import { routeApis } from "src/constants/apiRoutes";
import { axiosInstance } from "./axiosConfig";

export const getMasters = async (masterName, filters) => {
  const endpoint = routeApis(masterName);
  const queryParams = filters ? filters : ''
  const url = endpoint + queryParams

  try {
    const response = await axiosInstance.get(url)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener maestro');
  }
}

export const getEntregasByUser = async () => {

  const user = localStorage.getItem('user')
  const url = `info/transacciones/entrega/by/values?amount=100&unit=d&IdUser_Ing=${user}`

  try {
    const response = await axiosInstance.get(url)
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener entregas');
  }
}

export const getSedes = async () => {
  const url = `info/sedes/?Inactivo=false&sedeEE=true`

  try {
    const response = await axiosInstance.get(url)
    return response.data.data
  } catch (error) {
    console.error('Error en getSedes:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener entregas');
  }

}