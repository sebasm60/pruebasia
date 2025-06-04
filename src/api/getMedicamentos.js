import { routeApis } from "src/constants/apiRoutes";
import { axiosInstance } from "./axiosConfig";

export const getMedicamentos = async (masterName, idMedicamento, idConvenio, bodega) => {
  const endpoint = routeApis(masterName);
  const query = `?IdMedicamento=${idMedicamento}&IdConvenio=${idConvenio}&mostrarSaldos=true&Bodega=${bodega}`
  const url = `${endpoint}/${query}`

  try {
    const response = await axiosInstance.get(url)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener maestro');
  }
}

export const getAllMedicamentos = async (masterName, querySearch, idConvenio) => {
  const endpoint = routeApis(masterName);
  const query = `?search=${querySearch}&IdConvenio=${idConvenio}`
  const url = `${endpoint}/${query}`

  try {
    const response = await axiosInstance.get(url)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener maestro');
  }
}

export const getMedicamentosByPLU = async (masterName, querySearch, idConvenio) => {
  const endpoint = routeApis(masterName);
  const query = `?PLU=${querySearch}&IdConvenio=${idConvenio}`
  const url = `${endpoint}/${query}`

  try {
    const response = await axiosInstance.get(url)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener maestro');
  }
}