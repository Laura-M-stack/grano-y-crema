export const TAMANOS = {
  cuarto: { id: 'cuarto', nombre: '¼ kg', max: 3, precio: 8500 },
  medio: { id: 'medio', nombre: '½ kg', max: 4, precio: 15500 },
  kilo: { id: 'kilo', nombre: '1 kg', max: 5, precio: 29000 },
};

export const EXTRAS = {
  salsa: { id: 'salsa', nombre: 'Salsa de dulce de leche', precio: 900 },
  conos: { id: 'conos', nombre: 'Cucuruchos (x4)', precio: 1200 },
};

export const MAX_NOMBRE = 40;

export function pesos(n) {
  return '$' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function maxSabores(tam) {
  return TAMANOS[tam]?.max ?? 0;
}

/** Total del pedido. Devuelve null si el tamaño no existe; ignora extras desconocidos o repetidos. */
export function total(tam, extras = []) {
  const t = TAMANOS[tam];
  if (!t) return null;
  const unicos = [...new Set(extras)].filter((id) => Object.hasOwn(EXTRAS, id));
  return t.precio + unicos.reduce((s, id) => s + EXTRAS[id].precio, 0);
}

/**
 * Agrega o quita un sabor respetando el máximo del tamaño y la disponibilidad.
 * Devuelve { sabores, motivo } donde motivo es null o 'maximo' | 'agotado' | 'desconocido'.
 */
export function alternarSabor(actuales, id, max, catalogo) {
  const s = catalogo.find((x) => x.id === id);
  if (!s) return { sabores: actuales, motivo: 'desconocido' };
  if (actuales.includes(id)) return { sabores: actuales.filter((x) => x !== id), motivo: null };
  if (!s.disponible) return { sabores: actuales, motivo: 'agotado' };
  if (actuales.length >= max) return { sabores: actuales, motivo: 'maximo' };
  return { sabores: [...actuales, id], motivo: null };
}

/** Si se achica el tamaño, se conservan los primeros sabores que entran. */
export function ajustarSabores(sabores, max) {
  return sabores.slice(0, Math.max(0, max));
}

export function validar({ tam, sabores = [], nombre = '', retiro = '' }, slots = []) {
  const errores = {};
  if (!TAMANOS[tam]) errores.tam = 'Elegí un tamaño.';
  const limpio = nombre.trim();
  if (limpio.length < 2) errores.nombre = 'Escribí tu nombre (mínimo 2 letras).';
  else if (limpio.length > MAX_NOMBRE) errores.nombre = `El nombre no puede pasar de ${MAX_NOMBRE} letras.`;
  if (sabores.length < 1) errores.sabores = 'Elegí al menos un sabor.';
  else if (TAMANOS[tam] && sabores.length > TAMANOS[tam].max) errores.sabores = `Con ${TAMANOS[tam].nombre} podés elegir hasta ${TAMANOS[tam].max} sabores.`;
  if (!slots.length) errores.retiro = 'Hoy ya no tomamos pedidos. Probá mañana.';
  else if (!slots.some((s) => s.valor === retiro)) errores.retiro = 'Elegí un horario de retiro.';
  return errores;
}

export function resumen({ tam, sabores, extras = [], nombre, retiro }, catalogo) {
  const t = TAMANOS[tam];
  const nombres = sabores.map((id) => catalogo.find((s) => s.id === id)?.nombre).filter(Boolean);
  const ex = [...new Set(extras)].filter((id) => Object.hasOwn(EXTRAS, id)).map((id) => EXTRAS[id].nombre);
  return [
    `Pedido de ${nombre.trim()}`,
    `Helado de ${t.nombre}: ${nombres.join(', ')}`,
    ex.length ? `Extras: ${ex.join(', ')}` : null,
    `Retiro hoy a las ${retiro}`,
    `Total: ${pesos(total(tam, extras))}`,
  ].filter(Boolean).join('\n');
}
