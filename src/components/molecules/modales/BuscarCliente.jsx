import { useEffect } from "react";

import { useBuscarCliente } from "src/hooks";
import { IconButton } from "../../atoms";
import { FaUserCheck } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { IoIosPersonAdd } from "react-icons/io";
import { CrearCliente } from ".";

export const BuscarCliente = ({ onSelect, initialQuery, openModal, tiposId, afiliaciones, convenios, convenioId = '', tipoDeDocumento = '', categorias }) => {

  console.log(initialQuery, tipoDeDocumento, convenioId)
  const {
    query,
    setQuery,
    resultados,
    loading,
    seleccionado,
    setSeleccionado,
    handleChange,
    handleKeyDown,
    buscar
  } = useBuscarCliente();

  useEffect(() => {
    const ejecutarBusqueda = async () => {
      if (initialQuery) {
        setQuery(initialQuery);
        await buscar(initialQuery);
      }
    };
    ejecutarBusqueda();
  }, [initialQuery]);

  useEffect(() => {
    const setData = async () => {
      if (resultados.length === 1) {
        setSeleccionado(resultados[0])
      }
    }
    setData()
  }, [resultados]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Buscar por nombre o documento"
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white placeholder-gray-500"
      />

      {loading ? <span className="text-sm text-gray-500">Buscando...</span> :
        resultados.length > 0 ?
          <ul className="bg-white rounded-md text-gray-800 overflow-y-auto max-h-64 space-y-1 px-1">
            {resultados.map((cliente) => {
              const isSelected = String(seleccionado?.IdPaciente) === String(cliente.IdPaciente);

              return (
                <li
                  key={cliente.IdPaciente}
                  onClick={() => setSeleccionado(cliente)}
                  className={`px-4 py-2 cursor-pointer transition-colors border-l-4 ${isSelected
                    ? "bg-blue-100 border-blue-600"
                    : "bg-gray-50 border-transparent hover:bg-gray-100"
                    } rounded-md`}
                >
                  <p className="font-semibold">{cliente.Nombre}</p>
                  <p className="text-sm text-gray-600">Documento: {cliente.IdPaciente}</p>
                </li>
              );
            })}
          </ul> :
          <div className="flex flex-col items-center gap-2">
            <FaCircleInfo className="w-96 h-16 text-yellow-400" />
            <h1>Ups... no encontramos coincidencias.</h1>
            <h1>Puedes intentar con otro nombre y/o documento o crear un nuevo paciente</h1>
          </div>
      }

      <div className="flex gap-2 items-end justify-end w-full">
        <IconButton
          text="Seleccionar paciente"
          icon={FaUserCheck}
          onClick={() => onSelect(seleccionado)}
          className="self-end mt-2"
          disabled={!seleccionado}
        />

        <IconButton
          text="Crear paciente"
          icon={IoIosPersonAdd}
          onClick={() =>
            openModal({
              title: "Crear paciente",
              size: "lg",
              content: (
                <CrearCliente
                  tiposId={tiposId}
                  afiliaciones={afiliaciones}
                  convenios={convenios}
                  cliente={{ numeroDocumento: initialQuery }}
                  convenioId={convenioId}
                  tipoDeDocumento={tipoDeDocumento}
                  categorias={categorias}
                  modo={'create'}
                />
              ),
            })
          }
          className="self-end mt-2 bg-green-400 hover:bg-green-600"
        />
      </div>
    </div>
  );
};
