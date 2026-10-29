// Protección de /admin/* con contraseña (Cloudflare Pages Functions).
//
// La contraseña es "daianita". Acá se guarda su huella SHA-256, no el texto.
// Para cambiarla sin tocar el código, se carga la variable ADMIN_PASSWORD en
// Cloudflare (Pages > Settings > Variables and Secrets) y tiene prioridad.
// Huella de una clave nueva:  printf 'clave' | sha256sum
//
// Al entrar bien, queda una cookie firmada por 30 días. Cambiar la contraseña
// cierra todas las sesiones abiertas. /admin/salir cierra la sesión.

const CLAVE_SHA256 = '7b5330b813b7aceda3bb149ea42a60778a237da7a6717764a9cd9d65eb47b773';
const COOKIE = 'dg_admin';
const DIAS = 30;
const enc = new TextEncoder();

const NO_INDEX = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Referrer-Policy': 'no-referrer'
};

const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

// Compara sin cortar en la primera diferencia
function iguales(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

async function firmar(secret, exp) {
  return `${exp}.${await hmac(secret, `admin|${exp}`)}`;
}

export async function sesionValida(valor, secret, now = Date.now()) {
  const [exp, firma] = (valor || '').split('.');
  if (!exp || !firma || !/^\d+$/.test(exp) || Number(exp) < now) return false;
  return iguales(firma, await hmac(secret, `admin|${exp}`));
}

const sha256 = async texto => hex(await crypto.subtle.digest('SHA-256', enc.encode(texto)));

export async function claveCorrecta(intento, env) {
  if (env.ADMIN_PASSWORD) return iguales(await sha256(intento), await sha256(env.ADMIN_PASSWORD));
  return iguales(await sha256(intento), CLAVE_SHA256);
}

const leerCookie = (request, nombre) => {
  const m = (request.headers.get('Cookie') || '').match(new RegExp(`(?:^|;\\s*)${nombre}=([^;]*)`));
  return m ? m[1] : '';
};

const cookie = (valor, maxAge) =>
  `${COOKIE}=${valor}; Path=/admin; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;

function pantalla(error, status) {
  const html = `<!doctype html><html lang="es-UY"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Ingresar · dg.creando</title>
<style>
@font-face{font-family:Montserrat;src:url('/montserrat.woff2') format('woff2');font-weight:100 900;font-display:swap}
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px 16px;background:#090909;color:#f4f3f0;font-family:Montserrat,system-ui,sans-serif}
form{width:100%;max-width:360px;background:#131313;border:1px solid #2a2a2a;border-radius:22px;padding:28px}
img{height:20px;display:block;margin-bottom:24px;opacity:.9}
label{display:block;margin-bottom:8px;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#9a9893}
input{width:100%;min-height:52px;background:#1b1b1b;border:1px solid #2a2a2a;border-radius:14px;padding:13px 16px;font:inherit;font-size:16px;color:inherit;outline:none}
input:focus{border-color:#3a3a3a}
button{width:100%;min-height:52px;margin-top:14px;border:0;border-radius:40px;background:#f4f3f0;color:#111;font:inherit;font-size:14px;font-weight:600;cursor:pointer}
button:active{transform:scale(.98)}
p{margin:12px 0 0;font-size:13px;color:#e38b7d}
</style></head><body>
<form method="post"><img src="/logo-dgcreando.svg" alt="dg.creando">
<label for="clave">Contraseña</label>
<input id="clave" name="clave" type="password" autocomplete="current-password" autofocus required>
<button type="submit">Entrar</button>${error ? `<p role="alert">${error}</p>` : ''}
</form></body></html>`;
  return new Response(html, { status, headers: { ...NO_INDEX, 'Content-Type': 'text/html; charset=utf-8' } });
}

const redirigir = (location, setCookie) =>
  new Response(null, { status: 303, headers: { ...NO_INDEX, Location: location, 'Set-Cookie': setCookie } });

export async function onRequest({ request, env, next }) {
  // Firma de la cookie: cambia si cambia la contraseña, y cierra las sesiones viejas
  const secret = `${env.ADMIN_PASSWORD || ''}|${CLAVE_SHA256}`;

  const url = new URL(request.url);
  if (url.pathname.replace(/\/+$/, '') === '/admin/salir') {
    return redirigir('/admin/calculadora/', cookie('', 0));
  }

  if (await sesionValida(leerCookie(request, COOKIE), secret)) {
    const res = await next();
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(NO_INDEX)) out.headers.set(k, v);
    return out;
  }

  if (request.method === 'POST') {
    const form = await request.formData().catch(() => null);
    const intento = String(form?.get('clave') || '');
    if (intento && await claveCorrecta(intento, env)) {
      const exp = Date.now() + DIAS * 864e5;
      return redirigir(url.pathname + url.search, cookie(await firmar(secret, exp), DIAS * 86400));
    }
    // Frena un poco los intentos seguidos
    await new Promise(r => setTimeout(r, 800));
    return pantalla('Contraseña incorrecta.', 401);
  }

  return pantalla('', 401);
}
