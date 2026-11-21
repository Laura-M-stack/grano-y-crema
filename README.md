# Pistacho

Demo de una heladería y cafetería de barrio. Es un proyecto ficticio de portfolio: no toma pedidos reales.

**Demo:** https://laura-m-stack.github.io/pistacho/

## Qué muestra

- Diseño retro de heladería: toldo a rayas, crema, espresso y verde pistacho, con Fraunces y DM Sans.
- Parallax por capas: en el hero (sol, cono, taza, granos y confites a distintas velocidades), en dos bandas con foto y en la foto del café. Se desactiva con `prefers-reduced-motion`, se reduce en pantallas angostas y solo se calcula para lo que está en pantalla.
- Horario en vivo según la hora de Buenos Aires (no la del navegador), con cierre a medianoche viernes y sábado, y tabla con el día actual resaltado.
- Sabores con filtro por familia y búsqueda sin distinguir tildes; los agotados se ven aparte y no se pueden elegir.
- Armador de pedido: tamaño, sabores con máximo según el tamaño, extras, horario de retiro calculado según la hora y el cierre, validación con mensajes accesibles y botón para copiar el pedido.
- Fotos de Unsplash cargadas desde su CDN. Si una no carga, queda un fondo con patrón y el texto sigue legible.
- Accesibilidad: contraste AA (el acento `#3F6212` tiene 6,6:1 sobre crema), foco visible, navegación con teclado, áreas táctiles de 44 px, sin scroll horizontal a 375 px.

## Tecnología

HTML, CSS y JavaScript sin dependencias ni build. La lógica está separada del DOM y se prueba con el runner nativo de Node (38 pruebas).

## Uso

```powershell
npm test      # pruebas de la lógica
npm start     # servidor local en http://localhost:4173
```

Requiere Node 20 o superior. El sitio publicado es el contenido de `site/`.

## Estructura

```
site/                  sitio estático (index.html, css, js)
site/js/datos.js       sabores, café y horarios de ejemplo
site/js/horario.js     hora de Buenos Aires, abierto/cerrado, horarios de retiro
site/js/pedido.js      tamaños, precios, validación y resumen del pedido
site/js/sabores.js     filtro por familia y texto
site/js/parallax-calc.js  cálculo del desplazamiento de cada capa
site/js/parallax.js    enlace con el DOM (scroll, resize, movimiento reducido)
tests/                 pruebas con node:test
scripts/serve.mjs      servidor local mínimo
```

Fotos: [Unsplash](https://unsplash.com). Los precios, el local y los pedidos son de ejemplo.
