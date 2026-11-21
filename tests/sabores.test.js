import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FAMILIAS, SABORES } from '../site/js/datos.js';
import { filtrarSabores, normalizar } from '../site/js/sabores.js';

test('los ids de sabores son únicos y cada familia existe', () => {
  const ids = SABORES.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  const familias = new Set(FAMILIAS.map((f) => f.id));
  for (const s of SABORES) assert.ok(familias.has(s.familia), s.id);
});

test('normalizar quita tildes y mayúsculas', () => {
  assert.equal(normalizar('  Sambayón '), 'sambayon');
  assert.equal(normalizar(null), '');
});

test('sin filtros devuelve todo', () => {
  assert.equal(filtrarSabores(SABORES).length, SABORES.length);
});

test('filtra por familia', () => {
  const r = filtrarSabores(SABORES, { familia: 'frutales' });
  assert.ok(r.length > 0);
  assert.ok(r.every((s) => s.familia === 'frutales'));
});

test('busca sin importar tildes ni mayúsculas', () => {
  assert.deepEqual(filtrarSabores(SABORES, { q: 'LIMON' }).map((s) => s.id), ['limon']);
  assert.ok(filtrarSabores(SABORES, { q: 'sambayon' }).length === 1);
});

test('familia y texto se combinan', () => {
  assert.deepEqual(filtrarSabores(SABORES, { familia: 'chocolates', q: 'almendras' }).map((s) => s.id), ['choc-almendras']);
  assert.deepEqual(filtrarSabores(SABORES, { familia: 'frutales', q: 'almendras' }), []);
});
