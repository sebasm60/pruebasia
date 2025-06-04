import { useFieldArray, useForm } from "react-hook-form";
import { useGetMasters } from "./useGetMasters";
import { defaultValuesDispensacionInter } from "src/constants";
import { useEffect, useRef, useState } from "react";
import { useModal } from "./useModal";
import { useBuscarCliente } from "./useBuscarClientes";
import { formatDateP, toUPPER } from "src/reusable/Util";
import { getPacienteInfoById } from "src/api";
import { BuscarCliente } from "src/components";
import { useManejoMedicamentos } from "./useManejoMedicamentos";
import moment from "moment/moment";
import { calcularTotales } from "src/helpers";
import { fetchDiagnosticoByCodigo } from "./useDiagnosticosAsyncOptions";
import { useMutation } from "react-query";
import { saveDispensacion } from "src/api/postDispensacion";
import { generateSoporteEntrega } from "src/reports";
import swal from 'sweetalert'

export const useDispensacionInter = () => {

  const [lastKeyPressed, setLastKeyPressed] = useState(null);
  const [saldosPorMedicamento, setSaldosPorMedicamento] = useState({});
  const skipFetchPacienteInfo = useRef(false);

  const { isOpen, openModal, closeModal, content, title, actions, size } = useModal();
  const { buscarEntregas, entregas, buscarOrdenes, setEntregas, resultados } = useBuscarCliente();


  const { control, handleSubmit, trigger, reset, watch, setValue, getValues, formState: { errors, isValid } } = useForm({ mode: "all", reValidateMode: "onBlur", defaultValues: defaultValuesDispensacionInter })
  const { fields: ordenes, append: addOrden, remove: removeOrden, update } = useFieldArray({ control, name: "ordenes" })
  const { fields: mediosDePagoFields, append: appendMedio, remove: removeMedio, } = useFieldArray({ control, name: "mediosDePago" })

  const { addMedicamento, removeMedicamento, duplicarMedicamento, removeOrdenFromArray } = useManejoMedicamentos({ getValues, setValue, update, saldosPorMedicamento, setSaldosPorMedicamento });

  const [origenDeServicioSeleccionado, idPaciente, tipoPlan, convenioId, tipoConvenioId, totalGeneral, totalIVA, subtotalGeneral, valorPagado, cambio, tipoDeDocumento] = watch(
    ['origenDeServicioId', 'pacienteId', 'tipoPlan', 'convenioId', 'tipoConvenioId', 'totalGeneral', 'totalIVA', 'subtotalGeneral', 'valorPagado', 'cambio', 'tipoDeDocumento']
  )

  const userRole = localStorage.getItem("RolID").toLocaleLowerCase();

  const {
    afiliaciones,
    categoriasRows,
    convenios,
    lasas,
    mediosDePago,
    origenDeServiciosRows,
    parentescosRows,
    tiposCartera,
    tiposCarteraConvenio0,
    tiposCarteraConvenio1,
    tiposDeCobroRows,
    tiposDeConvenio,
    tiposDeVentaRows,
    tiposIdMedicosRows,
    tiposIdRows,
    diagnosticos
  } = useGetMasters(userRole, tipoConvenioId, tipoPlan);

  const parentescos = parentescosRows?.sort((a, b) => a.label.localeCompare(b.label))
  const categorias = categoriasRows?.sort((a, b) => Number(a.value) - Number(b.value))
  const tiposDeVenta = tiposDeVentaRows?.sort((a, b) => a.label.localeCompare(b.label))
  const origenDeServicios = origenDeServiciosRows?.sort((a, b) => a.label.localeCompare(b.label))
  const tiposId = tiposIdRows?.sort((a, b) => a.label.localeCompare(b.label))
  const tiposDeCobros = tiposDeCobroRows?.sort((a, b) => Number(a.value) - Number(b.value))
  const tiposIdMedicos = tiposIdMedicosRows?.sort((a, b) => a.label.localeCompare(b.label))

  useEffect(() => {
    if (idPaciente?.length > 0) {

      if (skipFetchPacienteInfo.current) {
        skipFetchPacienteInfo.current = false;
        return;
      }

      const formattedValue = toUPPER(idPaciente);

      if (formattedValue !== idPaciente) {
        setValue("pacienteId", formattedValue, { shouldDirty: true });
      }

      if (lastKeyPressed === "Enter" || lastKeyPressed === "Tab") {
        const fetchPacienteInfo = async () => {
          const response = await getPacienteInfoById("paciente", idPaciente);

          if (!response) {
            openModal({
              title: "Buscar paciente",
              content: <BuscarCliente
                onSelect={handleSeleccionarCliente}
                initialQuery={idPaciente}
                openModal={openModal}
                tiposId={tiposId}
                afiliaciones={afiliaciones}
                convenios={convenios}
                convenioId={convenioId}
                tipoDeDocumento={tipoDeDocumento}
                categorias={categorias}
              />,
              size: 'xl',
            })
          }

          if (response) {
            await buscarEntregas(idPaciente);
            const ordenes = await buscarOrdenes(idPaciente, tipoDeDocumento, convenioId)
            if (ordenes) {
              setOrdenesFromApi(ordenes?.orders)
            } else {
              swal({
                title: "No se encontraron Ordenes - Pendientes",
                text: "Por favor verificar en la pagina del convenio y/o el tipo de documento.",
                icon: "warning",
                dangerMode: true,
              })
              return;
            }
            setCliente(response)
          }
        };

        fetchPacienteInfo();
      }
    }
  }, [idPaciente, lastKeyPressed, setValue])

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (!name) return;

      if (
        (name.includes("cantidadAutorizada") ||
          name.includes("valor") ||
          name.includes("categoriaId") ||
          name.includes("tipoCobro")) &&
        tiposDeCobros && tiposDeCobros.length > 0 &&
        categorias && categorias.length > 0
      ) {
        recalcularTotalesMedicamentos(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [setValue, watch, tiposDeCobros, categorias]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (!name) return;

      if (name.startsWith("mediosDePago")) {
        const pagos = getValues("mediosDePago") || [];

        const totalPagado = pagos.reduce((sum, pago) => {
          const val = Number(pago.valor);
          return sum + (isNaN(val) ? 0 : val);
        }, 0);

        setValue("valorPagado", totalPagado, { shouldDirty: true });


        const total = Number(getValues("totalGeneral"));
        const diferencia = totalPagado - total;
        setValue("cambio", diferencia, { shouldDirty: true });
      }

      if (name === "totalGeneral") {
        const pagado = Number(getValues("valorPagado"));
        const total = Number(getValues("totalGeneral"));
        const diferencia = pagado - total;
        setValue("cambio", diferencia, { shouldDirty: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue, getValues]);

  const recalcularTotalesMedicamentos = (formData) => {
    calcularTotales({
      ordenes: formData.ordenes,
      categorias: categoriasRows,
      tiposDeCobros,
      currentCategoriaId: formData?.categoriaId,
      setValue,
      watch
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
    setLastKeyPressed(event.key)
  }

  const handleSeleccionarCliente = async (cliente) => {
    if (!cliente) return;

    skipFetchPacienteInfo.current = true;

    await buscarEntregas(cliente.IdPaciente);
    const ordenes = await buscarOrdenes(idPaciente, cliente?.IdTipoId, convenioId)
    setOrdenesFromApi(ordenes?.orders)
    setCliente(cliente)

    closeModal();
  }

  const setOrdenesFromApi = async (ordersApi) => {
    setValue("ordenes", [], { shouldDirty: true })

    if (ordersApi?.length <= 0) {
      swal({
        title: "No se encontraron Ordenes - Pendientes",
        text: "Por favor verificar en la pagina del convenio y/o el tipo de documento.",
        icon: "warning",
        dangerMode: true,
      })
      return;
    }

    const ordenesFormateadas = ordersApi?.map((ordenApi, i) => {
      const tratamiento = ordenApi?.formula.tratamiento || [];
      const medico = ordenApi?.interop?.formula?.prestador
      return {
        numeroOrden: ordenApi?.orderNumber || '',
        diagnostico: ordenApi?.formula?.diagnostico?.codigo || '',
        tipoCobro: ordenApi.cobro?.tipo || '',
        nroDocMedico: medico?.documento?.tipo !== 'NI' ? medico?.documento?.numero : '' || '',
        tipoDocMedico: medico?.documento?.tipo !== 'NI' ? medico?.documento?.tipo : '' || '',
        nombreMedico: medico?.documento?.tipo !== 'NI' ? `${medico?.nombre?.primero} ${medico?.nombre?.segundo || ''} ${medico?.nombre?.primerApellido} ${medico?.nombre?.segundoApellido || ''}` : '' || '',
        tipoCartera: '',
        totalOrden: 0,
        totalPagarPorOrden: ordenApi.cobro?.valor || 0,
        origenDeServicioId: ordenApi?.formula.servicio?.causa?.codigo || '',
        tipoPlan: ordenApi?.formula.servicio?.causa?.TipoPlaSura || '',
        tipoConvenioId: ordenApi?.interop?.formula?.actividadSura?.IdActividad || '',
        fechaOrden: moment(ordenApi?.formula?.fechaServicio).locale('es').format('DD MMM yyyy') || '',
        fechaVencimiento: moment(ordenApi?.formula?.fechaVencimiento).locale('es').format('DD MMM yyyy') || '',
        medicamentos: tratamiento?.map((t, j) => {
          const m = t.producto?.medicamento || {};

          const tieneAlertas = !!(
            m.Medicamento?.Regulado ||
            m.Medicamento?.Controlado ||
            m.Medicamento?.Aplicacion ||
            m.Medicamento?.Fotosensible ||
            m.Medicamento?.Frio ||
            m.Medicamento?.Agotado
          );

          setSaldosPorMedicamento(prev => ({
            ...prev,
            [`${i}-${j}`]: m.Medicamento?.saldos
          }));

          return {
            esCopia: false,
            pluOrden: m?.PLU || '',
            IdMedicamento: m?.IdMedicamento || '',
            medicamento: m?.Medicamento?.Nombre || '',
            lote: m?.Medicamento?.saldos?.[0]?.Lote ?? '',
            FhVtoRInv: m?.Medicamento?.FhVtoRInv || '',
            cantidadDisponible: m?.Medicamento?.saldos?.[0]?.Saldo ?? 0,
            cantidadAutorizada: t?.cantidad || 0,
            cantidadEntregada: (() => {
              const saldo = Array.isArray(m?.Medicamento?.saldos) && m.Medicamento.saldos.length > 0
                ? m.Medicamento.saldos[0].Saldo
                : 0;
              return saldo >= t?.cantidad ? t?.cantidad : saldo;
            })(),
            diasTratamiento: t.dosis?.duracion?.cantidad || 30,
            mipres: ordenApi?.formula.mipres || '',
            idSiNo: '',
            valor: parseFloat(m?.Precio || 0),
            iva: parseFloat(m?.PctajeIVA || 0),
            total: parseFloat(m?.Precio || 0) * (t.cantidad || 0),
            Lasa: !!m.Medicamento?.Lasa,
            IdLasa: m.Medicamento?.IdLasa || '',
            Regulado: !!m.Medicamento?.Regulado,
            Controlado: !!m.Medicamento?.Controlado,
            Aplicacion: !!m.Medicamento?.Aplicacion,
            Fotosensible: !!m.Medicamento?.Fotosensible,
            Frio: !!m.Medicamento?.Frio,
            Agotado: !!m.Medicamento?.Agotado,
            alertas: tieneAlertas,
          }
        })
      };
    });

    setValue("ordenes", ordenesFormateadas, { shouldDirty: true });
    await completarDiagnosticos(ordenesFormateadas, { shouldDirty: true });
    setValue("categoriaId", ordersApi[0]?.interop?.formula?.categoria?.codigo || "", { shouldDirty: true });
    setValue("afiliacion", Number(ordersApi[0]?.interop?.paciente?.clasificacion?.codigo) === 3 ? '02' : '01' || "", { shouldDirty: true });
    trigger()
  };

  const completarDiagnosticos = async (ordenes) => {
    const ordenesCompletadas = await Promise.all(
      ordenes?.map(async (orden) => {
        if (typeof orden.diagnostico === 'string') {
          const diag = await fetchDiagnosticoByCodigo(orden.diagnostico);
          return {
            ...orden,
            diagnostico: diag ?? { label: orden.diagnostico, value: orden.diagnostico },
          };
        }
        return orden;
      })
    );

    setValue("ordenes", ordenesCompletadas, { shouldDirty: true });
  };

  const setCliente = (cliente) => {
    setValue("pacienteId", cliente.IdPaciente || "", { shouldDirty: true });
    setValue("pacienteNombre", cliente.Nombre || "", { shouldDirty: true });
    setValue("reclamaPaciente", cliente?.TipoId?.EsMenor ? 'no' : 'si' || "", { shouldDirty: true });
    setValue('esMenor', cliente?.TipoId?.EsMenor, { shouldDirty: true })

  }

  const createObjDispensacion = (data) => {
    const mediosDePago = []
    const arrayOrdenes = []

    if (data.valorPagado > 0) {
      data.mediosDePago?.map(m => {
        mediosDePago.push({
          Prefijo: '',
          IdMedioPago: m.forma,
          Valor: Number(m.valor),
          Referencia: '',
          IdUsuario: localStorage.getItem('LoginUsers'),
          Fh_Entrega: new Date(),
        })
      })
    }

    data.ordenes?.forEach(item => {
      item.medicamentos?.map(m => {
        arrayOrdenes.push({
          IdPlan: item.tipoPlan,
          Orden: item.numeroOrden,
          fecha: new Date(),
          fechaVto: new Date(),
          IdMedicamento: m?.IdMedicamento,
          PLU: m?.pluOrden,
          Nombre: m?.medicamento,
          QtyOrden: Number(m?.cantidadAutorizada),
          QtyEntrega: Number(m?.cantidadEntregada),
          IdLote: m?.lote,
          Entregas: 0,
          Actual: 0,
          Mipres: m?.mipres,
          IdMires: m?.idSiNo,
          DiasTto: Number(m?.diasTratamiento),
          Valor: m?.valor,
          PctajeIVA: m?.iva,
          PctajeDto: 0,
          barras: '',
          Actividad: item.tipoConvenioId,
          categoria: data.categoriaId,
          tipoCobro: item.tipoCobro,
        });
      });
    });

    const header = {
      Prefijo: '',
      FijadoRE: '',
      Fecha: formatDateP(new Date(), 'DD-MM-yyyy'),
      Hora: formatDateP(new Date(), 'HH:mm:ss'),
      IdTipoEntrega: data.tipoVentaId,
      Reclamante: data.reclamaPaciente === 'no' ? data.reclamaNombre : data.pacienteNombre,
      IdReclamante: data.reclamaPaciente === 'no' ? data.reclamaId : data.pacienteId,
      IdParentesco: data.parentesco,
      IdTipoId: data.reclamaPaciente === 'no' ? data.tipoDeDocumentoReclama : data.tipoDeDocumento,
      IdConvenio: data.convenioId,
      IdPaciente: data.pacienteId,
      IdCartera: '0', // Pendiente
      FhNotificado: '',
      Notificado: '',
      Fh_Entrega: new Date(),
      IdUsuario: localStorage.getItem('LoginUsers'),
      NumeroERP2: '',
      TDERP2: '',
      TD2: '',
      IdConsecutivo2: '',
      NumeroERP: '',
      TDERP: '',
      TD: '',
      IdConsecutivo: '',
      Completo: true,
      Cambio: data.cambio === 0 ? 0 : data.cambio,
      Pagado: data.valorPagado === 0 ? 0 : data.valorPagado,
      Total: data.sumValorTx || 0,
      ValorDOM: 0,
      ValorCR: 0,
      ValorCM: data.sumValorCMTx || 0,
      ValorCOP: data.sumValorTx || 0,
      ValorDto: 0,
      ValorIVA: data.sumIVAValorTx || 0,
      ValorBruto: data.sumNetoValorTx || 0,
      EntregasCuadres: mediosDePago,
      Observacion: data.comentario
    }

    const body = arrayOrdenes

    return {
      header,
      body
    }
  }

  const mutation = useMutation({
    mutationFn: (data) => saveDispensacion(data),
    onSuccess: (data) => {
    },
    onError: (error) => {
    },
  });

  const onSubmit = handleSubmit((values) => {
    const obj = createObjDispensacion(values);

    mutation.mutate(obj, {
      onSuccess: (data) => {
        generateSoporteEntrega(data)
        reset(defaultValuesDispensacionInter)
      },
    });
  });

  return {
    actions,
    addMedicamento,
    addOrden,
    afiliaciones,
    appendMedio,
    buscarEntregas,
    cambio,
    categorias,
    closeModal,
    content,
    control,
    convenioId,
    convenios,
    duplicarMedicamento,
    entregas,
    errors,
    getValues,
    handleKeyDown,
    handleSeleccionarCliente,
    handleSubmit,
    onSubmit,
    idPaciente,
    isOpen,
    isValid,
    lasas,
    mediosDePago,
    mediosDePagoFields,
    openModal,
    ordenes,
    origenDeServicios,
    diagnosticos,
    origenDeServicioSeleccionado,
    parentescos,
    removeMedicamento,
    removeMedio,
    removeOrden,
    reset,
    saldosPorMedicamento,
    setSaldosPorMedicamento,
    setValue,
    size,
    subtotalGeneral,
    tipoConvenioId,
    tipoPlan,
    tiposCartera,
    tiposCarteraConvenio0,
    tiposCarteraConvenio1,
    tiposDeCobros,
    tiposDeConvenio,
    tiposDeVenta,
    tiposId,
    tiposIdMedicos,
    title,
    totalGeneral,
    totalIVA,
    trigger,
    update,
    valorPagado,
    watch,
    removeOrdenFromArray,
    setEntregas,
    resultados
  }
}