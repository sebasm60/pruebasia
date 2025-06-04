import { useBuscarMedico } from "src/hooks";
import { IconButton } from "../../atoms";
import { FaUserCheck } from "react-icons/fa";

export const BuscarMedico = ({ onSelect }) => {
  const {
    query,
    resultados,
    loading,
    seleccionado,
    setSeleccionado,
    handleChange,
    handleKeyDown,
  } = useBuscarMedico();

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

      {loading && <span className="text-sm text-gray-500">Buscando...</span>}

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
      </ul>

      <IconButton
        text="Seleccionar medico"
        icon={FaUserCheck}
        onClick={() => onSelect(seleccionado)}
        className="self-end mt-2"
        disabled={!seleccionado}
      />
    </div>
  );
};
