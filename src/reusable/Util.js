import moment, { months } from 'moment';
import 'moment-timezone';
import 'moment/locale/es';


moment.locale('es');

export function formatCurrency(locales, currency, fractionDigits, number) {
  var formatted = new Intl.NumberFormat(locales, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: fractionDigits
  }).format(number);
  return formatted;
};
export function removeformatCurrency(currency) {
  var number = Number(currency.replace(/[^0-9\.-]+/g, ""));
  return number;
};
export function formatNumber(locales, number) {
  var formatted = new Intl.NumberFormat(locales,).format(number);
  return formatted;
};
export function toUPPER(text) {
  return text.toUpperCase();
};
export function formatDate(fecha) {
  return moment(fecha).format('yyyy-MM-DD HH:mm:ss');
};
export function formatDateP(fecha, formate) {
  return moment(fecha).format(formate);
};
export function formatDateMOL(fecha) {
  return moment(fecha).format('DD-MM-yyyy HH_mm_ss');
};
export function formatDateUNIX(fecha) {
  let date = moment(new Date(fecha)).subtract(5, 'hours').format('x');
  var formatted = "/Date(" + parseInt(date) + ")/";
  return formatted;
}
export function formatUNIXDate(fecha) {
  var timestamp = fecha.replace("/Date(", "").replace(")/", "");
  var date = new Date(parseInt(timestamp));

  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hours = date.getHours() + 5;
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  var formatted = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
  return formatted;
}
export function getEstado(status) {
  switch (status) {
    case false:
    case 'ACTIVO':
      return 'success'
    case true:
    case 'INACTIVO':
      return 'secondary'
    default: return 'primary'
  }
}
export function getColorAlert(status) {
  switch (status) {
    case 'vigencia': return 'success'
    case true: return 'success'
    case 'alerta': return 'danger'
    case false: return 'danger'
    default: return 'primary'
  }
}
export function getColorPendientes(status) {
  switch (status) {
    case true: return '#fad7a0'
    case false: return '#d6ebff'
    default: return 'primary'
  }
}
export function RGBtoHEX(data) {
 if(data!=undefined)
 {
  data=data.replace("rgb(",'').replace(")",'');
  console.log(data);
  let arrayData=data.split(',');
  return `#${arrayData[0].toString(16).padStart(2, '0')}${arrayData[1].toString(16).padStart(2, '0')}${arrayData[2].toString(16).padStart(2, '0')}`;
 }
}
export function getColorCambio(dif) {
  if (dif > 0) {
    return '#217300'
  } else if (dif < 0) {
    return '#D20103'
  } else {
    //return 'danger'
  }
}

export function getColorAlertFechaVto(status) {
  let difMeses = (moment().diff(status, 'months')) * -1
  if (difMeses >= 0 && difMeses <= 3) {
    return '#F1948A'
  } else if (difMeses > 3 && difMeses <= 6) {
    return '#FEED61'
  }
  /* else if (difMeses > 6) {
    return '#8ED79D'
  } */
}

export function getEstadoName(status) {
  switch (status) {
    case false: return 'Activo'
    case true: return 'Inactivo'
    default: return ''
  }
}
export function getTraductorName(status) {
  switch (status) {
    case true: return 'Si'
    case false: return 'No'
    default: return ''
  }
}
export function getColorEstado(status) {
  switch (status) {
    case 'NA': return '#393D31' //Sin Conexion
    case 0: return '#393D31' //Sin Conexion
    case 1: return '#F9060B'//Apagado
    case 2: return '#37B661'//Encendido
    default: return ''
  }
}
export function onPrint() {
  console.log("onPrint");
  var ficha = document.getElementById("printSection");
  var ventImp = window.open('', '_blank');
  ventImp.document.write(ficha.innerHTML);
  ventImp.document.close();
  var css = ventImp.document.createElement("link");
  css.setAttribute("href", 'src/scss/style_print.scss');
  css.setAttribute("rel", 'stylesheet');
  css.setAttribute("type", 'text/css');
  ventImp.document.head.appendChild(css);
  ventImp.print();
  ventImp.close();
}
export function syncDelay(milliseconds) {
  var start = new Date().getTime();
  var end = 0;
  while ((end - start) < milliseconds) {
    end = new Date().getTime();
  }
}
export function createUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
export function betweenFecha(fecha, fechaInicial, fechaFinal)
{
  return moment(fecha).isBetween(fechaInicial, fechaFinal);
}