export const rulesCrearPaciente = () => {

  return {
    tipoDocumento: { required: 'El campo tipo de documento es requerido' },
    numeroDocumento: {
      required: 'El campo Nro. documento es requerido',
      maxLength: { value: 15, message: 'Máximo 15 caracteres' }
    },
    fechaNacimiento: { required: 'El campo fecha de nacimiento es requerido' },
    primerNombre: { required: 'El campo primer nombre es requerido' },
    primerApellido: { required: 'El campo primer apellido es requerido' },
    telefono: { required: 'El campo teléfono es requerido', maxLength: { value: 15, message: "Máximo 15 caracteres" }, },
    celular: { required: 'El campo celular es requerido', maxLength: { value: 15, message: "Máximo 15 caracteres" }, },
    correo: { required: 'El campo correo es requerido' },
    ciudad: { required: 'El campo ciudad es requerido' },
    barrio: { required: 'El campo barrio es requerido' },
    direccion: { required: 'El campo dirección es requerido' },
    genero: { required: 'El campo genero orden es requerido' },
    convenio: { required: 'El campo convenio es requerido' },
    zona: { required: 'El campo zona es requerido' },
    regimen: { required: 'El campo regimen es requerido' },
    nacionalidad: { required: 'El campo nacionalidad es requerido' },
    categoria: { required: 'El campo categoría es requerido' },
  };
};
