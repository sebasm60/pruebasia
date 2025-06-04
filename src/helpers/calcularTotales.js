export const calcularTotales = ({
  ordenes,
  categorias,
  tiposDeCobros,
  currentCategoriaId,
  setValue,
  watch
}) => {
  let totalGeneralTemp = 0;
  let totalIVATemp = 0;
  const tipoConvenioId = watch('tipoConvenioId')

  const tempCat = categorias.find(item => Number(item.value) === Number(currentCategoriaId));
  ordenes.forEach((orden, ordenIndex) => {
    let totalOrden = 0;
    const convenioIdOrden = watch(`ordenes.${ordenIndex}.tipoConvenioId`);
    const tipoCartera = watch(`ordenes.${ordenIndex}.tipoCartera`)

    orden.medicamentos?.forEach((med, medicamentoIndex) => {
      if (med.esCopia) return;

      const cantidad = Number(med.cantidadAutorizada);
      const cantidadDisponible = Number(med.cantidadDisponible)
      const precio = Number(med.valor);
      const iva = Number(med.iva);

      const subtotal = isNaN(cantidad) || isNaN(precio) ? 0 : cantidad * precio;
      const total = isNaN(cantidad) || isNaN(precio) ? 0 : Math.round(subtotal * (1 + iva / 100) * 100) / 100;
      const totalIVA = Math.round((total - subtotal) * 100) / 100;

      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.total`, total, {
        shouldDirty: true,
      });

      if (cantidadDisponible >= cantidad) {
        setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.cantidadEntregada`, cantidad, {
          shouldDirty: true,
        });
      } else {
        setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.cantidadEntregada`, cantidadDisponible, {
          shouldDirty: true,
        });
      }

      if (!isNaN(total)) totalOrden += total;
      if (!isNaN(totalIVA)) totalIVATemp += totalIVA;
    });

    totalOrden = Math.round(totalOrden);

    setValue(`ordenes.${ordenIndex}.totalOrden`, totalOrden, {
      shouldDirty: true,
    });

    const tc = orden.tipoCobro;
    const tipoCobroSeleccionado = tiposDeCobros.find(item => Number(item.value) === Number(tc));

    let totalPagar = totalOrden;

    if (tipoCobroSeleccionado?.CobroCero) {
      totalPagar = 0;
    } else if (currentCategoriaId && tc) {
      const tcNumero = Number(tc);

      if (tcNumero === 1) {
        totalPagar = Math.min(
          calcularValorPagarEspecial(totalOrden, tempCat.PctajeCOP),
          totalOrden
        );
      } else if (tcNumero === 2) {
        totalPagar = Math.min(tempCat.ValorCM, totalOrden);
        if (Number(tipoConvenioId) === 0 || Number(convenioIdOrden) === 0) setValue(`ordenes.${ordenIndex}.tipoCartera`, totalOrden < tempCat.ValorCM && totalPagar > 0 ? 'CAPVD' : tipoCartera)
        if (Number(tipoConvenioId) === 1 || Number(convenioIdOrden) === 1) setValue(`ordenes.${ordenIndex}.tipoCartera`, totalOrden < tempCat.ValorCM && totalPagar > 0 ? 'EVTVD' : tipoCartera)
      } else if (tcNumero === 12) {
        totalPagar = Math.min(
          calcularValorPagarEspecial(totalOrden, tempCat.PctajeCR),
          totalOrden
        );
      }
    }

    totalPagar = Math.round(totalPagar);
    setValue(`ordenes.${ordenIndex}.totalPagarPorOrden`, totalPagar, {
      shouldDirty: true,
    });

    totalGeneralTemp += totalPagar;
  });

  totalIVATemp = Math.round(totalIVATemp);
  totalGeneralTemp = Math.round(totalGeneralTemp);

  setValue(`totalIVA`, totalIVATemp, { shouldDirty: true });
  setValue(`totalGeneral`, totalGeneralTemp, { shouldDirty: true });
  setValue(`subtotalGeneral`, totalGeneralTemp, { shouldDirty: true });
};

export const calcularValorPagarEspecial = (totalOrden, porcentaje) => {
  const cuota = Number(porcentaje ?? 0);
  if (cuota > 0 && cuota <= 100) {
    return Math.round((totalOrden * cuota) / 100)
  }
  return totalOrden;
};
