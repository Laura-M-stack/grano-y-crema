import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SABORES } from '../site/js/datos.js';
import { ajustarSabores, alternarSabor, maxSabores, pesos, resumen, total, validar } from '../site/js/pedido.js';

const slots = [{ valor: '20:00', minutos: 1200 }, { valor: '20:30', minutos: 1230 }];

test('pesos separa los miles con punto', () => {
  assert.equal(pesos(500), '$500');
  assert.equal(pesos(8500), '$8.500');
  assert.equal(pesos(1234567), '$1.234.567');
});

test('máximo de sabores por tamaño', () => {
  assert.equal(maxSabores('cuarto'), 3);
  assert.equal(maxSabores('kilo'), 5);
  assert.equal(maxSabores('xx'), 0);
  assert.equal(maxSabores('toString'), 0);
});

test('total suma tamaño y extras sin repetir ni aceptar desconocidos', () => {
  assert.equal(total('cuarto'), 8500);
  assert.equal(total('cuarto', ['salsa']), 9400);
  assert.equal(total('medio', ['salsa', 'conos']), 15500 + 900 + 1200);
  assert.equal(total('medio', ['salsa', 'salsa', 'inexistente', 'toString']), 15500 + 900);
  assert.equal(total('nada'), null);
});

test('alternarSabor agrega, quita y respeta el máximo', () => {
  let r = alternarSabor([], 'pistacho', 2, SABORES);
  assert.deepEqual(r, { sabores: ['pistacho'], motivo: null });
  r = alternarSabor(r.sabores, 'frutilla', 2, SABORES);
  r = alternarSabor(r.sabores, 'limon', 2, SABORES);
  assert.equal(r.motivo, 'maximo');
  assert.deepEqual(r.sabores, ['pistacho', 'frutilla']);
  r = alternarSabor(r.sabores, 'pistacho', 2, SABORES);
  assert.deepEqual(r.sabores, ['frutilla']);
});

test('un sabor agotado no se puede elegir pero sí quitar si quedó elegido', () => {
  assert.equal(alternarSabor([], 'choc-almendras', 3, SABORES).motivo, 'agotado');
  assert.deepEqual(alternarSabor(['choc-almendras'], 'choc-almendras', 3, SABORES).sabores, []);
});

test('sabor desconocido no cambia nada', () => {
  assert.deepEqual(alternarSabor(['limon'], 'fantasma', 3, SABORES), { sabores: ['limon'], motivo: 'desconocido' });
});

test('ajustarSabores recorta al achicar el tamaño', () => {
  assert.deepEqual(ajustarSabores(['a', 'b', 'c', 'd'], 3), ['a', 'b', 'c']);
  assert.deepEqual(ajustarSabores(['a'], 3), ['a']);
  assert.deepEqual(ajustarSabores(['a'], -1), []);
});

test('validar acepta un pedido completo', () => {
  assert.deepEqual(validar({ tam: 'cuarto', sabores: ['limon'], nombre: 'Ana', retiro: '20:00' }, slots), {});
});

test('validar informa cada campo faltante', () => {
  const e = validar({ tam: '', sabores: [], nombre: ' ', retiro: '' }, slots);
  assert.deepEqual(Object.keys(e).sort(), ['nombre', 'retiro', 'sabores', 'tam']);
});

test('validar rechaza demasiados sabores, nombres largos y horarios inexistentes', () => {
  const e = validar({ tam: 'cuarto', sabores: ['a', 'b', 'c', 'd'], nombre: 'x'.repeat(41), retiro: '03:00' }, slots);
  assert.ok(e.sabores && e.nombre && e.retiro);
});

test('sin slots, el error de retiro avisa que ya no se toman pedidos', () => {
  const e = validar({ tam: 'cuarto', sabores: ['limon'], nombre: 'Ana', retiro: '' }, []);
  assert.match(e.retiro, /ya no tomamos pedidos/);
});

test('resumen lista todo y el total', () => {
  const txt = resumen({ tam: 'medio', sabores: ['pistacho', 'limon'], extras: ['conos'], nombre: ' Ana ', retiro: '20:30' }, SABORES);
  assert.match(txt, /^Pedido de Ana/);
  assert.match(txt, /Helado de ½ kg: Pistacho, Limón/);
  assert.match(txt, /Extras: Cucuruchos \(x4\)/);
  assert.match(txt, /Retiro hoy a las 20:30/);
  assert.match(txt, /Total: \$16\.700/);
});
