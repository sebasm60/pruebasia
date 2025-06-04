import { axiosInstance } from './axiosConfig';

export const getMvPendientes = async () => {
  const response = await axiosInstance.get('info/pendientes');
  return response.data;
};

export const getEntregas = async () => {
  const response = await axiosInstance.get('info/entregas');
  return response.data;
};
