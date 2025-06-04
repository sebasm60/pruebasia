import swal from 'sweetalert'
import _routeApis from 'src/containers/_routeApis'
import getOrganizeMessager from 'src/reusable/GetMessager'

export function getListSelect(origen, filter, history, nameid, values) {
    if (origen !== undefined) {
        const apiUrl = import.meta.env.VITE_API_URL;
        var actionOrigen = '';
        if (origen.includes(';')) {
            actionOrigen = origen.split(';')[1];
            origen = origen.split(';')[0];
        }
        return new Promise((resolve, reject) => {
            _routeApis(origen, actionOrigen, function (values, results) {
                let apiName = values;
                const axios = require("axios");
                console.log(apiUrl + apiName + filter)
                console.log(localStorage.getItem('LoginToken'))
                const resp = axios.get(apiUrl + apiName + filter,
                    { headers: { "Authorization": `Bearer ` + localStorage.getItem('LoginToken') + `` } }
                )
                    .then(result => {
                        resolve(result.data);
                    })
                    .catch(error => {
                        console.log(error);
                        if (error.response !== null && error.response !== undefined) {
                            if (error.response.status === 401) {
                                console.log("error" + error);
                                history.push('/Login');
                            } else {
                                if (error.response.status === 400 || error.response.status === 404 || error.response.status === 504) {
                                    console.log(error.response);
                                    //resolve(error.response);
                                    resolve(null);
                                }
                                else {
                                    getOrganizeMessager(error.response, function (values, results) {
                                        let mensaje = values;
                                        swal("Error", mensaje, "error");
                                    });
                                }
                            }
                        } else {
                            console.log(error.message);
                            swal("Error", error.message, "error");
                        }
                    });
            });
        })
    }
}
export default getListSelect;