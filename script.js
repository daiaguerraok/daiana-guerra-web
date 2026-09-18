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
const fotosProvisionales=Array.from({length:9},(_,i)=>`fotos/foto-0${i+1}.jpg`);
const sesiones=[
{slug:'cafe-nomade',nombre:'Café Nómade',titulo:'Café <em>Nómade.</em>',para:'Producto',anio:2025,portada:'fotos/sesion-01.jpg',
 texto:'Fotos de producto para el lanzamiento de la carta de invierno: tazas, granos y detalle de barra, pensadas para el feed y para historias.',fotos:fotosProvisionales},
{slug:'oreo-burger',nombre:'Oreo Burger',titulo:'Oreo <em>Burger.</em>',para:'Gastronomía',anio:2025,portada:'fotos/sesion-02.jpg',
 texto:'Sesión gastronómica para el feed nuevo: hamburguesas, papas y la barra, con luz cálida y fondo oscuro para que el producto sea el protagonista.',fotos:fotosProvisionales},
{slug:'editorial-primavera',nombre:'Editorial de primavera',titulo:'Editorial de <em style="--sangria:.148em">primavera.</em>',para:'Retrato',anio:2024,portada:'fotos/sesion-03.jpg',
 texto:'Retratos en exterior para una marca de indumentaria: luz natural, movimiento y planos que muestran la prenda sin perder a la persona.',fotos:fotosProvisionales},
{slug:'casa-rambla',nombre:'Casa Rambla',titulo:'Casa <em>Rambla.</em>',para:'Espacio',anio:2024,portada:'fotos/sesion-04.jpg',
 texto:'Interiores y detalle para un alojamiento frente al mar: ambientes amplios, texturas y la luz de la tarde entrando por las ventanas.',fotos:fotosProvisionales},
{slug:'lanzamiento-lua',nombre:'Lanzamiento Lúa',titulo:'Lanzamiento <em>Lúa.</em>',para:'Marca',anio:2025,portada:'fotos/sesion-05.jpg',
 texto:'Imágenes de marca para el lanzamiento: producto, packaging y escenas de uso, con una paleta definida para sostener la identidad en redes.',fotos:fotosProvisionales},
{slug:'feria-de-ideas',nombre:'Feria de ideas',titulo:'Feria de <em>ideas.</em>',para:'Evento',anio:2023,portada:'fotos/sesion-06.jpg',
 texto:'Cobertura de un evento de emprendedores: stands, charlas y gente, con foco en los momentos que después sirven para contar el evento en redes.',fotos:fotosProvisionales},
];
const folders=document.querySelector('#folders');
if(folders) folders.innerHTML=sesiones.map((s,i)=>`<li data-rise="${52-i*3}"><a class="folder" href="sesion.html?s=${s.slug}" aria-label="${s.nombre}: ${s.para}, ${s.anio}">
<span class="folder-tab"><span>${s.para.toUpperCase()}</span><i aria-hidden="true">${s.anio}</i></span>
<span class="folder-body"><span class="folder-shadow" aria-hidden="true"></span><span class="folder-cover"><img src="${s.portada}" alt="" width="1080" height="1440" loading="${i<3?'eager':'lazy'}" decoding="async"${i<3?' fetchpriority="high"':''}><span class="folder-sheen" aria-hidden="true"></span></span></span>
<span class="folder-meta"><strong>${s.nombre}</strong><span>${s.fotos.length} FOTOS</span></span></a></li>`).join('');
const sessionHead=document.querySelector('#session-head');
if(sessionHead){
  const slug=new URLSearchParams(location.search).get('s');
  const s=sesiones.find(x=>x.slug===slug);
  if(s){
    document.title=`${s.nombre} — ${s.para} — dg.creando`;
    sessionHead.innerHTML=`<a class="back-link" href="fotografia.html">← VOLVER A FOTOGRAFÍA</a>
<p class="section-label">SESIÓN / ${s.para.toUpperCase()} · ${s.anio}</p>
<h1>${s.titulo||s.nombre}</h1>
<p class="page-lead">${s.texto}</p>
<dl class="case-facts"><div><dt>PARA</dt><dd>${s.para}</dd></div><div><dt>AÑO</dt><dd>${s.anio}</dd></div><div><dt>FOTOS</dt><dd>${s.fotos.length}</dd></div></dl>`;
    document.querySelector('#session-gallery').innerHTML=s.fotos.map((f,i)=>`<figure data-rise="52"><img src="${f}" alt="${s.nombre}, foto ${i+1}" width="1000" height="1250" loading="${i<3?'eager':'lazy'}" decoding="async"></figure>`).join('');
  }else{
    sessionHead.innerHTML=`<a class="back-link" href="fotografia.html">← VOLVER A FOTOGRAFÍA</a><p class="section-label">FOTOGRAFÍA</p><h1>Esa sesión <em>no está.</em></h1><p class="no-session">Elegí una desde la página de fotografía.</p>`;
    document.querySelector('.session-section')?.remove();
  }
}

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

document.querySelector('#contact-form')?.addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const name=form.elements.name.value.trim(),brand=form.elements.brand.value.trim(),message=form.elements.message.value.trim();if(!name||!message){document.querySelector('#form-note').textContent='Completá tu nombre y tu mensaje para continuar.';return;}const text=`Hola Daiana, soy ${name}.${brand?` Mi marca es ${brand}.`:''}\n\n${message}`;window.open(whatsappURL(text),'_blank','noopener,noreferrer');document.querySelector('#form-note').textContent='Tu consulta está preparada. Enviála desde WhatsApp para completar el contacto.';});
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
// Mejora progresiva: si no hay WebGL o el módulo no carga, queda el
// teléfono en CSS. Se carga después del load para no competir con el
// primer pintado. Cuando llegue el video de Daiana:
//   phone3d.setVideo('reel.mp4')   ·   mp4 H.264 vertical, idealmente 9:19.5
const phoneSlot=document.querySelector('.phone-3d');
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
  spaced('DAIANA GUERRA',h*.20,9*k,3*k);
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
  spaced('ESPACIO PARA TU VIDEO',h*.80,8*k,1.5*k);
  spaced('VISTA PROVISIONAL',h*.80+13*k,8*k,1.5*k);
}
function hasWebGL(){try{const c=document.createElement('canvas');return !!(c.getContext('webgl2')||c.getContext('webgl'));}catch(e){return false;}}
if(phoneSlot&&hasWebGL()){
  const fine=matchMedia('(pointer: fine)').matches;
  const load=()=>import('./phone-3d.js').then(({mountPhone})=>{
    window.phone3d=mountPhone(phoneSlot,{
      finish:'grafito',notch:'island',painter:paintScreen,
      fit:1.14,baseAngle:-0.14,shadow:false,drag:false,
      float:!reduced.matches,
      tilt:fine&&!reduced.matches,tiltYaw:.30,tiltPitch:.14,tiltEase:.06,
      maxDpr:fine?2:1.5
    });
    document.body.classList.add('has-phone-3d');
  }).catch(()=>{});
  const boot=()=>(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(load);
  if(document.readyState==='complete')requestAnimationFrame(boot);
  else addEventListener('load',()=>requestAnimationFrame(boot),{once:true});
}

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
    if(document.body.classList.contains('menu-open')) return;     // menú mobile abierto
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
      setTimeout(()=>velo.classList.add('fuera'), suave?600:0);
    }, suave?240:0);
  }
  if(document.readyState==='complete') terminar();
  else addEventListener('load',terminar);
  // Red de seguridad: si algo no carga, el velo no se queda para siempre.
  setTimeout(terminar,4000);

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
    if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')) return;
    let destino;
    try{ destino=new URL(href,location.href); }catch(_){ return; }
    if(destino.origin!==location.origin) return;
    if(destino.pathname===location.pathname) return;      // la misma página
    event.preventDefault();
    velo.classList.remove('fuera');
    document.body.classList.add('saliendo');
    setTimeout(()=>{ location.href=destino.href; }, suave?320:0);
  });
})();
