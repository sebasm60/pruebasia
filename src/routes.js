import React from 'react';
import { PendientesPage } from './components/pages';

const test = React.lazy(() => import('./views/pages/test/index'));
const login = React.lazy(() => import('./views/pages/login/Login'));
const notFound = React.lazy(() => import('./views/pages/page404/Page404'));
const notAllowed = React.lazy(() => import('./views/pages/notAllowed/NotAllowed'));
const dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const ADSGet = React.lazy(() => import('./views/Despacho/Index'));
const dash2 = React.lazy(() => import('./components/pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const despachoManual = React.lazy(() => import('./components/pages/DispencacionManualPage').then(module => ({ default: module.DiespencacionManualPage })));
const despachoInter = React.lazy(() => import('./components/pages/DispensacionInterPage').then(module => ({ default: module.DispensacionInterPage })));
const entregas = React.lazy(() => import('./components/pages/EntregasPage').then(module => ({ default: module.EntregasPage })));
const pendientes = React.lazy(() => import('./components/pages/PendientesPage').then(module => ({ default: module.PendientesPage })));
const busqPacientes = React.lazy(() => import('./views/Masters/Pacientes/busqueda'));
const maesPacientes = React.lazy(() => import('./views/Masters/Pacientes/paciente'));
const maesMedicamentos = React.lazy(() => import('./views/Masters/Medicamentos/medicamento'));
const busqMedicamentos = React.lazy(() => import('./views/Masters/Medicamentos/busqueda'));
const maesUbicaciones = React.lazy(() => import('./views/Masters/Ubicaciones/ubicacion'));
const busqUbicaciones = React.lazy(() => import('./views/Masters/Ubicaciones/busqueda'));
const maesUnidades = React.lazy(() => import('./views/Masters/Unidades/unidad'));
const busqUnidades = React.lazy(() => import('./views/Masters/Unidades/busqueda'));
const maesFormasFticas = React.lazy(() => import('./views/Masters/FormasFticas/formasFtica'));
const busqFormasFticas = React.lazy(() => import('./views/Masters/FormasFticas/busqueda'));
const maesModalidades = React.lazy(() => import('./views/Masters/Modalidades/modalidad'));
const busqModalidades = React.lazy(() => import('./views/Masters/Modalidades/busqueda'));
const maesConvenios = React.lazy(() => import('./views/Masters/Convenios/convenio'));
const busqConvenios = React.lazy(() => import('./views/Masters/Convenios/busqueda'));
const maesTiposIdentificacion = React.lazy(() => import('./views/Masters/TiposIdentificacion/tiposId'));
const busqTiposIdentificacion = React.lazy(() => import('./views/Masters/TiposIdentificacion/busqueda'));
const maesTiposEntregas = React.lazy(() => import('./views/Masters/TiposEntregas/tipoEntrega'));
const busqTiposEntregas = React.lazy(() => import('./views/Masters/TiposEntregas/busqueda'));
const maesGeneros = React.lazy(() => import('./views/Masters/Generos/genero'));
const busqGeneros = React.lazy(() => import('./views/Masters/Generos/busqueda'));
const maesNivelEscolaridad = React.lazy(() => import('./views/Masters/NivelEscolaridad/nivelEscolaridad'));
const busqNivelEscolaridad = React.lazy(() => import('./views/Masters/NivelEscolaridad/busqueda'));
const maesRegimen = React.lazy(() => import('./views/Masters/Regimenes/regimen'));
const busqRegimen = React.lazy(() => import('./views/Masters/Regimenes/busqueda'));
const maesAfiliaciones = React.lazy(() => import('./views/Masters/Afiliaciones/afiliacion'));
const busqAfiliaciones = React.lazy(() => import('./views/Masters/Afiliaciones/busqueda'));
const maesParentesco = React.lazy(() => import('./views/Masters/Parentescos/parentesco'));
const busqParentesco = React.lazy(() => import('./views/Masters/Parentescos/busqueda'));
const maesViasAdmin = React.lazy(() => import('./views/Masters/ViasAdministracion/viasAdministracion'));
const busqViasAdmin = React.lazy(() => import('./views/Masters/ViasAdministracion/busqueda'));
const maesATC = React.lazy(() => import('./views/Masters/ATC/atc'));
const busqATC = React.lazy(() => import('./views/Masters/ATC/busqueda'));
const maesEstadoRInv = React.lazy(() => import('./views/Masters/RegInvimaEstados/regInvimaEstado'));
const busqEstadoRInv = React.lazy(() => import('./views/Masters/RegInvimaEstados/busqueda'));
const maesGrupoRInv = React.lazy(() => import('./views/Masters/RegInvima/regInvima'));
const busqGrupoRInv = React.lazy(() => import('./views/Masters/RegInvima/busqueda'));
const maesCiudades = React.lazy(() => import('./views/Masters/Ciudades/ciudades'));
const busqCiudades = React.lazy(() => import('./views/Masters/Ciudades/busqueda'));
const maesUsuarios = React.lazy(() => import('./views/Masters/Usuarios/usuario'));
const busqUsuarios = React.lazy(() => import('./views/Masters/Usuarios/busqueda'));
const maesPerfiles = React.lazy(() => import('./views/Masters/Perfiles/perfil'));
const busqPerfiles = React.lazy(() => import('./views/Masters/Perfiles/busqueda'));
const pageTest = React.lazy(() => import('./views/Masters/masterLog/LogSyncBi'));
const maesPaises = React.lazy(() => import('./views/Masters/Pais/pais'));
const busqPaises = React.lazy(() => import('./views/Masters/Pais/busqueda'));
const maesDepartamentos = React.lazy(() => import('./views/Masters/Departamentos/departamento'));
const busqDepartamentos = React.lazy(() => import('./views/Masters/Departamentos/busqueda'));
const maesSedes = React.lazy(() => import('./views/Masters/Sedes/sede'));
const busqSedes = React.lazy(() => import('./views/Masters/Sedes/busqueda'));
const maesPlanes = React.lazy(() => import('./views/Masters/Planes/plan'));
const busqPlanes = React.lazy(() => import('./views/Masters/Planes/busqueda'));
const maesRoles = React.lazy(() => import('./views/Masters/Roles/rol'));
const busqRoles = React.lazy(() => import('./views/Masters/Roles/busqueda'));
const maesMediosPago = React.lazy(() => import('./views/Masters/MediosPagos/mediopago'));
const busqMediosPago = React.lazy(() => import('./views/Masters/MediosPagos/busqueda'));
const maesConsecutivos = React.lazy(() => import('./views/Masters/Consecutivos/consecutivo'));
const busqConsecutivos = React.lazy(() => import('./views/Masters/Consecutivos/busqueda'));
const maesRolesSedes = React.lazy(() => import('./views/Masters/RolesXSedes/rolesSedes'));
const busqRolesSedes = React.lazy(() => import('./views/Masters/RolesXSedes/busqueda'));
const maesMenus = React.lazy(() => import('./views/Masters/Menus/menu'));
const busqMenus = React.lazy(() => import('./views/Masters/Menus/busqueda'));
const uploadDomiciliarios = React.lazy(() => import('./views/Domiciliario/CargarArchivo'));
const DespachoDom = React.lazy(() => import('./views/Domiciliario/Index'));
const DespacharDom = React.lazy(() => import('./views/Domiciliario/Despachar'));
const CorteDom = React.lazy(() => import('./views/Domiciliario/Corte'));
const perfil = React.lazy(() => import('./views/pages/profile/profile'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/Test', name: 'Test', component: test },
  { path: '/Login', name: 'Login', component: login },
  { path: '/Page404', name: '404', component: notFound },
  { path: '/NotAllowed', name: 'Sin Permisos', component: notAllowed },
  { path: '/DashboardOrigin', name: 'Dashboard', component: dashboard },
  { path: '/Dashboard', name: 'Dashboard', component: dash2 },
  { path: '/Despacho', name: 'Dispensación', component: ADSGet },
  { path: '/DespachoManual', name: 'Dispensación Manual', component: despachoManual },
  { path: '/DespachoInter', name: 'Dispensación INTEROPERABILIDAD', component: despachoInter },
  { path: '/Entregas', name: 'Entregas', component: entregas },
  { path: '/Pendientes', name: 'Pendientes', component: pendientes },
  { path: '/Maestros/BusquedaPas', name: 'Busqueda Pacientes', component: busqPacientes, exact: true },
  { path: '/Maestros/paciente/:id', name: 'Pacientes', component: maesPacientes },
  { path: '/Maestros/BusquedaMed', name: 'Busqueda Medicamentos', component: busqMedicamentos, exact: true },
  { path: '/Maestros/medicamento/:id', name: 'Medicamentos', component: maesMedicamentos },
  { path: '/Maestros/BusquedaUbi', name: 'Busqueda Ubicaciones', component: busqUbicaciones, exact: true },
  { path: '/Maestros/ubicaciones/:id', name: 'Ubicaciones', component: maesUbicaciones },
  { path: '/Maestros/unidades/:id', name: 'Unidades', component: maesUnidades },
  { path: '/Maestros/BusquedaUni', name: 'Busqueda Unidades', component: busqUnidades, exact: true },
  { path: '/Maestros/formasFticas/:id', name: 'Formas Farmaceuticas', component: maesFormasFticas },
  { path: '/Maestros/BusquedaFormFtica', name: 'Busqueda Formas Farmaceuticas', component: busqFormasFticas, exact: true },
  { path: '/Maestros/modalidades/:id', name: 'Modalidades', component: maesModalidades },
  { path: '/Maestros/BusquedaMod', name: 'Busqueda Modalidades', component: busqModalidades, exact: true },
  { path: '/Maestros/convenios/:id', name: 'Convenios', component: maesConvenios },
  { path: '/Maestros/BusquedaConv', name: 'Busqueda Convenios', component: busqConvenios, exact: true },
  { path: '/Maestros/tiposId/:id', name: 'Tipo Id', component: maesTiposIdentificacion },
  { path: '/Maestros/BusquedatiposId', name: 'Busqueda Tipo Id', component: busqTiposIdentificacion, exact: true },
  { path: '/Maestros/tipoEntrega/:id', name: 'Tipo Entrega', component: maesTiposEntregas },
  { path: '/Maestros/BusquedaTiposEnt', name: 'Busqueda Tipo Entrega', component: busqTiposEntregas, exact: true },
  { path: '/Maestros/generos/:id', name: 'Generos', component: maesGeneros },
  { path: '/Maestros/BusquedaGen', name: 'Busqueda Generos', component: busqGeneros, exact: true },
  { path: '/Maestros/nivelEscolaridad/:id', name: 'Nivel Escolaridad', component: maesNivelEscolaridad },
  { path: '/Maestros/BusquedaNivelEsc', name: 'Busqueda Nivel Escolaridad', component: busqNivelEscolaridad, exact: true },
  { path: '/Maestros/regimen/:id', name: 'Regimenes', component: maesRegimen },
  { path: '/Maestros/BusquedaReg', name: 'Busqueda Regimenes', component: busqRegimen, exact: true },
  { path: '/Maestros/afiliacion/:id', name: 'Afiliaciones', component: maesAfiliaciones },
  { path: '/Maestros/BusquedaAfil', name: 'Busqueda Afiliaciones', component: busqAfiliaciones, exact: true },
  { path: '/Maestros/parentesco/:id', name: 'Parentescos', component: maesParentesco },
  { path: '/Maestros/BusquedaParen', name: 'Busqueda Parentescos', component: busqParentesco, exact: true },
  { path: '/Maestros/viasAdministracion/:id', name: 'Vias Administracion', component: maesViasAdmin },
  { path: '/Maestros/BusquedaViasAdmin', name: 'Busqueda Vias Administracion', component: busqViasAdmin, exact: true },
  { path: '/Maestros/atc/:id', name: 'ATC', component: maesATC },
  { path: '/Maestros/BusquedaATC', name: 'Busqueda ATC', component: busqATC, exact: true },
  { path: '/Maestros/EstadoRInv/:id', name: 'Registro Invima Estados', component: maesEstadoRInv },
  { path: '/Maestros/BusquedaEstadoRInv', name: 'Busqueda Registro Invima Estados', component: busqEstadoRInv, exact: true },
  { path: '/Maestros/GrupoRInv/:id', name: 'Grupo Registro Invima', component: maesGrupoRInv },
  { path: '/Maestros/BusquedaGrupoRInv', name: 'Busqueda Grupo Registro Invima', component: busqGrupoRInv, exact: true },
  { path: '/Maestros/ciudades/:id', name: 'Ciudades', component: maesCiudades },
  { path: '/Maestros/BusquedaCiudades', name: 'Busqueda Ciudades', component: busqCiudades, exact: true },
  { path: '/Maestros/usuarios/:id', name: 'Usuario', component: maesUsuarios },
  { path: '/Maestros/BusquedaUser', name: 'Busqueda Usuario', component: busqUsuarios, exact: true },
  { path: '/Maestros/perfiles/:id', name: 'Perfiles', component: maesPerfiles },
  { path: '/Maestros/BusquedaPerf', name: 'Busqueda Perfiles', component: busqPerfiles, exact: true },
  { path: '/Maestros/pais/:id', name: 'Pais', component: maesPaises },
  { path: '/Maestros/BusquedaPaises', name: 'Busqueda Paises', component: busqPaises, exact: true },
  { path: '/Maestros/departamentos/:id', name: 'Departamentos', component: maesDepartamentos },
  { path: '/Maestros/BusquedaDepartamentos', name: 'Busqueda Departamentos', component: busqDepartamentos, exact: true },
  { path: '/Maestros/test', name: 'Pages Test', component: pageTest },
  { path: '/Maestros/sedes/:id', name: 'Sede', component: maesSedes },
  { path: '/Maestros/BusquedaSedes', name: 'Busqueda Sedes', component: busqSedes, exact: true },
  { path: '/Maestros/planes/:id', name: 'Plan', component: maesPlanes },
  { path: '/Maestros/BusquedaPlanes', name: 'Busqueda Planes', component: busqPlanes, exact: true },
  { path: '/Maestros/roles/:id', name: 'Rol', component: maesRoles },
  { path: '/Maestros/BusquedaRoles', name: 'Busqueda Roles', component: busqRoles, exact: true },
  { path: '/Maestros/mediospagos/:id', name: 'Medios Pago', component: maesMediosPago },
  { path: '/Maestros/BusquedaMediosPago', name: 'Busqueda Medios Pago', component: busqMediosPago, exact: true },
  { path: '/Maestros/Consecutivos/:id', name: 'Consecutivos', component: maesConsecutivos },
  { path: '/Maestros/BusquedaConsecutivos', name: 'Busqueda Consecutivos', component: busqConsecutivos, exact: true },
  { path: '/Maestros/rolesSedes/:idSede/:idRol', name: 'Roles x Sedes', component: maesRolesSedes },
  { path: '/Maestros/BusquedaRolesSedes', name: 'Busqueda Roles x Sedes', component: busqRolesSedes, exact: true },
  { path: '/Maestros/menu/:id', name: 'Menu', component: maesMenus },
  { path: '/Maestros/BusquedaMenus', name: 'Busqueda Menu', component: busqMenus, exact: true },
  { path: '/Domiciliario/CargarArchivo', name: 'Cargar Archivo', component: uploadDomiciliarios, exact: true },
  { path: '/Domiciliario/Despacho', name: 'Despacho Domiciliario', component: DespachoDom, exact: true },
  { path: '/Domiciliario/Despachar', name: 'Despachar Domiciliario', component: DespacharDom, exact: true },
  { path: '/Domiciliario/Corte', name: 'Corte Domiciliario', component: CorteDom, exact: true },
  { path: '/profile/:id', name: 'Cambio Clave', component: perfil },
];

export default routes;
