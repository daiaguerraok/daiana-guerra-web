// Tarifas y lugares de la calculadora de cumpleaños infantiles.
// Es el único archivo que hay que tocar para cambiar precios, barrios o textos.
//
// - precios: pesos uruguayos, por cantidad de horas. Ya incluyen el traslado
//   estimado desde Arroyo Seco.
// - lugares: cada lugar va en la lista de su zona. Para cambiarlo de zona,
//   se mueve de una lista a otra. Para agregar uno, se escribe en la lista.
// - Las zonas son aproximadas: no son kilómetros ni tiempos de viaje reales.

// Precios de la zona cerca, que también usan Piriápolis y Pan de Azúcar
const PRECIOS_CERCA = { 2: 4500, 3: 6000, 4: 7500 };

window.CALCULADORA = {
  // Seña fija en pesos, igual para todos los presupuestos
  sena: 500,

  horas: [2, 3, 4],

  zonas: [
    {
      id: 'mvd-cerca',
      nombre: 'Montevideo cerca',
      precios: PRECIOS_CERCA,
      lugares: [
        'Arroyo Seco', 'Aguada', 'Centro', 'Cordón', 'Ciudad Vieja', 'Reducto',
        'Goes', 'La Comercial', 'Barrio Sur', 'Palermo', 'Tres Cruces',
        'Parque Rodó', 'Brazo Oriental',
        // limitan con Arroyo Seco
        'Prado', 'Bella Vista', 'Capurro',
        // agregados: a pocas cuadras
        'Villa Muñoz', 'Jacinto Vera'
      ]
    },
    {
      id: 'mvd-media',
      nombre: 'Montevideo distancia media',
      precios: { 2: 5000, 3: 6500, 4: 8000 },
      lugares: [
        'Pocitos', 'Parque Batlle', 'La Blanqueada', 'Buceo', 'Malvín',
        'Unión', 'Atahualpa', 'La Teja', 'Belvedere', 'Cerro',
        // agregados
        'Punta Carretas', 'Villa Dolores', 'Larrañaga', 'Aires Puros',
        'Cerrito', 'Sayago', 'Nuevo París', 'Villa Española', 'Maroñas'
      ]
    },
    {
      id: 'mvd-lejos',
      nombre: 'Montevideo lejos',
      precios: { 2: 5500, 3: 7000, 4: 8500 },
      lugares: [
        'Carrasco', 'Punta Gorda', 'Colón', 'Paso de la Arena', 'Lezica', 'Manga',
        // agregados
        'Malvín Norte', 'Piedras Blancas', 'Peñarol', 'Casabó', 'Santa Catalina',
        'Punta de Rieles', 'Carrasco Norte'
      ]
    },
    {
      id: 'canelones',
      nombre: 'Canelones y alrededores',
      precios: { 2: 6200, 3: 7700, 4: 9200 },
      lugares: [
        'Las Piedras', 'Ciudad de la Costa', 'Pando', 'Salinas', 'Atlántida',
        // agregados
        'La Paz', 'Progreso', 'Barros Blancos', 'Solymar', 'El Pinar'
      ]
    },
    {
      id: 'maldonado',
      nombre: 'Maldonado y alrededores',
      precios: { 2: 9000, 3: 10500, 4: 12000 },
      lugares: ['Maldonado', 'Punta del Este', 'San Carlos']
    },
    {
      id: 'piriapolis',
      nombre: 'Piriápolis y Pan de Azúcar',
      precios: PRECIOS_CERCA,
      lugares: ['Piriápolis', 'Pan de Azúcar']
    }
  ],

  // Lo que incluyen todas las coberturas, en el orden del mensaje
  incluye: [
    'Fotos de la decoración.',
    'Fotos en la torta con los invitados a medida que van llegando.',
    'Mini sesión al cumpleañer@.',
    'Captura de juegos y momentos espontáneos.',
    'Se entregan todas las fotos sacadas + edición incluida.'
  ],

  // Lo que se suma al final según las horas de cobertura
  incluyePorHoras: {
    2: ['Si la cobertura no llega al feliz cumpleaños, prendemos la velita y sacamos fotos con los padres soplándola, para que tengan el recuerdo de ese momento.'],
    3: ['Si la cobertura no llega al feliz cumpleaños, prendemos la velita y sacamos fotos con los padres soplándola, para que tengan el recuerdo de ese momento.'],
    4: ['Cobertura del momento de cantar el feliz cumpleaños.']
  },

  // Textos del mensaje que se copia para WhatsApp. *texto* sale en negrita.
  mensaje: {
    saludo: '¡Hola{cliente}! Gracias por escribirme.',
    intro: 'Te paso el presupuesto para la cobertura fotográfica del cumpleaños:',
    sena: 'Para reservar la fecha se abona una seña.',
    cierre: 'Cualquier duda me escribís. ¡Va a quedar hermoso!',
    firma: 'Daiana Guerra · dg.creando'
  }
};
