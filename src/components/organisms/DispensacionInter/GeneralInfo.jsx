import { InputSelect } from "src/components/molecules"
import { getValidationsInter } from "src/helpers";

export const GeneralInfo = ({ control, convenios, errors, tiposDeVenta, watch }) => {

  const [pacienteNombre] = watch('pacienteNombre')

  const rules = getValidationsInter({ watch }).generalInfo;

  return (
    <fieldset className="border border-black px-4 py-2 rounded-lg shadow-md w-full relative" >
      <legend className="text-base font-semibold text-gray-700 select-none px-1">Información general</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-12 gap-2">

        <InputSelect
          controlForm={control}
          nameController="convenioId"
          rules={rules.convenioId}
          error={errors.convenioId?.message}
          placeholder='Convenios'
          options={convenios}
          className='xl:col-span-3 lg:col-span-2'
          disabled={pacienteNombre}
        />

        <InputSelect
          controlForm={control}
          nameController="tipoVentaId"
          rules={rules.tipoVentaId}
          error={errors.tipoVentaId?.message}
          placeholder='Tipo de entrega'
          options={tiposDeVenta}
          className='xl:col-span-3 lg:col-span-2'
          disabled={pacienteNombre}
        />
      </div>
    </ fieldset >
  )
}
