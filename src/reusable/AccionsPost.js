import swal from 'sweetalert'
import _routeApis from 'src/containers/_routeApis'
import getOrganizeMessager from 'src/reusable/GetMessager'

const apiUrl = process.env.REACT_APP_API_URL;

const AddItem = function (data, origen, history, urlreturn) {
  console.log(JSON.stringify(data));
  var actionOrigen = '';
  if (origen.includes(';')) {
    actionOrigen = origen.split(';')[1];
    origen = origen.split(';')[0];
  }
  return new Promise((resolve, reject) => {
    _routeApis(origen, actionOrigen, function (values, results) {
      let apiName = values;
      const axios = require("axios");
      console.log(apiUrl + '' + apiName);
      axios.post(apiUrl + apiName, data,
        { headers: { "Authorization": `Bearer ` + localStorage.getItem('LoginToken') + `` } }
      )
        .then(result => {
          console.log(result);
          let mensaje = result.data.message;
          if (result.Status === "OK" || result.status === 200 || result.status === 201) {
            resolve(result.data);
            swal("", "Registro Creado " + mensaje, "success")
              .then((value) => {
                if (value) {
                  if (urlreturn !== '') {
                    history.push(urlreturn);
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
          if (error.response !== null && error.response !== undefined) {
            if (error.response.status === 401) {
              console.log("error" + error);
              history.push('/Login');
            } else if (error.response.status === 409) {
              swal("Error", "Campo Duplicados", "error");
            }
            else {
              console.log(error.response);
              error.error="error";
              swal("Error", error.message + "\n" + error.response.data.message, "error");
              resolve(error);
            }
          } else {
            //console.log(error.message);
            if (Array.isArray(error.message)) {
              getOrganizeMessager(error.message, function (values, results) {
                let mensaje = values;
                swal("Error", mensaje, "error");
              });
            }
            else {
              swal("Error", error.message, "error");
            }
          }
        });
    });
  });
}

export default AddItem;