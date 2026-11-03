// Puente entre la página de sorteos y la API de Instagram (Instagram API con
// inicio de sesión de Instagram). El código de acceso llega en cada pedido desde
// el navegador de Daiana y se usa solo para ese pedido: acá no se guarda.
// La contraseña de /admin/sorteo/ la pide antes _middleware.js.

const API = 'https://graph.instagram.com';

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
});

async function graph(path, params) {
  const url = new URL(`${API}/${path}`);
  for (const [k, v] of Object.entries(params)) if (v != null && v !== '') url.searchParams.set(k, v);
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    const e = data.error || {};
    throw Object.assign(new Error(e.message || `Instagram respondió ${res.status}.`), { code: e.code ?? null, status: res.status });
  }
  return data;
}

// Solo estas consultas: no es un puente abierto a cualquier dirección
const OPS = {
  perfil: ({ token }) => graph('me', { fields: 'user_id,username', access_token: token }),
  posteos: ({ token, after }) => graph('me/media', {
    fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,comments_count',
    limit: 24, after, access_token: token
  }),
  // Las respuestas vienen dentro de cada comentario (hasta 50 por comentario)
  comentarios: ({ token, media, after }) => graph(`${media}/comments`, {
    fields: 'id,username,text,timestamp,replies.limit(50){id,username,text,timestamp}',
    limit: 50, after, access_token: token
  }),
  // Un código de más de 24 h se cambia por uno nuevo de 60 días
  renovar: ({ token }) => graph('refresh_access_token', { grant_type: 'ig_refresh_token', access_token: token })
};

export async function onRequestPost({ request }) {
  const body = await request.json().catch(() => null);
  const op = OPS[body?.op];
  if (!op || typeof body.token !== 'string' || !body.token.trim()) return json({ error: 'Pedido inválido.' }, 400);
  if (body.media != null && !/^\d+$/.test(String(body.media))) return json({ error: 'Posteo inválido.' }, 400);
  if (body.after != null && typeof body.after !== 'string') return json({ error: 'Pedido inválido.' }, 400);
  try {
    return json(await op({ ...body, token: body.token.trim() }));
  } catch (e) {
    return json({ error: e.message, code: e.code }, e.status && e.status < 500 ? 400 : 502);
  }
}
