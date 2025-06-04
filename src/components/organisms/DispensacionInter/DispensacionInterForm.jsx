import { useDispensacionInter } from "src/hooks/useDispensacionInter"
import { IconButton, Modal } from "src/components/atoms"
import { FaExclamationTriangle, FaSave } from "react-icons/fa"
import { FloatingActionMenu } from "src/components/molecules"
import { getFloatingActionsDispensacionManual } from "src/actions"

import { GeneralInfo } from "./GeneralInfo"
import { InfoPaciente } from "./InfoPaciente"
import { OrdersTable } from "./OrdersTable"
import { UltimasOrdenes } from "./UltimasOrdenes"
import { ResumenPago } from "./ResumenPago"

export const DispensacionInterForm = () => {

  const {
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
    tiposCarteraConvenio0,
    tiposCarteraConvenio1,
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
  } = useDispensacionInter()

  const floatingActions = getFloatingActionsDispensacionManual({
    openModal,
    handleSeleccionarCliente,
    tiposId,
    afiliaciones,
    convenios,
    reset,
    setEntregas,
    categorias
  });

  const getValidationMessages = (errors, parentKey = "", ordenes = []) => {
    const groupedErrors = {};

    const fieldSectionMap = {
      // Info Paciente
      pacienteId: "infoPaciente",
      tipoDeDocumento: "infoPaciente",
      pacienteNombre: "infoPaciente",
      afiliacion: "infoPaciente",
      categoriaId: "infoPaciente",
      reclamaPaciente: "infoPaciente",
      reclamaId: "infoPaciente",
      tipoDeDocumentoReclama: "infoPaciente",
      reclamaNombre: "infoPaciente",
      parentesco: "infoPaciente",

      // General Info
      convenioId: "generalInfo",
      tipoVentaId: "generalInfo",

      // Resumen Pago
      forma: "resumenPago",
      valor: "resumenPago",
    };

    const process = (errObj, keyPath = "") => {
      Object.entries(errObj).forEach(([key, value]) => {
        const fullKey = keyPath ? `${keyPath}.${key}` : key;

        if (value?.message) {
          const ordenMatch = fullKey.match(/^ordenes\.(\d+)/);

          if (ordenMatch) {
            const ordenIndex = parseInt(ordenMatch[1]);
            const numeroOrden = ordenes[ordenIndex]?.numeroOrden || `#${ordenIndex + 1}`;
            const medicamentoMatch = fullKey.match(/^ordenes\.(\d+)\.medicamentos\.(\d+)\.alertas$/);

            if (!groupedErrors[`Orden ${numeroOrden}`]) {
              groupedErrors[`Orden ${numeroOrden}`] = [];
            }

            if (medicamentoMatch) {
              const medIndex = parseInt(medicamentoMatch[2]);
              const nombreMed = ordenes?.[ordenIndex]?.medicamentos?.[medIndex]?.medicamento || `#${medIndex + 1}`;
              groupedErrors[`Orden ${numeroOrden}`].push(`Debes revisar las alertas del medicamento "${nombreMed}"`);
            } else {
              groupedErrors[`Orden ${numeroOrden}`].push(value.message);
            }

          } else {
            const baseKey = fullKey.split(".")[0];
            const section = fieldSectionMap[baseKey] || "_global";

            if (!groupedErrors[section]) {
              groupedErrors[section] = [];
            }

            groupedErrors[section].push(value.message);
          }
        }

        if (value && typeof value === "object" && !value.message) {
          process(value, fullKey);
        }
      });
    };

    process(errors);

    return groupedErrors;
  };

  const onShowValidationErrors = async () => {
    const ordenesWatch = watch("ordenes");

    await trigger()
    const validationErrors = getValidationMessages(errors, "", ordenesWatch);
    const hayErrores = Object.values(validationErrors).some(
      (errores) => errores.length > 0
    );

    const sectionTitles = {
      generalInfo: "Información General",
      infoPaciente: "Información del Paciente",
      resumenPago: "Resumen de Pago",
      _global: "Errores generales"
    };

    openModal({
      title: "Errores de validación",
      size: "md",
      content: (
        <div className="grid gap-4 text-sm text-red-600">
          {
            hayErrores ?
              Object.entries(validationErrors).map(([key, messages], index) => (
                <div key={index} className="border p-3 rounded shadow-sm bg-red-50">
                  <p className="font-bold mb-2">
                    {sectionTitles[key] || key}
                  </p>
                  <ul className="list-disc list-inside ml-4">
                    {messages.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </div>
              ))
              :
              <div className="border p-3 rounded shadow-sm bg-red-50">
                <h1>No se encontraron errores</h1>
              </div>
          }
        </div>
      )
    });
  };

  const hayOrdenesValidas = Array.isArray(ordenes) && ordenes.length > 0 && ordenes.every((orden) => Array.isArray(orden.medicamentos) && orden.medicamentos.length > 0);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-2 rounded-lg shadow-lg w-full h-full flex flex-col gap-5">
        <GeneralInfo
          control={control}
          errors={errors}
          convenios={convenios}
          tiposDeVenta={tiposDeVenta}
          watch={watch}
        />

        <InfoPaciente
          control={control}
          errors={errors}
          handleSeleccionarCliente={handleSeleccionarCliente}
          handleKeyDown={handleKeyDown}
          tiposId={tiposId}
          afiliaciones={afiliaciones}
          convenios={convenios}
          openModal={openModal}
          categorias={categorias}
          parentescos={parentescos}
          buscarEntregas={buscarEntregas}
          watch={watch}
          convenioId={convenioId}
        />

        <OrdersTable
          control={control}
          ordenes={ordenes}
          tipoPlan={tipoPlan}
          addOrden={addOrden}
          convenioId={convenioId}
          tiposIdMedicos={tiposIdMedicos}
          removeOrden={removeOrden}
          addMedicamento={addMedicamento}
          removeMedicamento={removeMedicamento}
          setValue={setValue}
          openModal={openModal}
          closeModal={closeModal}
          tiposCarteraConvenio0={tiposCarteraConvenio0}
          tiposCarteraConvenio1={tiposCarteraConvenio1}
          errors={errors}
          getValues={getValues}
          tiposDeConvenio={tiposDeConvenio}
          tipoConvenioId={tipoConvenioId}
          lasas={lasas}
          duplicarMedicamento={duplicarMedicamento}
          saldosPorMedicamento={saldosPorMedicamento}
          setSaldosPorMedicamento={setSaldosPorMedicamento}
          tiposDeCobros={tiposDeCobros}
          origenDeServicios={origenDeServicios}
          diagnosticos={diagnosticos}
          watch={watch}
          trigger={trigger}
          removeOrdenFromArray={removeOrdenFromArray}
        />

        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-2">
            <UltimasOrdenes
              control={control}
              entregas={entregas}
            />
          </div>

          <ResumenPago
            totalGeneral={totalGeneral}
            totalIVA={totalIVA}
            subtotalGeneral={subtotalGeneral}
            valorPagado={valorPagado}
            cambio={cambio}
            control={control}
            errors={errors}
            mediosDePago={mediosDePago}
            mediosDePagoFields={mediosDePagoFields}
            appendMedio={appendMedio}
            removeMedio={removeMedio}
            watch={watch}
          />
        </div>

        <div className="w-full flex justify-center gap-3">
          <IconButton
            text="Registrar Dispensación"
            icon={FaSave}
            type="submit"
            disabled={!isValid || totalGeneral !== valorPagado || !hayOrdenesValidas}
          />

          <IconButton
            icon={FaExclamationTriangle}
            text="Validar Dispensación"
            onClick={onShowValidationErrors}
            className="bg-yellow-500 hover:bg-yellow-600"
          />
        </div>
      </form>

      <FloatingActionMenu actions={floatingActions} />

      <Modal isOpen={isOpen} onClose={closeModal} title={title} actions={actions} size={size}>
        {content}
      </Modal>
    </>
  )
}
