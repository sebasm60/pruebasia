import { axiosInstance } from "./axiosConfig";

export const saveDispensacion = async (data) => {
  const url = `info/procesar-entregas`
  try {
    const response = await axiosInstance.post(url, data)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al guardar registro');
  }
}

export const saveDispensacionManual = async (data) => {
  const url = `info/procesar-entregas/manual`
  try {
    const response = await axiosInstance.post(url, data)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al guardar registro');
  }
}