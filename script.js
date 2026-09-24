// Add Daiana's confirmed international WhatsApp number here (digits only).
const WHATSAPP_NUMBER = '59892347597';
const plans = [
{name:'Básico',description:'Para mantener tu marca activa y visualmente coherente.',items:['Portadas para historias destacadas','Optimización de la biografía','8 posteos mensuales','Diseño personalizado','Carruseles de hasta 7 placas','Ideas de contenido','Copy + CTA','Hashtags y palabras clave','Planificación mensual']},
{name:'Plus',description:'Más contenido y presencia durante toda la semana.',items:['Portadas para historias destacadas','Optimización de la biografía','8 posteos mensuales','3 Stories semanales','Diseño personalizado','Carruseles de hasta 7 placas','Ideas de contenido','Copy + CTA','Hashtags y palabras clave','Planificación mensual']},
{name:'Reels',description:'Contenido en video para darle movimiento y presencia a tu marca.',items:['Portadas para historias destacadas','Optimización de la biografía','8 Reels mensuales','Ideas y conceptos','Guión para cada Reel','Edición profesional','Textos, música y recursos visuales','Copy + CTA','Hashtags y palabras clave','Planificación mensual','Análisis básico de rendimiento']},
{name:'Completo',description:'Una propuesta que combina diseño y video de forma constante.',items:['Portadas para historias destacadas','Optimización de la biografía','8 posteos mensuales','4 Reels mensuales','Carruseles de hasta 7 placas','Diseño personalizado','Ideas y planificación','Guiones para Reels','Edición de video','Copy + CTA','Hashtags y palabras clave']}
];
// Estos cuatro ítems estaban repetidos en los cuatro planes: ocupaban el 40%
// de cada lista sin diferenciar nada. Ahora se muestran una sola vez debajo
// de la grilla, y cada tarjeta lista solo lo suyo.
const planBase = ['Portadas para historias destacadas','Optimización de la biografía','Copy + CTA','Hashtags y palabras clave'];
// Cada página arranca arriba del todo: el navegador tiende a restaurar el
// scroll anterior al cambiar de página o al volver, y quedaba a mitad de
// camino. Si el link trae un ancla (#planes) se respeta.
if('scrollRestoration' in history) history.scrollRestoration='manual';
const arriba=()=>{ if(!location.hash) scrollTo({top:0,left:0,behavior:'instant'}); };
arriba();
addEventListener('DOMContentLoaded',arriba);
addEventListener('pageshow',arriba);
// No en 'load': con las imágenes pesadas llega tarde y devolvería al
// inicio a quien ya empezó a bajar.
// Al irse, la página se guarda con el scroll en cero: así ni el botón atrás
// ni la caché del navegador la traen de vuelta a mitad de camino.
addEventListener('pagehide',()=>scrollTo({top:0,left:0,behavior:'instant'}));

const whatsappURL = message => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
const planGrid=document.querySelector('#plan-grid');
if(planGrid) planGrid.innerHTML = plans.map((p,i)=>`<article class="plan tier-${i+1}"><div class="plan-top"><span>PLAN / 0${i+1}</span><span class="tier-bars" aria-hidden="true">${Array.from({length:4},(_,j)=>`<i class="${j<=i?'active':''}"></i>`).join('')}</span></div><h3>${p.name}</h3><p class="plan-description">${p.description}</p><ul>${p.items.filter(item=>!planBase.includes(item)).map(item=>`<li>${item}</li>`).join('')}</ul><a class="button plan-contact" data-plan="${p.name}" href="${whatsappURL(`Hola Daiana, me interesa el plan ${p.name}. Me gustaría conocer el precio y cómo podemos empezar a trabajar en mi marca.`)}" target="_blank" rel="noopener noreferrer">Quiero este plan <span>↗</span></a></article>`).join('');
if(planGrid){
  const base=document.createElement('p');
  base.className='plan-base';
  base.innerHTML='<span class="plan-base-label">Todos los planes incluyen</span><ul>'+
    planBase.map(i=>'<li>'+i+'</li>').join('')+'</ul>';
  planGrid.after(base);
}
// ── Sesiones de fotografía ───────────────────────────────────────────
// Una sola lista arma las carpetas de fotografia.html y la página de cada
// sesión (sesion.html?s=slug). Para sumar una sesión: un objeto acá, la
// portada en fotos/ (1080 × 1440, vertical) y sus fotos (1000 × 1250). `titulo`
// es opcional y admite HTML, para poner una palabra en cursiva.
const sesiones=[
{slug:'exteriores',nombre:'Exteriores',titulo:'<em>Exteriores.</em>',para:'Infantiles',portada:'fotos/sesion-01.jpg',
 texto:'Sesiones infantiles al aire libre: luz natural, juego y movimiento, para guardar esa etapa tal como es.',fotos:[{s:'fotos/exteriores/01.jpg',w:1080,h:1440},{s:'fotos/exteriores/02.jpg',w:1080,h:1440},{s:'fotos/exteriores/03.jpg',w:1080,h:1440},{s:'fotos/exteriores/04.jpg',w:1080,h:1440},{s:'fotos/exteriores/05.jpg',w:1080,h:1440},{s:'fotos/exteriores/06.jpg',w:1153,h:1440},{s:'fotos/exteriores/07.jpg',w:1152,h:1440},{s:'fotos/exteriores/08.jpg',w:1153,h:1440}]},
{slug:'glam-studio',nombre:'Glam Studio',titulo:'Glam <em style="--sangria:-.047em">Studio.</em>',para:'Maquillaje',portada:'fotos/sesion-03.jpg',
 texto:'Fotos pensadas para maquilladoras: cada look retratado con cuidado, para que puedas mostrar tu trabajo de una forma más profesional en redes, en tu portfolio o donde lo necesites.',
 fotos:[{s:'fotos/glam-studio/01.jpg',w:960,h:1440},{s:'fotos/glam-studio/02.jpg',w:960,h:1440},{s:'fotos/glam-studio/03.jpg',w:960,h:1440},{s:'fotos/glam-studio/04.jpg',w:960,h:1440},{s:'fotos/glam-studio/05.jpg',w:960,h:1440},{s:'fotos/glam-studio/06.jpg',w:960,h:1440},{s:'fotos/glam-studio/07.jpg',w:960,h:1440},{s:'fotos/glam-studio/08.jpg',w:960,h:1440},{s:'fotos/glam-studio/09.jpg',w:960,h:1440},{s:'fotos/glam-studio/10.jpg',w:960,h:1440},{s:'fotos/glam-studio/11.jpg',w:960,h:1440},{s:'fotos/glam-studio/12.jpg',w:960,h:1440}]},
{slug:'memorias-del-amor',nombre:'Memorias del Amor',titulo:'Memorias del <em>Amor.</em>',para:'Civil',portada:'fotos/sesion-04.jpg',
 texto:'Cobertura de civiles: la firma, los abrazos, las miradas. Los momentos que después se quieren volver a mirar.',
 fotos:[{s:'fotos/civil/01.jpg',w:1440,h:1014},{s:'fotos/civil/02.jpg',w:1440,h:1100},{s:'fotos/civil/03.jpg',w:1152,h:1440},{s:'fotos/civil/04.jpg',w:1152,h:1440},{s:'fotos/civil/05.jpg',w:1151,h:1440},{s:'fotos/civil/06.jpg',w:960,h:1440}]},
{slug:'fotos-personales',nombre:'Fotos Personales',titulo:'Fotos <em>Personales.</em>',para:'Books',portada:'fotos/sesion-05.jpg',
 texto:'Books personales y profesionales: retratos pensados para redes, perfil o portfolio, con una dirección que te haga sentir cómoda.',
 fotos:[{s:'fotos/personales/01.jpg',w:1080,h:1244},{s:'fotos/personales/02.jpg',w:1440,h:1440},{s:'fotos/personales/03.jpg',w:1251,h:1440},{s:'fotos/personales/04.jpg',w:1152,h:1440},{s:'fotos/personales/05.jpg',w:1152,h:1440},{s:'fotos/personales/06.jpg',w:1152,h:1440},{s:'fotos/personales/07.jpg',w:1152,h:1440},{s:'fotos/personales/08.jpg',w:960,h:1440},{s:'fotos/personales/09.jpg',w:960,h:1440},{s:'fotos/personales/10.jpg',w:960,h:1440},{s:'fotos/personales/11.jpg',w:960,h:1440}]},
{slug:'cumples-infantiles',nombre:'Cumples Infantiles',titulo:'Cumples <em>Infantiles.</em>',para:'Evento',portada:'fotos/sesion-06.jpg',
 texto:'Cobertura de cumpleaños: la torta, los juegos, las caras. Fotos para revivir la fiesta y compartirla con la familia.',
 fotos:[{s:'fotos/cumples/01.jpg',w:960,h:1440},{s:'fotos/cumples/02.jpg',w:960,h:1440},{s:'fotos/cumples/03.jpg',w:1440,h:960},{s:'fotos/cumples/04.jpg',w:1440,h:960},{s:'fotos/cumples/05.jpg',w:1153,h:1440},{s:'fotos/cumples/06.jpg',w:1152,h:1440},{s:'fotos/cumples/07.jpg',w:1152,h:1440},{s:'fotos/cumples/08.jpg',w:1152,h:1440},{s:'fotos/cumples/09.jpg',w:1345,h:1106},{s:'fotos/cumples/10.jpg',w:1124,h:1405},{s:'fotos/cumples/11.jpg',w:960,h:1440},{s:'fotos/cumples/12.jpg',w:960,h:1440},{s:'fotos/cumples/13.jpg',w:960,h:1440},{s:'fotos/cumples/14.jpg',w:960,h:1440},{s:'fotos/cumples/15.jpg',w:960,h:1440},{s:'fotos/cumples/16.jpg',w:960,h:1440},{s:'fotos/cumples/17.jpg',w:960,h:1440},{s:'fotos/cumples/18.jpg',w:960,h:1440},{s:'fotos/cumples/19.jpg',w:960,h:1440},{s:'fotos/cumples/20.jpg',w:960,h:1440},{s:'fotos/cumples/21.jpg',w:960,h:1440}]},
{slug:'moda',nombre:'Moda',titulo:'<em>Moda.</em>',para:'Editorial',portada:'fotos/sesion-moda.jpg',
 texto:'Sesiones para Pink, alquiler de vestidos, pensadas para mostrar la calidad y la variedad de sus prendas: el brillo de cada tela, el calce y el movimiento, con una dirección pensada para cada vestido.',
 fotos:[{s:'fotos/moda/01.jpg',w:960,h:1440},{s:'fotos/moda/02.jpg',w:960,h:1440},{s:'fotos/moda/03.jpg',w:960,h:1440},{s:'fotos/moda/04.jpg',w:960,h:1440},{s:'fotos/moda/05.jpg',w:960,h:1440},{s:'fotos/moda/06.jpg',w:960,h:1440},{s:'fotos/moda/07.jpg',w:960,h:1440},{s:'fotos/moda/08.jpg',w:960,h:1440},{s:'fotos/moda/09.jpg',w:1126,h:1440}]},
{slug:'foto-producto',nombre:'Foto Producto',titulo:'Foto <em>Producto.</em>',para:'Gastronomía',portada:'fotos/sesion-02.jpg',
 texto:'Fotoproducto para gastronomía: platos, bebidas y detalles retratados con luz cálida y composición cuidada, para que tu producto se destaque de forma profesional en el feed, la carta o donde lo muestres.',
 fotos:[{s:'fotos/foto-producto/01.jpg',w:960,h:1440},{s:'fotos/foto-producto/02.jpg',w:960,h:1440},{s:'fotos/foto-producto/03.jpg',w:960,h:1440},{s:'fotos/foto-producto/04.jpg',w:960,h:1440},{s:'fotos/foto-producto/05.jpg',w:960,h:1440},{s:'fotos/foto-producto/06.jpg',w:960,h:1440},{s:'fotos/foto-producto/07.jpg',w:960,h:1440},{s:'fotos/foto-producto/08.jpg',w:1440,h:960},{s:'fotos/foto-producto/09.jpg',w:1440,h:960},{s:'fotos/foto-producto/10.jpg',w:960,h:1440},{s:'fotos/foto-producto/11.jpg',w:960,h:1440},{s:'fotos/foto-producto/12.jpg',w:960,h:1440},{s:'fotos/foto-producto/13.jpg',w:960,h:1440}]},
];
// ── Fotos livianas ───────────────────────────────────────────────────
// optimizar-fotos.py genera, por cada .jpg, un .webp y versiones a 480 y
// 960 px de ancho. Acá se arma el srcset para que el navegador baje solo
// el tamaño que la pantalla necesita; el .jpg queda de respaldo.
const webp=src=>src.replace(/\.jpg$/i,'.webp');
const srcset=(src,w=1440)=>{const b=src.replace(/\.jpg$/i,'');const l=[];if(w>480)l.push(`${b}-480.webp 480w`);if(w>960)l.push(`${b}-960.webp 960w`);l.push(`${b}.webp ${w}w`);return l.join(', ');};

// ── Cinta de fotos verticales (cabecera de fotografia.html) ───────────
// Se alimenta sola de las sesiones: toma las fotos verticales, una de cada
// sesión por vuelta para que se mezclen, y duplica la tira para que el
// desplazamiento sea infinito sin corte. Cada foto lleva a su sesión.
const cinta=document.querySelector('#cinta .cinta-track');
if(cinta){
  const norm=f=>typeof f==='string'?{s:f,w:1000,h:1250}:f;
  const porSesion=sesiones.map(s=>s.fotos.map(norm).filter(f=>f.h>f.w).map(f=>({...f,slug:s.slug,nombre:s.nombre})));
  const eleccion=[];
  for(let i=0;i<3;i++) porSesion.forEach(c=>{ if(c[i]) eleccion.push(c[i]); });
  const tira=eleccion.map(f=>`<a href="sesion.html?s=${f.slug}" tabindex="-1" aria-label="${f.nombre}"><img src="${f.s}" srcset="${srcset(f.s,f.w)}" sizes="220px" width="${f.w}" height="${f.h}" alt="" decoding="async"></a>`).join('');
  cinta.innerHTML=tira+tira;
  cinta.style.setProperty('--n',eleccion.length);
}

const folders=document.querySelector('#folders');
if(folders) folders.innerHTML=sesiones.map((s,i)=>`<li data-rise="${52-i*3}"><a class="folder" href="sesion.html?s=${s.slug}" aria-label="${s.nombre}: ${s.para}">
<span class="folder-tab">${s.para.toUpperCase()}</span>
<span class="folder-body"><span class="folder-shadow" aria-hidden="true"></span><span class="folder-cover"><img src="${s.portada}" srcset="${srcset(s.portada,1080)}" sizes="(max-width:600px) 92vw, (max-width:1000px) 46vw, 30vw" alt="" width="1080" height="1440" loading="${i<3?'eager':'lazy'}" decoding="async"${i<3?' fetchpriority="high"':''}><span class="folder-sheen" aria-hidden="true"></span></span></span>
<span class="folder-meta"><strong>${s.nombre}</strong><span>${s.fotos.length} FOTOS</span></span></a></li>`).join('');
const sessionHead=document.querySelector('#session-head');
if(sessionHead){
  const slug=new URLSearchParams(location.search).get('s');
  const s=sesiones.find(x=>x.slug===slug);
  if(s){
    document.title=`${s.nombre} — ${s.para} — dg.creando`;
    sessionHead.innerHTML=`<a class="back-link" href="fotografia.html">← VOLVER A FOTOGRAFÍA</a>
<p class="section-label">SESIÓN / ${s.para.toUpperCase()}</p>
<h1>${s.titulo||s.nombre}</h1>
<p class="page-lead">${s.texto}</p>
<dl class="case-facts"><div><dt>PARA</dt><dd>${s.para}</dd></div><div><dt>FOTOS</dt><dd>${s.fotos.length}</dd></div></dl>`;
    document.querySelector('#session-gallery').innerHTML=s.fotos.map((f,i)=>{
  const src=typeof f==='string'?f:f.s, w=typeof f==='string'?1080:f.w, h=typeof f==='string'?1440:f.h;
  return `<figure data-rise="52"><a href="${src}" data-foto="${i}"><img src="${src}" srcset="${srcset(src,w)}" sizes="(max-width:700px) 48vw, 30vw" alt="${s.nombre}, foto ${i+1}" width="${w}" height="${h}" loading="${i<3?'eager':'lazy'}" decoding="async"></a></figure>`;
}).join('');
    montarVisor(s.fotos.map(f=>typeof f==='string'?f:f.s));
  }else{
    sessionHead.innerHTML=`<a class="back-link" href="fotografia.html">← VOLVER A FOTOGRAFÍA</a><p class="section-label">FOTOGRAFÍA</p><h1>Esa sesión <em>no está.</em></h1><p class="no-session">Elegí una desde la página de fotografía.</p>`;
    document.querySelector('.session-section')?.remove();
  }
}

// ── Visor de fotos ───────────────────────────────────────────────────
function montarVisor(fotos){
  const galeria=document.querySelector('#session-gallery');
  const visor=document.createElement('div');
  visor.className='visor'; visor.setAttribute('role','dialog'); visor.setAttribute('aria-modal','true'); visor.setAttribute('aria-label','Fotos de la sesión');
  visor.innerHTML='<button class="visor-prev" aria-label="Foto anterior">←</button><figure><img alt=""><figcaption></figcaption></figure><button class="visor-next" aria-label="Foto siguiente">→</button><button class="visor-cerrar" aria-label="Cerrar">×</button>';
  document.body.append(visor);
  const img=visor.querySelector('img'), pie=visor.querySelector('figcaption');
  let actual=0, origen=null;
  const precargar=i=>{ if(fotos[i]){ const p=new Image(); p.src=webp(fotos[i]); } };
  function mostrar(i){
    actual=(i+fotos.length)%fotos.length;
    img.classList.remove('lista');
    const src=webp(fotos[actual]);
    const listo=()=>{ if(img.src.endsWith(src.split('/').pop())) img.classList.add('lista'); };
    img.onload=listo; img.src=src; if(img.complete) listo();
    pie.textContent=`${actual+1} / ${fotos.length}`;
    precargar(actual+1); precargar(actual-1);
  }
  function abrir(i,desde){ origen=desde; document.body.classList.add('visor-abierto'); visor.classList.add('abierto'); mostrar(i); visor.querySelector('.visor-cerrar').focus(); }
  function cerrar(){ visor.classList.remove('abierto'); document.body.classList.remove('visor-abierto'); origen?.focus(); }
  galeria.addEventListener('click',e=>{
    const a=e.target.closest('a[data-foto]'); if(!a) return;
    e.preventDefault(); e.stopPropagation();          // que no lo agarre la transición entre páginas
    abrir(Number(a.dataset.foto),a);
  });
  visor.querySelector('.visor-prev').addEventListener('click',()=>mostrar(actual-1));
  visor.querySelector('.visor-next').addEventListener('click',()=>mostrar(actual+1));
  visor.querySelector('.visor-cerrar').addEventListener('click',cerrar);
  visor.addEventListener('click',e=>{ if(e.target===visor||e.target.tagName==='FIGURE') cerrar(); });
  document.addEventListener('keydown',e=>{
    if(!visor.classList.contains('abierto')) return;
    if(e.key==='Escape') cerrar();
    else if(e.key==='ArrowRight') mostrar(actual+1);
    else if(e.key==='ArrowLeft') mostrar(actual-1);
    else if(e.key==='Tab'){            // el foco circula entre los botones del visor
      const f=[...visor.querySelectorAll('button')], i=f.indexOf(document.activeElement);
      e.preventDefault(); f[(e.shiftKey?i-1+f.length:i+1)%f.length].focus();
    }
  });
  // Deslizar en táctil.
  let x0=null;
  visor.addEventListener('pointerdown',e=>{ x0=e.clientX; },{passive:true});
  visor.addEventListener('pointerup',e=>{ if(x0===null) return; const dx=e.clientX-x0; x0=null; if(Math.abs(dx)>40) mostrar(actual+(dx<0?1:-1)); },{passive:true});
}

// El textarea del formulario crece con lo que escribís, sin barra.
document.querySelectorAll('.contact-footer textarea').forEach(t=>{
  const ajustar=()=>{ t.style.height='auto'; t.style.height=Math.max(110,t.scrollHeight)+'px'; };
  t.addEventListener('input',ajustar); ajustar();
});

document.querySelectorAll('#year').forEach(el=>el.textContent=new Date().getFullYear());
document.querySelectorAll('a[href="#contacto"]').forEach(a=>{
  // Navigation scrolls to the form; explicit WhatsApp actions open the conversation.
  if(a.matches('[data-social="whatsapp"]') || a.textContent.includes('WhatsApp') || a.textContent.includes('Contame')) {
    a.href=whatsappURL('Hola Daiana, me gustaría hablar sobre las redes de mi marca.');a.target='_blank';a.rel='noopener noreferrer';
  }
});
const carouselGroup=document.querySelector('.carousel-group'),carouselTrack=document.querySelector('.carousel-track');
if(carouselGroup&&carouselTrack){const carouselCopy=carouselGroup.cloneNode(true);carouselCopy.setAttribute('aria-hidden','true');carouselTrack.append(carouselCopy);}
const nav=document.querySelector('#nav'),toggle=document.querySelector('.menu-toggle'),menu=document.querySelector('#main-menu');
function setMenu(open){toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');nav.classList.toggle('menu-open',open);document.body.classList.toggle('menu-open',open);if(open)nav.classList.remove('hidden');}
toggle.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('menu-open')){setMenu(false);toggle.focus();}});
const mobile=matchMedia('(max-width: 700px)');mobile.addEventListener('change',()=>setMenu(false));
// Keep keyboard focus inside the open mobile navigation.
nav.addEventListener('keydown',event=>{if(event.key!=='Tab'||!nav.classList.contains('menu-open'))return;const items=[...nav.querySelectorAll('a,button')].filter(el=>el.getClientRects().length);const first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
let previous=scrollY,scheduled=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const layers=[...document.querySelectorAll('[data-parallax]')];
const risers=[...document.querySelectorAll('[data-rise]')];
// Se miden las posiciones una vez (y al redimensionar) en lugar de leer el
// layout en cada cuadro: evita reflows y, sobre todo, evita que el propio
// desplazamiento de un elemento realimente su cálculo.
function measure(){
  [...layers,...risers].forEach(el=>{el.style.transform='';el.style.opacity='';});
  layers.forEach(el=>{const r=el.parentElement.getBoundingClientRect();el._top=r.top+scrollY;el._h=r.height;});
  risers.forEach(el=>{const r=el.getBoundingClientRect();el._top=r.top+scrollY;el._h=r.height;});
}
function render(){
  const y=scrollY;
  nav.classList.toggle('hidden',y>150&&y>previous&&!nav.contains(document.activeElement)&&!nav.classList.contains('menu-open'));
  previous=y;
  if(!reduced.matches){
    layers.forEach(el=>{
      const top=el._top-y;
      if(top+el._h>0&&top<innerHeight) el.style.transform=`translateY(${(innerHeight/2-top-el._h/2)*Number(el.dataset.parallax)}px)`;
    });
    // Aparición desde abajo, atada al scroll: el elemento sube mientras
    // entra en pantalla, en vez de dispararse una animación fija.
    risers.forEach(el=>{
      const top=el._top-y;
      // Solo se saltean los que ya pasaron hacia arriba: si se saltearan
      // también los de más abajo, al entrar al margen darían un salto seco
      // desde 0 hasta el desplazamiento inicial.
      if(top+el._h<-200) return;
      const avance=Math.min(1,Math.max(0,(innerHeight-top)/(innerHeight*0.72)));
      const suave=1-Math.pow(1-avance,3);
      const salto=Number(el.dataset.rise)||64;
      el.style.transform=`translate3d(0,${((1-suave)*salto).toFixed(2)}px,0)`;
      el.style.opacity=(0.25+suave*0.75).toFixed(3);
    });
  }
  scheduled=false;
}
addEventListener('resize',()=>{measure();requestAnimationFrame(render);},{passive:true});
addEventListener('load',()=>{measure();render();});
measure();
addEventListener('scroll',()=>{if(!scheduled){requestAnimationFrame(render);scheduled=true}},{passive:true});
// ── Cursor propio ────────────────────────────────────────────────────
if(!reduced.matches&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  const c=document.createElement('div'); c.className='cursor'; c.setAttribute('aria-hidden','true');
  c.innerHTML='<i></i><b></b>';
  const claros='.contact-footer form,.tier-4,.button,.visual,.phone-screen,.nav-contact:hover';
  document.body.append(c); document.documentElement.classList.add('cursor-propio');
  let mx=innerWidth/2,my=innerHeight/2,x=mx,y=my,activo=false;
  addEventListener('pointermove',e=>{ mx=e.clientX; my=e.clientY; if(!activo){activo=true;x=mx;y=my;c.classList.add('visible');requestAnimationFrame(seguir);} },{passive:true});
  function seguir(){ x+=(mx-x)*.22; y+=(my-y)*.22; c.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`; requestAnimationFrame(seguir); }
  document.addEventListener('mouseleave',()=>c.classList.remove('visible'));
  document.addEventListener('mouseenter',()=>c.classList.add('visible'));
  addEventListener('pointerover',e=>{
    const t=e.target;
    c.classList.toggle('oculto',!!t.closest('input,textarea'));
    const foto=!!t.closest('#session-gallery a');
    c.classList.toggle('mas',foto);
    c.classList.toggle('grande',!foto&&!!t.closest('a,button,.plan,label,[role="button"]'));
    c.classList.toggle('oscuro',!!t.closest(claros));
  },{passive:true});
}

// ── Palabra que cambia ───────────────────────────────────────────────
document.querySelectorAll('.rota').forEach(rota=>{
  const palabras=(rota.dataset.palabras||'').split('|').filter(Boolean);
  if(palabras.length<2||reduced.matches) return;
  let i=0, span=document.createElement('span'); span.textContent=palabras[0]; rota.replaceChildren(span);
  rota.style.width=span.offsetWidth+'px';
  const medir=()=>{ rota.style.width=rota.querySelector('span:not(.sale)').offsetWidth+'px'; };
  addEventListener('resize',medir,{passive:true});
  setInterval(()=>{
    if(document.hidden) return;
    i=(i+1)%palabras.length;
    const nuevo=document.createElement('span'); nuevo.className='entra'; nuevo.textContent=palabras[i];
    const viejo=rota.querySelector('span:not(.sale)');
    rota.append(nuevo);
    rota.style.width=nuevo.offsetWidth+'px';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{ viejo.classList.add('sale'); nuevo.classList.remove('entra'); }));
    setTimeout(()=>viejo.remove(),900);
  },2600);
});

// ── Carpetas: inclinación hacia el cursor ────────────────────────────
// Solo con mouse. La posición del puntero se guarda en cada evento y se
// aplica una vez por cuadro; el CSS hace el resto con variables.
if(!reduced.matches&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  document.querySelectorAll('.folder').forEach(carpeta=>{
    let px=0,py=0,pedido=0;
    const aplicar=()=>{
      pedido=0;
      const r=carpeta.parentElement.getBoundingClientRect();   // el <li> no rota: su caja es fiel
      const x=Math.min(1,Math.max(0,(px-r.left)/r.width)), y=Math.min(1,Math.max(0,(py-r.top)/r.height));
      carpeta.style.setProperty('--rx',((x-.5)*2).toFixed(3));
      carpeta.style.setProperty('--ry',((y-.5)*2).toFixed(3));
      carpeta.style.setProperty('--mx',(x*100).toFixed(1)+'%');
      carpeta.style.setProperty('--my',(y*100).toFixed(1)+'%');
    };
    carpeta.addEventListener('pointerenter',()=>carpeta.classList.add('moviendo'));
    carpeta.addEventListener('pointermove',e=>{px=e.clientX;py=e.clientY;if(!pedido)pedido=requestAnimationFrame(aplicar);});
    carpeta.addEventListener('pointerleave',()=>{
      if(pedido){cancelAnimationFrame(pedido);pedido=0;}
      carpeta.classList.remove('moviendo');
      carpeta.style.setProperty('--rx','0');carpeta.style.setProperty('--ry','0');
    });
  });
}

document.querySelector('#contact-form')?.addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const name=form.elements.name.value.trim(),brand=(v=>v&&!/\s/.test(v)&&!v.startsWith('@')?'@'+v:v)(form.elements.brand.value.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i,'').replace(/\/$/,'')),message=form.elements.message.value.trim();if(!name||!message){document.querySelector('#form-note').textContent='Completá tu nombre y tu mensaje para continuar.';return;}const text=`Hola Daiana, soy ${name}.${brand?` Mi marca en Instagram es ${brand}.`:''}\n\n${message}`;window.open(whatsappURL(text),'_blank','noopener,noreferrer');document.querySelector('#form-note').textContent='Tu consulta está preparada. Enviála desde WhatsApp para completar el contacto.';});
// One-time entrances: headings soften into focus, only short labels type in.
const headingElements=document.querySelectorAll('h1,h2,.about-copy p');const labels=document.querySelectorAll('.eyebrow,.section-label');
if(!reduced.matches&&'IntersectionObserver' in window){
 headingElements.forEach(el=>el.classList.add('blur-enter'));
 labels.forEach(el=>{const text=el.textContent;el.setAttribute('aria-label',text);const reserve=document.createElement('span');reserve.className='type-reserve';reserve.setAttribute('aria-hidden','true');reserve.textContent=text;const span=document.createElement('span');span.className='type-content';span.setAttribute('aria-hidden','true');el.replaceChildren(reserve,span);el.classList.add('type-enter');});
 function typeLabel(el){const text=el.getAttribute('aria-label'),span=el.querySelector('.type-content');let count=0;function tick(){count=reduced.matches?text.length:count+1;span.textContent=text.slice(0,count);if(count<text.length)setTimeout(tick,24);else el.classList.add('typed');}tick();}
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('entered');if(entry.target.classList.contains('type-enter'))typeLabel(entry.target);observer.unobserve(entry.target);}}),{threshold:.18});
 [...headingElements,...labels].forEach(el=>observer.observe(el));
}
reduced.addEventListener('change',event=>{if(event.matches){document.querySelectorAll('.blur-enter,.type-enter').forEach(el=>el.classList.add('entered'));layers.forEach(el=>el.style.transform='none');}});
document.querySelectorAll('.plan').forEach(card=>card.addEventListener('click',event=>{if(event.target.closest('a,button')||window.getSelection()?.toString())return;card.querySelector('.plan-contact').click();}));

// ── Teléfono 3D del hero ─────────────────────────────────────────────
// Mejora progresiva: si no hay WebGL o el módulo no carga, el video se
// reproduce en el teléfono CSS. El 3D se carga después del primer pintado.
const phoneSlot=document.querySelector('.phone-3d');
const phoneVideoSources=[{src:'reel.webm',type:'video/webm'},{src:'reel.mp4',type:'video/mp4'}];
function playPhoneFallback(){
  const screen=document.querySelector('.hero .phone-screen');
  if(!screen||screen.querySelector('video')) return;
  const video=document.createElement('video');
  video.autoplay=true; video.muted=true; video.defaultMuted=true;
  video.loop=true; video.playsInline=true; video.preload='metadata';
  video.setAttribute('muted',''); video.setAttribute('playsinline','');
  video.setAttribute('aria-hidden','true'); video.poster='reel-poster.webp';
  phoneVideoSources.forEach(({src,type})=>{
    const source=document.createElement('source'); source.src=src; source.type=type;
    video.append(source);
  });
  screen.append(video);
  video.play().catch(()=>{});
}
// Dibuja la pantalla: mismo contenido que la versión CSS.
function paintScreen(ctx,w,h){
  const k=w/210; // el teléfono en CSS mide 210px de pantalla
  const grad=ctx.createLinearGradient(0,0,w,h);
  grad.addColorStop(0,'#fff');grad.addColorStop(.64,'#c8c8c8');grad.addColorStop(1,'#f6f6f6');
  ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
  ctx.fillStyle='#181818';ctx.textAlign='center';ctx.textBaseline='alphabetic';
  const spaced=(text,y,size,ls)=>{
    ctx.font=`500 ${size}px Montserrat, sans-serif`;
    const widths=[...text].map(c=>ctx.measureText(c).width+ls);
    let x=w/2-(widths.reduce((a,b)=>a+b,0)-ls)/2;
    [...text].forEach((c,i)=>{ctx.fillText(c,x+widths[i]/2-ls/2,y);x+=widths[i];});
  };
  spaced('DG.CREANDO',h*.20,9*k,3*k);
  ctx.font=`500 ${44*k}px Montserrat, sans-serif`;
  ctx.fillText('Ideas',w/2,h*.345);
  ctx.fillText('que se',w/2,h*.345+48*k);
  ctx.font=`${64*k}px Vibes, cursive`;
  ctx.fillText('mueven.',w/2,h*.345+112*k);
  const cy=h*.685,r=20*k;
  ctx.strokeStyle='rgba(34,34,34,.4)';ctx.lineWidth=1*k;
  ctx.beginPath();ctx.arc(w/2,cy,r,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(w/2-r*.28,cy-r*.34);ctx.lineTo(w/2+r*.38,cy);ctx.lineTo(w/2-r*.28,cy+r*.34);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(24,24,24,.75)';
  spaced('CONTENIDO QUE',h*.80,8*k,1.5*k);
  spaced('SE MUEVE',h*.80+13*k,8*k,1.5*k);
}
function hasWebGL(){try{const c=document.createElement('canvas');return !!(c.getContext('webgl2')||c.getContext('webgl'));}catch(e){return false;}}
if(phoneSlot&&hasWebGL()){
  const fine=matchMedia('(pointer: fine)').matches;
  const load=()=>import('./phone-3d.js').then(({mountPhone})=>{
    window.phone3d=mountPhone(phoneSlot,{
      finish:'grafito',notch:'island',painter:paintScreen,
      poster:'reel-poster.webp',
      fit:1.14,baseAngle:-0.14,shadow:false,drag:false,
      float:!reduced.matches,
      tilt:fine&&!reduced.matches,tiltYaw:.30,tiltPitch:.14,tiltEase:.06,
      maxDpr:fine?2:1.5
    });
    document.body.classList.add('has-phone-3d');
    window.phone3d.setVideo(phoneVideoSources);
  }).catch(playPhoneFallback);
  const boot=()=>(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(load);
  if(document.readyState==='complete')requestAnimationFrame(boot);
  else addEventListener('load',()=>requestAnimationFrame(boot),{once:true});
}else if(phoneSlot) playPhoneFallback();

// ── Scroll suave con inercia ─────────────────────────────────────────
// Interpola la posición real de scroll en vez de transformar un wrapper:
// así siguen funcionando el header fijo, el parallax, los anclajes y los
// IntersectionObserver, que leen scroll nativo.
(function(){
  if(reduced.matches) return;                            // respeta la preferencia del sistema
  if(!matchMedia('(pointer: fine)').matches) return;     // en touch el scroll nativo ya tiene inercia
  const doc=document.documentElement;
  let target=scrollY, current=scrollY, running=false, lastSet=scrollY;
  const maxY=()=>doc.scrollHeight-innerHeight;
  const clamp=v=>Math.max(0,Math.min(maxY(),v));
  function detener(){ running=false; target=current=lastSet=scrollY; }
  function frame(){
    // Si el scroll se movió por fuera de nosotros (la barra, el teclado, un
    // buscar-en-página), el usuario manda: soltamos la inercia en vez de
    // arrastrarlo de vuelta a nuestro destino.
    if(Math.abs(scrollY-lastSet)>2){ detener(); return; }
    current+=(target-current)*0.11;
    if(Math.abs(target-current)<0.4){current=target;running=false;}
    // 'instant' es imprescindible: el CSS tiene scroll-behavior:smooth y si no
    // cada llamada reinicia una animación nativa que cancela a la anterior.
    lastSet=current;
    scrollTo({top:current,left:0,behavior:'instant'});
    if(running) requestAnimationFrame(frame);
  }
  function start(){ if(!running){running=true;requestAnimationFrame(frame);} }
  addEventListener('wheel',event=>{
    if(event.ctrlKey) return;                                    // zoom del navegador
    if(document.body.classList.contains('menu-open')||document.body.classList.contains('visor-abierto')) return; // menú o visor abiertos
    if(event.target.closest && event.target.closest('textarea')) return; // scroll propio del campo
    event.preventDefault();
    const paso=event.deltaMode===1?16:(event.deltaMode===2?innerHeight:1);
    // El trackpad manda decenas de eventos con su propia inercia. Si se suman
    // todos, la nuestra se encima y te dispara media página de más. Limitamos
    // cada golpe y cuánto puede adelantarse el destino respecto de dónde
    // estamos: la sensación se mantiene y deja de pasarse de largo.
    const golpe=Math.max(-innerHeight,Math.min(innerHeight,event.deltaY*paso));
    const techo=innerHeight*1.15;
    target=clamp(Math.max(current-techo,Math.min(current+techo,target+golpe)));
    start();
  },{passive:false});
  // Los anclajes usan el mismo lerp: si no, la animación nativa y esta se
  // pisan y el salto queda a mitad de camino.
  addEventListener('click',event=>{
    const enlace=event.target.closest&&event.target.closest('a[href^="#"]');
    if(!enlace||enlace.target==='_blank') return;
    const href=enlace.getAttribute('href');
    if(href.length<2){ event.preventDefault(); target=0; start(); return; }
    const destino=document.querySelector(href);
    if(!destino) return;
    event.preventDefault();
    target=clamp(destino.getBoundingClientRect().top+scrollY);
    start();
    history.replaceState(null,'',href);
  });
  // Si el scroll lo mueve otra cosa (teclado, barra), sincronizamos.
  addEventListener('scroll',()=>{ if(!running){target=current=lastSet=scrollY;} },{passive:true});
  addEventListener('resize',()=>{ target=clamp(target); },{passive:true});
  // El alto del documento cambia cuando entran las imágenes diferidas: si el
  // destino quedó fuera de rango, se corrige.
  if(window.ResizeObserver) new ResizeObserver(()=>{ target=clamp(target); }).observe(document.body);
  // Al arrastrar la barra o usar el teclado también soltamos la inercia.
  addEventListener('pointerdown',()=>{ if(running) detener(); },{passive:true});
  addEventListener('keydown',event=>{
    if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key)&&running) detener();
  },{passive:true});
})();

// ── Precarga de los casos ────────────────────────────────────────────
// Apenas el cursor entra en una tarjeta (o el dedo la toca), el navegador
// empieza a bajar la página del caso; al hacer clic ya está en caché.
document.querySelectorAll('.case-cover[href],.case-link[href]').forEach(a=>{
  const pre=()=>{ if(a.dataset.pre) return; a.dataset.pre=1;
    const l=document.createElement('link'); l.rel='prefetch'; l.href=a.getAttribute('href'); document.head.appendChild(l); };
  a.addEventListener('pointerenter',pre,{passive:true}); a.addEventListener('touchstart',pre,{passive:true}); a.addEventListener('focus',pre);
});

// ── Loader y transición entre páginas ────────────────────────────────
// El velo ya está en el HTML, así que cubre desde el primer pintado. Acá
// solo se lo saca cuando la página terminó, y se lo vuelve a traer al
// navegar a otra página para que el corte no sea seco.
(function(){
  const velo=document.querySelector('#loader');
  if(!velo) return;
  const barra=velo.querySelector('.loader-bar i');
  const suave=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  let avance=0, listo=false;

  const pintar=v=>{ avance=Math.max(avance,v); if(barra) barra.style.setProperty('--p',avance.toFixed(3)); };

  // La barra avanza hacia 0.9 mientras carga y solo llega a 1 cuando
  // terminó de verdad: el final es real, no simulado.
  const t0=performance.now();
  (function ramp(){
    if(listo) return;
    const t=(performance.now()-t0)/1400;
    pintar(Math.min(0.9,1-Math.pow(1-Math.min(1,t),2)*1));
    requestAnimationFrame(ramp);
  })();

  function terminar(){
    if(listo) return;
    listo=true; pintar(1);
    setTimeout(()=>{
      document.body.classList.add('cargada');
      setTimeout(()=>velo.classList.add('fuera'), suave?380:0);
    }, suave?120:0);
  }
  // Se va cuando el HTML y las fuentes están listos: esperar a 'load' era
  // esperar a la última foto de la página, y en los casos se notaba.
  const listoParaMostrar=()=>(document.fonts&&document.fonts.ready?Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,800))]):Promise.resolve()).then(terminar);
  if(document.readyState!=='loading') listoParaMostrar();
  else addEventListener('DOMContentLoaded',listoParaMostrar,{once:true});
  // Red de seguridad: si algo no carga, el velo no se queda para siempre.
  setTimeout(terminar,2500);

  // Volver con el botón atrás restaura la página desde caché: el velo
  // tiene que estar afuera, no tapando todo.
  addEventListener('pageshow',event=>{
    if(event.persisted){
      document.body.classList.remove('saliendo');
      document.body.classList.add('cargada');
      velo.classList.add('fuera');
    }
  });

  // Transición de salida hacia otra página del sitio.
  addEventListener('click',event=>{
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.button!==0) return;
    const enlace=event.target.closest&&event.target.closest('a[href]');
    if(!enlace||enlace.target==='_blank'||enlace.hasAttribute('download')) return;
    const href=enlace.getAttribute('href');
    if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||/\.(jpe?g|png|webp|gif)$/i.test(href)) return;
    let destino;
    try{ destino=new URL(href,location.href); }catch(_){ return; }
    if(destino.origin!==location.origin) return;
    if(destino.pathname===location.pathname) return;      // la misma página
    event.preventDefault();
    velo.classList.remove('fuera');
    document.body.classList.add('saliendo');
    setTimeout(()=>{ scrollTo({top:0,left:0,behavior:'instant'}); location.href=destino.href; }, suave?320:0);
  });
})();
