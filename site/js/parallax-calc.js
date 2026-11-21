/**
 * Desplazamiento vertical (px) de una capa según qué tan lejos está su contenedor del centro de la pantalla.
 * speed > 0: la capa se adelanta al scroll (primer plano). speed < 0: se atrasa (fondo).
 * El resultado se limita a ±max para que nunca se vea el borde de la imagen.
 */
export function desplazamiento({ top, height }, viewportAlto, speed, max = Infinity) {
  if (![top, height, viewportAlto, speed].every(Number.isFinite)) return 0;
  const distancia = top + height / 2 - viewportAlto / 2;
  const y = distancia * speed;
  const limite = Math.abs(max);
  return Math.max(-limite, Math.min(limite, y)) + 0; // + 0 evita devolver -0
}

/** En pantallas angostas se reduce el efecto para que no marée ni tape el texto. */
export function factorPantalla(ancho) {
  return ancho < 720 ? 0.55 : 1;
}

/** Un contenedor participa solo si está (casi) en pantalla. */
export function visible({ top, height }, viewportAlto, margen = 200) {
  return top < viewportAlto + margen && top + height > -margen;
}
