// Protección de /admin/* con contraseña (Cloudflare Pages Functions).
//
// Cada contraseña abre una sola página. Acá se guarda la huella SHA-256 de
// cada una, no el texto. Huella de una clave nueva:  printf 'clave' | sha256sum
//
// Al entrar bien, queda una cookie firmada por 30 días para esa página.
// Cambiar una contraseña cierra sus sesiones abiertas. /admin/salir cierra todas.

const ACCESOS = [
  // daianita
  { id: 'calculadora', ruta: '/admin/calculadora/', clave: '7b5330b813b7aceda3bb149ea42a60778a237da7a6717764a9cd9d65eb47b773' },
  // daianita2
  { id: 'sorteo', ruta: '/admin/sorteo/', clave: 'bebd1727ab0af5daefd7bd72b460c51d609ee6733de5d91143dae11de1b68efb' }
];
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

// La firma usa la huella de la clave: si cambia la clave, la sesión deja de valer
async function firmar(acceso, exp) {
  return `${exp}.${await hmac(acceso.clave, `${acceso.id}|${exp}`)}`;
}

export async function sesionValida(valor, acceso, now = Date.now()) {
  const [exp, firma] = (valor || '').split('.');
  if (!exp || !firma || !/^\d+$/.test(exp) || Number(exp) < now) return false;
  return iguales(firma, await hmac(acceso.clave, `${acceso.id}|${exp}`));
}

const sha256 = async texto => hex(await crypto.subtle.digest('SHA-256', enc.encode(texto)));

// Devuelve la página que abre esa contraseña, o null
export async function accesoDeClave(intento) {
  const huella = await sha256(intento);
  let encontrado = null;
  for (const a of ACCESOS) if (iguales(huella, a.clave)) encontrado = a;
  return encontrado;
}

const leerCookie = (request, nombre) => {
  const m = (request.headers.get('Cookie') || '').match(new RegExp(`(?:^|;\\s*)${nombre}=([^;]*)`));
  return m ? m[1] : '';
};

const nombreCookie = acceso => `dg_${acceso.id}`;
const cookie = (nombre, valor, maxAge) =>
  `${nombre}=${valor}; Path=/admin; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;

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

function redirigir(location, cookies) {
  const headers = new Headers({ ...NO_INDEX, Location: location });
  for (const c of cookies) headers.append('Set-Cookie', c);
  return new Response(null, { status: 303, headers });
}

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const ruta = url.pathname;
  if (ruta.replace(/\/+$/, '') === '/admin/salir') {
    // también borra la cookie de la versión anterior, de una sola clave
    return redirigir('/admin/', [...ACCESOS.map(a => cookie(nombreCookie(a), '', 0)), cookie('dg_admin', '', 0)]);
  }

  // Página que se pide; /admin/ sola no es de nadie y lleva a la de la clave
  const pedido = ACCESOS.find(a => ruta.startsWith(a.ruta.replace(/\/$/, '')));

  if (pedido && await sesionValida(leerCookie(request, nombreCookie(pedido)), pedido)) {
    const res = await next();
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(NO_INDEX)) out.headers.set(k, v);
    return out;
  }

  if (request.method === 'POST') {
    const form = await request.formData().catch(() => null);
    const intento = String(form?.get('clave') || '');
    const acceso = intento ? await accesoDeClave(intento) : null;
    if (acceso) {
      const exp = Date.now() + DIAS * 864e5;
      // Si se pidió una página de esa misma clave, vuelve ahí; si no, a la suya
      const destino = pedido === acceso ? ruta + url.search : acceso.ruta;
      return redirigir(destino, [cookie(nombreCookie(acceso), await firmar(acceso, exp), DIAS * 86400)]);
    }
    // Frena un poco los intentos seguidos
    await new Promise(r => setTimeout(r, 800));
    return pantalla('Contraseña incorrecta.', 401);
  }

  return pantalla('', 401);
}
