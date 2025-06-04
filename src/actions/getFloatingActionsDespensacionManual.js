import { FaSearch, FaUserPlus } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { BuscarCliente, CrearCliente } from "src/components/molecules";

export const getFloatingActionsDispensacionManual = ({ openModal, handleSeleccionarCliente, tiposId, afiliaciones, convenios, reset, setEntregas, categorias }) => [
  {
    icon: FaSearch,
    text: "Buscar Paciente",
    onClick: () =>
      openModal({
        title: "Buscar paciente",
        content: <BuscarCliente
          onSelect={handleSeleccionarCliente}
          categorias={categorias}
        />,
        size: 'lg',
      }),
  },
  {
    icon: FaUserPlus,
    text: "Crear Paciente",
    onClick: () =>
      openModal({
        title: "Crear paciente",
        content: <CrearCliente
          tiposId={tiposId}
          afiliaciones={afiliaciones}
          convenios={convenios}
          categorias={categorias}
          modo={'create'}
        />,
        size: 'lg',
      }),
  },
  {
    icon: MdDeleteForever,
    text: "Siguiente paciente",
    onClick: () => {
      setEntregas([])
      reset()
    }
  },
];
