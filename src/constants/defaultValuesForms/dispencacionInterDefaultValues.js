import moment from 'moment';

import { defaultValuesMedioDePago } from './medioDePagoDefaultValues';
export const defaultValuesDispensacionInter = {
  pacienteId: '',
  tipoDeDocumento: 'CC',
  esMenor: false,
  pacienteNombre: '',
  afiliacion: '',
  categoriaId: '',
  reclamaPaciente: 'si',
  reclamaId: '',
  reclamaNombre: '',
  tipoDeDocumentoReclama: '',
  parentesco: '',
  convenioId: '01',
  fecha: moment().locale('es').format('DD MMM yyyy'),
  ordenes: [],
  mediosDePago: [defaultValuesMedioDePago],
  totalGeneral: 0,
  totalIVA: 0,
  subtotalGeneral: 0,
  valorPagado: 0,
  cambio: 0,
  comentario: ''
};