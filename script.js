// Add Daiana's confirmed international WhatsApp number here (digits only).
const WHATSAPP_NUMBER = '59892347597';
const plans = [
{name:'Básico',description:'Para mantener tu marca activa y visualmente coherente.',items:['Portadas para historias destacadas','Optimización de la biografía','8 posteos mensuales','Diseño personalizado','Carruseles de hasta 7 placas','Ideas de contenido','Copy + CTA','Hashtags y palabras clave','Planificación mensual']},
{name:'Plus',description:'Más contenido y presencia durante toda la semana.',items:['Portadas para historias destacadas','Optimización de la biografía','8 posteos mensuales','3 Stories semanales','Diseño personalizado','Carruseles de hasta 7 placas','Ideas de contenido','Copy + CTA','Hashtags y palabras clave','Planificación mensual']},
{name:'Reels',description:'Contenido en video para darle movimiento y presencia a tu marca.',items:['Portadas para historias destacadas','Optimización de la biografía','8 Reels mensuales','Ideas y conceptos','Guión para cada Reel','Edición profesional','Textos, música y recursos visuales','Copy + CTA','Hashtags y palabras clave','Planificación mensual','Análisis básico de rendimiento']},
{name:'Completo',description:'Una propuesta que combina diseño y video de forma constante.',items:['Portadas para historias destacadas','Optimización de la biografía','8 posteos mensuales','4 Reels mensuales','Carruseles de hasta 7 placas','Diseño personalizado','Ideas y planificación','Guiones para Reels','Edición de video','Copy + CTA','Hashtags y palabras clave']}
];
const whatsappURL = message => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
document.querySelector('#plan-grid').innerHTML = plans.map((p,i)=>`<article class="plan tier-${i+1}"><div class="plan-top"><span>PLAN / 0${i+1}</span><span class="tier-bars" aria-hidden="true">${Array.from({length:4},(_,j)=>`<i class="${j<=i?'active':''}"></i>`).join('')}</span></div><h3>${p.name}</h3><p class="plan-description">${p.description}</p><ul>${p.items.map(item=>`<li>${item}</li>`).join('')}</ul><a class="button plan-contact" data-plan="${p.name}" href="${whatsappURL(`Hola Daiana, me interesa el plan ${p.name}. Me gustaría conocer el precio y cómo podemos empezar a trabajar en mi marca.`)}" target="_blank" rel="noopener noreferrer">Quiero el plan ${p.name} <span>↗</span></a></article>`).join('');
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelectorAll('a[href="#contacto"]').forEach(a=>{
  // Navigation scrolls to the form; explicit WhatsApp actions open the conversation.
  if(a.matches('[data-social="whatsapp"]') || a.textContent.includes('WhatsApp') || a.textContent.includes('Contame')) {
    a.href=whatsappURL('Hola Daiana, me gustaría hablar sobre las redes de mi marca.');a.target='_blank';a.rel='noopener noreferrer';
  }
});
const carouselGroup=document.querySelector('.carousel-group');
const carouselCopy=carouselGroup.cloneNode(true);carouselCopy.setAttribute('aria-hidden','true');document.querySelector('.carousel-track').append(carouselCopy);
const nav=document.querySelector('#nav'),toggle=document.querySelector('.menu-toggle'),menu=document.querySelector('#main-menu');
function setMenu(open){toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');nav.classList.toggle('menu-open',open);document.body.classList.toggle('menu-open',open);if(open)nav.classList.remove('hidden');}
toggle.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('menu-open')){setMenu(false);toggle.focus();}});
const mobile=matchMedia('(max-width: 700px)');mobile.addEventListener('change',()=>setMenu(false));
// Keep keyboard focus inside the open mobile navigation.
nav.addEventListener('keydown',event=>{if(event.key!=='Tab'||!nav.classList.contains('menu-open'))return;const items=[...nav.querySelectorAll('a,button')].filter(el=>el.getClientRects().length);const first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
let previous=scrollY,scheduled=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)'),layers=document.querySelectorAll('[data-parallax]');
function render(){const y=scrollY;nav.classList.toggle('hidden',y>150&&y>previous&&!nav.contains(document.activeElement)&&!nav.classList.contains('menu-open'));previous=y;if(!reduced.matches)layers.forEach(el=>{const r=el.parentElement.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)el.style.transform=`translateY(${(innerHeight/2-r.top-r.height/2)*Number(el.dataset.parallax)}px)`});scheduled=false;}
addEventListener('scroll',()=>{if(!scheduled){requestAnimationFrame(render);scheduled=true}},{passive:true});
document.querySelector('#contact-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const name=form.elements.name.value.trim(),brand=form.elements.brand.value.trim(),message=form.elements.message.value.trim();if(!name||!message){document.querySelector('#form-note').textContent='Completá tu nombre y tu mensaje para continuar.';return;}const text=`Hola Daiana, soy ${name}.${brand?` Mi marca es ${brand}.`:''}\n\n${message}`;window.open(whatsappURL(text),'_blank','noopener,noreferrer');document.querySelector('#form-note').textContent='Tu consulta está preparada. Enviála desde WhatsApp para completar el contacto.';});
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
