import { axiosInstance } from "./axiosConfig";

export const createPaciente = async (data) => {
  const url = `info/pacientes`
  try {
    const response = await axiosInstance.post(url, data)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al guardar registro');
  }
}

export const updatePaciente = async (data) => {
  const url = `info/pacientes/${data.IdPaciente}`
  try {
    const response = await axiosInstance.patch(url, data)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al guardar registro');
  }
}