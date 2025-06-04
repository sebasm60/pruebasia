import { useCallback } from "react";
import { defaultValuesMedicamento } from "src/constants";

export const useManejoMedicamentos = ({ getValues, setValue, update, saldosPorMedicamento, setSaldosPorMedicamento }) => {

  const addMedicamento = useCallback((ordenIndex) => {
    const currentMedicamentos = getValues(`ordenes.${ordenIndex}.medicamentos`) || [];
    const ordenActual = getValues(`ordenes.${ordenIndex}`);

    const newMedicamento = defaultValuesMedicamento;

    update(ordenIndex, {
      ...ordenActual,
      medicamentos: [...currentMedicamentos, newMedicamento]
    });
  }, [getValues, update]);

  const removeMedicamento = useCallback((ordenIndex, medicamentoIndex) => {
    const ordenActual = getValues(`ordenes.${ordenIndex}`);
    if (!ordenActual?.medicamentos) return;

    const medicamentos = ordenActual.medicamentos;
    const medicamento = medicamentos[medicamentoIndex];

    let updatedMedicamentos;

    if (medicamento.esCopia) {
      // Solo eliminar la copia
      updatedMedicamentos = [...medicamentos];
      updatedMedicamentos.splice(medicamentoIndex, 1);
    } else {
      // Es el original, buscar si la siguiente es la copia
      if (medicamentos[medicamentoIndex + 1]?.esCopia &&
        medicamentos[medicamentoIndex + 1]?.IdMedicamento === medicamento.IdMedicamento) {
        // Eliminar ambos (original y copia)
        updatedMedicamentos = [...medicamentos];
        updatedMedicamentos.splice(medicamentoIndex, 2);
      } else {
        // Solo eliminar el original
        updatedMedicamentos = [...medicamentos];
        updatedMedicamentos.splice(medicamentoIndex, 1);
      }
    }

    update(ordenIndex, {
      ...ordenActual,
      medicamentos: updatedMedicamentos
    });

  }, [getValues, update]);


  const duplicarMedicamento = useCallback((ordenIndex, medicamentoIndex) => {
    const ordenActual = getValues(`ordenes.${ordenIndex}`);
    const medicamentosActuales = ordenActual.medicamentos || [];
    const medicamentoOriginal = medicamentosActuales[medicamentoIndex];

    const copiaYaExiste = medicamentosActuales[medicamentoIndex + 1]?.IdMedicamento === medicamentoOriginal.IdMedicamento &&
      medicamentosActuales[medicamentoIndex + 1]?.esCopia;

    if (copiaYaExiste) return;

    // 1. Obtener los saldos del medicamento original
    const claveOriginal = `${ordenIndex}-${medicamentoIndex}`;
    const saldos = saldosPorMedicamento[claveOriginal] || [];

    // 2. Buscar el siguiente lote disponible (o el mismo si no hay otro)
    const indexLoteActual = saldos.findIndex(s => s.Lote === medicamentoOriginal.lote);
    const siguienteLote = saldos[indexLoteActual + 1] || saldos[indexLoteActual];

    // 3. Crear el nuevo medicamento duplicado con el siguiente lote
    const nuevoMedicamento = {
      ...medicamentoOriginal,
      lote: siguienteLote?.Lote || "",
      esCopia: true,
      cantidadAutorizada: medicamentoOriginal.cantidadAutorizada - medicamentoOriginal.cantidadEntregada,
      cantidadEntregada: medicamentoOriginal.cantidadAutorizada - medicamentoOriginal.cantidadEntregada,
      total: 0,
      cantidadDisponible: siguienteLote?.Saldo || ""
    };


    const medicamentosActualizados = [
      ...medicamentosActuales.slice(0, medicamentoIndex + 1),
      nuevoMedicamento,
      ...medicamentosActuales.slice(medicamentoIndex + 1)
    ];

    update(ordenIndex, {
      ...ordenActual,
      medicamentos: medicamentosActualizados
    });

    // 5. Actualizar el estado de saldosPorMedicamento reindexando
    const nuevoSaldos = { ...saldosPorMedicamento };

    // Reindexar las claves después del índice duplicado
    const total = medicamentosActuales.length;
    for (let i = total - 1; i > medicamentoIndex; i--) {
      const claveActual = `${ordenIndex}-${i}`;
      const claveNueva = `${ordenIndex}-${i + 1}`;
      nuevoSaldos[claveNueva] = nuevoSaldos[claveActual];
    }

    // Insertar el nuevo lote duplicado en la nueva clave
    const claveDuplicado = `${ordenIndex}-${medicamentoIndex + 1}`;
    nuevoSaldos[claveDuplicado] = saldos;

    setSaldosPorMedicamento(nuevoSaldos);

  }, [getValues, update, saldosPorMedicamento, setSaldosPorMedicamento]);

  const removeOrdenFromArray = useCallback((ordenIndex, removeFn) => {
    removeFn(ordenIndex);

    const nuevoSaldos = {};

    Object.entries(saldosPorMedicamento).forEach(([clave, valor]) => {
      const [orden, med] = clave.split("-").map(Number);

      if (orden < ordenIndex) {
        nuevoSaldos[`${orden}-${med}`] = valor;
      } else if (orden > ordenIndex) {
        nuevoSaldos[`${orden - 1}-${med}`] = valor;
      }
    });

    setSaldosPorMedicamento(nuevoSaldos);
  }, [saldosPorMedicamento, setSaldosPorMedicamento]);

  return { addMedicamento, removeMedicamento, duplicarMedicamento, removeOrdenFromArray };
};
