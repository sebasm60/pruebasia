import { useState } from "react";
import { getEntregasByPaciente, getPacienteInfo, getOrdenes } from "src/api/getPacienteInfo";

export const useBuscarCliente = () => {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);

  const buscar = async (valor = query) => {
    if (!valor.trim()) return;

    setLoading(true);
    try {
      const response = await getPacienteInfo("paciente", valor);
      const resultadoNormalizado = Array.isArray(response.data) ? response.data : [response.data];
      setResultados(resultadoNormalizado);
    } catch (error) {
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const buscarEntregas = async (pacienteId) => {
    if (!pacienteId.trim()) return;

    setLoading(true);
    try {
      const response = await getEntregasByPaciente("entregas", pacienteId);
      const data = response?.data?.sort((a, b) => new Date(b.Fh_Ing) - new Date(a.Fh_Ing));
      const resultadoNormalizado = Array.isArray(data) ? data : [data];
      setEntregas(resultadoNormalizado);
    } catch (error) {
      setEntregas([]);
    } finally {
      setLoading(false);
    }
  }

  const buscarOrdenes = async (idPaciente, tipoDocPaciente, convenioId) => {
    if (!idPaciente.trim()) return;

    setLoading(true);
    try {
      const response = await getOrdenes("Obtener_datos_paciente_interpolaridad", idPaciente, tipoDocPaciente, convenioId);
      return response;
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }

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
    setQuery,
    resultados,
    loading,
    seleccionado,
    setSeleccionado,
    handleChange,
    handleKeyDown,
    buscar,
    buscarEntregas,
    entregas,
    buscarOrdenes,
    setEntregas
  };
};
