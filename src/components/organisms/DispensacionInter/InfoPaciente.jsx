import React from 'react'
import { BsPersonCheckFill } from 'react-icons/bs'
import { MdOutlineNumbers } from 'react-icons/md'
import { TbAbc } from 'react-icons/tb'
import { BuscarCliente, CrearCliente, InputField, InputRadio, InputSelect } from 'src/components/molecules'
import { getValidationsInter } from 'src/helpers'

export const InfoPaciente = ({ control, errors, handleKeyDown, tiposId, afiliaciones, categorias, parentescos, handleSeleccionarCliente, openModal, convenios, watch }) => {

  const [idPaciente, reclamaPaciente, tipoVentaId, pacienteNombre, esMenor, tipoDeDocumento, convenioId, categoriaId, afiliacion] = watch(['pacienteId', 'reclamaPaciente', 'tipoVentaId', 'pacienteNombre', 'esMenor', 'tipoDeDocumento', 'convenioId', 'categoriaId', 'afiliacion'])
  const rules = getValidationsInter({ watch }).infoPaciente;

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
        />

        <InputField
          controlForm={control}
          nameController="pacienteId"
          rules={rules.pacienteId}
          error={errors.pacienteId?.message}
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
                  convenioId={convenioId}
                  tipoDeDocumento={tipoDeDocumento}
                  categorias={categorias}
                />,
                size: 'xl',
              })
          }
          icon={idPaciente !== '' && pacienteNombre !== '' ? <BsPersonCheckFill /> : <MdOutlineNumbers />}
          className="basis-[12%]"
          disabled={!tipoVentaId || pacienteNombre}
        />

        <InputField
          controlForm={control}
          nameController="pacienteNombre"
          label="Nombre"
          icon={<TbAbc />}
          className="basis-[30%]"
          disabled
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
          disabled={afiliacion !== ''}
        />

        <InputSelect
          controlForm={control}
          nameController="categoriaId"
          placeholder='Categoría'
          options={categorias}
          className="basis-[15%]"
          rules={rules.categoriaId}
          error={errors.categoriaId?.message}
          disabled={categoriaId !== ''}
        />
      </div>

      <InputRadio
        controlForm={control}
        nameController="reclamaPaciente"
        options={[
          { value: "si", label: "Si", disabled: esMenor },
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
  )
}