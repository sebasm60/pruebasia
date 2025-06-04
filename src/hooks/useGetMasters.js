import { useFetchSelectOptions } from "./useFetchSelectOptions";

export const useGetMasters = (userRole, tipoConvenioId, tipoPlan) => {
  const { data: convenios } = useFetchSelectOptions("convenios", '?Inactivo=false', item => ({
    label: item.Nombre,
    value: item.IdConvenio,
  }));

  const { data: tiposDeVentaRows } = useFetchSelectOptions("tiposEntrega", "?Inactivo=false", (item) => {
    const validForRole =
      (userRole === "front" && item.Front) ||
      (userRole === "apl" && item.Aplicacion) ||
      (userRole === "dom" && item.Domicilio);
    if (!validForRole) return null;
    return { label: item.Nombre, value: item.IdTipoEntrega };
  });

  const { data: tiposDeConvenio } = useFetchSelectOptions("actividadesSura", '', item => ({
    label: item.Nombre,
    value: item.IdActividad,
    ForeColor: item.ForeColor,
  }));

  const { data: origenDeServiciosRows } = useFetchSelectOptions("causaServiciosSura", '', item => ({
    label: item.Nombre,
    value: item.Codigo,
    tipoPlan: item.TipoPlan,
  }));

  const { data: parentescosRows } = useFetchSelectOptions("parentescos", '', item =>
    item.IdParentesco !== '0' && ({ label: item.Nombre, value: item.IdParentesco })
  );

  const { data: tiposIdRows } = useFetchSelectOptions("tiposId", '', item => ({
    label: item.Nombre,
    value: item.IdTipoId,
  }));

  const { data: tiposIdMedicosRows } = useFetchSelectOptions("tiposId", '?Medicos=1', item => ({
    label: item.Nombre,
    value: item.IdTipoId,
  }));

  const { data: afiliaciones } = useFetchSelectOptions("afiliaciones", '', item => ({
    label: item.Nombre,
    value: item.IdAfiliacion,
  }));

  const { data: categoriasRows } = useFetchSelectOptions("categorias", '', item => ({
    label: item.Nombre,
    value: item.Codigo,
    Sigla: item.Sigla,
    ValorCM: item.ValorCM,
    PctajeCR: item.PctajeCR,
    PctajeCOP: item.PctajeCOP,
  }));

  const { data: diagnosticosRows } = useFetchSelectOptions("diagnosticosSura", '', item => ({
    label: item.Nombre,
    value: item.Codigo,
  }));

  const { data: tiposDeCobroRows } = useFetchSelectOptions("cobroSura", '', item => ({
    label: item.Nombre,
    value: item.Tipo,
    CobroCero: item.CobroCero,
  }));

  const { data: mediosDePago } = useFetchSelectOptions("mediosPago", '', item => ({
    label: item.Nombre,
    value: item.IdMedioPago,
  }));

  const { data: lasas } = useFetchSelectOptions("lasas", '', item => ({
    value: item.IdLasa,
    label: item.BackColor,
  }));

  const filtrosCartera = tipoConvenioId
    ? (+tipoConvenioId === 0
      ? `?IdTipoConvenio=Equal(${tipoConvenioId})`
      : `?IdSede=Equal(${localStorage.getItem('SedeID')})&Planes=Equal(${tipoPlan})&IdTipoConvenio=Equal(${tipoConvenioId})`)
    : null;

  const { data: tiposCartera } = useFetchSelectOptions(
    "tiposDeCartera",
    filtrosCartera,
    item => ({ label: item.Nombre, value: item.IdCartera })
  );

  const { data: tiposCarteraConvenio0 } = useFetchSelectOptions(
    "tiposDeCartera",
    `?IdTipoConvenio=Equal(0)`,
    item => ({ label: item.Nombre, value: item.IdCartera })
  );

  const { data: tiposCarteraConvenio1 } = useFetchSelectOptions(
    "tiposDeCartera",
    `?IdSede=Equal(${localStorage.getItem('SedeID')})&IdTipoConvenio=Equal(1)`,
    item => ({ label: item.Nombre, value: item.IdCartera, plan: item.Planes })
  );

  return {
    convenios,
    tiposDeVentaRows,
    tiposDeConvenio,
    origenDeServiciosRows,
    parentescosRows,
    tiposIdRows,
    tiposIdMedicosRows,
    afiliaciones,
    categoriasRows,
    diagnosticosRows,
    tiposDeCobroRows,
    mediosDePago,
    tiposCartera,
    tiposCarteraConvenio0,
    tiposCarteraConvenio1,
    lasas,
  };
};
