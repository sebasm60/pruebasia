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
  CForm,
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
import { getPrintEntrega } from 'src/reusable/formatPrint'
import customSelectStyles from 'src/reusable/customSelectStyles'
import { CustomValueContainer } from 'src/reusable/CustomControl'
import Select from 'react-select';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ListUltimasEntregasUsuario: [],
      listSedeEE: [],
      loading: false,
      showReciboModal: false,
      showCambioSedeEE: false,
      bodyReciboModal: getTextHTML(""),
      TpEntregaMvto: [],
      TpEntregaMvto_pendientes: [],
      IdSede: ''
    };

    this.onInputchange = this.onInputchange.bind(this);
    this.onSelectchange = this.onSelectchange.bind(this);
    this.onSubmitServices = this.onSubmitServices.bind(this);
    this.onPrintRecibo = this.onPrintRecibo.bind(this);
    this.onCallEntregasUsuario = this.onCallEntregasUsuario.bind(this);
    this.onCallHistoricoOrden = this.onCallHistoricoOrden.bind(this);
    this.onChangetypeOrder = this.onChangetypeOrder.bind(this);
    this.onChangeSedeEE = this.onChangeSedeEE.bind(this);
    this.closeCambioSedeEE = this.closeCambioSedeEE.bind(this);
    this.ObtenerMestros = this.ObtenerMestros.bind(this);
    this.onSubmitFormCambiarSedeEE = this.onSubmitFormCambiarSedeEE.bind(this);
  }

  componentDidMount() {
    this.ObtenerMestros();
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

  ObtenerMestros() {
    getListSelect('Sedes', '?Inactivo=false&sedeEE=true', this.props.history).then(listdata => {
      let tempArray = [];
      console.log(listdata);
      if (listdata.data != null) {
        listdata.data.forEach(element => {
          tempArray.push({
            label: element.Nombre,
            value: element.IdSede,
            select: false
          });
        });
      }
      this.setState({
        "listSedeEE": tempArray
      });
    });
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
      case "dispensacionManual":
        history.push(`/DespachoManual`);
        break;
    }
  }
  onSubmitFormCambiarSedeEE() {
    console.log(this.state.IdSede)
    localStorage.setItem('SedeID', this.state.IdSede.value);
    localStorage.setItem('SedeUsers', this.state.IdSede.label);
    window.location.reload(false);
  }

  onPrintRecibo(resultado) {
    console.log(resultado);
    let infoRecibo = getPrintEntrega(resultado);
    syncDelay(300);
    console.log(infoRecibo);
    this.setState({
      "bodyReciboModal": infoRecibo
    });
    window.print();
  }

  onCallHistoricoOrden(idTransaccion) {
    getListSelect('Transacciones', '/entrega?id=' + idTransaccion, this.props.history)
      .then(listdata => {
        this.onPrintRecibo(listdata.data);
      });
  }

  onChangetypeOrder() {
    const { history } = this.props;
    const datasend = {
      typeOrder: localStorage.getItem("typeOrder") == 'E' ? 'I' : 'E'
    }
    UpdateItem('order-type', datasend, 'USUARIOS;put', history, '').then(result => {
      //  this.onChangeInfo(this.state.Id);
      console.log(result)
      localStorage.setItem('typeOrder', result.typeOrder);
      window.location.reload(false);
    });
  }

  onSelectchange(selector, event) {
    this.setState({
      [selector]: event
    });
  }

  onChangeSedeEE() {
    this.setState({
      showCambioSedeEE: true,
    });
  }

  closeCambioSedeEE() {
    this.setState({
      showCambioSedeEE: false,
    });
  }

  onCallEntregasUsuario() {
    console.log(localStorage.getItem('user'));
    //getListSelect('Entregas', '?IdUsuario=' + localStorage.getItem('user') + '&sort=%5B%7B%22item%22%3A%20%22NoEntrega%22%2C%22asc%22%3A%20false%7D%5D', this.props.history)
    getListSelect('Transacciones', '/entrega/by/values?amount=100&unit=d&IdUser_Ing=' + localStorage.getItem('user'), this.props.history)
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
            NombrePaciente: element.paciente?.Nombre,
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
                      <h1><small>{localStorage.getItem("usuarioEE") === "false" ? '' : <b>Equipo Estrategico</b>}</small> </h1>
                      <h1><small>{localStorage.getItem("usuarioEE") === "false" ? '' : <CButton size="sm" color="primary" onClick={this.onChangeSedeEE}>Cambiar Sede</CButton>}</small> </h1>
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
                        <CCardBody>
                          <CCardTitle className="text-center">Dispensación</CCardTitle>
                        </CCardBody>
                      </CCard>
                      <CCard onClick={() => this.onSubmitServices("dispensacionManual")} >
                        <CCardBody>
                          <CCardTitle className="text-center">Dispensación Manual</CCardTitle>
                        </CCardBody>
                      </CCard>
                      <CCard className="text-center" onClick={() => this.onSubmitServices("medicamentos")}>
                        <CCardBody>
                          <CCardTitle className="text-center">Catálogo de Medicamentos</CCardTitle>
                        </CCardBody>
                      </CCard>
                      <CCard className="text-center" onClick={() => this.onSubmitServices("pacientes")}>
                        <CCardBody>
                          <CCardTitle className="text-center">Catálogo de Pacientes</CCardTitle>
                        </CCardBody>
                      </CCard>
                      <CCard onClick={() => this.onSubmitServices("SERVICE4")} >
                        {/* <div className="justify-content-center" style={{ paddingTop: "6px" }}>
                          <CImg style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
                            fluid
                            className="mb-2"
                            src="https:infoRecibo += static.wixstatic.com/media/86007f_699ea26c29fe4928b9d10f97e7c6f740~mv2.png/v1/fill/w_52,h_55,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/86007f_699ea26c29fe4928b9d10f97e7c6f740~mv2.png"></CImg>
                        </div> */}
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
            </CModalBody>
            <CModalFooter>
              <CButton color="primary" onClick={this.onPrintRecibo}>Imprimir</CButton>
              <CButton onClick={this.onHideRecibo}>Cerrar</CButton>
            </CModalFooter>
          </CModal>
          <CModal show={this.state.showCambioSedeEE} closeOnBackdrop={false}>
            <CModalHeader>
              <CModalTitle>Seleccionar Sede EE</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow>
                <CCol>
                  <CForm inline style={{ paddingTop: '0.8%' }}>
                    <CFormGroup className="pr-1" >
                      <div style={{ width: '420px' }}>
                        <Select
                          options={this.state.listSedeEE}
                          styles={customSelectStyles}
                          isClearable
                          components={{
                            ValueContainer: CustomValueContainer
                          }}
                          placeholder="Sedes EE"
                          onChange={event => this.onSelectchange("IdSede", event)}
                        ></Select>
                      </div>
                    </CFormGroup>
                  </CForm>
                  <CForm inline style={{ paddingTop: '3%' }}>
                    <CFormGroup className="pr-1" >
                      <CButton
                        style={{ float: "right", width: '424px' }}
                        color="primary"
                        shape="square"
                        visible="false"
                        onClick={() => this.onSubmitFormCambiarSedeEE()}
                        size="sm">Aplicar Cambio de Sede EE
                      </CButton>
                    </CFormGroup>
                  </CForm>
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton onClick={this.closeCambioSedeEE}>Cerrar</CButton>
            </CModalFooter>
          </CModal>
        </div>
        <div id='printSection' dangerouslySetInnerHTML={{ __html: this.state.bodyReciboModal }}></div>

      </>
    )
  }

}
export default Dashboard