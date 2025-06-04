export const getCantidadEntregadaRules = (ordenes, ordenIndex, medicamentoIndex) => {
  const cantidadDisponible = Number(ordenes[ordenIndex]?.medicamentos[medicamentoIndex]?.cantidadDisponible || 0);
  const cantidadAutorizada = Number(ordenes[ordenIndex]?.medicamentos[medicamentoIndex]?.cantidadAutorizada || 0);

  const min = cantidadDisponible === 0 ? 0 : 1;
  const max = Math.min(cantidadDisponible, cantidadAutorizada);

  return {
    min: {
      value: min,
      message: 'Debe ser mayor o igual a 1 (o 0 si no hay disponibilidad)',
    },
    max: {
      value: max,
      message: 'No puede superar la cantidad autorizada o disponible',
    },
  };
};
