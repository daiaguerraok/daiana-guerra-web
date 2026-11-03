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
    actualizar();
    pegado.focus();
  });

  actualizar();
})();
