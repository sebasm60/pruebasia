import { routeApis } from "src/constants/apiRoutes";
import { axiosInstance } from "./axiosConfig";

export const getEntregasByPaciente = async (masterName, queryParam) => {
  const endpoint = routeApis(masterName);
  const query = `?IdPaciente=${queryParam}`
  const url = `${endpoint}/${query}`

  try {
    const response = await axiosInstance.get(url)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener datos');
  }
}

export const getPacienteInfo = async (masterName, queryParam) => {
  const endpoint = routeApis(masterName);
  const query = `?limit=50&search=${queryParam}&searchFields=Nombre,IdPaciente`
  const url = `${endpoint}/${query}`

  try {
    const response = await axiosInstance.get(url)
    return response.data
  } catch (error) {
    return null
  }
}

export const getPacienteInfoById = async (masterName, queryParam) => {
  const endpoint = routeApis(masterName);
  const query = `${queryParam}`
  const url = `${endpoint}/${query}`

  try {
    const response = await axiosInstance.get(url)
    return response.data
  } catch (error) {

  }
}

export const getOrdenes = async (masterName, idPaciente, tipoDocPaciente, convenioId) => {
  const endpoint = routeApis(masterName);
  const url = `${endpoint}/tipoDoc/${tipoDocPaciente}/convenio/${convenioId}/id/${idPaciente}`

  try {
    const response = await axiosInstance.get(url)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener datos');
  }
}