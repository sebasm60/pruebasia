export const routeApis = (master) => {
  const endpoints = {
    convenios: "info/convenios",
    tiposId: "info/tiposid",
    tiposEntrega: "info/tiposentrega",
    parentescos: "info/parentescos",
    planes: "info/planes",
    mediosPago: "info/mediospago",
    actividadesSura: "info/actividades/sura",
    causaServiciosSura: "info/causas-servicio-sura",
    canalSura: "info/canales-sura",
    categorias: "info/categorias",
    clasificacionesSura: "info/clasificaciones-sura",
    diagnosticosSura: "info/diagnosticos-sura",
    cobroSura: "info/cobros-sura",
    tecnologiaSura: "info/tecnologias-sura",
    lasa: "info/lasas",
    ecFechas: "info/ec-fechas",
    ecMedicamentos: "info/ec-medicamentos",
    afiliaciones: 'info/afiliaciones',
    paciente: 'info/pacientes',
    generos: 'info/generos',
    regimenes: 'info/regimenes',
    ciudades: 'info/ciudades',
    paises: 'info/paises',
    nivelEscolaridad: 'info/nivelesescol',
    medicamentos: 'info/medicamentos',
    medicamentosplu: 'info/medicamentosplu',
    medicos: '/info/medicos',
    tiposDeCartera: '/info/carteras',
    entregas: '/info/transacciones/entrega',
    lasas: '/info/lasas',
    Obtener_datos_paciente_interpolaridad: 'info/obtener-datos-paciente'
  };

  return endpoints[master] || null;
};
