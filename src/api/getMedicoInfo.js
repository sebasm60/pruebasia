import { routeApis } from "src/constants/apiRoutes";
import { axiosInstance } from "./axiosConfig";

export const getMedicoInfo = async (masterName) => {
  const endpoint = routeApis(masterName);
  const url = `${endpoint}`

  try {
    const response = await axiosInstance.get(url)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener maestro');
  }
}