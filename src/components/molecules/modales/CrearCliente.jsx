import { useCrearCliente } from "src/hooks";
import { InputCheck, InputField, InputSelect } from "../forms";
import { FaSave } from "react-icons/fa";
import { IconButton } from "src/components/atoms";
import { rulesCrearPaciente } from "src/helpers";
import zonas from "src/reusable/maestros/zonas";

export const CrearCliente = ({ tiposId, afiliaciones, convenios, categorias, cliente, modo = 'create', convenioId = '', tipoDeDocumento = '' }) => {
  const { control, errors, generos, ciudadesOptions, isValid, handleSubmit, onSubmit, paises } = useCrearCliente({ cliente, modo, convenioId, tipoDeDocumento });

  const rules = rulesCrearPaciente();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-2">

      {/* Documento */}
      <fieldset className="border border-black px-4 py-2 rounded-lg shadow-md w-full">
        <legend className="text-lg font-semibold text-gray-700 select-none px-1">Documento</legend>
        <div className="grid grid-cols-3 gap-2">
          <InputSelect
            controlForm={control}
            nameController="tipoDocumento"
            placeholder="Tipo documento"
            options={tiposId}
            rules={rules.tipoDocumento}
            error={errors.tipoDocumento?.message}
            disabled={modo === 'update'}
          />

          <InputField
            controlForm={control}
            nameController="numeroDocumento"
            label="Nro. Documento"
            rules={rules.numeroDocumento}
            error={errors.numeroDocumento?.message}
            disabled={modo === 'update'}
          />

          <InputField
            controlForm={control}
            nameController="fechaNacimiento"
            label="Fecha Nacimiento"
            type="date"
            rules={rules.fechaNacimiento}
            error={errors.fechaNacimiento?.message}
          />

        </div>
      </fieldset>

      {/* Nombre */}
      <fieldset className="border border-black px-4 py-2 rounded-lg shadow-md w-full">
        <legend className="text-lg font-semibold text-gray-700 select-none px-1">Nombre</legend>
        <div className="grid grid-cols-4 gap-2">
          <InputField
            controlForm={control}
            nameController="primerNombre"
            label="Primer Nombre"
            rules={rules.primerNombre}
            error={errors.primerNombre?.message}
          />

          <InputField
            controlForm={control}
            nameController="segundoNombre"
            label="Segundo Nombre"
            error={errors.segundoNombre?.message}
          />

          <InputField
            controlForm={control}
            nameController="primerApellido"
            label="Primer Apellido"
            rules={rules.primerApellido}
            error={errors.primerApellido?.message}
          />

          <InputField
            controlForm={control}
            nameController="segundoApellido"
            label="Segundo Apellido"
            error={errors.segundoApellido?.message}
          />
        </div>

        <div className="mt-2">
          <InputField
            controlForm={control}
            nameController="nombreCompleto"
            label="Nombre completo"
            error={errors.nombreCompleto?.message}
            disabled
          />
        </div>
      </fieldset>

      <fieldset className="border border-black px-4 py-2 rounded-lg shadow-md w-full">
        <legend className="text-lg font-semibold text-gray-700 select-none px-1">Contacto</legend>
        <div className="grid grid-cols-2 gap-2">
          <InputField
            type='number'
            controlForm={control}
            nameController="telefono"
            label="Teléfono"
            rules={rules.telefono}
            error={errors.telefono?.message}
          />

          <InputField
            type='number'
            controlForm={control}
            nameController="celular"
            label="Celular"
            rules={rules.celular}
            error={errors.celular?.message}
          />

          <InputField
            controlForm={control}
            nameController="correo"
            label="correo"
            rules={rules.correo}
            error={errors.eps?.message}
            className='col-span-2'
          />
        </div>
      </fieldset>

      <fieldset className="border border-black px-4 py-2 rounded-lg shadow-md w-full">
        <legend className="text-lg font-semibold text-gray-700 select-none px-1">Dirección</legend>
        <div className="grid grid-cols-3 gap-2">
          <InputSelect
            controlForm={control}
            nameController="ciudad"
            placeholder="Ciudad"
            options={ciudadesOptions}
            rules={rules.ciudad}
            error={errors.ciudad?.message}
          />

          <InputField
            controlForm={control}
            nameController="departamento"
            label="Departamento"
            error={errors.departamento?.message}
            disabled
          />

          <InputField
            controlForm={control}
            nameController="barrio"
            label="Barrio"
            rules={rules.barrio}
            error={errors.barrio?.message}
          />


        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <InputField controlForm={control} nameController="direccion" label="Dirección" error={errors.direccion?.message} />
          <InputField controlForm={control} nameController="complemento" label="Complemento" error={errors.complemento?.message} />
        </div>
      </fieldset>

      <fieldset className="border border-black px-4 py-2 rounded-lg shadow-md w-full">
        <legend className="text-lg font-semibold text-gray-700 select-none px-1">Información adicional</legend>
        <div className="grid grid-cols-3 gap-2">
          <InputSelect
            controlForm={control}
            nameController="genero"
            placeholder="Género"
            options={generos}
            rules={rules.genero}
            error={errors.genero?.message}
          />

          <InputSelect
            controlForm={control}
            nameController="convenio"
            placeholder="Convenio"
            options={convenios}
            rules={rules.convenio}
            error={errors.convenio?.message}
          />

          <InputSelect
            controlForm={control}
            nameController="zona"
            placeholder="Zona"
            options={zonas}
            rules={rules.zona}
            error={errors.zona?.message}
          />

          <InputSelect
            controlForm={control}
            nameController="afiliacion"
            placeholder="Afiliación"
            options={afiliaciones}
            rules={rules.afiliacion}
            error={errors.afiliacion?.message}
          />

          <InputSelect
            controlForm={control}
            nameController="categoria"
            placeholder="Categoría Ingresos"
            options={categorias}
            rules={rules.categoria}
            error={errors.categoria?.message}
          />

          <InputSelect
            controlForm={control}
            nameController="nacionalidad"
            placeholder="Nacionalidad"
            options={paises}
            rules={rules.nacionalidad}
            error={errors.nacionalidad?.message}
          />
        </div>
      </fieldset>


      <div className="flex gap-3">
        <InputCheck
          controlForm={control}
          nameController="habilitado"
          legend="Habilitado"
        />

        <InputCheck
          controlForm={control}
          nameController="fallecido"
          legend="Fallecido"
        />
      </div>

      <fieldset className="border border-black px-4 py-2 rounded-lg shadow-md w-full">
        <legend className="text-lg font-semibold text-gray-700 select-none px-1">Comentario</legend>
        <InputField
          controlForm={control}
          nameController="comentario"
          label="Comentario"
          isTextarea
          rows={3}
          error={errors.comentario?.message}
        />
      </fieldset>

      <div className="flex justify-end">
        <IconButton
          text={modo === 'update' ? "Actualizar paciente" : "Guardar paciente"}
          icon={FaSave}
          type="submit"
          disabled={!isValid}
        />
      </div>
    </form>
  );
};
