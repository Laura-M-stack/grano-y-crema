export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/** Filtra por familia y por texto, sin distinguir tildes ni mayúsculas. */
export function filtrarSabores(lista, { familia = 'todos', q = '' } = {}) {
  const buscado = normalizar(q);
  return lista.filter((s) => {
    if (familia !== 'todos' && s.familia !== familia) return false;
    if (!buscado) return true;
    return normalizar(`${s.nombre} ${s.desc}`).includes(buscado);
  });
}
