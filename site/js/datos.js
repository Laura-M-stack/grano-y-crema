/** Datos de la demo: sabores, café y horarios. Los precios son de ejemplo. */

export const FAMILIAS = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'dulce-de-leche', nombre: 'Dulce de leche' },
  { id: 'chocolates', nombre: 'Chocolates' },
  { id: 'cremas', nombre: 'Cremas' },
  { id: 'frutales', nombre: 'Frutales' },
];

/** `color` es solo decorativo (la bocha de la tarjeta); el texto nunca depende de él. */
export const SABORES = [
  { id: 'ddl-granizado', nombre: 'Dulce de leche granizado', familia: 'dulce-de-leche', desc: 'Con escamas de chocolate semiamargo.', color: '#D9A15B', disponible: true },
  { id: 'super-ddl', nombre: 'Súper dulce de leche', familia: 'dulce-de-leche', desc: 'Con ribetes de dulce de leche repostero.', color: '#C98A4B', disponible: true },
  { id: 'sambayon', nombre: 'Sambayón', familia: 'dulce-de-leche', desc: 'Yema, vino dulce y un toque de vainilla.', color: '#F0CF72', disponible: true },
  { id: 'choc-amargo', nombre: 'Chocolate amargo', familia: 'chocolates', desc: 'Cacao intenso, poco dulce.', color: '#5A3A29', disponible: true },
  { id: 'choc-suizo', nombre: 'Chocolate suizo', familia: 'chocolates', desc: 'Cremoso, con chips de chocolate.', color: '#7A5039', disponible: true },
  { id: 'choc-almendras', nombre: 'Chocolate con almendras', familia: 'chocolates', desc: 'Almendras tostadas y crocantes.', color: '#8A6247', disponible: false },
  { id: 'americana', nombre: 'Crema americana', familia: 'cremas', desc: 'La clásica, de vainilla y leche entera.', color: '#F7E7BE', disponible: true },
  { id: 'mascarpone', nombre: 'Mascarpone con frutos rojos', familia: 'cremas', desc: 'Suave, con salsa de frutos rojos.', color: '#F2D3D8', disponible: true },
  { id: 'tiramisu', nombre: 'Tiramisú', familia: 'cremas', desc: 'Café, mascarpone y vainillas.', color: '#CFAF8E', disponible: true },
  { id: 'pistacho', nombre: 'Pistacho', familia: 'cremas', desc: 'Pasta de pistacho tostado.', color: '#A8C97A', disponible: true },
  { id: 'menta', nombre: 'Menta granizada', familia: 'cremas', desc: 'Menta fresca con chocolate picado.', color: '#BFE3CC', disponible: true },
  { id: 'frutilla', nombre: 'Frutilla a la crema', familia: 'frutales', desc: 'Frutillas reales y crema.', color: '#F08AA0', disponible: true },
  { id: 'limon', nombre: 'Limón', familia: 'frutales', desc: 'Al agua, bien cítrico.', color: '#F4E684', disponible: true },
  { id: 'maracuya', nombre: 'Maracuyá', familia: 'frutales', desc: 'Ácido y perfumado, al agua.', color: '#F5B94E', disponible: true },
];

export const CAFE = [
  { nombre: 'Espresso', desc: 'Corto, de tueste medio.', precio: 2200 },
  { nombre: 'Cortado', desc: 'Espresso con un chorrito de leche.', precio: 2600 },
  { nombre: 'Lágrima', desc: 'Mucha leche, poco café.', precio: 3000 },
  { nombre: 'Cappuccino', desc: 'Con espuma firme y cacao.', precio: 3600 },
  { nombre: 'Submarino', desc: 'Leche caliente y una barra de chocolate.', precio: 4200 },
  { nombre: 'Affogato', desc: 'Una bocha de crema americana con espresso.', precio: 4800 },
];

/** Horario por día (0 = domingo … 6 = sábado). Minutos desde las 00:00; 1440 = medianoche. */
export const HORARIOS = {
  0: { abre: 9 * 60, cierra: 22 * 60 },
  1: { abre: 8 * 60, cierra: 22 * 60 },
  2: { abre: 8 * 60, cierra: 22 * 60 },
  3: { abre: 8 * 60, cierra: 22 * 60 },
  4: { abre: 8 * 60, cierra: 22 * 60 },
  5: { abre: 8 * 60, cierra: 24 * 60 },
  6: { abre: 8 * 60, cierra: 24 * 60 },
};

export const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const NEGOCIO = {
  nombre: 'Pistacho',
  direccion: 'Av. del Libertador 1200, Buenos Aires',
  telefono: '+54 11 5555-0188',
  instagram: '@pistacho.demo',
  zona: 'America/Argentina/Buenos_Aires',
  repo: 'https://github.com/Laura-M-stack/pistacho',
};
