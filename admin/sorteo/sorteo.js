// Sorteo entre los comentarios de un posteo de Instagram.
// Todo pasa en el navegador: no se guarda ni se envía nada.
(() => {
  const $ = id => document.getElementById(id);
  const pegado = $('pegado'), participantes = $('participantes'), excluir = $('excluir');
  const unico = $('unico'), ganadoresIn = $('ganadores'), suplentesIn = $('suplentes');
  const sortear = $('sortear'), copiarBtn = $('copiar');
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Detectar usuarios en el texto copiado de Instagram ---
  const USUARIO = /^@?([a-z0-9._]{1,30})$/i;
  // "2 sem", "3 d", "5 h", "1 min", "4 w", "1 a"…
  const TIEMPO = /^\d+\s*(s|seg|min|m|h|d|sem|w|a|y)\.?$/i;
  const RUIDO = [
    /^responder$/i, /^reply$/i, /^ver traducción$/i, /^see translation$/i,
    /^ver (las )?\d* ?respuestas?/i, /^view (all )?\d* ?repl/i, /^[—–-]+\s*(ver|view|ocultar|hide)/i,
    /^ocultar respuestas$/i, /^hide replies$/i, /^verificado$/i, /^verified$/i,
    /^editado$/i, /^edited$/i, /^fijado$/i, /^pinned$/i, /^autor$/i, /^author$/i,
    /^\d+[.,]?\d*\s*(mil\s*)?(me gusta|likes?)$/i, /^me gusta$/i, /^like$/i, /^seguir$/i, /^follow$/i, /^[·•]$/
  ];
  const esRuido = l => RUIDO.some(r => r.test(l));
  const usuarioDe = l => {
    const m = l.split(/\s+[·•]\s+/)[0].trim().match(USUARIO);
    return m && /[a-z]/i.test(m[1]) ? m[1].toLowerCase() : null;
  };

  function detectar(texto) {
    const lineas = texto.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const tiempos = lineas.filter(l => TIEMPO.test(l)).length;
    const usuarios = [];
    if (tiempos >= 2) {
      // Texto de Instagram: usuario, comentario, tiempo, "Responder"…
      // El usuario es la primera línea útil después de cada tiempo.
      let esperando = true;
      for (const l of lineas) {
        if (TIEMPO.test(l)) { esperando = true; continue; }
        if (esRuido(l) || !esperando) continue;
        const u = usuarioDe(l);
        if (u) { usuarios.push(u); esperando = false; }
      }
      return { usuarios, modo: 'instagram' };
    }
    // Lista simple: el primer usuario de cada línea
    for (const l of lineas) {
      const u = usuarioDe(l.split(/[\s,;]+/)[0] || '');
      if (u) usuarios.push(u);
    }
    return { usuarios, modo: 'lista' };
  }

  // --- Lista final de participantes ---
  function lista() {
    const fuera = excluidos();
    let todos = participantes.value.split(/\r?\n/).map(usuarioDe).filter(u => u && !fuera.has(u));
    if (unico.checked) todos = [...new Set(todos)];
    return todos;
  }
  const entero = (input, min, max) => Math.min(max, Math.max(min, parseInt(input.value, 10) || min));

  function actualizar() {
    const l = lista(), personas = new Set(l).size;
    const g = entero(ganadoresIn, 1, 20), s = entero(suplentesIn, 0, 20);
    const faltan = personas < g + s;
    sortear.disabled = !l.length || faltan || animando;
    $('conteo').textContent = !l.length ? ''
      : `${l.length} participaciones de ${personas} ${personas === 1 ? 'persona' : 'personas'}.` +
        (faltan ? ` Hacen falta al menos ${g + s} personas distintas.` : '');
  }

  const excluidos = () => new Set(excluir.value.split(/[\s,;]+/).map(u => u.replace(/^@/, '').toLowerCase()).filter(Boolean));

  pegado.addEventListener('input', () => {
    const fuera = excluidos();
    const { modo, usuarios: todos } = detectar(pegado.value);
    const usuarios = todos.filter(u => !fuera.has(u));
    participantes.value = usuarios.join('\n');
    const personas = new Set(usuarios).size;
    $('deteccion').textContent = !pegado.value.trim() ? ''
      : !usuarios.length ? 'No encontré usuarios. Probá copiando de nuevo, o escribí la lista a mano.'
      : modo === 'instagram'
        ? `Encontré ${usuarios.length} comentarios de ${personas} personas. Revisá la lista antes de sortear.`
        : `Encontré ${personas} usuarios. Revisá la lista antes de sortear.`;
    actualizar();
  });
  [participantes, excluir, unico, ganadoresIn, suplentesIn].forEach(el => el.addEventListener('input', actualizar));

  // --- Sorteo ---
  // Número al azar entre 0 y n-1, sin sesgo
  function azar(n) {
    const max = Math.floor(0x100000000 / n) * n, a = new Uint32Array(1);
    do crypto.getRandomValues(a); while (a[0] >= max);
    return a[0] % n;
  }
  // Saca personas distintas; si una persona comentó varias veces, tiene más chances
  function elegir(entradas, cantidad) {
    const quedan = [...entradas], elegidos = [];
    while (elegidos.length < cantidad && quedan.length) {
      const u = quedan[azar(quedan.length)];
      elegidos.push(u);
      for (let i = quedan.length - 1; i >= 0; i--) if (quedan[i] === u) quedan.splice(i, 1);
    }
    return elegidos;
  }

  let animando = false, ultimo = null;
  const espera = ms => new Promise(r => setTimeout(r, ms));

  async function ruleta(entradas) {
    if (reducido) return;
    const nombre = $('nombre');
    nombre.classList.add('girando');
    // Empieza rápido y frena
    for (let t = 40; t < 260; t *= 1.12) {
      nombre.textContent = '@' + entradas[azar(entradas.length)];
      await espera(t);
    }
    nombre.classList.remove('girando');
  }

  const perfil = u => `https://www.instagram.com/${encodeURIComponent(u)}/`;
  const fecha = () => new Date().toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' });

  sortear.addEventListener('click', async () => {
    const entradas = lista();
    const g = entero(ganadoresIn, 1, 20), s = entero(suplentesIn, 0, 20);
    if (!entradas.length || new Set(entradas).size < g + s) return;
    animando = true; actualizar();
    copiarBtn.hidden = true;
    $('resultado').hidden = true;
    $('escenario').classList.remove('listo');
    $('escenario-label').textContent = 'Sorteando…';

    const elegidos = elegir(entradas, g + s);
    await ruleta(entradas);

    const ganadores = elegidos.slice(0, g), suplentes = elegidos.slice(g);
    ultimo = { ganadores, suplentes, total: entradas.length, personas: new Set(entradas).size, cuando: fecha() };

    $('escenario-label').textContent = g === 1 ? 'Ganador/a' : 'Ganadores';
    $('nombre').textContent = ganadores.map(u => '@' + u).join('  ·  ');
    $('escenario').classList.add('listo');

    const ol = $('resultado');
    ol.replaceChildren(...elegidos.map((u, i) => {
      const li = document.createElement('li');
      const tipo = i < g ? (g === 1 ? 'Ganador/a' : `Ganador/a ${i + 1}`) : `Suplente ${i - g + 1}`;
      li.innerHTML = '<span></span><a target="_blank" rel="noopener noreferrer"></a>';
      li.firstChild.textContent = tipo;
      li.lastChild.textContent = '@' + u;
      li.lastChild.href = perfil(u);
      if (i >= g) li.className = 'suplente';
      return li;
    }));
    ol.hidden = false;
    $('detalle').textContent = `Sorteo hecho el ${ultimo.cuando} entre ${ultimo.total} participaciones de ${ultimo.personas} personas.`;
    copiarBtn.hidden = false;
    animando = false; actualizar();
  });

  function textoResultado(r) {
    return [
      r.ganadores.length === 1 ? `🎉 Ganador/a del sorteo: @${r.ganadores[0]}` : `🎉 Ganadores del sorteo: ${r.ganadores.map(u => '@' + u).join(', ')}`,
      ...(r.suplentes.length ? [`Suplentes: ${r.suplentes.map(u => '@' + u).join(', ')}`] : []),
      '',
      `Sorteo hecho el ${r.cuando} entre ${r.personas} participantes.`,
      '¡Gracias a todos por participar!'
    ].join('\n');
  }

  let toastTimer;
  function aviso(texto) {
    const t = $('toast');
    t.textContent = texto;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  async function copiar(texto) {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = texto;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.append(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    }
  }

  copiarBtn.addEventListener('click', async () => {
    if (!ultimo) return;
    aviso(await copiar(textoResultado(ultimo)) ? 'Resultado copiado.' : 'No se pudo copiar.');
  });

  $('nuevo').addEventListener('click', () => {
    if (animando) return;
    pegado.value = participantes.value = '';
    $('deteccion').textContent = $('detalle').textContent = '';
    $('nombre').textContent = '—';
    $('escenario-label').textContent = 'Ganador/a';
    $('escenario').classList.remove('listo');
    $('resultado').hidden = copiarBtn.hidden = true;
    ultimo = null;
    soltarPosteo();
    actualizar();
  });

  // --- Pestañas: desde Instagram o pegando el texto ---
  const tabs = { ig: $('tab-ig'), pegar: $('tab-pegar') };
  function mostrarTab(cual) {
    for (const [k, b] of Object.entries(tabs)) {
      b.setAttribute('aria-selected', String(k === cual));
      $(`panel-${k}`).hidden = k !== cual;
    }
    try { localStorage.setItem('dg_sorteo_tab', cual); } catch {}
  }
  tabs.ig.addEventListener('click', () => mostrarTab('ig'));
  tabs.pegar.addEventListener('click', () => mostrarTab('pegar'));
  try { if (localStorage.getItem('dg_sorteo_tab') === 'pegar') mostrarTab('pegar'); } catch {}

  // --- Instagram ---
  // El código de acceso queda solo en este navegador. Se renueva solo cada vez
  // que se abre la página, si tiene más de un día.
  const LS = 'dg_sorteo_ig';
  let cuenta = null;
  try { cuenta = JSON.parse(localStorage.getItem(LS)); } catch {}
  const guardarCuenta = c => {
    cuenta = c;
    try { c ? localStorage.setItem(LS, JSON.stringify(c)) : localStorage.removeItem(LS); } catch {}
  };
  const igEstado = t => { $('ig-estado').textContent = t; };

  async function ig(op, extra = {}) {
    let res;
    try {
      res = await fetch('instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ op, token: cuenta.token, ...extra })
      });
    } catch {
      throw new Error('No hay conexión. Probá de nuevo.');
    }
    if (!(res.headers.get('Content-Type') || '').includes('application/json')) {
      throw new Error('Se cerró la sesión de esta página. Recargala y volvé a poner la contraseña.');
    }
    const data = await res.json();
    if (data.error) throw Object.assign(new Error(data.error), { code: data.code });
    return data;
  }

  // 190: el código venció, se revocó o está mal copiado
  function errorIg(e) {
    if (e.code === 190) {
      guardarCuenta(null);
      pantallaIg();
      igEstado('El código venció o no es válido. Generá uno nuevo y pegalo acá.');
    } else {
      igEstado(`Instagram respondió: ${e.message}`);
    }
  }

  function pantallaIg() {
    $('ig-conectar').hidden = !!cuenta;
    $('ig-conectado').hidden = !cuenta;
    if (cuenta) {
      $('ig-usuario').textContent = '@' + cuenta.usuario;
      // la cuenta del posteo no participa
      if (!excluidos().has(cuenta.usuario)) {
        excluir.value = [excluir.value.trim(), cuenta.usuario].filter(Boolean).join(', ');
        actualizar();
      }
    }
  }

  $('ig-conectar-btn').addEventListener('click', async () => {
    const token = $('ig-token').value.trim();
    if (!token) return igEstado('Pegá el código primero.');
    const boton = $('ig-conectar-btn');
    boton.disabled = true;
    igEstado('Conectando…');
    try {
      cuenta = { token };
      const p = await ig('perfil');
      guardarCuenta({ token, desde: Date.now(), usuario: String(p.username || '').toLowerCase() });
      $('ig-token').value = '';
      igEstado('');
      pantallaIg();
      cargarPosteos();
    } catch (e) {
      cuenta = null;
      igEstado(e.code === 190 ? 'Ese código no funciona. Fijate de copiarlo completo.' : `No se pudo conectar: ${e.message}`);
    } finally {
      boton.disabled = false;
    }
  });

  $('ig-desconectar').addEventListener('click', () => {
    guardarCuenta(null);
    $('ig-posteos').replaceChildren();
    $('ig-mas').hidden = true;
    igEstado('');
    pantallaIg();
  });

  // --- Posteos ---
  let despues = null, posteoElegido = null, trayendo = false;
  const fechaCorta = iso => new Date(iso).toLocaleDateString('es-UY', { day: 'numeric', month: 'short' });

  async function cargarPosteos(mas = false) {
    const grilla = $('ig-posteos');
    if (!mas) { grilla.replaceChildren(); despues = null; }
    $('ig-mas').hidden = true;
    igEstado('Cargando posteos…');
    try {
      const r = await ig('posteos', despues ? { after: despues } : {});
      for (const m of r.data || []) grilla.append(tarjeta(m));
      despues = r.paging?.next ? r.paging.cursors?.after || null : null;
      $('ig-mas').hidden = !despues;
      igEstado(grilla.children.length ? '' : 'Esta cuenta no tiene posteos.');
    } catch (e) {
      errorIg(e);
    }
  }
  $('ig-mas').addEventListener('click', () => cargarPosteos(true));

  function tarjeta(m) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'posteo';
    b.setAttribute('aria-pressed', 'false');
    const texto = (m.caption || '').replace(/\s+/g, ' ').trim();
    b.title = texto.slice(0, 140) || 'Posteo sin texto';
    const foto = m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url;
    if (foto) {
      const img = document.createElement('img');
      img.src = foto;
      img.alt = texto.slice(0, 80);
      img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
      b.append(img);
    } else {
      const sin = document.createElement('span');
      sin.className = 'sin-foto';
      sin.textContent = texto.slice(0, 60) || 'Posteo';
      b.append(sin);
    }
    const info = document.createElement('span');
    info.className = 'info';
    const n = m.comments_count ?? 0;
    info.textContent = `${fechaCorta(m.timestamp)} · ${n} ${n === 1 ? 'comentario' : 'comentarios'}`;
    b.append(info);
    b.addEventListener('click', () => traerComentarios(m, b));
    return b;
  }

  function soltarPosteo() {
    posteoElegido = null;
    $('ig-posteos').querySelectorAll('.posteo').forEach(x => x.setAttribute('aria-pressed', 'false'));
  }

  async function traerComentarios(m, boton) {
    if (trayendo || animando) return;
    trayendo = true;
    soltarPosteo();
    boton.setAttribute('aria-pressed', 'true');
    posteoElegido = m;
    const grilla = $('ig-posteos');
    grilla.classList.add('cargando');
    const usuarios = [];
    let after = null, comentarios = 0;
    try {
      do {
        igEstado(`Trayendo comentarios… ${comentarios}`);
        const r = await ig('comentarios', after ? { media: m.id, after } : { media: m.id });
        for (const c of r.data || []) {
          comentarios++;
          if (c.username) usuarios.push(c.username.toLowerCase());
          for (const rta of c.replies?.data || []) {
            comentarios++;
            if (rta.username) usuarios.push(rta.username.toLowerCase());
          }
        }
        after = r.paging?.next ? r.paging.cursors?.after || null : null;
      } while (after);
      const fuera = excluidos();
      const validos = usuarios.filter(u => !fuera.has(u));
      participantes.value = validos.join('\n');
      const personas = new Set(validos).size;
      igEstado('');
      $('deteccion').textContent = !comentarios
        ? 'Este posteo no tiene comentarios.'
        : `Traje ${comentarios} ${comentarios === 1 ? 'comentario' : 'comentarios'} del posteo del ${fechaCorta(m.timestamp)}. ${personas === 1 ? 'Participa 1 persona' : `Participan ${personas} personas`}.`;
      actualizar();
    } catch (e) {
      soltarPosteo();
      errorIg(e);
    } finally {
      grilla.classList.remove('cargando');
      trayendo = false;
    }
  }

  // Al abrir: si ya hay cuenta, renovar el código si hace falta y mostrar posteos
  (async () => {
    pantallaIg();
    if (!cuenta) return;
    if (Date.now() - (cuenta.desde || 0) > 864e5) {
      try {
        const r = await ig('renovar');
        if (r.access_token) guardarCuenta({ ...cuenta, token: r.access_token, desde: Date.now() });
      } catch (e) {
        if (e.code === 190) return errorIg(e);
        // si no se pudo renovar ahora, se intenta la próxima vez
      }
    }
    cargarPosteos();
  })();

  actualizar();
})();
