import { useForm } from "react-hook-form";
import { crearClienteFormDefaultValues } from "../constants";
import { useFetchSelectOptions } from "./useFetchSelectOptions";
import { useEffect, useRef } from "react";
import { useMutation } from "react-query";
import { createPaciente, getOrdenes, getPacienteInfoById, updatePaciente } from "src/api";
import { formatDateP } from "src/reusable/Util";

export const useCrearCliente = ({ cliente = null, modo = 'create', convenioId = '', tipoDeDocumento = '' }) => {
  const isUpdateRef = useRef(modo === 'update');
  console.log(isUpdateRef)

  const { control, handleSubmit, trigger, reset, watch, setValue, formState: { errors, isValid }, } = useForm({ mode: "all", reValidateMode: "onBlur", defaultValues: crearClienteFormDefaultValues });

  const { data: generos } = useFetchSelectOptions("generos", '?Inactivo=false', item => ({ label: item.Nombre, value: item.IdGenero }));
  const { data: regimenes } = useFetchSelectOptions("regimenes", '?Inactivo=false', item => ({ label: item.Nombre, value: item.IdRegimen }));
  const { data: paises } = useFetchSelectOptions("paises", '', item => ({ label: item.Nombre, value: item.IdPais }));
  const { data: nivelesEscolares } = useFetchSelectOptions("nivelEscolaridad", '?Inactivo=false', item => ({ label: item.Nombre, value: item.IdNivelEscol }));
  const { data: ciudadesOptions } = useFetchSelectOptions("ciudades", `?page=1&limit=1500`, item => ({ label: item.Nombre, value: item.IdCiudad, Departamento: item.Departamento }));

  const [primerNombre, segundoNombre, primerApellido, segundoApellido, ciudad] = watch(['primerNombre', 'segundoNombre', 'primerApellido', 'segundoApellido', 'ciudad'])

  useEffect(() => {
    const nombreCompleto = `${primerNombre || ''} ${segundoNombre || ''} ${primerApellido || ''} ${segundoApellido || ''}`.trim().replace('  ', ' ');
    setValue('nombreCompleto', nombreCompleto);
  }, [primerNombre, segundoNombre, primerApellido, segundoApellido]);

  useEffect(() => {
    const departamento = ciudadesOptions?.find(c => c.value === ciudad)?.Departamento
    setValue('departamento', departamento?.Nombre);
    setValue('idDepartamento', departamento?.IdDepartamento);
  }, [ciudad]);


  useEffect(() => {
    if (cliente !== '') setValue('numeroDocumento', cliente?.numeroDocumento);
    if (tipoDeDocumento !== '') setValue('tipoDocumento', tipoDeDocumento);
  }, [ciudad, tipoDeDocumento]);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!cliente?.numeroDocumento) return;
      try {
        // 1. Intentar traer desde la fuente principal
        const response = await getPacienteInfoById("paciente", cliente.numeroDocumento);

        if (response) {
          const formValues = mapearClienteAFormValues(response);
          reset({ ...crearClienteFormDefaultValues, ...formValues });
          return;
        } else {
          const responseInter = await getOrdenes("Obtener_datos_paciente_interpolaridad", cliente.numeroDocumento, tipoDeDocumento, convenioId);

          if (responseInter.paciente) {
            isUpdateRef.current = true;
            const formValues = mapearClienteAFormValues(responseInter.paciente, responseInter?.orders?.[0].interop?.formula?.categoria?.codigo);
            reset({ ...crearClienteFormDefaultValues, ...formValues });
          }
        }
      } catch (error) {
        console.error("Error al cargar los datos del paciente:", error);
      }
    };

    cargarDatos();
  }, [cliente]);

  const mapearClienteAFormValues = (cliente, categoria) => ({
    tipoDocumento: cliente?.TipoId?.IdTipoId || cliente?.IdTipoId || '',
    numeroDocumento: cliente?.IdPaciente || '',
    fechaExpedicion: cliente?.FhExpedicion?.split('T')[0] || '',
    primerNombre: cliente?.Nombre1 || '',
    segundoNombre: cliente?.Nombre2 || '',
    primerApellido: cliente?.Apellido1 || '',
    segundoApellido: cliente?.Apellido2 || '',
    nombreCompleto: cliente?.Nombre || '',
    eps: cliente?.CodigoEPS || '',
    telefono: cliente?.Telefono || '',
    celular: cliente?.Celular || '',
    fechaNacimiento: cliente?.FhNacimiento?.split('T')[0] || '',
    genero: cliente?.Genero?.IdGenero || cliente?.IdGenero || '',
    regimen: cliente?.Regimen?.IdRegimen || cliente?.IdRegimen || '',
    afiliacion: cliente?.Afiliacion?.IdAfiliacion || cliente?.IdAfiliacion || '',
    ciudad: cliente?.Ciudad?.IdCiudad || cliente?.IdCiudad || cliente?.Ciudad?.IdCiudad || '',
    departamento: cliente?.Ciudad?.Departamento?.Nombre || '',
    idDepartamento: cliente?.Ciudad?.Departamento?.IdDepartamento || '',
    idReal: cliente?.IdReal || '',
    correo: cliente?.Email || '',
    nacionalidad: cliente?.IdNacionalidad || '',
    barrio: cliente?.Barrio || '',
    direccion: cliente?.Direccion || '',
    complemento: cliente?.Direccion2 || '',
    convenio: cliente?.Convenio?.IdConvenio || cliente?.IdConvenio || '',
    escolaridad: cliente?.NivelEscol?.IdNivelEscol || cliente?.IdNivelEscol || '',
    estrato: cliente?.Estrato || '',
    zona: cliente?.ZonaUR || '',
    contacto: cliente?.Contacto || '',
    acudiente: cliente?.Acudiente || '',
    celularAcudiente: cliente?.CelAcudiente || '',
    comentario: cliente?.Comentario || '',
    habilitado: cliente?.Habilitado ?? true,
    fallecido: cliente?.Fallecido ?? false,
    categoria: cliente?.IdCategoria || categoria || '',
    nacionalidad: cliente?.IdNacionalidad ?? ''
  });

  const createObjPaciente = (data) => ({
    IdPaciente: data.numeroDocumento,
    Nombre: data.nombreCompleto,
    Nombre1: data.primerNombre,
    Nombre2: data.segundoNombre,
    Apellido1: data.primerApellido,
    Apellido2: data.segundoApellido,
    Telefono: data.telefono,
    Celular: data.celular,
    FhNacimiento: data.fechaNacimiento,
    Barrio: data.barrio,
    Direccion: data.direccion,
    Direccion2: data.complemento,
    ZonaUR: data.zona,
    Comentario: data.comentario,
    Inactivo: false,
    FhCreacion: formatDateP(new Date(), 'yyyy-MM-DD'),
    IdUser_Ing: localStorage.getItem('user'),
    IdTipoId: data.tipoDocumento,
    IdGenero: data.genero,
    IdAfiliacion: data.afiliacion,
    IdCiudad: data.ciudad,
    IdConvenio: data.convenio,
    Email: data.correo,
    IdCategoria: data.categoria,
    IdNivelEscol: "0",
    IdRegimen: "0",
    Habilitado: data.habilitado,
    Fallecido: data.fallecido,
    IdNacionalidad: data.nacionalidad
  });

  const mutation = useMutation({ mutationFn: (data) => isUpdateRef.current ? updatePaciente(data) : createPaciente(data), });

  const onSubmit = handleSubmit(values => {
    const objPaciente = createObjPaciente(values);
    mutation.mutate(objPaciente, {
      onSuccess: () => {
        reset(crearClienteFormDefaultValues)
      },
    });
  });

  return {
    control, handleSubmit, trigger, reset, watch, setValue, errors,
    generos, regimenes, ciudadesOptions, paises, nivelesEscolares, isValid,
    onSubmit
  };
};
