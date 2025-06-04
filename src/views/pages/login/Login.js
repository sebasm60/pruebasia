import React, { Component } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CImg,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import _routeApis from 'src/containers/_routeApis'
import swal from 'sweetalert' 

import getOrganizeMessager from 'src/reusable/GetMessager'

const apiUrl = import.meta.env.VITE_API_URL;

function datosObligatorios(list, callback) {
  let permite = true;
  if (list.Username !== '') {
    if (list.Password !== '') {
      permite = true;
    }
    else {
      swal("Error", "La Contraseña es un campo obligatorio", "error");
      permite = false;
    }
  }
  else {
    swal("Error", "El Usuario es un campo obligatorio", "error");
    permite = false;
  }
  callback(permite);
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Username: '',
      Password: ''
    };
    this.onInputchange = this.onInputchange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }
  componentDidMount() {
  }
  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  onSubmitForm() {
    const { history } = this.props;
    const datasend = {
      user: this.state.Username,
      password: this.state.Password,
      ip: '1.0.0.0'
    };

    datosObligatorios(this.state, function (values, results) {
      if (values) {
        _routeApis('Login', '', function (values1, results) {
          let apiName = values1;
          console.log(apiName);
          axios.post(apiUrl + apiName, JSON.stringify(datasend), {
            headers: {
              'content-type': 'application/json'
            }
          })
            .then(res => {
              console.log(res);
              if (res.data.success === true) {
                console.log(res.data);
                let perfiles=''
                 res.data.perfiles.forEach(element => {
                 perfiles=perfiles+element.Nombre+','
                }); 
                localStorage.setItem('LoginToken', res.data.accessToken);
                localStorage.setItem('RefreshToken', res.data.refreshToken);
                localStorage.setItem('LoginUsers', res.data.nombre);
                localStorage.setItem('PerfilUsers', perfiles);
                localStorage.setItem('SedeUsers', res.data.sede.Nombre);
                localStorage.setItem('SedeID', res.data.sede.IdSede);
                localStorage.setItem('BodegaID', res.data.sede.RolesSedes[0].IdBodega);
                localStorage.setItem('RolUsers', res.data.rol.Nombre);
                localStorage.setItem('RolID', res.data.rol.IdRol);
                localStorage.setItem('permissions', JSON.stringify(res.data.menus));
                localStorage.setItem('user', datasend.user);
                localStorage.setItem('Domicilio', res.data.rol.Domicilio);
                localStorage.setItem('Aplicacion', res.data.rol.Aplicacion);
                localStorage.setItem('typeOrder', res.data.typeOrder);
                localStorage.setItem('usuarioEE', res.data.usuarioEE);

                history.push('/dashboard');
              } else {
                getOrganizeMessager(res.response.data, function (values, results) {
                  let mensaje = values;
                  swal("Advertencia", mensaje, "warning");
                });
              }
            })
            .catch(error => {
              getOrganizeMessager(error.response, function (values, results) {
                let mensaje = values;
                if (mensaje === 'Unauthorized') {
                  mensaje = "Sin Autorizacion";
                }
                swal("Error", mensaje, "error");
              });
            });
        });
      }
    });
  }
  render() {
    return (
      <>
        <div className="c-app c-default-layout flex-row align-items-center">
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md="5" sm="12">
                <CCardGroup>
                  <CCard className="p-2">
                    <CCardHeader>
                      <div className='justify-content-center'>
                        <CImg style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                          fluid
                          className="mb-2"
                          src='https://static.wixstatic.com/media/86007f_0b4a795108ad425dabf0bc7ed3c67106~mv2.png/v1/fill/w_192,h_51,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/86007f_0b4a795108ad425dabf0bc7ed3c67106~mv2.png'></CImg>
                      </div>
                    </CCardHeader>
                    <CCardBody>
                      <CForm>
                        <h1 className="text-center">Iniciar sesión</h1>
                        <p className="text-muted text-center">Helpharma</p>
                        <CInputGroup className="mb-3">
                          <CInputGroupPrepend>
                            <CInputGroupText>
                              <CIcon name="cil-user" />
                            </CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput type="text" placeholder="Usuario" onChange={this.onInputchange} name="Username" autoComplete="username" />
                        </CInputGroup>
                        <CInputGroup className="mb-4">
                          <CInputGroupPrepend>
                            <CInputGroupText>
                              <CIcon name="cil-lock-locked" />
                            </CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput type="password" placeholder="Clave" onChange={this.onInputchange} name="Password" autoComplete="current-password" />
                        </CInputGroup>
                        <CRow>
                          <CCol xs="6">
                            <CButton color="primary" className="px-4" onClick={this.onSubmitForm}>Iniciar Sesión</CButton>
                          </CCol>
                          <CCol xs="6" className="text-right">
                            <CButton color="link" className="px-0">Se te olvidó tu contraseña?</CButton>
                          </CCol>
                        </CRow>
                      </CForm>
                    </CCardBody>
                  </CCard>
                </CCardGroup>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      </>
    )
  }
}

export default Login
