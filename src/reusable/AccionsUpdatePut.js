import swal from 'sweetalert'
import _routeApis from 'src/containers/_routeApis'
import getOrganizeMessager from 'src/reusable/GetMessager'

const apiUrl = import.meta.env.VITE_API_URL;

const UpdateItemPut = function (id, data, origen, history, urlreturn) {
  var actionOrigen = '';
  if (origen.includes(';')) {
    actionOrigen = origen.split(';')[1];
    origen = origen.split(';')[0];
  }
  return new Promise((resolve, reject) => {
  _routeApis(origen, actionOrigen, function (values, results) {
    let apiName = values;
    apiName=apiUrl + apiName
    if(id!=='')
    {
      apiName=apiName + "/" + id
    }
    console.log(JSON.stringify(data));
    const axios = require("axios");
    axios.put(apiName, data,
      { headers: { "Authorization": `Bearer ` + localStorage.getItem('LoginToken') + `` } }
    )
      .then(result => {
        console.log(result);
        let mensaje = result.statusText;
        if (result.Status === "OK" || result.status === 200) {
          resolve(result.data);
          swal("", mensaje, "success")
            .then((value) => {
              if (value) {
                if (urlreturn !== '') {
                  history.push({
                    pathname: urlreturn
                  });
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
          } else {
            getOrganizeMessager(error.response, function (values, results) {
              let mensaje = values;
              swal("Error", mensaje, "error");
            });
          }
        } else {
          console.log(error.message);
          swal("Error", error.message, "error");
        }
      });
  });
});
}

export default UpdateItemPut;