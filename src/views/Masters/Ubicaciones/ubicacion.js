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
} from '@coreui/react'
import swal from 'sweetalert'
import CIcon from '@coreui/icons-react'
import UpdateItem from 'src/reusable/AccionsUpdate'
import AddItem from 'src/reusable/AccionsPost'
import DeleteItem from 'src/reusable/AccionsDelete'
import getListSelect from 'src/reusable/GetList'
import getPermissions from 'src/reusable/GetPermissions'
import {formatDateP, toUPPER } from 'src/reusable/Util'

import { getEstado } from 'src/reusable/Util'
import FloatingLabelInput from 'react-floating-label-input'
import validateRequiredFields from 'src/reusable/RequiredFields'


import 'src/scss/style_print.scss';

const camposRequired = [
    { label: 'IdUbicacion' },
    { label: 'Nombre' },
]
class ubicacion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IdMenu: 'Menu-ubicaciones',
            id: props.match.params.id,
            listPermissions: [],
            IdUbicacion: '',
            Nombre: '',
            estado: '',
            showBtnCreate: false,
            showBtnUpdate: false,
            showLoading: true,
        };
        this.onInputchange = this.onInputchange.bind(this);
        this.onSelectchange = this.onSelectchange.bind(this);
        this.onInputclear = this.onInputclear.bind(this);
        this.onSubmitFormUpdate = this.onSubmitFormUpdate.bind(this);
        this.onSubmitFormCreate = this.onSubmitFormCreate.bind(this);
        this.onSubmitFormDelete = this.onSubmitFormDelete.bind(this);
        this.ObtenerMestros = this.ObtenerMestros.bind(this);
        this.onChangeInfo = this.onChangeInfo.bind(this);
        this.onGoNewItem = this.onGoNewItem.bind(this);
        this.onDeleteItem = this.onDeleteItem.bind(this);
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
        if (this.state.id !== '_add') {
            this.setState({
                "IdUbicacion": this.state.id,
                "showLoading": true
            });
            this.onChangeInfo(this.state.id);
        } else {
            this.setState({
                "showLoading": false,
                "showBtnCreate": true,
            });
        }
    }

    onInputchange(event) {
        if (event.target.name === "IdUbicacion") {
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

    onInputclear() {
        this.setState({
            estado: '',
            Nombre: '',
            showBtnCreate: true,
            showBtnUpdate: false
        });
    }

    onSelectchange(selector, event) {
        this.setState({
            [selector]: event
        });
    }

    onChangeInfo(id) {
        this.onInputclear();
        console.log(localStorage.getItem('ActionItem'));
        if (localStorage.getItem('ActionItem') === 'Retiro') {
            this.setState({
                "showLoading": true,
                "showBtnDelete": true,
            });
        }
        getPermissions(this.state.IdMenu, 'Consulta', this.props.history).then(resultPermiss => {
            if (resultPermiss) {
                getListSelect('ubicaciones', '/' + id, this.props.history).then(listdata => {
                    console.log(listdata);
                    this.setState({
                        "showLoading": false,
                        "IdUbicacion": listdata.IdUbicacion,
                        "Nombre": listdata.Nombre,
                        "showBtnUpdate": this.state.showBtnDelete === true ? false : (listdata.Inactivo === true ? false : true),
                        "showBtnCreate": false,
                        "estado": listdata.Inactivo === true ? 'INACTIVO' : 'ACTIVO'
                    });

                    console.log(this.state);

                });
            } else {
                swal("Advertencia", "Sin Permisos CONSULTA", "warning");
            }
        });
    }

    onSubmitFormCreate() {
        getPermissions(this.state.IdMenu, 'Ingreso', this.props.history).then(resultPermiss => {
            if (resultPermiss) {
                this.setState({
                    "showLoading": true
                });
                validateRequiredFields(this.state, camposRequired).then(result => {
                    if (result) {
                        const { history } = this.props;

                        const datasend = {
                            IdUbicacion: this.state.IdUbicacion,
                            Nombre: this.state.Nombre,
                            Inactivo: false,
                            FhCreacion: formatDateP(new Date(), 'yyyy-MM-DD'),
                            IdUser_Ing: localStorage.getItem('LoginUsers'),
                        }
                        AddItem(datasend, 'ubicaciones;post', history, '').then(result => {
                            this.ObtenerMestros();
                        });
                    }
                });
                this.setState({
                    "showLoading": false
                });
            } else {
                swal("Advertencia", "Sin Permisos INGRESO", "warning");
            }
        });
    }

    onSubmitFormUpdate() {
        getPermissions(this.state.IdMenu, 'Edicion', this.props.history).then(resultPermiss => {
            if (resultPermiss) {
                this.setState({
                    "showLoading": true
                });
                validateRequiredFields(this.state, camposRequired).then(result => {
                    if (result) {
                        const { history } = this.props;

                        const datasend = {
                            IdUbicacion: this.state.IdUbicacion,
                            Nombre: this.state.Nombre,
                            Inactivo: false,
                            IdUser_Act: localStorage.getItem('LoginUsers'),
                            Fh_Act: new Date(),
                        }
                        UpdateItem(this.state.IdUbicacion, datasend, 'ubicaciones;put', history, '').then(result => {
                            this.onChangeInfo(this.state.IdUbicacion);
                        });
                    }
                });
                this.setState({
                    "showLoading": false
                });
            } else {
                swal("Advertencia", "Sin Permisos EDICION", "warning");
            }
        });
    }

    onSubmitFormDelete() {
        DeleteItem(this.state.IdUbicacion, 'ubicaciones', this.props.history, '/Maestros/BusquedaUbi');
    }

    onGoNewItem() {
        localStorage.setItem('ActionItem', '');
        this.props.history.push('/Maestros/BusquedaUbi');
    }

    onDeleteItem(id) {
        getPermissions(this.state.IdMenu, 'Retiro', this.props.history).then(resultPermiss => {
            if (resultPermiss) {
                const { history } = this.props;

                const datasend = {
                    Inactivo: true,
                    IdUser_Act: localStorage.getItem('LoginUsers'),
                    FhInactivo: new Date(),
                }
                UpdateItem(this.state.IdUbicacion, datasend, 'ubicaciones;put', history, '').then(result => {
                    this.onChangeInfo(this.state.IdUbicacion);
                });
                this.setState({
                    "showLoading": false
                });
                // DeleteItem(id, 'Paciente', this.props.history);
            } else {
                swal("Advertencia", "Sin Permisos RETIRO", "warning");
            }
        });
    }

    getTitle() {
        if (this.state.id === '_add') {
            return "Agregar UBICACION"
        } else {
            return "Consultar / Modificar / Eliminar UBICACION"
        }
    }


    render() {

        return (
            <>
                <CRow>
                    <CCol md="12">
                        <div style={{ textAlign: "center", justifyContent: 'center', display: this.state.showLoading ? 'flex' : 'none' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <CSpinner
                                    color="danger"
                                    style={{ width: '5rem', height: '5rem' }}
                                />
                            </div>
                        </div>
                        <CCard style={{ display: this.state.showLoading ? 'none' : 'flex' }}>
                            <CCardHeader>
                                {this.getTitle()}
                                {/*  <div className="card-header-actions justify-content-md-end">
                                    <CButton
                                        style={{ float: "right" }}
                                        color="warning"
                                        variant="outline"
                                        shape="square" onClick={this.onGoNewItem}
                                        size="sm">{<CIcon name="cil-plus" alt="plus" />}Nuevo
                                    </CButton>
                                </div> */}
                            </CCardHeader>
                            <CCardBody>
                                <CCol md="12">
                                    <CForm inline>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput id="IdUbicacion" name="IdUbicacion" style={{ paddingLeft: '2%' }} label="Id.Ubicacion" value={this.state.IdUbicacion} onChange={this.onInputchange} onKeyDown={this.onInputchange} required />
                                        </CFormGroup>

                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput value={this.state.Nombre} style={{ paddingLeft: '2%', width: '324px' }} onChange={this.onInputchange} label="Nombre" id="Nombre" name="Nombre" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" style={{marginLeft: 'auto',marginRight: '0'}}  >
                                            <CLabel htmlFor="estado" style={{ width: '70px' }} className="pr-1">Estado</CLabel>
                                            <CBadge color={getEstado(this.state.estado)}>
                                                {(this.state.estado)}
                                            </CBadge>&nbsp;
                                            <CButton
                                                style={{ float: "right", display: this.state.estado === 'ACTIVO' ? 'flex' : 'none' }}
                                                color="danger"
                                                variant="outline"
                                                shape="square"
                                                onClick={() => this.onDeleteItem(this.state.IdUbicacion)}
                                                size="sm">{<CIcon name="cil-x" alt="delete" />}
                                            </CButton>
                                        </CFormGroup>
                                    </CForm>
                                </CCol>
                            </CCardBody>
                            <CCardFooter>
                                <CButton type="submit" size="sm" className="float-left" color="warning" onClick={this.onInputclear}><CIcon name="cil-x" /> Limpiar</CButton>
                                <CButton type="submit" size="sm" className="float-right" color="primary" style={{ display: this.state.showBtnCreate ? 'block' : 'none' }} onClick={this.onSubmitFormCreate}><CIcon name="cil-plus" /> Guardar Información</CButton>
                                  <CButton type="submit" size="sm" className="float-right" color="primary" style={{ display: this.state.showBtnUpdate ? 'block' : 'none' }} onClick={this.onSubmitFormUpdate}><CIcon name="cil-pencil" /> Guardar cambios</CButton>
                                <CButton type="submit" size="sm" className="float-right" color="primary" style={{ display: this.state.showBtnDelete ? 'block' : 'none' }} onClick={this.onSubmitFormDelete}><CIcon name="cil-pencil" /> Eliminar Item</CButton>
                                <CButton className="float-right" color="warning" onClick={this.onGoNewItem} size="sm"><CIcon name="cil-arrow-left" /> Volver </CButton>
                           
                            </CCardFooter>
                        </CCard>
                    </CCol>
                </CRow>
            </>
        )
    }
}
export default ubicacion