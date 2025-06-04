import moment from 'moment';

import { defaultValuesMedioDePago } from './medioDePagoDefaultValues';
import { defaultValuesOrden } from './ordenDefaultValues';

export const defaultValuesDispensacionManual = {
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
  tipoConvenioId: '',
  origenDeServicioId: '',
  tipoPlan: '',
  ordenes: [defaultValuesOrden],
  mediosDePago: [defaultValuesMedioDePago],
  totalGeneral: 0,
  totalIVA: 0,
  subtotalGeneral: 0,
  valorPagado: 0,
  cambio: 0
};