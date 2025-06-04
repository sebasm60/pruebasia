import { useState } from "react";
import { getMedicamentos, getAllMedicamentos, getMedicamentosByPLU } from "src/api";

export const useBuscarMedicamento = (convenioId) => {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);

  const buscarSaldos = async (idMedicamento) => {
    const bodega = localStorage.getItem('BodegaID')

    setLoading(true);
    try {
      const response = await getMedicamentos("medicamentos", idMedicamento, convenioId, bodega);
      return response.data[0]?.saldos
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  const buscarAllSaldos = async (idMedicamento) => {
    setLoading(true);
    try {
      const response = await getMedicamentos("medicamentos", idMedicamento, convenioId, '');
      return response.data[0]?.saldos
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  const buscarAllPLU = async (valor = query) => {
    if (!valor.trim()) return;

    setLoading(true);
    try {
      const response = await getAllMedicamentos("medicamentosplu", valor, convenioId);
      const resultadoNormalizado = Array.isArray(response.data) ? response.data : [response.data];
      setResultados(resultadoNormalizado);
    } catch (error) {
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const buscarByPLU = async (valor = query) => {
    if (!valor.trim()) return;

    setLoading(true);
    try {
      const response = await getMedicamentosByPLU("medicamentosplu", valor, convenioId);
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buscarAllPLU();
    }
  };

  return {
    query,
    setQuery,
    resultados,
    loading,
    seleccionado,
    setSeleccionado,
    handleChange,
    handleKeyDown,
    buscarSaldos,
    buscarByPLU,
    buscarAllPLU,
    buscarAllSaldos
  };
};
