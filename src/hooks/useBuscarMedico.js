import { useState } from "react";
import { getMedicoInfo } from "src/api";

export const useBuscarMedico = () => {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);

  const buscar = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await getMedicoInfo("medicos", query);
      const resultadoNormalizado = Array.isArray(response.data) ? response.data : [response.data];
      setResultados(resultadoNormalizado);
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
      buscar();
    }
  };

  return {
    query,
    resultados,
    loading,
    seleccionado,
    setSeleccionado,
    handleChange,
    handleKeyDown,
  };
};
