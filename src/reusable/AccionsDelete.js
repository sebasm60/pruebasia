import swal from 'sweetalert'
import _routeApis from 'src/containers/_routeApis'
import getOrganizeMessager from 'src/reusable/GetMessager'

const apiUrl = import.meta.env.VITE_API_URL;


const DeleteItem = function (id, origen, history, urlreturn) {
  var actionOrigen = '';
  if (origen.includes(';')) {
    actionOrigen = origen.split(';')[1];
    origen = origen.split(';')[0];
  }
  _routeApis(origen, actionOrigen, function (values, results) {
    let apiName = values;
    swal("Eliminar items", "Favor confirme que desea inactivar el items", "warning", {
      buttons: ["Cancelar", "Confirmar"],
    })
      .then((value) => {
        if (value === true) {
          const axios = require("axios");
          axios.delete(apiUrl + apiName + "/" + id,
            { headers: { "Authorization": `Bearer ` + localStorage.getItem('LoginToken') + `` } }
          )
            .then(result => {
              console.log(result);
              let mensaje = result.statusText;
              if (result.Status === "OK" || result.status === 200) {
                swal("", "Registro Eliminado " + mensaje, "success")
                  .then((value) => {
                    if (value) {
                      if (urlreturn !== '') {
                        history.push({
                          pathname: urlreturn
                        });
                      } else {
                        window.location.reload(false);
                      }
                    }
                  });
              }
              else {
                console.log(values)
                swal("Error", mensaje, "error");
              }
            })
            .catch(error => {
              console.log(error);
              if (error.response !== null) {
                if (error.response.status === 401) {
                  console.log("error" + error);
                  history.push('/Login');
                } else {
                  getOrganizeMessager(error.response, function (values, results) {
                    let mensaje = values;
                    swal("Error", mensaje, "error");
                  });
                }
              }
            });
        }
      });
  });
}
export default DeleteItem;