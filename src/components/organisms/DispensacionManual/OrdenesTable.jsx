import { useState } from "react";
import { FaPlus, FaTrash, FaChevronDown, FaChevronUp, FaSearch, FaCopy } from "react-icons/fa";
import { BsBoxes } from "react-icons/bs";
import { FiAlertCircle } from "react-icons/fi";
import { useWatch } from 'react-hook-form';
import swal from "sweetalert";

import { BuscarMedicamentos, InputField, InputRadio, InputSelect, InventarioPLU } from "../../molecules";
import { IconButton } from "../../atoms";
import { useDispensacionManualForm } from "src/hooks/useDispensacionManualForm";
import { useBuscarMedicamento, useDiagnosticosAsyncOptions } from "src/hooks";
import Alertas from "src/components/molecules/modales/Alertas";
import { defaultValuesOrden } from "src/constants";
import { getValidationsManual } from "src/helpers/rules/rulesDispensacionManual";

export const OrdenesTable = ({
  control,
  ordenes,
  addOrden,
  removeOrden,
  addMedicamento,
  tiposIdMedicos,
  tiposCartera,
  removeMedicamento,
  setValue,
  openModal,
  closeModal,
  tipoPlan,
  convenioId,
  errors,
  getValues,
  tiposDeConvenio,
  tipoConvenioId,
  lasas,
  duplicarMedicamento,
  saldosPorMedicamento,
  setSaldosPorMedicamento,
  watch,
  trigger,
  removeOrdenFromArray
}) => {

  const ordenesWatch = useWatch({ control, name: 'ordenes' });

  const rules = getValidationsManual({ watch });

  const { buscarSaldos, buscarByPLU } = useBuscarMedicamento(convenioId);
  const [expandedOrders, setExpandedOrders] = useState({});
  const { tiposDeCobros } = useDispensacionManualForm();

  const [reclamaPaciente] = watch(['reclamaPaciente'])

  const camposSiReclama = ['pacienteId', 'tipoDeDocumento', 'pacienteNombre', 'afiliacion', 'categoriaId'];
  const camposNoReclama = [...camposSiReclama, 'reclamaId', 'tipoDeDocumentoReclama', 'reclamaNombre', 'parentesco'];

  const valoresPaciente = watch(reclamaPaciente === 'no' ? camposNoReclama : camposSiReclama);

  const isInfoPacienteComplete = valoresPaciente.every((value) => value?.toString().trim() !== '' && value !== null);

  const { fetchOptions } = useDiagnosticosAsyncOptions();

  const toggleOrder = (index) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const seleccionarMedicamento = async (ordenIndex, medicamentoIndex, query = '', forzarModal = false) => {
    const res = await buscarByPLU(query)

    if (forzarModal || res?.length !== 1) {
      openModal({
        title: "Buscar Medicamento",
        size: "lg",
        content: (
          <BuscarMedicamentos
            onSelect={async (medicamento) => {
              const saldos = await buscarSaldos(medicamento.IdMedicamento) || []

              setSaldosPorMedicamento(prev => ({
                ...prev,
                [`${ordenIndex}-${medicamentoIndex}`]: saldos
              }));

              const tieneAlertas = !!(
                medicamento.Medicamento?.Regulado ||
                medicamento.Medicamento?.Controlado ||
                medicamento.Medicamento?.Aplicacion ||
                medicamento.Medicamento?.Fotosensible ||
                medicamento.Medicamento?.Frio ||
                medicamento.Medicamento?.Agotado
              );

              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.medicamento`, medicamento.Medicamento.Nombre);
              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.IdMedicamento`, medicamento.IdMedicamento);
              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.Lasa`, medicamento.Medicamento.Lasa);
              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.FhVtoRInv`, medicamento.Medicamento.FhVtoRInv);
              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.Regulado`, medicamento.Medicamento.Regulado);
              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.Controlado`, medicamento.Medicamento.Controlado);
              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.Aplicacion`, medicamento.Medicamento.Aplicacion);
              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.Fotosensible`, medicamento.Medicamento.Fotosensible);
              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.Frio`, medicamento.Medicamento.Frio);
              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.Agotado`, medicamento.Medicamento.Agotado);
              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.IdLasa`, medicamento.Medicamento.IdLasa);
              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.pluOrden`, medicamento.PLU);
              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.valor`, medicamento.Precio);
              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.iva`, medicamento.PctajeIVA);
              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.lote`, saldos[0]?.Lote || '');
              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.cantidadDisponible`, saldos[0]?.Saldo || '');
              setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.alertas`, tieneAlertas);

              closeModal();
            }}
            convenioId={convenioId}
            initialQuery={query}
          />
        )
      });
    } else {
      const saldos = await buscarSaldos(res[0]?.IdMedicamento) || []

      setSaldosPorMedicamento(prev => ({
        ...prev,
        [`${ordenIndex}-${medicamentoIndex}`]: saldos
      }));

      const tieneAlertas = !!(
        res[0].Medicamento?.Regulado ||
        res[0].Medicamento?.Controlado ||
        res[0].Medicamento?.Aplicacion ||
        res[0].Medicamento?.Fotosensible ||
        res[0].Medicamento?.Frio ||
        res[0].Medicamento?.Agotado
      );

      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.medicamento`, res[0].Medicamento.Nombre);
      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.IdMedicamento`, res[0].IdMedicamento);
      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.Lasa`, res[0].Medicamento.Lasa);
      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.FhVtoRInv`, res[0].Medicamento.FhVtoRInv);
      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.Regulado`, res[0].Medicamento.Regulado);
      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.Controlado`, res[0].Medicamento.Controlado);
      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.Aplicacion`, res[0].Medicamento.Aplicacion);
      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.Fotosensible`, res[0].Medicamento.Fotosensible);
      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.Frio`, res[0].Medicamento.Frio);
      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.Agotado`, res[0].Medicamento.Agotado);
      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.IdLasa`, res[0].Medicamento.IdLasa);
      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.pluOrden`, res[0].PLU);
      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.valor`, res[0].Precio);
      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.iva`, res[0].PctajeIVA);
      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.lote`, saldos[0]?.Lote || '');
      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.cantidadDisponible`, saldos[0]?.Saldo || '');
      setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.alertas`, tieneAlertas);
    }
  };

  const isOrdenCompleta = (ordenIndex) => {
    const orden = ordenesWatch?.[ordenIndex];
    if (!orden) return false;

    const camposObligatorios = [
      orden.numeroOrden,
      orden.diagnostico,
      orden.tipoCobro,
      orden.nroDocMedico,
      orden.tipoDocMedico
    ];

    return camposObligatorios.every(campo => campo?.toString().trim() !== '');
  };

  return (
    <fieldset className="border border-black px-2 py-1 rounded-lg shadow-md w-full relative">
      <legend className="text-base font-semibold text-gray-700 select-none px-1">Ordenes</legend>
      <div className="flex flex-col justify-start gap-4">

        {
          ordenes.length > 0 ?
            ordenes?.map((orden, ordenIndex) => (
              <div key={orden.id} className="border border-gray-300 p-1 rounded-lg bg-white shadow-md">
                <div className="flex gap-2">
                  <InputField
                    controlForm={control}
                    nameController={`ordenes.${ordenIndex}.numeroOrden`}
                    label="Nro. Orden"
                    rules={rules.ordenes.numeroOrden}
                    error={errors?.ordenes?.[ordenIndex]?.numeroOrden?.message}
                    className="basis-[15%]"
                    disabled={!isInfoPacienteComplete}
                  />

                  <InputSelect
                    controlForm={control}
                    nameController={`ordenes.${ordenIndex}.diagnostico`}
                    placeholder='Diagnóstico'
                    loadOptions={fetchOptions}
                    rules={rules.ordenes.diagnostico}
                    error={errors?.ordenes?.[ordenIndex]?.diagnostico?.message}
                    className='basis-[34%]'
                    disabled={!isInfoPacienteComplete}
                  />

                  <InputSelect
                    controlForm={control}
                    nameController={`ordenes.${ordenIndex}.tipoCobro`}
                    placeholder='Tipo de cobro'
                    options={tiposDeCobros}
                    rules={rules.ordenes.tipoCobro}
                    error={errors?.ordenes?.[ordenIndex]?.tipoCobro?.message}
                    className='basis-[18%]'
                    disabled={!isInfoPacienteComplete}
                  />

                  <InputField
                    controlForm={control}
                    nameController={`ordenes.${ordenIndex}.nroDocMedico`}
                    label="Doc Médico"
                    rules={rules.ordenes.nroDocMedico}
                    error={errors?.ordenes?.[ordenIndex]?.nroDocMedico?.message}
                    className="basis-[14%]"
                    disabled={!isInfoPacienteComplete}
                  />

                  <InputSelect
                    controlForm={control}
                    nameController={`ordenes.${ordenIndex}.tipoDocMedico`}
                    placeholder='Tipo documento' options={tiposIdMedicos}
                    rules={rules.ordenes.tipoDocMedico}
                    error={errors?.ordenes?.[ordenIndex]?.tipoDocMedico?.message}
                    className='basis-[25%]'
                    disabled={!isInfoPacienteComplete}
                  />

                  <div>
                    <IconButton icon={FaTrash}
                      onClick={() => {
                        swal({
                          title: "¿Estás seguro?",
                          text: "Esta acción eliminará la orden completa.",
                          icon: "warning",
                          buttons: ["Cancelar", "Sí, eliminar"],
                          dangerMode: true,
                        }).then((willDelete) => {
                          if (willDelete) {
                            removeOrdenFromArray(ordenIndex, removeOrden);
                            swal("¡Orden eliminada correctamente!", {
                              icon: "success",
                            });
                          }
                        });
                      }}
                      className="bg-red-500 hover:bg-red-600 basis-[2%]"
                    />
                  </div>

                  <div>
                    <IconButton
                      icon={!expandedOrders[ordenIndex] ? FaChevronUp : FaChevronDown}
                      onClick={() => toggleOrder(ordenIndex)}
                      className="bg-gray-500 hover:bg-gray-600 basis-[2%]"
                    />
                  </div>
                </div>

                {!expandedOrders[ordenIndex] && (
                  <div className="mt-4 overflow-hidden">
                    <table className="w-full table-fixed rounded-lg shadow-sm bg-white divide-y divide-gray-200">
                      <thead className="bg-blue-600 text-white text-xs rounded-t-lg">
                        <tr>
                          <th className="w-[3%] px-0 py-1 border text-center font-medium"></th>
                          <th className="w-[9%] px-0 py-1 border text-center font-medium">PLU Orden</th>
                          <th className="w-[20%] px-0 py-1 border text-center font-medium">Medicamento</th>
                          <th className="w-[6%] px-0 py-1 border text-center font-medium">Cantidad Autorizada</th>
                          <th className="w-[11%] px-0 py-1 border text-center font-medium">Lote</th>
                          <th className="w-[6%] px-0 py-1 border text-center font-medium">Cantidad disponible</th>
                          <th className="w-[5%] px-0 py-1 border text-center font-medium">Cantidad Entregada</th>
                          <th className="w-[6%] px-0 py-1 border text-center font-medium">Días Tratamiento</th>
                          <th className="w-[9%] px-0 text-center font-medium">MIPRES</th>
                          <th className="w-[7%] p-0 text-center font-medium">Id MIPRES</th>
                          <th className="w-[7%] px-0 py-1 border text-center font-medium">Valor</th>
                          <th className="w-[3%] px-0 py-1 border text-center font-medium">% IVA</th>
                          <th className="w-[7%] px-0 py-1 border text-center font-medium">Valor Total</th>
                          <th className="w-[1%] px-0 py-1 border text-center font-medium"></th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-gray-700">
                        {orden?.medicamentos?.length === 0 ? (
                          <tr>
                            <td colSpan="11" className="border p-3 text-center text-gray-500">No hay medicamentos</td>
                          </tr>
                        ) : (
                          orden?.medicamentos?.map((medicamento, medicamentoIndex) => (
                            <tr key={`${ordenIndex}-${medicamentoIndex}`} className="hover:bg-gray-50 transition">
                              <td className="w-[3%] border">
                                <div className="flex w-full items-center justify-center gap-2 flex-wrap">
                                  {ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.medicamento !== '' &&
                                    !ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.esCopia &&
                                    Number(ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.cantidadAutorizada) > 0 &&
                                    Number(ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.cantidadAutorizada) >
                                    Number(ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.cantidadEntregada) && (
                                      <FaCopy
                                        title="Duplicar medicamento"
                                        className="text-green-500 hover:text-green-600 cursor-pointer h-5 w-5"
                                        onClick={() => duplicarMedicamento(ordenIndex, medicamentoIndex)}
                                      />
                                    )}
                                  {ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.medicamento !== '' &&
                                    !ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.esCopia &&
                                    <BsBoxes className="text-blue-500 hover:text-blue-600 cursor-pointer h-5 w-5"
                                      onClick={() => {
                                        openModal({
                                          title: `Inventario ${ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.medicamento}`,
                                          size: "xl",
                                          content: (
                                            <InventarioPLU
                                              medicamento={ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.IdMedicamento}
                                              convenioId={convenioId}
                                            />
                                          )
                                        });
                                      }}
                                    />
                                  }
                                  {(ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.Regulado ||
                                    ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.Controlado ||
                                    ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.Aplicacion ||
                                    ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.Fotosensible ||
                                    ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.Frio ||
                                    ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.Agotado) &&
                                    !ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.esCopia &&
                                    <FiAlertCircle className="text-red-500 hover:text-red-600 cursor-pointer h-5 w-5 animate-bounceUp"
                                      onClick={() => {
                                        openModal({
                                          title: `Alertas del Medicamento ${ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.medicamento}`,
                                          size: "md",
                                          content: (
                                            <Alertas
                                              medicamento={ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]}
                                            />
                                          )
                                        });

                                        setValue(
                                          `ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.alertas`,
                                          false
                                        );

                                        trigger()
                                      }}
                                    />
                                  }
                                </div>
                              </td>

                              <td className="w-[9%] border p-1">
                                <InputField
                                  controlForm={control}
                                  nameController={`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.pluOrden`}
                                  rules={rules.medicamento.pluOrden}
                                  error={errors?.ordenes?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.pluOrden?.message}
                                  icon={<FaSearch />}
                                  onIconClick={() => {
                                    const value = getValues(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.pluOrden`);
                                    seleccionarMedicamento(ordenIndex, medicamentoIndex, value, true);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === "Tab") {
                                      e.preventDefault();
                                      const inputValue = e.target.value;
                                      seleccionarMedicamento(ordenIndex, medicamentoIndex, inputValue);
                                    }
                                  }}
                                  className='text-[15px]'
                                  disabled={!isInfoPacienteComplete || !isOrdenCompleta(ordenIndex)}
                                />

                                <InputField
                                  controlForm={control}
                                  nameController={`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.alertas`}
                                  rules={rules.medicamento.alertas}
                                  className="hidden"
                                  type="hidden"
                                />
                              </td>

                              <td className="w-[20%] border p-1">
                                <span style={{ color: tipoConvenioId !== '' && tiposDeConvenio?.find(tc => Number(tc.value) === Number(tipoConvenioId))?.ForeColor || '#000' }} className="font-bold">
                                  {ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.medicamento ?? ''}
                                </span>

                                {ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.Lasa &&
                                  <span style={{ backgroundColor: lasas?.find(l => Number(l.value) === Number(ordenesWatch?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.IdLasa))?.label || '#000' }} className="ml-1 rounded-md p-1 text-white text-center font-bold animate-pulse transition-all duration-500">
                                    LASA
                                  </span>
                                }
                              </td>

                              <td className="w-[6%] border p-1">
                                <InputField
                                  className='text-lg'
                                  controlForm={control}
                                  nameController={`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.cantidadAutorizada`}
                                  type='number'
                                  rules={rules.medicamento.cantidadAutorizada}
                                  error={errors?.ordenes?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.cantidadAutorizada?.message}
                                  formatAsCurrency
                                  disabled={!isInfoPacienteComplete || !isOrdenCompleta(ordenIndex)}
                                />
                              </td>

                              <td className="w-[11%] border p-1">
                                <InputSelect
                                  controlForm={control}
                                  nameController={`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.lote`}
                                  placeholder="Lote"
                                  options={(saldosPorMedicamento[`${ordenIndex}-${medicamentoIndex}`] || []).map(s => ({
                                    label: s.Lote,
                                    value: s.Lote
                                  }))}

                                  onChange={(selectedOption) => {
                                    const lote = selectedOption?.value;

                                    const yaExiste = ordenesWatch?.[ordenIndex]?.medicamentos?.some((m, i) =>
                                      i !== medicamentoIndex &&
                                      m.IdMedicamento === ordenesWatch[ordenIndex].medicamentos[medicamentoIndex].IdMedicamento &&
                                      m.lote === lote
                                    );

                                    if (yaExiste) {
                                      alert("Este lote ya fue asignado a otro medicamento igual en esta orden.");
                                      return;
                                    }

                                    const saldos = saldosPorMedicamento[`${ordenIndex}-${medicamentoIndex}`] || [];
                                    const loteSeleccionado = saldos.find(s => s.Lote === lote);
                                    setValue(`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.cantidadDisponible`, loteSeleccionado?.Saldo || 0);
                                  }}

                                  disabled={!isInfoPacienteComplete || !isOrdenCompleta(ordenIndex)}
                                />
                              </td>

                              <td className="w-[6%] border p-1 text-lg">
                                <InputField
                                  controlForm={control}
                                  nameController={`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.cantidadDisponible`}
                                  disabled={true}
                                  formatAsCurrency
                                />
                              </td>

                              <td className="w-[5%] border p-1">
                                <InputField
                                  className='text-lg'
                                  controlForm={control} nameController={`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.cantidadEntregada`}
                                  type='number'
                                  rules={rules.medicamento.cantidadEntregada(ordenIndex, medicamentoIndex)}
                                  error={errors?.ordenes?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.cantidadEntregada?.message}
                                  disabled={!isInfoPacienteComplete || !isOrdenCompleta(ordenIndex)}
                                  formatAsCurrency
                                />
                              </td>

                              <td className="w-[6%] border p-1 text-lg">
                                <InputField
                                  controlForm={control}
                                  nameController={`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.diasTratamiento`}
                                  rules={rules.medicamento.diasTratamiento}
                                  error={errors?.ordenes?.[ordenIndex]?.medicamentos?.[medicamentoIndex]?.diasTratamiento?.message}
                                  disabled={!isInfoPacienteComplete || !isOrdenCompleta(ordenIndex)}
                                  formatAsCurrency
                                />
                              </td>


                              <td className="w-[9%] border p-1">
                                <InputField
                                  controlForm={control}
                                  nameController={`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.mipres`}
                                  disabled={!isInfoPacienteComplete || !isOrdenCompleta(ordenIndex)}
                                />
                              </td>



                              <td className="w-[7%] border p-1">
                                <InputRadio
                                  controlForm={control}
                                  nameController={`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.idSiNo`}
                                  options={[
                                    { value: "si", label: "Si" },
                                    { value: "no", label: "No" },
                                  ]}
                                  className="w-full"
                                  classNameOptions='text-sm'
                                  disabled={!isInfoPacienteComplete || !isOrdenCompleta(ordenIndex)}
                                />
                              </td>


                              <td className="w-[7%] border p-1 text-right">
                                <InputField
                                  className='text-[15px]'
                                  controlForm={control}
                                  nameController={`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.valor`}
                                  type='number'
                                  disabled
                                  formatAsCurrency
                                  showCurrencySymbol
                                />
                              </td>

                              <td className="w-[3%] border p-1 text-right">
                                <InputField
                                  className='text-[15px]'
                                  controlForm={control}
                                  nameController={`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.iva`}
                                  type='number'
                                  disabled
                                  formatAsCurrency
                                />
                              </td>

                              <td className="w-[7%] border p-1 text-right">
                                <InputField
                                  className='text-[15px]'
                                  controlForm={control}
                                  nameController={`ordenes.${ordenIndex}.medicamentos.${medicamentoIndex}.total`}
                                  type='number'
                                  disabled
                                  formatAsCurrency
                                  showCurrencySymbol
                                />
                              </td>

                              {
                                ordenes?.[ordenIndex]?.medicamentos?.length > 1 &&
                                <td className="w-[1%] border">
                                  <div className="flex w-full items-center justify-center">
                                    <FaTrash
                                      onClick={() => {
                                        swal({
                                          title: "¿Estás seguro?",
                                          text: "Esta acción eliminará este medicamento.",
                                          icon: "warning",
                                          buttons: ["Cancelar", "Sí, eliminar"],
                                          dangerMode: true,
                                        }).then((willDelete) => {
                                          if (willDelete) {
                                            removeMedicamento(ordenIndex, medicamentoIndex);
                                            swal("¡Medicamento eliminado correctamente!", {
                                              icon: "success",
                                            });
                                          }
                                        });
                                      }}
                                      className="text-red-500 hover:text-red-600 cursor-pointer h-5 w-5" />
                                  </div>
                                </td>
                              }
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    <div className="flex justify-between mt-2">
                      <div>
                        <IconButton text="Agregar Medicamento" icon={FaPlus} onClick={() => addMedicamento(ordenIndex)} className="bg-green-500 hover:bg-green-600 mt-2" />
                      </div>
                      <div className="flex gap-2">
                        <InputSelect
                          controlForm={control}
                          nameController={`ordenes.${ordenIndex}.tipoCartera`}
                          placeholder="Cartera"
                          options={tiposCartera}
                          className="w-96"
                          rules={rules.ordenes.tipoCartera}
                          error={errors?.ordenes?.[ordenIndex]?.tipoCartera?.message}
                          disabled={!isInfoPacienteComplete || !isOrdenCompleta(ordenIndex)}
                        />

                        <InputField
                          controlForm={control}
                          nameController={`ordenes.${ordenIndex}.totalOrden`}
                          type='number'
                          label="Total orden"
                          disabled
                          formatAsCurrency
                          showCurrencySymbol
                        />

                        <InputField
                          controlForm={control}
                          nameController={`ordenes.${ordenIndex}.totalPagarPorOrden`}
                          type='number'
                          label="Valor a pagar"
                          disabled
                          formatAsCurrency
                          showCurrencySymbol
                        />

                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
            :
            <div className="w-full">
              <h1 colSpan="11" className=" p-3 text-center text-gray-500">No hay ordenes</h1>
            </div>
        }

        <div className="flex justify-start">
          <IconButton
            text="Agregar Nueva Orden"
            icon={FaPlus}
            onClick={() => addOrden(defaultValuesOrden)}
            className="bg-blue-500 hover:bg-blue-600"
          />
        </div>
      </div>


    </fieldset>
  );
};
