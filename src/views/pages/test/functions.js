import jsPDF from 'jspdf';
import { renderToString } from "react-dom/server";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};
const colstyle = {
  width: "30%"
};
const tableStyle = {
  width: "100%"
};


const Prints = () => (
  <div>
    <h3>Time & Materials Statement of Work (SOW)</h3>
    <h4>General Information</h4>
    <img class='c-sidebar-brand-full' src='https://static.wixstatic.com/media/86007f_0b4a795108ad425dabf0bc7ed3c67106~mv2.png/v1/fill/w_192,h_51,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/86007f_0b4a795108ad425dabf0bc7ed3c67106~mv2.png' height='50' alt='logo-negative' />
    <table id="tab_customers" class="table table-striped" style={tableStyle}>
      <colgroup>
        <col span="1" style={colstyle} />
        <col span="1" style={colstyle} />
      </colgroup>
      <thead>
        <tr class="warning">
          <th>SOW Creation Date</th>
          <th>SOW Start Date</th>
          <th>Project</th>
          <th>Last Updated</th>
          <th>SOW End Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Dec 13, 2017</td>
          <td>Jan 1, 2018</td>
          <td>NM Connect - NMETNMCM</td>
          <td>Dec 13, 2017</td>
          <td>Dec 31, 2018</td>
        </tr>
      </tbody>
    </table>
    <p>
      This is a Time and Materials Statement of Work between Northwestern Mutual
      Life Insurance Company and Infosys with all general terms and conditions
      as described in the current Master Agreement and its related documents
    </p>
  </div>
);

export function getTextHTML() {
  const string = renderToString(<Prints />);
  var doc = new jsPDF("p", "mm", "a2")
  doc.fromHTML(string)
  doc.save("name.pdf")

  const pdfDataUri = doc.output('datauristring');
  const newTab = window.open();
  newTab?.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);

}