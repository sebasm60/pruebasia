import swal from 'sweetalert'

export function validateRequiredFields(camposFill, camposRequired, values) {
    return new Promise((resolve, reject) => {
        let next = true;
        let camposEmpty = '';
        camposRequired.forEach((elementRequired) => {
            if (camposFill[elementRequired.label] === ''
                || camposFill[elementRequired.label] === undefined) {
                camposEmpty += '* '+elementRequired.label + '\n'
                next=false;
            }
        });
        if (!next) {
            swal("Advertencia", "Existen Campos Vacios: \n" + camposEmpty, "warning");
        }
        resolve(next);
    });
}
export default validateRequiredFields;