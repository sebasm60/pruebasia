import { useEffect, useState, useRef, } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { useModal } from "./useModal";
import { formatDateP, toUPPER } from "src/reusable/Util";
import { getPacienteInfoById } from "src/api";
import { useBuscarCliente, useGetMasters, useManejoMedicamentos } from "./";
import { BuscarCliente } from "src/components/molecules";
import { defaultValuesDispensacionManual } from "src/constants";
import { calcularTotales } from "src/helpers";
import { saveDispensacionManual } from "src/api/postDispensacion";
import { useMutation } from "react-query";
import moment from "moment/moment";
import { generateSoporteEntrega } from "src/reports";

export const useDispensacionManualForm = () => {

  const [lastKeyPressed, setLastKeyPressed] = useState(null);
  const [saldosPorMedicamento, setSaldosPorMedicamento] = useState({});
  const skipFetchPacienteInfo = useRef(false);

  const { isOpen, openModal, closeModal, content, title, actions, size } = useModal();
  const { buscarEntregas, entregas, setEntregas, resultados } = useBuscarCliente();

  const userRole = localStorage.getItem("RolID").toLocaleLowerCase();

  const { control, handleSubmit, trigger, reset, watch, setValue, getValues, formState: { errors, isValid } } = useForm({ mode: "all", reValidateMode: "onBlur", defaultValues: defaultValuesDispensacionManual });
  const { fields: ordenes, append: addOrden, remove: removeOrden, update } = useFieldArray({ control, name: "ordenes" });
  const { fields: mediosDePagoFields, append: appendMedio, remove: removeMedio, } = useFieldArray({ control, name: "mediosDePago" });
  const { addMedicamento, removeMedicamento, duplicarMedicamento, removeOrdenFromArray } = useManejoMedicamentos({ getValues, setValue, update, saldosPorMedicamento, setSaldosPorMedicamento });

  const [origenDeServicioSeleccionado, idPaciente, tipoPlan, convenioId, tipoConvenioId, totalGeneral, totalIVA, subtotalGeneral, valorPagado, cambio, tipoDeDocumento] = watch(
    ['origenDeServicioId', 'pacienteId', 'tipoPlan', 'convenioId', 'tipoConvenioId', 'totalGeneral', 'totalIVA', 'subtotalGeneral', 'valorPagado', 'cambio', 'tipoDeDocumento']
  )

  const {
    convenios,
    tiposDeVentaRows,
    tiposDeConvenio,
    origenDeServiciosRows,
    parentescosRows,
    tiposIdRows,
    tiposIdMedicosRows,
    afiliaciones,
    categoriasRows,
    diagnosticosRows,
    tiposDeCobroRows,
    mediosDePago,
    tiposCartera,
    lasas
  } = useGetMasters(userRole, tipoConvenioId, tipoPlan);

  const parentescos = parentescosRows?.sort((a, b) => a.label.localeCompare(b.label))
  const categorias = categoriasRows?.sort((a, b) => Number(a.value) - Number(b.value))
  const tiposDeVenta = tiposDeVentaRows?.sort((a, b) => a.label.localeCompare(b.label))
  const origenDeServicios = origenDeServiciosRows?.sort((a, b) => a.label.localeCompare(b.label))
  const tiposId = tiposIdRows?.sort((a, b) => a.label.localeCompare(b.label))
  const diagnosticos = diagnosticosRows?.sort((a, b) => a.label.localeCompare(b.label))
  const tiposDeCobros = tiposDeCobroRows?.sort((a, b) => Number(a.value) - Number(b.value))
  const tiposIdMedicos = tiposIdMedicosRows?.sort((a, b) => a.label.localeCompare(b.label))

  useEffect(() => {
    if (origenDeServicioSeleccionado) {
      const servicio = origenDeServicios.find(
        (item) => item.value === origenDeServicioSeleccionado
      );
      setValue("tipoPlan", servicio?.tipoPlan || "");
    }
  }, [origenDeServicioSeleccionado]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (!name) return;
      if (type !== "change") return;

      if (
        (name.includes("cantidadAutorizada") ||
          name.includes("valor") ||
          name.includes("tipoConvenioId") ||
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
    if (idPaciente?.length > 0) {

      if (skipFetchPacienteInfo.current) {
        skipFetchPacienteInfo.current = false;
        return;
      }

      const formattedValue = toUPPER(idPaciente);

      if (formattedValue !== idPaciente) {
        setValue("pacienteId", formattedValue, { shouldDirty: true, shouldValidate: true });
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
            setValue("pacienteNombre", response?.Nombre || "", { shouldDirty: true });
            setValue("tipoDeDocumento", response?.IdTipoId || "", { shouldDirty: true });
            setValue("afiliacion", response?.IdAfiliacion || "", { shouldDirty: true });
            setValue("categoriaId", response?.IdCategoria || "", { shouldDirty: true });
          }
        };

        fetchPacienteInfo();
      }
    }
  }, [idPaciente, lastKeyPressed, setValue]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (!name) return;
      if (type !== "change") return;

      // Si cambia un medio de pago, recalcular valorPagado y luego cambio
      if (name.startsWith("mediosDePago")) {
        const pagos = getValues("mediosDePago") || [];

        const totalPagado = pagos.reduce((sum, pago) => {
          const val = Number(pago.valor);
          return sum + (isNaN(val) ? 0 : val);
        }, 0);

        setValue("valorPagado", totalPagado, { shouldDirty: true, shouldValidate: true });

        // Calcula cambio inmediatamente después
        const total = Number(getValues("totalGeneral"));
        const diferencia = totalPagado - total;
        setValue("cambio", diferencia, { shouldDirty: true, shouldValidate: true });
      }

      // Si cambia el total general por otros motivos
      if (name === "totalGeneral") {
        const pagado = Number(getValues("valorPagado"));
        const total = Number(getValues("totalGeneral"));
        const diferencia = pagado - total;
        setValue("cambio", diferencia, { shouldDirty: true, shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue, getValues]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
    setLastKeyPressed(event.key);
  };

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

  const handleSeleccionarCliente = async (cliente) => {
    if (!cliente) return;

    skipFetchPacienteInfo.current = true;

    await buscarEntregas(cliente.IdPaciente);
    setValue("pacienteId", cliente.IdPaciente);
    setValue("pacienteNombre", cliente.Nombre);
    setValue("tipoDeDocumento", cliente.IdTipoId);
    setValue("afiliacion", cliente.IdAfiliacion);
    setValue("reclamaPaciente", cliente?.TipoId?.EsMenor ? 'no' : 'si' || "", { shouldDirty: true });
    setValue('esMenor', cliente?.TipoId?.EsMenor, { shouldDirty: true })

    closeModal();
  };

  const createObjDispensacion = (data) => {
    const EntregasCuadres = []
    const arrayOrdenes = []

    data.mediosDePago?.map(m => {
      if (m.forma !== null && m.forma !== '' && Number(m.valor) > 0) {
        EntregasCuadres.push({
          IdMedioPago: m.forma,
          Valor: Number(m.valor),
          Referencia: '',
        })
      }
    })

    data.ordenes?.forEach(item => {
      const Medicamentos = item.medicamentos.map(m => ({
        IdMedicamento: m?.IdMedicamento,
        PLU: m?.pluOrden,
        Nombre: m?.medicamento,
        PLUAlterno: '',
        QtyOrden: Number(m?.cantidadAutorizada),
        QtyEntrega: Number(m?.cantidadEntregada),
        IdLote: m?.lote || 0,
        Entregas: 0,
        Actual: 0,
        Mipres: m?.mipres,
        IdMires: m?.idSiNo,
        DiasTratamiento: Number(m?.diasTratamiento),
        Valor: m?.valor,
        PctajeIVA: m?.iva,
        PctajeDto: 0,
        Barra: ''
      }));

      arrayOrdenes.push({
        Orden: item.numeroOrden,
        Fecha: moment(),
        FechaVto: moment(),
        Actividad: '01', //pendiente
        IdCartera: item.tipoCartera,
        CodigoCausa: data.origenDeServicioId,
        NombreCausa: origenDeServicios.find(o => o.value === data.origenDeServicioId).label,
        TipoPlan: data.tipoPlan,
        TipoCobro: item.tipoCobro,
        NombreCobro: tiposDeCobros.find(tc => tc.value === item.tipoCobro).label,
        ValorCobroReal: item.totalOrden,
        ValorCobro: item.totalPagarPorOrden,
        CodigoDiagnostico: item.diagnostico.value,
        NombreDiagnostico: item.diagnostico.label,
        TipoDocPrestador: item.tipoDocMedico,
        NumeroDocPrestador: item.nroDocMedico,
        NombrePrestador: '',
        Medicamentos,
      });
    });

    const header = {
      IdRol: localStorage.getItem('RolID'),
      IdSede: localStorage.getItem('SedeID'),
      IdBodega: localStorage.getItem('BodegaID'),
      IdUsuario: localStorage.getItem('LoginUsers'),
      IdPaciente: data.pacienteId,
      IdTipoId: data.reclamaPaciente === 'no' ? data.tipoDeDocumentoReclama : data.tipoDeDocumento,
      IdConvenio: data.convenioId,
      NombreConvenio: convenios.find(c => data.convenioId === c.value).label,
      NitConvenio: convenios.find(c => data.convenioId === c.value).label.split('/')[0],
      IdTipoEntrega: data.tipoVentaId,
      CodigoClasificacion: '01', //pendiente
      NombreClasificacion: '01',//pendiente
      SiglaCategoria: categoriasRows.find(c => c.value === data.categoriaId).Sigla,
      CodigoCategoria: categoriasRows.find(c => c.value === data.categoriaId).value,
      NombreCategoria: categoriasRows.find(c => c.value === data.categoriaId).label,
      Reclamante: data.reclamaPaciente === 'no' ? data.reclamaNombre : data.pacienteNombre,
      IdReclamante: data.reclamaPaciente === 'no' ? data.reclamaId : data.pacienteId,
      IdParentesco: data.reclamaPaciente === 'no' ? data.parentesco : '0',
      Fecha: formatDateP(new Date(), 'DD-MM-yyyy'),
      Hora: parseFloat(formatDateP(new Date(), 'HH.mm')),
      ValorBruto: data.sumNetoValorTx || 0,
      ValorIVA: data.sumIVAValorTx || 0,
      ValorDto: 0,
      ValorCOP: data.sumValorTx || 0,
      ValorCM: data.sumValorCMTx || 0,
      ValorCR: 0,
      ValorDOM: 0,
      Total: data.sumValorTx || 0,
      Pagado: data.valorPagado === 0 ? 0 : data.valorPagado,
      Cambio: data.cambio === 0 ? 0 : data.cambio,
      Prefijo: '',
      FijadoRE: '',
      FhNotificado: '',
      Notificado: '',
      Fh_Entrega: new Date(),
      NumeroERP2: '',
      TDERP2: '',
      TD2: '',
      IdConsecutivo2: '',
      NumeroERP: '',
      TDERP: '',
      TD: '',
      IdConsecutivo: '',
      Completo: true,
      NitConvenio: data.convenioId,
    }

    const Ordenes = arrayOrdenes

    return {
      header,
      Ordenes,
      EntregasCuadres
    }
  }

  const mutation = useMutation({
    mutationFn: (data) => saveDispensacionManual(data),
  });

  const onSubmit = handleSubmit((values) => {
    const obj = createObjDispensacion(values);

    mutation.mutate(obj, {
      onSuccess: (data) => {
        generateSoporteEntrega(data)
        reset(defaultValuesDispensacionManual)
      },
    });
  });

  return {
    setEntregas,
    addMedicamento,
    addOrden,
    afiliaciones,
    appendMedio,
    buscarEntregas,
    cambio,
    categorias,
    control,
    convenioId,
    convenios,
    diagnosticos,
    duplicarMedicamento,
    entregas,
    errors,
    getValues,
    handleKeyDown,
    handleSeleccionarCliente,
    handleSubmit,
    isOpen, openModal, closeModal, content, title, actions, size,
    isValid,
    lasas,
    mediosDePago,
    mediosDePagoFields,
    onSubmit,
    ordenes,
    origenDeServicios,
    parentescos,
    removeMedicamento,
    removeMedio,
    removeOrden,
    reset,
    saldosPorMedicamento,
    setSaldosPorMedicamento,
    setValue,
    subtotalGeneral,
    tipoConvenioId,
    tipoPlan,
    tiposCartera,
    tiposDeCobros,
    tiposDeConvenio,
    tiposDeVenta,
    tiposId,
    tiposIdMedicos,
    totalGeneral,
    totalIVA,
    valorPagado,
    watch,
    trigger,
    removeOrdenFromArray,
    resultados
  };
};

