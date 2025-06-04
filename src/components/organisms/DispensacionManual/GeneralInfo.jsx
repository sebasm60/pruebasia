import { InputField, InputSelect } from "src/components/molecules";
import { getValidationsManual } from "src/helpers/rules/rulesDispensacionManual";

export const GeneralInfo = ({ control, errors, convenios, tiposDeVenta, tiposDeConvenio, origenDeServicios, watch }) => {

  const [ordenes] = watch(['ordenes'])
  const rules = getValidationsManual({ watch }).generalInfo;

  const primeraOrdenIncompleta = () => {
    if (!ordenes || !ordenes[0]) return true;

    const orden = ordenes[0];

    return orden.numeroOrden?.length > 3 ||
      orden.diagnostico?.length > 3 ||
      orden.tipoCobro?.length > 3 ||
      orden.nroDocMedico?.length > 3 ||
      orden.tipoDocMedico?.length > 3;
  };

  return (
    <fieldset className="border border-black px-4 py-2 rounded-lg shadow-md w-full relative" >
      <legend className="text-base font-semibold text-gray-700 select-none px-1">Información general</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-12 gap-2">

        <InputSelect
          controlForm={control}
          nameController="convenioId"
          placeholder='Convenios'
          options={convenios}
          className='xl:col-span-3 lg:col-span-2'
          rules={rules.convenioId}
          error={errors.convenioId?.message}
          disabled={primeraOrdenIncompleta()}
        />

        <InputSelect
          controlForm={control}
          nameController="tipoVentaId"
          placeholder='Tipo de entrega'
          options={tiposDeVenta}
          className='xl:col-span-3 lg:col-span-2'
          rules={rules.tipoVentaId}
          error={errors.tipoVentaId?.message}
          disabled={primeraOrdenIncompleta()}
        />

        <InputSelect
          controlForm={control}
          nameController="tipoConvenioId"
          placeholder='Tipo de convenio'
          options={tiposDeConvenio}
          className='xl:col-span-2 lg:col-span-2'
          rules={rules.tipoConvenioId}
          error={errors.tipoConvenioId?.message}
          disabled={primeraOrdenIncompleta()}
        />

        <InputSelect
          controlForm={control}
          nameController="origenDeServicioId"
          placeholder='Origen servicio'
          options={origenDeServicios}
          className='xl:col-span-2 lg:col-span-2'
          rules={rules.origenDeServicioId}
          error={errors.origenDeServicioId?.message}
          disabled={primeraOrdenIncompleta()}
        />

        <InputField
          controlForm={control}
          nameController="tipoPlan"
          label="Tipo plan"
          disabled={true}
          className='xl:col-span-1 lg:col-span-2'
        />

        <InputField
          controlForm={control}
          nameController="fecha"
          label="Fecha"
          type="text"
          disabled={true}
          className='xl:col-span-1 lg:col-span-2'
        />
      </div>
    </ fieldset >
  )
}


