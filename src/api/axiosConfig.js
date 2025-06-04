import axios from 'axios'

import Swal from 'sweetalert'
import { transformResponseData } from './helpers'

const API_BASE_URL = process.env.REACT_APP_API_URL;
let activeRequests = 0;

const getToken = () => localStorage.getItem('LoginToken');

const handleErrorToast = (error, defaultMessage) => {
  const status = error.response?.status || '';
  let message = defaultMessage;

  const responseData = error.response?.data;

  if (responseData) {
    if (Array.isArray(responseData.message)) {
      // Si es un arreglo de errores (como validaciones), únelos con salto de línea
      message = responseData.message.join('\n');
    } else if (typeof responseData.message === 'string') {
      // Si es un string directo
      message = responseData.message;
    } else if (typeof responseData.error === 'string') {
      // Si viene solo un campo "error"
      message = responseData.error;
    }
  }

  Swal({
    title: `Error ${status}`,
    text: status === 401
      ? `Acceso denegado, inicie sesión nuevamente`
      : message,
    icon: "error",
    dangerMode: true,
    closeOnClickOutside: false,
    closeOnEsc: false,
  }).then((confirm) => {
    if (confirm && status === 401) {
      window.location.hash = "#/login";
    }
  });
};


const transformToUppercase = (data) => {
  if (typeof data !== 'object' || data === null) return data;

  for (const key in data) {
    if (typeof data[key] === 'string') {
      data[key] = data[key].toUpperCase();
    } else if (typeof data[key] === 'object') {
      data[key] = transformToUppercase(data[key]);
    }
  }

  return data;
};

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data) {
      config.data = transformToUppercase(config.data);
    }
    if (config.method.toLowerCase() === 'get') {
      activeRequests++;

      if (activeRequests === 1) {
        Swal({
          content: {
            element: "div",
            attributes: {
              innerHTML: `
              <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; font-family: sans-serif;">
                <div class="loader"></div>
                <div style="font-size: 16px; font-weight: 500;">Estamos cargando los datos...</div>
                <div style="font-size: 13px; color: #555;">Por favor espera un momento</div>
              </div>
            `
            }
          },
          buttons: false,
          closeOnClickOutside: false,
          closeOnEsc: false
        });
      }
    }

    return config;
  },
  (error) => {
    Swal.close();
    handleErrorToast(error, 'No se pudo establecer conexión con el servidor');
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.method.toLowerCase() === 'get') {
      activeRequests--;
      if (activeRequests === 0) Swal.close();
    }
    return transformResponseData(response);
  },

  error => {
    if (error.config?.method?.toLowerCase() === 'get') {
      activeRequests--;
      if (activeRequests === 0) Swal.close();
    }
    console.error(error)
    handleErrorToast(error, 'No se pudo establecer conexión con el servidor');

    let objError

    if (error.response) {
      objError = {
        message: error?.message,
        name: error?.name,
        status: error?.response.status,
        text: error?.response.statusText
      }
      if (error?.response.status === 401) window.location.hash = "#/login";
    } else {
      objError = {
        message: error?.message,
        name: error?.name
      }
    }

    return Promise.reject(objError)
  }
)