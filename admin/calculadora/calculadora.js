// Calculadora de presupuestos. Los precios y lugares salen de tarifas.js.
(() => {
  const C = window.CALCULADORA;
  const $ = id => document.getElementById(id);
  const OTRO = '__otro';
  const peso = new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU', maximumFractionDigits: 0 });
  const plata = n => peso.format(n);

  const form = $('calc-form'), lugar = $('lugar'), cliente = $('cliente');
  const otro = $('otro'), otroLugar = $('otro-lugar'), otroZona = $('otro-zona'), horas = $('horas');
  const zonaPorLugar = new Map();

  // Selector de lugares, agrupado por zona y en orden alfabético
  const alfa = (a, b) => a.localeCompare(b, 'es');
  C.zonas.forEach(z => {
    const grupo = document.createElement('optgroup');
    grupo.label = z.nombre;
    [...z.lugares].sort(alfa).forEach(l => {
      zonaPorLugar.set(l, z);
      grupo.append(new Option(l, l));
    });
    lugar.append(grupo);
  });
  const grupoOtro = document.createElement('optgroup');
  grupoOtro.label = 'Fuera de la lista';
  grupoOtro.append(new Option('Otra ubicación…', OTRO));
  lugar.append(grupoOtro);

  const radio = (name, value, text, checked) => {
    const l = document.createElement('label');
    l.innerHTML = `<input type="radio" name="${name}" value="${value}"${checked ? ' checked' : ''}><span></span>`;
    l.querySelector('span').textContent = text;
    return l;
  };
  C.zonas.forEach(z => otroZona.append(radio('otro-zona', z.id, z.nombre)));
  C.horas.forEach((h, i) => horas.append(radio('horas', h, `${h} horas`, i === 0)));
  C.incluye.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t;
    $('incluye').append(li);
  });

  const valorRadio = name => form.querySelector(`input[name="${name}"]:checked`)?.value;

  function estado() {
    const h = Number(valorRadio('horas'));
    let nombreLugar = lugar.value, zona = zonaPorLugar.get(nombreLugar);
    if (lugar.value === OTRO) {
      nombreLugar = otroLugar.value.trim();
      zona = C.zonas.find(z => z.id === valorRadio('otro-zona'));
    }
    if (!nombreLugar || !zona || !zona.precios[h]) return { zona, nombreLugar, h };
    const total = zona.precios[h];
    const sena = Math.min(C.sena, total);
    return { zona, nombreLugar, h, total, sena, saldo: total - sena, cliente: cliente.value.trim() };
  }

  function mensaje(p) {
    const m = C.mensaje;
    return [
      m.saludo.replace('{cliente}', p.cliente ? `, ${p.cliente}` : ''),
      m.intro,
      '',
      `📍 *Lugar:* ${p.nombreLugar}`,
      `⏱️ *Cobertura:* ${p.h} horas`,
      `💰 *Total:* ${plata(p.total)}`,
      '',
      '*Incluye:*',
      ...C.incluye.map(t => `• ${t}`),
      '',
      m.sena,
      `• Seña: ${plata(p.sena)}`,
      `• Saldo restante: ${plata(p.saldo)}`,
      '',
      m.cierre,
      m.firma
    ].join('\n');
  }

  const pulso = el => {
    el.classList.remove('pulse');
    void el.offsetWidth;
    el.classList.add('pulse');
  };

  let ultimoTotal = null;
  function render() {
    const p = estado();
    otro.hidden = lugar.value !== OTRO;
    $('zona-note').textContent = p.zona
      ? `Zona: ${p.zona.nombre}. La tarifa ya incluye el traslado estimado.`
      : '';
    const listo = p.total != null;
    $('copiar').disabled = !listo;
    if (!listo) {
      $('total').textContent = $('sena').textContent = $('saldo').textContent = '—';
      $('resumen').textContent = lugar.value === OTRO
        ? 'Escribí el lugar y elegí la zona de distancia.'
        : 'Elegí el lugar para calcular.';
      $('mensaje').textContent = 'Completá el lugar y las horas para armar el mensaje.';
      ultimoTotal = null;
      return;
    }
    $('total').textContent = plata(p.total);
    $('sena').textContent = plata(p.sena);
    $('saldo').textContent = plata(p.saldo);
    $('resumen').textContent = [p.cliente, p.nombreLugar, `${p.h} horas`].filter(Boolean).join(' · ');
    $('mensaje').textContent = mensaje(p);
    if (ultimoTotal !== p.total) pulso($('total'));
    ultimoTotal = p.total;
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
      // Respaldo para navegadores sin acceso al portapapeles
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

  $('copiar').addEventListener('click', async () => {
    const p = estado();
    if (p.total == null) return;
    const ok = await copiar(mensaje(p));
    aviso(ok ? 'Presupuesto copiado. Pegalo en WhatsApp.' : 'No se pudo copiar. Seleccioná el mensaje y copialo a mano.');
  });

  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('reset', () => {
    // El reset del navegador corre después de este evento
    setTimeout(() => {
      render();
      cliente.focus();
      aviso('Nueva cotización');
    });
  });

  render();
})();
