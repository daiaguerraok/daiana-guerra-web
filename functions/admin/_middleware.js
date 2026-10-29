// Protección de /admin/* (Cloudflare Pages Functions).
//
// Cloudflare Access pide el login antes de llegar acá y agrega el token
// Cf-Access-Jwt-Assertion. Esta función lo verifica de nuevo: firma, audiencia,
// emisor, vencimiento y correo. Si Access no está configurado para el dominio
// que se visita, o faltan las variables de entorno, no se sirve nada.
//
// Variables de entorno (Pages > Settings > Variables and Secrets):
//   ACCESS_TEAM_DOMAIN  ej. dgcreando.cloudflareaccess.com
//   ACCESS_AUD          el "Application Audience (AUD) Tag" de la app de Access
//   ADMIN_EMAILS        correos autorizados, separados por coma

const CERTS_TTL = 60 * 60 * 1000;
let certsCache = { url: '', keys: null, at: 0 };

const deny = (status, msg) => new Response(msg, {
  status,
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow'
  }
});

const b64url = s => {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '='));
  return Uint8Array.from(bin, c => c.charCodeAt(0));
};
const json = s => JSON.parse(new TextDecoder().decode(b64url(s)));

async function getKeys(issuer, force) {
  const url = `${issuer}/cdn-cgi/access/certs`;
  if (!force && certsCache.url === url && certsCache.keys && Date.now() - certsCache.at < CERTS_TTL) return certsCache.keys;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`certs ${res.status}`);
  const { keys } = await res.json();
  certsCache = { url, keys, at: Date.now() };
  return keys;
}

export async function verifyAccessJwt(token, { issuer, aud, emails, now = Date.now() }) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  let header, payload;
  try {
    header = json(h);
    payload = json(p);
  } catch {
    return null;
  }
  if (header.alg !== 'RS256') return null;

  let jwk = (await getKeys(issuer)).find(k => k.kid === header.kid);
  if (!jwk) jwk = (await getKeys(issuer, true)).find(k => k.kid === header.kid);
  if (!jwk) return null;

  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64url(s), new TextEncoder().encode(`${h}.${p}`));
  if (!ok) return null;

  const secs = now / 1000;
  const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (payload.iss !== issuer || !auds.includes(aud)) return null;
  if (typeof payload.exp !== 'number' || payload.exp < secs) return null;
  if (typeof payload.nbf === 'number' && payload.nbf > secs + 60) return null;
  if (!payload.email || !emails.includes(String(payload.email).toLowerCase())) return null;
  return payload;
}

export async function onRequest({ request, env, next }) {
  const team = (env.ACCESS_TEAM_DOMAIN || '').trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const aud = (env.ACCESS_AUD || '').trim();
  const emails = (env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  if (!team || !aud || !emails.length) return deny(403, 'Acceso no configurado.');

  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) return deny(403, 'Acceso restringido.');

  let payload = null;
  try {
    payload = await verifyAccessJwt(token, { issuer: `https://${team}`, aud, emails });
  } catch {
    return deny(503, 'No se pudo verificar el acceso. Probá de nuevo en un momento.');
  }
  if (!payload) return deny(403, 'Acceso restringido.');

  const res = await next();
  const out = new Response(res.body, res);
  out.headers.set('Cache-Control', 'no-store');
  out.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return out;
}
