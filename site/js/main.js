import { CAFE, FAMILIAS, SABORES } from './datos.js';
import { estadoAhora, partesBA, slotsRetiro, tablaHorarios } from './horario.js';
import { iniciarParallax } from './parallax.js';
import { EXTRAS, TAMANOS, ajustarSabores, alternarSabor, maxSabores, pesos, resumen, total, validar } from './pedido.js';
import { filtrarSabores } from './sabores.js';

const $ = (sel, root = document) => root.querySelector(sel);

function el(tag, props = {}, ...hijos) {
  const nodo = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') nodo.className = v;
    else if (k === 'text') nodo.textContent = v;
    else if (v === true) nodo.setAttribute(k, '');
    else if (v !== false && v != null) nodo.setAttribute(k, String(v));
  }
  nodo.append(...hijos);
  return nodo;
}

/* ---------- Estado abierto / cerrado ---------- */
function pintarEstado() {
  const nodo = $('[data-estado]');
  if (!nodo) return;
  const e = estadoAhora();
  nodo.textContent = e.texto;
  nodo.dataset.abierto = String(e.abierto);
}

/* ---------- Horarios ---------- */
function pintarHorarios() {
  const hoy = partesBA().dia;
  const cuerpo = $('[data-horarios]');
  cuerpo.replaceChildren(
    ...tablaHorarios().map((h) =>
      el('tr', { class: h.dia === hoy ? 'es-hoy' : '' },
        el('th', { scope: 'row' }, h.nombre, h.dia === hoy ? el('span', { class: 'hoy-tag', text: ' · hoy' }) : ''),
        el('td', { text: h.abre }),
        el('td', { text: h.cierra }),
      ),
    ),
  );
}

/* ---------- Café ---------- */
function pintarCafe() {
  $('[data-cafe]').replaceChildren(
    ...CAFE.map((c) =>
      el('li', { class: 'cafe__item' },
        el('div', { class: 'cafe__head' },
          el('span', { class: 'cafe__nombre', text: c.nombre }),
          el('span', { class: 'cafe__puntos', 'aria-hidden': 'true' }),
          el('span', { class: 'cafe__precio', text: pesos(c.precio) }),
        ),
        el('p', { class: 'cafe__desc', text: c.desc }),
      ),
    ),
  );
}

/* ---------- Sabores ---------- */
const filtro = { familia: 'todos', q: '' };

function pintarSabores() {
  const lista = filtrarSabores(SABORES, filtro);
  $('[data-sabores]').replaceChildren(
    ...lista.map((s) =>
      el('li', { class: 'sabor', 'data-agotado': String(!s.disponible) },
        el('span', { class: 'bocha', style: `--c:${s.color}`, 'aria-hidden': 'true' }),
        el('div', { class: 'sabor__texto' },
          el('h3', { class: 'sabor__nombre', text: s.nombre }),
          el('p', { class: 'sabor__desc', text: s.desc }),
          s.disponible ? '' : el('span', { class: 'etiqueta', text: 'Se terminó por hoy' }),
        ),
      ),
    ),
  );
  $('[data-vacio]').hidden = lista.length > 0;
  $('[data-conteo]').textContent = lista.length === SABORES.length ? `${lista.length} sabores` : `${lista.length} de ${SABORES.length} sabores`;
}

function iniciarFiltros() {
  const contenedor = $('[data-chips]');
  function pintarChips() {
    contenedor.replaceChildren(
      ...FAMILIAS.map((f) =>
        el('button', { type: 'button', class: 'chip', 'aria-pressed': String(filtro.familia === f.id), 'data-id': f.id, text: f.nombre }),
      ),
    );
  }
  pintarChips();
  contenedor.addEventListener('click', (e) => {
    const b = e.target.closest('[data-id]');
    if (!b) return;
    filtro.familia = b.dataset.id;
    pintarChips();
    pintarSabores();
    $(`[data-id="${filtro.familia}"]`, contenedor)?.focus();
  });
  const input = $('#buscar');
  input.addEventListener('input', () => {
    filtro.q = input.value;
    pintarSabores();
  });
  $('[data-limpiar]').addEventListener('click', () => {
    filtro.familia = 'todos';
    filtro.q = '';
    input.value = '';
    pintarChips();
    pintarSabores();
    input.focus();
  });
  pintarSabores();
}

/* ---------- Pedido ---------- */
const pedido = { tam: 'cuarto', sabores: [], extras: [] };

function iniciarPedido() {
  const form = $('#pedido-form');
  const contTam = $('[data-tamanos]');
  const contElegir = $('[data-elegir]');
  const contExtras = $('[data-extras]');
  const selectRetiro = $('#retiro');
  const aviso = $('[data-aviso]');

  contTam.replaceChildren(
    ...Object.values(TAMANOS).map((t) =>
      el('label', { class: 'opcion' },
        el('input', { type: 'radio', name: 'tam', value: t.id, checked: t.id === pedido.tam }),
        el('span', { class: 'opcion__cuerpo' },
          el('strong', { text: t.nombre }),
          el('small', { text: `hasta ${t.max} sabores` }),
          el('b', { text: pesos(t.precio) }),
        ),
      ),
    ),
  );

  contElegir.replaceChildren(
    ...SABORES.map((s) =>
      el('label', { class: 'pastilla', 'data-agotado': String(!s.disponible) },
        el('input', { type: 'checkbox', name: 'sabor', value: s.id, disabled: !s.disponible }),
        el('span', { class: 'pastilla__cuerpo' },
          el('i', { class: 'punto', style: `--c:${s.color}`, 'aria-hidden': 'true' }),
          s.nombre,
          s.disponible ? '' : el('em', { text: ' (se terminó)' }),
        ),
      ),
    ),
  );

  contExtras.replaceChildren(
    ...Object.values(EXTRAS).map((x) =>
      el('label', { class: 'pastilla' },
        el('input', { type: 'checkbox', name: 'extra', value: x.id }),
        el('span', { class: 'pastilla__cuerpo' }, `${x.nombre} (+${pesos(x.precio)})`),
      ),
    ),
  );

  function sincronizar() {
    for (const i of contElegir.querySelectorAll('input')) i.checked = pedido.sabores.includes(i.value);
    $('[data-contador]').textContent = `(${pedido.sabores.length} de ${maxSabores(pedido.tam)})`;
    $('[data-total]').textContent = pesos(total(pedido.tam, pedido.extras) ?? 0);
  }

  function limpiarError(nombre) {
    const p = $(`#err-${nombre}`);
    if (p) p.textContent = '';
    const campo = nombre === 'nombre' ? $('#nombre') : nombre === 'retiro' ? selectRetiro : null;
    campo?.removeAttribute('aria-invalid');
  }

  function pintarSlots() {
    const previo = selectRetiro.value;
    const slots = slotsRetiro(new Date());
    if (!slots.length) {
      selectRetiro.replaceChildren(el('option', { value: '', text: 'Hoy ya no tomamos pedidos', disabled: true, selected: true }));
      return slots;
    }
    selectRetiro.replaceChildren(
      el('option', { value: '', text: 'Elegí un horario' }),
      ...slots.map((s) => el('option', { value: s.valor, text: s.valor, selected: s.valor === previo })),
    );
    return slots;
  }
  let slots = pintarSlots();
  setInterval(() => { slots = pintarSlots(); }, 60_000);

  contTam.addEventListener('change', (e) => {
    if (e.target.name !== 'tam') return;
    pedido.tam = e.target.value;
    const max = maxSabores(pedido.tam);
    const antes = pedido.sabores.length;
    pedido.sabores = ajustarSabores(pedido.sabores, max);
    aviso.textContent = pedido.sabores.length < antes ? `Con ${TAMANOS[pedido.tam].nombre} entran ${max} sabores: dejamos los primeros ${max}.` : '';
    limpiarError('tam');
    sincronizar();
  });

  contElegir.addEventListener('change', (e) => {
    const input = e.target;
    if (input.name !== 'sabor') return;
    const r = alternarSabor(pedido.sabores, input.value, maxSabores(pedido.tam), SABORES);
    pedido.sabores = r.sabores;
    aviso.textContent =
      r.motivo === 'maximo' ? `Con ${TAMANOS[pedido.tam].nombre} podés elegir hasta ${maxSabores(pedido.tam)} sabores. Sacá uno para cambiarlo.`
      : r.motivo === 'agotado' ? 'Ese sabor se terminó por hoy.'
      : '';
    limpiarError('sabores');
    sincronizar();
  });

  contExtras.addEventListener('change', (e) => {
    if (e.target.name !== 'extra') return;
    pedido.extras = [...contExtras.querySelectorAll('input:checked')].map((i) => i.value);
    sincronizar();
  });

  $('#nombre').addEventListener('input', () => limpiarError('nombre'));
  selectRetiro.addEventListener('change', () => limpiarError('retiro'));

  const conf = $('[data-confirmacion]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    conf.hidden = true;
    slots = pintarSlots();
    const datos = { ...pedido, nombre: $('#nombre').value, retiro: selectRetiro.value };
    const errores = validar(datos, slots);

    for (const nombre of ['tam', 'sabores', 'nombre', 'retiro']) {
      const p = $(`#err-${nombre}`);
      p.textContent = errores[nombre] ?? '';
      const campo = nombre === 'nombre' ? $('#nombre') : nombre === 'retiro' ? selectRetiro : null;
      if (campo) {
        if (errores[nombre]) campo.setAttribute('aria-invalid', 'true');
        else campo.removeAttribute('aria-invalid');
      }
    }
    const primero = ['tam', 'sabores', 'nombre', 'retiro'].find((n) => errores[n]);
    if (primero) {
      const destino = primero === 'nombre' ? $('#nombre') : primero === 'retiro' ? selectRetiro : primero === 'tam' ? $('input[name="tam"]') : $('input[name="sabor"]:not(:disabled)');
      destino?.focus();
      return;
    }
    $('[data-texto]').textContent = resumen(datos, SABORES);
    $('[data-copiado]').textContent = '';
    conf.hidden = false;
    conf.focus();
  });

  $('[data-copiar]').addEventListener('click', async () => {
    const texto = $('[data-texto]').textContent;
    const salida = $('[data-copiado]');
    try {
      await navigator.clipboard.writeText(texto);
      salida.textContent = 'Copiado.';
    } catch {
      const r = document.createRange();
      r.selectNodeContents($('[data-texto]'));
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
      salida.textContent = 'No pudimos copiar solo: el texto quedó seleccionado, copialo con Ctrl+C.';
    }
  });

  sincronizar();
}

/* ---------- Fotos con respaldo ---------- */
function iniciarFotos() {
  for (const img of document.querySelectorAll('.band__media img, .marco img')) {
    const fallar = () => {
      img.hidden = true;
      img.parentElement.dataset.fallo = 'true';
    };
    img.addEventListener('error', fallar, { once: true });
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) fallar();
  }
}

/* ---------- Menú móvil ---------- */
function iniciarMenu() {
  const boton = $('.nav-toggle');
  const nav = $('#nav');
  const cerrar = () => {
    boton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('abierto');
  };
  boton.addEventListener('click', () => {
    const abrir = boton.getAttribute('aria-expanded') !== 'true';
    boton.setAttribute('aria-expanded', String(abrir));
    nav.classList.toggle('abierto', abrir);
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) cerrar(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('abierto')) { cerrar(); boton.focus(); }
  });
}

pintarEstado();
setInterval(pintarEstado, 60_000);
pintarHorarios();
pintarCafe();
iniciarFiltros();
iniciarPedido();
iniciarFotos();
iniciarMenu();
iniciarParallax();
