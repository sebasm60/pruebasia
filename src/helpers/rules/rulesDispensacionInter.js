import { getCantidadEntregadaRules } from "./getCantidadEntregadaRules";

export const getValidationsInter = ({ watch }) => {
  const [idPaciente, reclamaPaciente, totalGeneral, ordenes] = watch(['pacienteId', 'reclamaPaciente', 'totalGeneral', 'ordenes']);

  return {
    generalInfo: {
      convenioId: { required: 'El campo convenios es requerido' },
      tipoVentaId: { required: 'El campo tipo de entrega es requerido' },
    },

    infoPaciente: {
      pacienteId: {
        required: 'El campo Nro. documento es requerido',
        maxLength: { value: 15, message: 'Máximo 15 caracteres' }
      },
      tipoDeDocumento: { required: 'El campo Tipo de documento es requerido' },
      pacienteNombre: {
        required: 'El campo Nombre es requerido',
        maxLength: { value: 250, message: 'Máximo 250 caracteres' }
      },
      afiliacion: { required: 'El campo Tipo de afiliado es requerido' },
      categoriaId: { required: 'El campo Categoría es requerido' },
      reclamaPaciente: { required: 'Seleccione si reclama el titular' },
      reclamaId: {
        required: reclamaPaciente === "no" ? "El campo Nro. Documento reclama es requerido" : false,
        maxLength: { value: 15, message: "Máximo 15 caracteres" },
        validate: (value) => {
          if (reclamaPaciente === "no" && value === idPaciente) {
            return "El número de documento no puede ser igual al del paciente";
          }
          return true;
        }
      },
      tipoDeDocumentoReclama: {
        required: reclamaPaciente === "no" ? "El campo Tipo documento reclama es requerido" : false
      },
      reclamaNombre: {
        required: reclamaPaciente === "no" ? "El campo nombre reclama es requerido" : false,
        maxLength: { value: 250, message: "Máximo 250 caracteres" }
      },
      parentesco: {
        required: reclamaPaciente === "no" ? "El campo parentesco es requerido" : false
      },
    },

    ordenes: {
      numeroOrden: { required: 'El campo Nro. orden es requerido' },
      tipoConvenioId: { required: 'El campo tipo de convenio es requerido' },
      origenDeServicioId: { required: 'El campo Origen servicio es requerido' },
      tipoPlan: { required: 'El campo Tipo plan es requerido' },
      tipoCobro: { required: 'El campo Tipo de cobro es requerido' },
      diagnostico: { required: 'El campo Diagnostico es requerido' },
      nroDocMedico: { required: 'El campo Doc. Medico es requerido' },
      tipoDocMedico: { required: 'El campo Tipo documento medico es requerido' },
      fechaOrden: { required: 'El campo es requerido' },
      fechaVencimiento: { required: 'El campo es requerido' },
    },

    medicamento: {
      pluOrden: { required: 'El campo PLU es requerido' },
      cantidadAutorizada: {
        min: { value: 1, message: 'Debe ser mayor o igual a 1' }
      },
      cantidadEntregada: (ordenIndex, medicamentoIndex) => ({
        ...getCantidadEntregadaRules(ordenes, ordenIndex, medicamentoIndex)
      }),
      diasTratamiento: {
        min: { value: 1, message: 'Debe ser mayor o igual a 1' }
      },
      alertas: {
        validate: (value) => {
          return value === false || "Debes revisar las alertas del medicamento antes de continuar.";
        }
      }
    },

    resumenPago: {
      forma: { required: totalGeneral > 0 ? 'El campo es requerido' : false },
      valor: { required: totalGeneral > 0 ? 'El campo es requerido' : false },
    }
  };
};
