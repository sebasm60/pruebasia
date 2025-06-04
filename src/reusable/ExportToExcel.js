import React from 'react'
import { CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { ExportToCsv } from "export-to-csv";
import swal from 'sweetalert'
import getOrganizeMessager from 'src/reusable/GetMessager'


export const ExportToExcel = ({ apiData, fileName, title }) => {

  const exportToCSV = (apiData, fileName, title) => {
    console.log(apiData)

    if (apiData.length > 0) {

      const options = {
        filename: fileName,
        fieldSeparator: ";",
        quoteStrings: '"',
        decimalSeparator: ",",
        showLabels: true,
        showTitle: true,
        title: title,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true
        // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
      };

      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(apiData);

    }
  };

  return (
    <CButton type="submit" size="sm" color="success" onClick={(e) => exportToCSV(apiData, fileName, title)}><CIcon name="cil-cloud-download" /> Descargar</CButton>
  );
};