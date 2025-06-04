
import { useGetLocalStorage } from "src/hooks";
import { DispensacionInterTemplate } from "../templates/DispensacionInterTemplate";

export const DispensacionInterPage = () => {

  const { aplicacion, domicilio, tipoOrdenId } = useGetLocalStorage()

  return <DispensacionInterTemplate title={`Dispensación interoperabilidad ${domicilio ? '-' + tipoOrdenId : ''}`} />;
}
