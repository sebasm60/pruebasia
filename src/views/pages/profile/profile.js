import React, { Component } from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CFormGroup,
    CLabel,
    CSpinner,
    CBadge,
    CInputCheckbox,
    CListGroup,
    CListGroupItem,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter
} from '@coreui/react'
import swal from 'sweetalert'
import CIcon from '@coreui/icons-react'
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import customSelectStyles from 'src/reusable/customSelectStyles'
import UpdateItem from 'src/reusable/AccionsUpdate'
import DeleteItem from 'src/reusable/AccionsDelete'
import AddItem from 'src/reusable/AccionsPost'
import getListSelect from 'src/reusable/GetList'
import getPermissions from 'src/reusable/GetPermissions'
import { formatDateP, toUPPER } from 'src/reusable/Util'
import { getEstado } from 'src/reusable/Util'
import FloatingLabelInput from 'react-floating-label-input'
import { CustomValueContainer } from 'src/reusable/CustomControl'
import validateRequiredFields from 'src/reusable/RequiredFields'

class profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IdMenu: 'Menu-usuarios',
            id: props.match.params.id,
            listPermissions: [],
            IdUsuario: '',
            Id: '',
            showBtnCreate: false,
            showBtnUpdate: false,
            showLoading: true,
            PasswordOld: '',
            PasswordComfirm: '',
            Password: '',
        };
        this.onInputchange = this.onInputchange.bind(this);
        this.onInputclear = this.onInputclear.bind(this);
        this.onSubmitFormCreateChangePassword = this.onSubmitFormCreateChangePassword.bind(this);
        this.ObtenerMestros = this.ObtenerMestros.bind(this);
    }

    componentDidMount() {
        getPermissions(this.state.IdMenu, 'Ingreso', this.props.history).then(resultPermiss => {
            if (resultPermiss) {
                this.ObtenerMestros();
            } else {
                swal("Advertencia", "Sin Permisos Ingreso", "warning");
            }
        });
    }

    ObtenerMestros() {
        this.setState({
            "Id": this.state.id,
            "showLoading": false
        });
    }

    onInputchange(event) {

        if (event.target.name.includes('ch')) {
            this.setState({
                [event.target.name]: this.state[event.target.name] === true ? false : true
            });
        } else {
            if (event.target.name === "Id") {
                this.setState({
                    [event.target.name]: toUPPER(event.target.value)
                });
                if (event.code === "Tab") {
                    this.onChangeInfo(event.target.value);
                }
            }
            else {
                this.setState({
                    [event.target.name]: toUPPER(event.target.value)
                });
            }
        }
    }

    onInputclear() {
        this.setState({
            IdUsuario: '',
            Id: '',
        });
    }

    onSubmitFormCreateChangePassword() {
        if (this.state.Password !== "") {
            if (this.state.PasswordComfirm !== "") {
                if (this.state.Password === this.state.PasswordComfirm) {
                    const { history } = this.props;
                    const datasend = {
                        oldPasword: this.state.PasswordOld,
                        newPassword1: this.state.Password,
                        newPassword2: this.state.PasswordComfirm
                    }
                    UpdateItem('user/' + this.state.Id, datasend, 'cambio_clave;put', history, '').then(result => {
                        this.onChangeInfo(this.state.Id);
                    });
                }
                else {
                    swal("Advertencia", "Claves no Coinciden", "warning");
                }
            } else {
                swal("Advertencia", "Debe Ingresar las Claves", "warning");
            }
        } else {
            swal("Advertencia", "Debe Ingresar las Claves", "warning");
        }
    }
    render() {
        return (
            <>
                <CRow>
                    <CCol md="4">
                        <div style={{ textAlign: "center", justifyContent: 'center', display: this.state.showLoading ? 'flex' : 'none' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <CSpinner
                                    color="danger"
                                    style={{ width: '5rem', height: '5rem' }}
                                />
                            </div>
                        </div>
                        <CCard style={{ display: this.state.showLoading ? 'none' : 'flex' }}>
                            <CCardHeader><h2>{'Cambio de Clave'}</h2></CCardHeader>
                            <CCardBody>
                                <CRow>
                                    <FloatingLabelInput label="Clave" style={{ paddingLeft: '2%', width: '424px' }} type="Password" value={this.state.Password} onChange={this.onInputchange} id="Password" name="Password" required="True" />
                                </CRow>
                                <CRow inline style={{ paddingTop: '0.9%' }}>
                                    <FloatingLabelInput label="Confirmacion Clave"
                                        style={{ paddingLeft: '2%', width: '424px' }} type="Password" value={this.state.PasswordComfirm} onChange={this.onInputchange} id="PasswordComfirm" name="PasswordComfirm" required="True" />
                                </CRow>
                                <CRow style={{ paddingTop: '0.9%' }}>
                                    <CCol className="text-right">
                                        <CButton color="primary"
                                            className="d-grid gap-2"
                                            onClick={this.onSubmitFormCreateChangePassword}>Cambiar Clave</CButton>
                                    </CCol>
                                </CRow>
                            </CCardBody >
                        </CCard >
                    </CCol >
                </CRow >
            </>
        )
    }
}
export default profile