import { useBuscarMedicamento } from "src/hooks";
import { IconButton } from "../../atoms";
import { FaUserCheck } from "react-icons/fa";
import { useEffect } from "react";

export const BuscarMedicamentos = ({ onSelect, convenioId, initialQuery }) => {
  const {
    query,
    setQuery,
    resultados,
    loading,
    seleccionado,
    setSeleccionado,
    handleChange,
    handleKeyDown,
    buscarAllPLU,
  } = useBuscarMedicamento(convenioId);

  useEffect(() => {
    const ejecutarBusqueda = async () => {
      if (initialQuery) {
        setQuery(initialQuery);
        await buscarAllPLU(initialQuery);
      }
    };
    ejecutarBusqueda();
  }, [initialQuery]);

  useEffect(() => {
    if (resultados.length === 1) {
      setSeleccionado(resultados[0]);
    }
  }, [resultados]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Buscar por nombre o PLU"
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white placeholder-gray-500"
      />

      {loading && <span className="text-sm text-gray-500">Buscando...</span>}

      <ul className="bg-white rounded-md text-gray-800 overflow-y-auto max-h-64 space-y-1 px-1">
        {resultados.map((medicamento) => {
          const isSelected = String(`${seleccionado?.IdMedicamento}_${seleccionado?.PLU}`) === String(`${medicamento?.IdMedicamento}_${medicamento?.PLU}`);

          return (
            <li key={`${medicamento.PLU}_${medicamento.IdMedicamento}`} onClick={() => setSeleccionado(medicamento)}
              className={`px-4 py-2 cursor-pointer transition-colors border-l-4 ${isSelected ? "bg-blue-100 border-blue-600" : "bg-gray-50 border-transparent hover:bg-gray-100"} rounded-md`}>
              <p className="font-semibold">{medicamento.Medicamento.Nombre}</p>
              <p className="text-sm text-gray-600">Id medicamento: {medicamento.IdMedicamento}</p>
              <p className="text-sm text-gray-600">PLU: {medicamento.PLU}</p>
            </li>
          );
        })}
      </ul>

      <IconButton
        text="Seleccionar medicamento"
        icon={FaUserCheck}
        onClick={() => onSelect(seleccionado)}
        className="self-end mt-2"
        disabled={!seleccionado}
      />
    </div>
  );
};
