import swal from 'sweetalert'

export function getPermissions(IdMenu, filter, history) {
    return new Promise((resolve, reject) => {
        let tempArray = JSON.parse(localStorage.getItem('permissions'));
        if (tempArray !== undefined) {
            let permissions = tempArray.find(i => i.IdMenu === IdMenu);
            if (permissions !== undefined) {
                switch (filter) {
                    default:
                        resolve(false);
                        break;
                    case "Ingreso":
                        if (!permissions.Ingreso) {
                            history.push('/NotAllowed');
                        } else {
                            resolve(true);
                        }
                        break;
                    case "Consulta":
                        if (!permissions.Consulta) {
                            swal("Advertencia", "Sin Permisos " + filter + "", "warning");
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                        break;
                    case "Edicion":
                        if (!permissions.Edicion) {
                            swal("Advertencia", "Sin Permisos " + filter + "", "warning");
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                        break;
                        case "Retiro":
                            if (!permissions.Retiro) {
                                swal("Advertencia", "Sin Permisos " + filter + "", "warning");
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                            break;
                }
            } else {
                history.push('/NotAllowed');
            }
        } else {
            resolve(false);
        }
    })
}
export default getPermissions;