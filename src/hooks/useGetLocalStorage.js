import { useEffect, useState } from "react";

export const useGetLocalStorage = () => {

  const [domicilio, setDomicilio] = useState(false);
  const [tipoOrdenId, setTipoOrdenId] = useState('');
  const [aplicacion, setAplicacion] = useState(false);

  useEffect(() => {
    const apl = localStorage.getItem('Aplicacion') === 'true';
    const dom = localStorage.getItem('Domicilio') === 'true';
    const tipo = localStorage.getItem('typeOrder');

    setDomicilio(dom);
    setTipoOrdenId(tipo === 'E' ? 'EXCLUSIVOS' : 'INTEGRADOS');
    setAplicacion(!dom && apl);
  }, []);

  return {
    aplicacion,
    domicilio,
    tipoOrdenId,
  }
}