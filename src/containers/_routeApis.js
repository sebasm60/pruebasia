import { toUPPER } from "src/reusable/Util";

const _routeApis = function (origen, accions, callback) {
    let apiName = "";
    origen = toUPPER(origen);
    switch (origen) {
        case "LOGIN":
            apiName = 'auth/login';
            break;
        case "CONVENIOS":
            apiName = 'info/convenios';
            break;
        case "CARTERAS":
            apiName = 'info/carteras';
            break;
        case "LASA":
            apiName = 'info/lasas';
            break;
        case "PACIENTE":
            apiName = 'info/pacientes';
            break;
        case "ACTIVIDADESSURA":
            apiName = 'info/actividades/sura';
            break;
        case "CAUSASERVICIOSSURA":
            apiName = 'info/causas-servicio-sura';
            break;
        case "CANALSURA":
            apiName = 'info/canales-sura';
            break;
        case "CATEGORIASSURA":
            apiName = 'info/categorias-sura';
            break;
        case "CLASIFICACIONESSURA":
            apiName = 'info/clasificaciones-sura';
            break;
        case "DIAGNOSTICOSSURA":
            apiName = 'info/diagnosticos-sura';
            break;
        case "COBROSURA":
            apiName = 'info/cobros-sura';
            break;
        case "TECNOLOGIASURA":
            apiName = 'info/tecnologias-sura';
            break;
        case "MEDICAMENTO":
            apiName = 'info/medicamentos';
            break;
        case "MEDICAMENTOPLU":
            apiName = 'info/medicamentosplu';
            break;
        case "TIPOSID":
            apiName = 'info/tiposid';
            break;
        case "TIPOSENTREGA":
            apiName = 'info/tiposentrega';
            break;
        case "TIPOSVIA":
            apiName = 'info/tiposvia';
            break;
        case "LETRASVIA":
            apiName = 'info/letrasvia';
            break;
        case "ORIENTACIONVIA":
            apiName = 'info/orientacionesvia';
            break;
        case "GENEROS":
            apiName = 'info/generos';
            break;
        case "NIVELESCOLARIDAD":
            apiName = 'info/nivelesescol';
            break;
        case "REGIMENES":
            apiName = 'info/regimenes';
            break;
        case "AFILIACIONES":
            apiName = 'info/afiliaciones';
            break;
        case "MARCAS":
            apiName = 'info/marcas';
            break;
        case "CIUDADES":
            apiName = 'info/ciudades';
            break;
        case "PARENTESCOS":
            apiName = 'info/parentescos';
            break;
        case "UNIDADES":
            apiName = 'info/unidades';
            break;
        case "FORMASFTICA":
            apiName = 'info/formasftica';
            break;
        case "VIASADMON":
            apiName = 'info/viasadmon';
            break;
        case "GRUPOSRINV":
            apiName = 'info/gruposrinv';
            break;
        case "ESTADOSRINV":
            apiName = 'info/estadosrinv';
            break;
        case "MODALIDADES":
            apiName = 'info/modalidades';
            break;
        case "ATC":
            apiName = 'info/atc';
            break;
        case "UBICACIONES":
            apiName = 'info/ubicaciones';
            break;
        case "USUARIOS":
            apiName = 'manager/usuarios';
            break;
        case "SEDES":
            apiName = 'info/sedes';
            break;
        case "PAISES":
            apiName = 'info/paises';
            break;
        case "DEPARTAMENTOS":
            apiName = 'info/departamentos';
            break;
        case "ROLES":
            apiName = 'info/roles';
            break;
        case "PERFILES":
            apiName = 'manager/perfiles';
            break;
        case "PERFILES_MENU":
            apiName = 'manager/perfilesmenu';
            break;
        case "CAMBIO_CLAVE":
            apiName = 'auth/changePassword';
            break;
        case "MENUS":
            apiName = 'manager/menus';
            break;
        case "OBTENER_DATOS_PACIENTE_INTERPOLARIDAD":
            apiName = 'info/obtener-datos-paciente';
            break;
        case "PROCESAR_ENTREGAS":
            apiName = 'info/procesar-entregas';
            break;
        case "PLANES":
            apiName = 'info/planes';
            break;
        case "MEDIOSPAGO":
            apiName = 'info/mediospago';
            break;
        case "CONSECUTIVOS":
            apiName = 'info/consecutivos';
            break;
        case "ROLESSEDES":
            apiName = 'info/rolessede';
            break;
        case "ENTREGAS":
            apiName = 'info/entregas';
            break;
        case "TRANSACCIONES":
            apiName = 'info/transacciones';
            break;
        case "DOMICILIO_CARGA":
            apiName = 'domicilios/upload';
            break;
        case "DOMICILIO_NEXT_PACIENTE":
            apiName = 'info/obtener-datos-paciente/domicilio/next';
            break;
        case "OPERADORES":
            apiName = 'info/operadores/logisticos';
            break;
        case "CAJA":
            apiName = 'info/entregas/siguiente/caja';
            break;
        case "EC_FECHAS":
            apiName = 'info/ec-fechas';
            break;
        case "EC_MEDICAMENTOS":
            apiName = 'info/ec-medicamentos';
            break;
    }

    callback(apiName);
}
export default _routeApis;