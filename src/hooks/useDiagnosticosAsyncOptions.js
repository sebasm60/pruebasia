import { getMasters } from "src/api";

export const useDiagnosticosAsyncOptions = () => {
  const fetchOptions = async (inputValue = '') => {
    console.log(inputValue)
    const filters = `?limit=50&search=${encodeURIComponent(inputValue)}`;
    const res = await getMasters("diagnosticosSura", filters);
    const data = res?.data || [];

    return data.map(item => ({
      label: item.Nombre,
      value: item.Codigo,
    }));
  };

  return { fetchOptions };
};


export const fetchDiagnosticoByCodigo = async (codigo) => {
  const res = await getMasters("diagnosticosSura", `?Codigo=${codigo}&limit=1`);
  const data = res?.data?.[0];
  return data ? { label: data.Nombre, value: data.Codigo } : null;
};
