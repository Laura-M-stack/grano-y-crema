import { DIAS, HORARIOS, NEGOCIO } from './datos.js';

/** Día de la semana y minutos del día en Buenos Aires, sin depender de la zona del navegador. */
export function partesBA(fecha = new Date()) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: NEGOCIO.zona,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const p = Object.fromEntries(f.formatToParts(fecha).map((x) => [x.type, x.value]));
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  const hora = Number(p.hour) % 24;
  return { dia, minutos: hora * 60 + Number(p.minute) };
}

export function hhmm(minutos) {
  const m = minutos % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

export function estadoAhora(fecha = new Date()) {
  const { dia, minutos } = partesBA(fecha);
  const hoy = HORARIOS[dia];
  if (minutos >= hoy.abre && minutos < hoy.cierra) {
    return { abierto: true, texto: `Abierto ahora, cerramos a las ${hhmm(hoy.cierra)}` };
  }
  if (minutos < hoy.abre) {
    return { abierto: false, texto: `Cerrado, abrimos hoy a las ${hhmm(hoy.abre)}` };
  }
  const manana = (dia + 1) % 7;
  return { abierto: false, texto: `Cerrado, abrimos mañana (${DIAS[manana].toLowerCase()}) a las ${hhmm(HORARIOS[manana].abre)}` };
}

/**
 * Horarios de retiro disponibles para hoy: desde `anticipacion` minutos adelante
 * (o la apertura, si todavía no abrimos) hasta `paso` minutos antes de cerrar.
 */
export function slotsRetiro(fecha = new Date(), { anticipacion = 30, paso = 30 } = {}) {
  const { dia, minutos } = partesBA(fecha);
  const { abre, cierra } = HORARIOS[dia];
  const primero = Math.max(abre, Math.ceil((minutos + anticipacion) / paso) * paso);
  const slots = [];
  for (let m = primero; m <= cierra - paso; m += paso) slots.push({ valor: hhmm(m), minutos: m });
  return slots;
}

export function tablaHorarios() {
  return DIAS.map((nombre, i) => ({ dia: i, nombre, abre: hhmm(HORARIOS[i].abre), cierra: hhmm(HORARIOS[i].cierra) }));
}
