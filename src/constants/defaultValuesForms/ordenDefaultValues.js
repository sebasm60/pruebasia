import { defaultValuesMedicamento } from "./medicamentoDefaultValues";

export const defaultValuesOrden =
{
  numeroOrden: '',
  diagnostico: '',
  tipoCobro: '',
  nroDocMedico: '',
  tipoDocMedico: '',
  tipoCartera: '',
  totalOrden: 0,
  totalPagarPorOrden: 0,
  medicamentos: [defaultValuesMedicamento]
}
