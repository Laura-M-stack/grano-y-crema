import { test } from 'node:test';
import assert from 'node:assert/strict';
import { desplazamiento, factorPantalla, visible } from '../site/js/parallax-calc.js';

const vh = 800;

test('centrado en pantalla no hay desplazamiento', () => {
  assert.equal(desplazamiento({ top: 300, height: 200 }, vh, 0.5), 0);
});

test('fondo (negativo) y primer plano (positivo) se mueven en sentidos opuestos', () => {
  const centrado = { top: 300, height: 200 };
  const r = { top: 100, height: 200 }; // su centro queda 200px arriba del medio de la pantalla
  assert.equal(desplazamiento(r, vh, 0.5), -100);
  assert.equal(desplazamiento(r, vh, -0.5), 100);
  assert.equal(desplazamiento(centrado, vh, 0), 0);
});

test('se limita a ±max', () => {
  const r = { top: -1000, height: 200 };
  assert.equal(desplazamiento(r, vh, 1, 60), -60);
  assert.equal(desplazamiento({ top: 3000, height: 200 }, vh, 1, 60), 60);
});

test('entradas inválidas devuelven 0 en vez de NaN', () => {
  assert.equal(desplazamiento({ top: NaN, height: 10 }, vh, 1), 0);
  assert.equal(desplazamiento({ top: 0, height: 10 }, vh, undefined), 0);
});

test('menos efecto en pantallas angostas', () => {
  assert.equal(factorPantalla(375), 0.55);
  assert.equal(factorPantalla(1280), 1);
});

test('visible solo cerca de la pantalla', () => {
  assert.equal(visible({ top: 100, height: 300 }, vh), true);
  assert.equal(visible({ top: 5000, height: 300 }, vh), false);
  assert.equal(visible({ top: -2000, height: 300 }, vh), false);
  assert.equal(visible({ top: -300, height: 400 }, vh), true);
});
