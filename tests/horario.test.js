import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estadoAhora, hhmm, partesBA, slotsRetiro, tablaHorarios } from '../site/js/horario.js';

// 2026-11-21 es sábado. Las horas llevan el offset de Buenos Aires (-03:00).
const d = (iso) => new Date(iso);

test('usa la hora de Buenos Aires aunque la fecha venga en UTC', () => {
  const p = partesBA(d('2026-11-21T15:30:00Z')); // 12:30 en Buenos Aires
  assert.deepEqual(p, { dia: 6, minutos: 12 * 60 + 30 });
});

test('el día cambia según Buenos Aires, no según UTC', () => {
  const p = partesBA(d('2026-11-22T01:00:00Z')); // sábado 22:00 en BA, ya domingo en UTC
  assert.equal(p.dia, 6);
});

test('la medianoche en Buenos Aires es 00:00 y no 24:00', () => {
  const p = partesBA(d('2026-11-22T03:00:00Z'));
  assert.deepEqual(p, { dia: 0, minutos: 0 });
});

test('abierto un martes a la tarde', () => {
  const e = estadoAhora(d('2026-11-24T17:00:00-03:00'));
  assert.equal(e.abierto, true);
  assert.match(e.texto, /cerramos a las 22:00/);
});

test('viernes y sábado cerramos a medianoche', () => {
  const e = estadoAhora(d('2026-11-21T23:30:00-03:00'));
  assert.equal(e.abierto, true);
  assert.match(e.texto, /cerramos a las 00:00/);
});

test('el domingo a las 00:30 (madrugada del sábado) ya está cerrado', () => {
  const e = estadoAhora(d('2026-11-22T00:30:00-03:00'));
  assert.equal(e.abierto, false);
  assert.match(e.texto, /abrimos hoy a las 09:00/);
});

test('cerrado de noche: abrimos mañana', () => {
  const e = estadoAhora(d('2026-11-24T23:00:00-03:00')); // martes 23:00
  assert.equal(e.abierto, false);
  assert.match(e.texto, /abrimos mañana \(miércoles\) a las 08:00/);
});

test('justo a la hora de apertura está abierto, justo al cierre no', () => {
  assert.equal(estadoAhora(d('2026-11-24T08:00:00-03:00')).abierto, true);
  assert.equal(estadoAhora(d('2026-11-24T22:00:00-03:00')).abierto, false);
});

test('hhmm formatea y envuelve la medianoche', () => {
  assert.equal(hhmm(0), '00:00');
  assert.equal(hhmm(8 * 60 + 5), '08:05');
  assert.equal(hhmm(1440), '00:00');
});

test('slots de retiro: 30 minutos de anticipación y de a media hora', () => {
  const s = slotsRetiro(d('2026-11-24T20:10:00-03:00')); // martes, cierra 22:00
  assert.deepEqual(s.map((x) => x.valor), ['21:00', '21:30']);
});

test('antes de abrir, el primer retiro es a la apertura', () => {
  const s = slotsRetiro(d('2026-11-24T06:00:00-03:00'));
  assert.equal(s[0].valor, '08:00');
  assert.equal(s.at(-1).valor, '21:30');
});

test('sin slots cuando ya no alcanza el tiempo o cerramos', () => {
  assert.deepEqual(slotsRetiro(d('2026-11-24T21:30:00-03:00')), []);
  assert.deepEqual(slotsRetiro(d('2026-11-24T23:30:00-03:00')), []);
});

test('viernes llega hasta 23:30', () => {
  const s = slotsRetiro(d('2026-11-20T22:00:00-03:00'));
  assert.equal(s.at(-1).valor, '23:30');
});

test('la tabla de horarios cubre los 7 días', () => {
  const t = tablaHorarios();
  assert.equal(t.length, 7);
  assert.equal(t[0].nombre, 'Domingo');
  assert.equal(t[5].cierra, '00:00');
});
