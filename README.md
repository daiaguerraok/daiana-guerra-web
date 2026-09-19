# dg.creando — Daiana Guerra

Portfolio y servicios de community management, fotografía y gestión de redes.
Sitio estático: HTML, CSS y JavaScript a mano, sin build, sin dependencias
que instalar.

**Cloudflare Pages:** framework `None`, sin comando de compilación, directorio
de publicación `.`. Rama de producción: `main`.

---

## Páginas

| Archivo | Qué es |
|---|---|
| `index.html` | Home: hero, sobre mí, portfolio, planes y contacto |
| `fotografia.html` | Fotografía: las sesiones, como carpetas |
| `sesion.html` | Una sesión de fotos (`sesion.html?s=slug`): para qué fue y todas las fotos |
| `caso-oreo-burger.html` | Caso 01: feed de Oreo Burger, antes y después |

Cada caso del portfolio abre su propia página. Para sumar uno nuevo, se copia
`caso-oreo-burger.html` y se cambian contenido y material.

## Archivos

```
style.css            todo el sitio
script.js            planes, menú, formulario, movimiento y loader
phone-3d.js          mockup 3D del hero (bundle con Three.js adentro)
logo-dgcreando.svg
montserrat.woff2     fuentes locales, con sus licencias OFL
great-vibes.woff2
casos/               portadas y logos de los casos
casos/oreo/          capturas del feed del caso 01
fotos/               portadas de sesión, fotos de cada sesión y retrato
```

## Material

Las imágenes de los casos 02 y 03 y las de las sesiones de fotografía son
**placeholders** hasta recibir el material definitivo. Medidas:

| Qué | Medida |
|---|---|
| Portada de caso, horizontal | 2752 × 1320 |
| Portada de caso, vertical (celular) | 1100 × 1000 |
| Logo de caso | SVG, o PNG transparente de 1200 px de ancho |
| Posteo del feed | 1080 × 1080 |
| Portada de sesión (carpeta) | 1080 × 1440, vertical |
| Foto de sesión y retrato | 1000 × 1250 |

Las portadas se recortan a `cover` y el centro queda tapado por el logo del
caso: conviene dejar esa zona tranquila. El 10% de arriba y el de abajo se
pierden, porque la imagen se desplaza con el scroll.

## Cómo está hecho

**Teléfono 3D del hero.** `phone-3d.js` monta un mockup en Three.js que sigue
el mouse. Es mejora progresiva: se carga después del `load` y, si el navegador
no soporta WebGL, queda el teléfono dibujado en CSS. El canvas no recibe
eventos, así que nunca tapa el botón del hero. Para poner un video:

```js
phone3d.setVideo('reel.mp4')   // mp4 H.264 vertical
```

**Movimiento.** El scroll tiene inercia propia (solo con mouse o trackpad; en
táctil queda el nativo). Los casos y las fotos suben al entrar en pantalla,
atado a la posición de scroll. Las posiciones se miden una vez y al
redimensionar, no en cada cuadro.

**Carpetas de fotografía.** Cada sesión es una carpeta con pestaña. Con
mouse, se inclina hacia el cursor; en táctil queda quieta. Todo el
movimiento va por `transform` y `opacity`, y el cálculo corre una vez por
cuadro.

**Loader.** Está en el HTML, así que cubre desde el primer pintado, y hace
también de transición entre páginas. Sin JavaScript no aparece.

**Todo respeta `prefers-reduced-motion`**: con esa preferencia activada no hay
inercia, ni desplazamientos, ni transiciones.

## Editar

- **Planes:** el array `plans` al principio de `script.js`. Los ítems que se
  repiten en todos los planes van en `planBase` y se muestran una sola vez.
- **Sesiones de fotografía:** el array `sesiones` en `script.js`. Cada
  sesión es un objeto con `slug`, `nombre`, `para`, `portada`,
  `texto` y `fotos`; con eso se arman la carpeta y su página. `titulo` es
  opcional y admite HTML, para poner una palabra en cursiva.
- **WhatsApp:** la constante `WHATSAPP_NUMBER`, también en `script.js`.
- **Logos de caso descentrados:** si un logo tiene partes que sobresalen de su
  forma principal, se corrige con `--logo-y` en su `div.case-logo`, en
  porcentaje del alto del logo.
- **Palabras en cursiva (`<em>`, `<i>`):** el tamaño sale solo, de `--script`
  en `style.css`. Lo único que puede necesitar ajuste es el espacio que queda
  antes de la palabra: algunas letras de la Great Vibes se meten hacia atrás
  con el trazo de entrada y quedan pegadas a la palabra anterior. Se corrige
  con `--sangria` en el `<em>`, que es el margen propio de la letra cambiado
  de signo. Para sacarlo:

  ```bash
  python3 -c "
  from fontTools.ttLib import TTFont
  from fontTools.pens.boundsPen import BoundsPen
  f=TTFont('great-vibes.woff2'); g=f.getGlyphSet()
  p=BoundsPen(g); g[f.getBestCmap()[ord('p')]].draw(p)
  print('--sangria:%+.3fem' % (-p.bounds[0]/f['head'].unitsPerEm))"
  ```

  Cambiando `'p'` por la inicial de la palabra. Por debajo de `0.03em` no se
  nota y conviene dejarlo en cero.

`script.js` corre en todas las páginas y tiene guardas para lo que solo existe
en la home. Al agregar algo nuevo, conviene mantener esa precaución.

## Trabajo

Hacer commits y push solo cuando Daiana lo indique.

WhatsApp: +598 92 347 597 · [Instagram](https://www.instagram.com/dg.creando/) · [Facebook](https://www.facebook.com/people/DG-Creando/100088979876752/)
