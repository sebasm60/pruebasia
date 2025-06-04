import { BuscarCliente, CrearCliente, InputField, InputRadio, InputSelect } from "../../molecules";
import { MdOutlineNumbers } from "react-icons/md";
import { TbAbc } from "react-icons/tb";
import { BsPersonCheckFill } from "react-icons/bs";

import { getValidationsManual } from "src/helpers/rules/rulesDispensacionManual";

export const InfoPaciente = ({ control, errors, handleKeyDown, tiposId, afiliaciones, categorias, parentescos, handleSeleccionarCliente, openModal, convenios, watch }) => {

  const [idPaciente, reclamaPaciente, pacienteNombre, tipoDeDocumento] = watch(['pacienteId', 'reclamaPaciente', 'pacienteNombre', 'tipoDeDocumento'])
  const datosGenerales = watch(['convenioId', 'tipoVentaId', 'tipoConvenioId', 'origenDeServicioId', 'tipoPlan', 'fecha'])
  const isDatosGeneralesComplete = datosGenerales.every((value) => value?.toString().trim() !== '' && value !== null);
  const rules = getValidationsManual({ watch }).infoPaciente;
  const [ordenes] = watch(['ordenes'])

  const primeraOrdenIncompleta = () => {
    if (!ordenes || !ordenes[0]) return true;

    const orden = ordenes[0];

    return orden.numeroOrden?.length > 3 ||
      orden.diagnostico?.length > 3 ||
      orden.tipoCobro?.length > 3 ||
      orden.nroDocMedico?.length > 3 ||
      orden.tipoDocMedico?.length > 3 ||
      !isDatosGeneralesComplete;
  };

  return (
    <fieldset className="border border-black px-4 py-2 rounded-lg shadow-md w-full relative">
      <legend className="text-base font-semibold text-gray-700 select-none px-1">Información del paciente</legend>

      <div className="flex flex-row gap-2">
        <InputSelect
          controlForm={control}
          nameController="tipoDeDocumento"
          placeholder='Tipo documento'
          options={tiposId}
          className="basis-[20%]"
          rules={rules.tipoDeDocumento}
          error={errors.tipoDeDocumento?.message}
          disabled={primeraOrdenIncompleta()}
        />

        <InputField
          controlForm={control}
          nameController="pacienteId"
          label="Nro. documento"
          type="text"
          onKeyDown={handleKeyDown}
          onIconClick={() =>
            idPaciente !== '' && pacienteNombre !== '' ?
              openModal({
                title: "Actualizar paciente",
                size: "lg",
                content: (
                  <CrearCliente
                    tiposId={tiposId}
                    afiliaciones={afiliaciones}
                    convenios={convenios}
                    categorias={categorias}
                    cliente={{ numeroDocumento: idPaciente }}
                    modo={'update'}
                  />
                ),
              }) :
              openModal({
                title: "Buscar paciente",
                content: <BuscarCliente
                  onSelect={handleSeleccionarCliente}
                  initialQuery={idPaciente}
                  openModal={openModal}
                  tiposId={tiposId}
                  afiliaciones={afiliaciones}
                  convenios={convenios}
                  convenioId={datosGenerales.convenioId}
                  tipoDeDocumento={tipoDeDocumento}
                  categorias={categorias}
                />,
                size: 'xl',
              })
          }
          rules={rules.pacienteId}
          error={errors.pacienteId?.message}
          icon={idPaciente !== '' && pacienteNombre !== '' ? <BsPersonCheckFill /> : <MdOutlineNumbers />}
          className="basis-[12%]"
          disabled={primeraOrdenIncompleta()}
        />

        <InputField
          controlForm={control}
          nameController="pacienteNombre"
          label="Nombre"
          icon={<TbAbc />}
          className="basis-[30%]"
          disabled={true}
          rules={rules.pacienteNombre}
          error={errors.pacienteNombre?.message}
        />

        <InputSelect
          controlForm={control}
          nameController="afiliacion"
          placeholder='Tipo de afiliado'
          options={afiliaciones}
          className="basis-[23%]"
          rules={rules.afiliacion}
          error={errors.afiliacion?.message}
          disabled={primeraOrdenIncompleta()}
        />

        <InputSelect
          controlForm={control}
          nameController="categoriaId"
          placeholder='Categoría'
          options={categorias}
          className="basis-[15%]"
          rules={rules.categoriaId}
          error={errors.categoriaId?.message}
          disabled={primeraOrdenIncompleta()}
        />
      </div>

      <InputRadio
        controlForm={control}
        nameController="reclamaPaciente"
        options={[
          { value: "si", label: "Si" },
          { value: "no", label: "No" },
        ]}
        legend="¿Reclama el paciente?"
        rules={rules.reclamaPaciente}
        className="w-full mt-4"
      />

      {reclamaPaciente === "no" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
          <InputField
            controlForm={control}
            nameController="reclamaId"
            label="Nro. de documento reclama"
            className='w-full'
            rules={rules.reclamaId}
            error={errors.reclamaId?.message}
          />

          <InputSelect controlForm={control}
            nameController="tipoDeDocumentoReclama"
            placeholder='Tipo de documento'
            options={tiposId}
            rules={rules.tipoDeDocumentoReclama}
            error={errors.tipoDeDocumentoReclama?.message}
          />

          <InputField
            controlForm={control}
            nameController="reclamaNombre"
            label="Nombre reclama"
            className='w-full'
            rules={rules.reclamaNombre}
            error={errors.reclamaNombre?.message}
          />

          <InputSelect
            controlForm={control}
            nameController="parentesco"
            placeholder='Parentesco'
            options={parentescos}
            rules={rules.parentesco}
            error={errors.parentesco?.message}
          />
        </div>
      )}
    </fieldset>
  );
};
