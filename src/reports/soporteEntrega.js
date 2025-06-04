import jsPDF from "jspdf"
import moment from "moment";
import swal from 'sweetalert';
import JsBarcode from "jsbarcode";
import { truncateText } from "src/helpers/truncateText";
import { formatCurrency } from "src/reusable/Util";

export const generateSoporteEntrega = (data) => {
  const DATE = moment().format('DD MMM YYYY');

  swal({
    title: "Generando documentos...",
    text: "Por favor espere un momento",
    buttons: false,
    closeOnClickOutside: false,
    closeOnEsc: false,
    icon: "info",
  });

  const generatePDF = (entrega, medicamentos, tipo, cabecera) => {
    const prefijoEntrega = entrega?.prefijoEntrega || entrega?.Prefijo + entrega?.NoPendiente;
    const title = tipo === 'entrega' ? `Soporte de Entrega` : `Soporte de Pendiente`;

    const canvas = document.createElement("canvas");
    JsBarcode(canvas, prefijoEntrega, {
      format: "CODE128",
      displayValue: true,
      fontSize: 16,
      height: 50,
    });
    const barcodeImg = canvas.toDataURL("image/png");

    const img = new Image();
    img.src = `${window.location.origin}/img/SoporteEntregaDispensacion.png`;

    img.onload = () => {
      const doc = new jsPDF({ orientation: 'landscape' });
      let posY = 120;

      doc.setFontSize(12);
      doc.addImage(img, "PNG", 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
      doc.addImage(barcodeImg, "PNG", 230, 0, 60, 25);

      doc.setFontSize(16);
      doc.setFontType('bold');
      doc.text(truncateText(doc, title, 70) || '', 160, 15);

      doc.setFontSize(12);
      doc.setFontType('normal');
      doc.text(truncateText(doc, entrega.Convenio?.Nombre, 100) || '', 42, 36);
      doc.text(truncateText(doc, DATE, 30) || '', 170, 36);
      doc.text(truncateText(doc, entrega.Sede?.Nombre, 50) || '', 237, 36);

      doc.text(truncateText(doc, entrega?.TipoEntrega?.Nombre || '', 50) || '', 50, 48);
      doc.text(truncateText(doc, entrega?.TipoPlan, 50) || '', 145, 48);
      doc.text(truncateText(doc, entrega?.Cartera?.Nombre, 50) || '', 237, 48);

      doc.text(truncateText(doc, data?.paciente?.Nombre, 140) || '', 37, 63.4);
      doc.text(data?.paciente?.IdPaciente || '', 222, 63.4);

      doc.text(truncateText(doc, data?.paciente?.Direccion, 140) || '', 37, 75);
      doc.text(truncateText(doc, `${data?.paciente?.Celular ? `${data?.paciente?.Celular} - ` : ''}${data?.paciente?.Telefono}`, 60) || '', 218, 74.5);

      doc.text(truncateText(doc, `${data?.paciente?.Comentario}`, 180) || '', 48, 85.5);

      medicamentos?.forEach((m) => {
        const cantidad = tipo === 'entrega' ? m?.QtyEntrega : m?.QtyPendiente;

        doc.text(truncateText(doc, m?.Orden, 180) || '', 12, posY);

        doc.setFontSize(10);
        doc.text(truncateText(doc, m?.Nombre, 140) || '', 52, posY);

        doc.setFontSize(12);
        doc.text(truncateText(doc, m?.IdLote || '', 180) || '', 196, posY);
        doc.text(truncateText(doc, cantidad, 180) || '', 235, posY);
        doc.text(truncateText(doc, m?.PctajeIVA, 180) || '', 266, posY);
        posY += 5;
      });

      doc.setFontSize(14);

      doc.text(truncateText(doc, cabecera?.ValorCM > 0 ? 'Cuota Moderadora' : '', 180) || '', 238, 167);
      doc.text(truncateText(doc, cabecera?.ValorCM > 0 ? formatCurrency('es-CO', 'COP', 0, cabecera?.ValorCM) : '', 180) || '', 238, 172);

      doc.text(truncateText(doc, cabecera?.ValorDOM > 0 ? 'Flete' : '', 180) || '', 238, 178);
      doc.text(truncateText(doc, cabecera?.ValorDOM > 0 ? formatCurrency('es-CO', 'COP', 0, cabecera?.ValorDOM) : '', 180) || '', 238, 183);

      doc.setFontSize(24);
      doc.text(truncateText(doc, entrega?.IdUsuario, 180) || '', 52, 201);

      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);

      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      };
    };

    img.onerror = () => {
      console.error("Error cargando la imagen:", img.src);
      swal("Error", "No se pudo cargar la imagen de soporte", "error");
    };
  };

  // Recorrer entregas
  data?.valuesEntregas?.forEach((item) => {
    generatePDF(item.entrega, item.mvEntrega, 'entrega', item.entrega);
  });

  // Recorrer pendientes
  data?.valuesPendientes?.forEach((item) => {
    generatePDF(item.pendiente, item.mvPendiente, 'pendiente', item.paciente);
  });

  setTimeout(() => swal.close(), 500);
};
