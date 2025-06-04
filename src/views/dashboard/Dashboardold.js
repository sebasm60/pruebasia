import React, { Component } from "react"
import {
  CButton,
  CCard,
  CCardBody,
  CListGroup,
  CListGroupItem,
  CImg,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
  CCardGroup,
  CInputGroup,
  CFormGroup,
  CInputGroupAppend,
  CInput,
  CModalTitle,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CBadge,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import swal from "sweetalert"
import "src/scss/style_print.scss";
import { getTextHTML } from "src/views/Despacho/DocPdf"
import {
  formatDateP, toUPPER, formatCurrency,
  syncDelay,
} from 'src/reusable/Util'
import getListSelect from 'src/reusable/GetList'
import UpdateItem from 'src/reusable/AccionsUpdate'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ListUltimasEntregasUsuario: [],
      loading: false,
      showReciboModal: false,
      bodyReciboModal: getTextHTML(""),
      TpEntregaMvto: [],
      TpEntregaMvto_pendientes: [],
    };

    this.onInputchange = this.onInputchange.bind(this);
    this.onSubmitServices = this.onSubmitServices.bind(this);
    this.onPrintRecibo = this.onPrintRecibo.bind(this);
    this.onCallEntregasUsuario = this.onCallEntregasUsuario.bind(this);
    this.onCallHistoricoOrden = this.onCallHistoricoOrden.bind(this);
    this.onChangetypeOrder = this.onChangetypeOrder.bind(this);
  }

  componentDidMount() {
    this.onCallEntregasUsuario();
  }

  componentWillUnmount() {
  }

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value.toUpperCase()
    });

    if (event.target.name === "Placa") {

      let data = this.state.dataVoucher;
      data.forEach(element => {
        if (element.description.includes("Placa")) {
          element.value = event.target.value.toUpperCase();
        }
      });

      this.onUpdateVoucher();
    }
    if (event.target.name === "NumRecibo" && event.target.value === "") {
      this.startInterval();
    }
  }

  onSubmitServices(menu) {
    const { history } = this.props;
    switch (menu) {
      default:
        swal("Advertencia", "Filtro de Menu no Encontrado", "warning");
        break;
      case "dispensacion":
        history.push(`/Despacho`);
        break;
      case "pacientes":
        history.push(`/Maestros/BusquedaPas`);
        break;
      case "medicamentos":
        history.push(`/Maestros/BusquedaMed`);
        break;
      case "SERVICE4":
        this.onPrintRecibo();
        break;
    }
  }

  onPrintRecibo(resultado) {
    console.log(resultado);
    if (resultado.valuesEntregas.length > 0) {
      resultado.valuesEntregas.forEach(element => {
        this.setState({
          pdf_nroEntrega: element.entrega.Prefijo + ' ' + element.entrega.NoEntrega,
          pdf_convenio: element.entrega.IdConvenio, //this.state.conveniosId.label,
          pdf_fecha: formatDateP(element.entrega.Fecha, 'D MMM YYYY'),
          pdf_nombrePaciente: resultado.paciente.Nombre,
          pdf_tpEntrega: '',//this.state.tipoEntregaId.label,
          pdf_nitPaciente: element.entrega.IdPaciente,
          pdf_observaciones: '',//this.state.comentario,
          pdf_Elaborado: localStorage.getItem('LoginUsers'),
          pdf_Reclamante: element.entrega.Reclamante,
          pdf_idReclamante: element.entrega.IdReclamante,
          pdf_Telefono: resultado.paciente.Telefono,
          pdf_Celular: resultado.paciente.Celular,
          pdf_Barrio: resultado.paciente.Barrio,
          pdf_Direccion: resultado.paciente.Direccion,
          pdf_FhEntrega: formatDateP(element.entrega.Fh_Entrega, 'D MMM YYYY'),
          pdf_TD: element.entrega.Completo ? 'FA' : 'RE',
          pdf_Pagado: element.entrega.Pagado,
          pdf_PagadoCM: element.entrega.ValorCM,
          pdf_Bodega: element.entrega.IdBodega,
          pdf_convenio_interpolaridad: this.state.ccInterpolaridad,
          pdf_CARTERA: element.entrega.IdCartera,
          pdf_PLAN: "POS",
          TpEntregaMvto: element.mvEntrega ? element.mvEntrega : (element.mvEntregas ? element.mvEntregas : null),
          pdf_title: element.entrega.Completo ? 'SOPORTE ENTREGA' : 'REMISIÓN',
        });
        console.log(element);
      });
    }
    syncDelay(300)
    window.print();
  }

  onCallHistoricoOrden(idTransaccion) {
    getListSelect('Transacciones', '/entrega/' + idTransaccion, this.props.history)
      .then(listdata => {
        this.onPrintRecibo(listdata);
      });
  }

  onChangetypeOrder() {
    const { history } = this.props;
    const datasend = {
      typeOrder: localStorage.getItem("typeOrder") == 'E' ? 'I' : 'E'
    }
    UpdateItem('order-type', datasend, 'USUARIOS;put', history, '').then(result => {
      // this.onChangeInfo(this.state.Id);
      console.log(result)
      localStorage.setItem('typeOrder', result.typeOrder);
      window.location.reload(false);
    });
  }

  onCallEntregasUsuario() {
    console.log(localStorage.getItem('user'));
    getListSelect('Entregas', '?IdUsuario=' + localStorage.getItem('user') + '&sort=%5B%7B%22item%22%3A%20%22NoEntrega%22%2C%22asc%22%3A%20false%7D%5D', this.props.history)
      .then(listdata => {
        console.log(listdata)
        let tempArray = [];
        listdata.data.forEach(element => {
          tempArray.push({
            Id: element.IdTransaccion,
            IdBodega: element.IdBodega,
            IdConsecutivo: element.IdConsecutivo,
            IdPaciente: element.IdPaciente,
            IdReclamante: element.IdReclamante,
            IdTipoId: element.IdTipoId,
            NoEntrega: element.NoEntrega,
            Pagado: element.Pagado,
            Prefijo: element.Prefijo,
            Fecha: element.Fecha,
            Fh_Entrega: element.Fh_Entrega,
            NombrePaciente: element.Paciente.Nombre,
          });
        });
        tempArray = tempArray.sort((a, b) => b.NoEntrega - a.NoEntrega)
        this.setState({
          'ListUltimasEntregasUsuario': tempArray,
        });
      });
  }

  render() {
    return (
      <>
        {/* <MainChartExample style={{height: "300px", marginTop: "40px"}}/> */}
        <div id="noPrintSection" >
          <CCard> <CCardBody>
            <CRow>
              <CCol sm={7}>
                <CCard style={{ border: "0" }}>
                  <CCardBody>
                    <CCardTitle>
                      <h2 style={{ color: "#ff0000" }}>Servicio Dispensacion Helpharma</h2></CCardTitle>
                    <CCardText>
                      <h1>Hola, <b>{localStorage.getItem("LoginUsers")}</b>,<br></br><small>Has ingresado a la sede: <b>{localStorage.getItem("SedeUsers")}</b>,</small> </h1>
                      {/* <h1><small>Bajo el perfil: <b>{localStorage.getItem("PerfilUsers")}</b></small></h1> */}
                      <h1><small>Rol: <b>{localStorage.getItem("RolUsers")}</b></small></h1>
                      <h1><small>{localStorage.getItem("Domicilio") === "false" ? '' : localStorage.getItem("typeOrder") == 'E' ? 'EXCLUSIVOS' : 'INTEGRADOS'} {localStorage.getItem("Domicilio") === "true" ? <CButton size="sm" color="primary" onClick={this.onChangetypeOrder}>Cambiar</CButton> : ''}</small> </h1>
                      <br></br>
                      un espacio útil donde podrás encontrar información relevante sobre nuestros servicios
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol sm={5}>
                <CCard>
                  <CCardBody style={{ maxHeight: '400px', overflow: 'scroll' }}>
                    <CCardTitle>Ultimas Ordenes Entregadas {localStorage.getItem('LoginUsers') !== null ? toUPPER(localStorage.getItem('LoginUsers')) : ''}</CCardTitle>
                    <CListGroup>
                      <CListGroup>
                        {this.state.ListUltimasEntregasUsuario.map(elemento => (
                          <CListGroupItem className='d-flex justify-content-between align-items-center'>
                            {"Nro.Entrega: " + elemento.NoEntrega} <br></br>
                            {"Fh.Entrega " + formatDateP(elemento.Fh_Entrega, 'D MMM YYYY')}<br></br>
                            {" " + elemento.NombrePaciente}<br></br>
                            <small>{elemento.IdTipoId + "-" + elemento.IdPaciente}<br></br>{" Pagado" + formatCurrency('en-US', 'USD', 0, elemento.Pagado)}</small>
                            <CBadge color='primary' shape='pill'>
                              <CIcon name='cilArrowRight'
                                alt='cilArrowRight'
                                onClick={() => this.onCallHistoricoOrden(elemento.Id)} />
                            </CBadge>
                          </CListGroupItem>
                        ))}
                      </CListGroup>
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm={12}>
                <CCard style={{ border: "0" }}>
                  <CCardBody>
                    <CCardTitle>Los servicios más utilizados</CCardTitle>
                    <CCardGroup>
                      <CCard onClick={() => this.onSubmitServices("dispensacion")} >
                        <div className="justify-content-center" style={{ paddingTop: "6px" }}>
                          <CImg style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
                            fluid
                            className="mb-2"
                            src="https://static.wixstatic.com/media/86007f_699ea26c29fe4928b9d10f97e7c6f740~mv2.png/v1/fill/w_52,h_55,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/86007f_699ea26c29fe4928b9d10f97e7c6f740~mv2.png"></CImg>
                        </div>
                        <CCardBody>
                          <CCardTitle className="text-center">Dispensacion</CCardTitle>
                        </CCardBody>
                      </CCard>
                      <CCard className="text-center" onClick={() => this.onSubmitServices("medicamentos")}>
                        <div className="justify-content-center" style={{ paddingTop: "6px" }}>
                          <CImg style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
                            fluid
                            className="mb-2"
                            src="https://static.wixstatic.com/media/86007f_699ea26c29fe4928b9d10f97e7c6f740~mv2.png/v1/fill/w_52,h_55,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/86007f_699ea26c29fe4928b9d10f97e7c6f740~mv2.png"></CImg>
                        </div>
                        <CCardBody>
                          <CCardTitle className="text-center">Catálogo de Medicamentos</CCardTitle>
                        </CCardBody>
                      </CCard>
                      <CCard className="text-center" onClick={() => this.onSubmitServices("pacientes")}>
                        <div className="justify-content-center" style={{ paddingTop: "6px" }}>
                          <CImg style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
                            fluid
                            className="mb-2"
                            src="https://static.wixstatic.com/media/86007f_699ea26c29fe4928b9d10f97e7c6f740~mv2.png/v1/fill/w_52,h_55,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/86007f_699ea26c29fe4928b9d10f97e7c6f740~mv2.png"></CImg>
                        </div>
                        <CCardBody>
                          <CCardTitle className="text-center">Catálogo de Pacientes</CCardTitle>
                        </CCardBody>
                      </CCard>
                      <CCard onClick={() => this.onSubmitServices("SERVICE4")} >
                        <div className="justify-content-center" style={{ paddingTop: "6px" }}>
                          <CImg style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
                            fluid
                            className="mb-2"
                            src="https://static.wixstatic.com/media/86007f_699ea26c29fe4928b9d10f97e7c6f740~mv2.png/v1/fill/w_52,h_55,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/86007f_699ea26c29fe4928b9d10f97e7c6f740~mv2.png"></CImg>
                        </div>
                        <CCardBody>
                          <CCardTitle className="text-center">Servicio 4</CCardTitle>
                        </CCardBody>
                      </CCard>
                    </CCardGroup>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm={12}>
                {/* <CCarousel animate={true}>
            <CCarouselIndicators/>
            <CCarouselInner>
              <CCarouselItem>
                <img className="d-block w-100" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1607923e7e2%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1607923e7e2%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.9296875%22%20y%3D%22217.75625%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="slide 1"/>
                <CCarouselCaption><h3>Slide 1</h3><p>Slide 1</p></CCarouselCaption>
              </CCarouselItem>
              <CCarouselItem>
                <img className="d-block w-100" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1607923e7e2%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1607923e7e2%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.9296875%22%20y%3D%22217.75625%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="slide 2"/>
                <CCarouselCaption><h3>Slide 2</h3><p>Slide 2</p></CCarouselCaption>
              </CCarouselItem>
            </CCarouselInner>
            <CCarouselControl direction="prev"/>
            <CCarouselControl direction="next"/>
          </CCarousel> */}
              </CCol>
            </CRow>
          </CCardBody></CCard >

          <CModal show={this.state.showReciboModal} closeOnBackdrop={false}>
            <CModalHeader>
              <CModalTitle>Recibo N.{this.state.NumRecibo} </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CCol sm="6" lg="6">
                <CFormGroup row>
                  <CCol md="12" id="col-Placa" style={{ display: this.state.VisibleColPlaca ? "none" : "block" }}>
                    <label htmlFor="nf-Placa">Placa</label>
                    <CInputGroup>
                      <CInput type="text" value={this.state.Placa} length="20" onChange={this.onInputchange} id="nf-Placa" name="Placa" placeholder="Ingrese PLACA.." />
                      <CInputGroupAppend>
                        <CButton type="button" onClick={() => this.onUpdateVoucher()} color="primary">Aplicar</CButton>
                      </CInputGroupAppend>
                    </CInputGroup>
                  </CCol>
                </CFormGroup>
              </CCol>
              <div id="printSection" dangerouslySetInnerHTML={{ __html: this.state.bodyReciboModal }}></div>
            </CModalBody>
            <CModalFooter>
              <CButton color="primary" onClick={this.onPrintRecibo}>Imprimir</CButton>
              <CButton onClick={this.onHideRecibo}>Cerrar</CButton>
            </CModalFooter>
          </CModal>
        </div>
        <div id='printSection' >
          <style>
            {`@media print {.contacts{display: none;}}`}
          </style>
          <div id='entregas'>
            <table width={'100%'}>
              <tbody>
                <tr>
                  <td colspan='2'>
                    <img class='c-sidebar-brand-full' src='https://static.wixstatic.com/media/86007f_0b4a795108ad425dabf0bc7ed3c67106~mv2.png/v1/fill/w_192,h_51,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/86007f_0b4a795108ad425dabf0bc7ed3c67106~mv2.png' height='50' alt='logo-negative' /></td>
                  <td colspan='2' width='350px'>
                    900277244-4<br></br>
                    Sede Principal: Carrera 43a N.34–95 Local 298<br></br>
                    Tel: (4)3220689<br></br>
                    <table width='100%'><tr>
                      <td>www.helpharma.com</td>
                      <td align='right'>
                        <div style={{ fontWeight: 'bold', marginRight: '30px' }}>{this.state.pdf_title} </div>
                      </td>
                    </tr></table>
                    <table width='100%'><tr>
                      <td>Medellin-Colombia</td>
                      <td align='right'>
                        <div style={{ fontWeight: 'bold', marginRight: '30px' }}>No. <p>{this.state.pdf_nroEntrega}</p></div>
                      </td>
                    </tr></table>
                  </td>
                  <td colspan='2'>
                    <img class='c-sidebar-brand-full' src='https://www.latiendadelasbarras.com/wp-content/uploads/2019/07/codigo-39-barras.jpg' height='50' alt='logo-negative' />
                  </td>
                </tr>
              </tbody>
            </table>
            <br></br>
            <table border={'1px solid black;'} width={'100%'}>
              <tr>
                <th rowspan='2' style={{ width: '400px' }}>SEÑORES:<br></br><p>{this.state.pdf_convenio}</p>
                  <br></br>Telefono:
                  <br></br>Ciudad:
                </th>
                <td>
                  <table width='100%' ><tr>
                    <td><b>FECHA:</b> {this.state.pdf_fecha}</td>
                    <td><b>BODEGA:</b> {this.state.pdf_Bodega}</td>
                  </tr></table>
                </td>
              </tr>
              <tr>
                <td><b>PACIENTE:</b> {this.state.pdf_nombrePaciente}</td>
              </tr>
              <tr>
                <td>
                  <b>TIPO DE VENTA</b><br></br> {this.state.pdf_tpEntrega}</td>
                <td>
                  <table width='100%' ><tr>
                    <td><b>CEDULA O NIT</b><br></br>{this.state.pdf_nitPaciente}</td>
                    <td><b>TIPO DCTO</b><br></br>{this.state.pdf_TD}</td>
                    <td><b>TIPO PLAN</b><br></br>{this.state.pdf_PLAN}</td>
                    <td><b>TIPO CARTERA</b><br></br>{this.state.pdf_CARTERA}</td>
                  </tr></table>
                </td>
              </tr>
              <tr >
                <td colspan='2'>
                  <table width='100%'>
                    <tr><td><b>DIRECCION:</b>{this.state.pdf_Direccion}</td></tr>
                    <tr><td><b>BARRIO:</b>{this.state.pdf_Barrio}</td><td><b></b></td><td><b></b></td></tr>
                    <tr><td><b>TELEFONO:</b>{this.state.pdf_Telefono}</td><td><b>CELULAR:</b>{this.state.pdf_Celular}</td></tr>
                    <tr><td colspan='3' height={'50'}><b>OBSERVACIONES:</b>{this.state.pdf_observaciones}</td></tr>
                  </table></td>
              </tr>
            </table>
            <br></br>
            <table border={'1px solid black;'} width={'100%'}>
              <tr>
                <th>Orden</th>
                <th>Descripcion</th>
                <th>Cantidad</th>
                <th>Vr. Unitario</th>
                <th>Total</th>
              </tr>
              <tbody>
                {this.state.TpEntregaMvto.map(elemento => (
                  <tr>
                    <td>{elemento.Orden}</td>
                    <td>{elemento.Nombre}</td>
                    <td>{elemento.QtyEntrega}</td>
                    <td>{this.state.pdf_convenio_interpolaridad === true ? '' : formatCurrency('en-US', 'USD', 0, elemento.Valor)}</td>
                    <td>{this.state.pdf_convenio_interpolaridad === true ? '' : formatCurrency('en-US', 'USD', 0, (elemento.Valor * elemento.QtyEntrega))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td>Cuota moderadora</td>
                  <td></td>
                  <td>{formatCurrency('en-US', 'USD', 0, this.state.pdf_PagadoCM)}</td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>Valor a Pagado</td>
                  <td></td>
                  <td>{formatCurrency('en-US', 'USD', 0, this.state.pdf_Pagado)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
            <br></br>
            <table width={'100%'}>
              <tr>
                <td>___{this.state.pdf_Elaborado}___</td>
                <td>_______________________________________________________</td>
                <td>________________________________</td>
              </tr>
              <tr>
                <td>Elaborado Por</td>
                <td>Nombre Quien Recibe</td>
                <td>Identificacion Quien Recibe</td>
              </tr>
            </table>
          </div>
          <br></br>
          <br></br>
          <br></br>
          <div id='pendientes' style={{ display: this.state.pdf_tiene_pendientes }}>
            <table width={'100%'}>
              <tbody>
                <tr>
                  <td colspan='2'>
                    <img class='c-sidebar-brand-full' src='https://static.wixstatic.com/media/86007f_0b4a795108ad425dabf0bc7ed3c67106~mv2.png/v1/fill/w_192,h_51,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/86007f_0b4a795108ad425dabf0bc7ed3c67106~mv2.png' height='50' alt='logo-negative' /></td>
                  <td colspan='2' width='350px'>
                    900277244-4<br></br>
                    Sede Principal: Carrera 43a N.34–95 Local 298<br></br>
                    Tel: (4)3220689<br></br>
                    <table width='100%'><tr>
                      <td>www.helpharma.com</td>
                      <td align='right'>
                        <div style={{ fontWeight: 'bold', marginRight: '30px' }}> {this.state.pdf_title_pendientes} </div>
                      </td>
                    </tr></table>
                    <table width='100%'><tr>
                      <td>Medellin-Colombia</td>
                      <td align='right'>
                        <div style={{ fontWeight: 'bold', marginRight: '30px' }}>No. <p>{this.state.pdf_nroEntrega_pendientes}</p></div>
                      </td>
                    </tr></table>
                  </td>
                  <td colspan='2'>
                    <img class='c-sidebar-brand-full' src='https://www.latiendadelasbarras.com/wp-content/uploads/2019/07/codigo-39-barras.jpg' height='50' alt='logo-negative' />
                  </td>
                </tr>
              </tbody>
            </table>
            <br></br>
            <table border={'1px solid black;'} width={'100%'}>
              <tr>
                <th rowspan='2' style={{ width: '260px' }}>SEÑORES:<br></br><p>{this.state.pdf_convenio_pendientes}</p>
                  <br></br>Telefono:
                  <br></br>Ciudad:
                </th>
                <td>
                  <table width='100%' ><tr>
                    <td><b>FECHA:</b> {this.state.pdf_fecha}</td>
                    <td><b>BODEGA:</b> {this.state.pdf_Bodega}</td>
                  </tr></table>
                </td>
              </tr>
              <tr>
                <td><b>PACIENTE:</b> {this.state.pdf_nombrePaciente}</td>
              </tr>
              <tr>
                <td>
                  <b>TIPO DE VENTA</b><br></br> {this.state.pdf_tpEntrega_pendientes}</td>
                <td>
                  <table width='100%' ><tr>
                    <td><b>CEDULA O NIT</b><br></br>{this.state.pdf_nitPaciente}</td>
                    <td><b>TIPO DCTO</b><br></br>{this.state.pdf_TD_pendientes}</td>
                    <td><b>TIPO PLAN</b><br></br>{this.state.pdf_PLAN}</td>
                    <td><b>TIPO CARTERA</b><br></br>{this.state.pdf_CARTERA}</td>
                  </tr></table>
                </td>
              </tr>
              <tr >
                <td colspan='2'>
                  <table width='100%'>
                    <tr><td><b>DIRECCION:</b>{this.state.pdf_Direccion}</td></tr>
                    <tr><td><b>BARRIO:</b>{this.state.pdf_Barrio}</td><td><b></b></td><td><b></b></td></tr>
                    <tr><td><b>TELEFONO:</b>{this.state.pdf_Telefono}</td><td><b>CELULAR:</b>{this.state.pdf_Celular}</td></tr>
                    <tr><td colspan='3' height={'50'}><b>OBSERVACIONES:</b>{this.state.pdf_observaciones}</td></tr>
                  </table></td>
              </tr>
            </table>
            <br></br>
            <table border={'1px solid black;'} width={'100%'}>
              <tr>
                <th>Orden</th>
                <th>Descripcion</th>
                <th>Cantidad</th>
                <th>Vr. Unitario</th>
                <th>Total</th>
              </tr>
              <tbody>
                {this.state.TpEntregaMvto_pendientes.map(elemento => (
                  <tr>
                    <td>{elemento.Orden}</td>
                    <td>{elemento.Nombre}</td>
                    <td>{elemento.QtyPendiente}</td>
                    <td>{this.state.pdf_convenio_interpolaridad === true ? '' : formatCurrency('en-US', 'USD', 0, elemento.Valor)}</td>
                    <td>{this.state.pdf_convenio_interpolaridad === true ? '' : formatCurrency('en-US', 'USD', 0, (elemento.Valor * elemento.QtyPendiente))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td>Cuota moderadora</td>
                  <td></td>
                  <td>{formatCurrency('en-US', 'USD', 0, this.state.pdf_PagadoCM_pendientes)}</td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>Valor a Pagado</td>
                  <td></td>
                  <td>{formatCurrency('en-US', 'USD', 0, this.state.pdf_Pagado_pendientes)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
            <br></br>
            <table width={'100%'}>
              <tr>
                <td>___{this.state.pdf_Elaborado}___</td>
                <td>_______________________________________________________</td>
                <td>________________________________</td>
              </tr>
              <tr>
                <td>Elaborado Por</td>
                <td>Nombre Quien Recibe</td>
                <td>Identificacion Quien Recibe</td>
              </tr>
            </table>
          </div>
        </div>

      </>
    )
  }

}
export default Dashboard