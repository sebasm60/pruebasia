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
} from '@coreui/react'
import swal from 'sweetalert'
import CIcon from '@coreui/icons-react'
import AsyncSelect from 'react-select/async';
import customSelectStyles from 'src/reusable/customSelectStyles'
import { CustomValueContainer } from 'src/reusable/CustomControl'
import UpdateItem from 'src/reusable/AccionsUpdate'
import AddItem from 'src/reusable/AccionsPost'
import DeleteItem from 'src/reusable/AccionsDelete'
import getListSelect from 'src/reusable/GetList'
import getPermissions from 'src/reusable/GetPermissions'
import { formatDateP, toUPPER } from 'src/reusable/Util'

import { getEstado } from 'src/reusable/Util'
import FloatingLabelInput from 'react-floating-label-input'
import validateRequiredFields from 'src/reusable/RequiredFields'


import 'src/scss/style_print.scss';

const camposRequired = [
    { label: 'IdSede' },
    { label: 'Nombre' },
]
class tiposEntrega extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IdMenu: 'Menu-sedes',
            id: props.match.params.id,
            listPermissions: [],
            listCiudades: [],
            IdSede: '',
            Nombre: '',
            ciudadesId: '',
            estado: '',
            showBtnCreate: false,
            showBtnUpdate: false,
            showLoading: true,
            chSedeEE: false,
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
    onAsyncOptionsSelect(selector, event) {
        if (selector === 'ciudadesId' && event !== null) {
            return new Promise((resolve, reject) => {
                getListSelect('Ciudades', '?page=1&limit=50&search=' + event + '', this.props.history).then(listdata => {
                    let tempArray = [];
                    listdata.data.forEach(element => {
                        tempArray.push({
                            label: element.Nombre,
                            value: element.IdCiudad,
                            select: false
                        });
                    });
                    resolve(tempArray);
                });
            });
        }
    }
    onSelectchange(selector, event) {
        this.setState({
            [selector]: event
        });
    }
    ObtenerMestros() {
        if (this.state.id !== '_add') {
            this.setState({
                "IdSede": this.state.id,
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
        if (event.target.name === "IdSede") {
            this.setState({
                [event.target.name]: toUPPER(event.target.value)
            });
            if (event.code === "Tab") {
                this.onChangeInfo(event.target.value);
            }
        }
        else {
            if (event.target.name.includes('ch')) {
                this.setState({
                    [event.target.name]: this.state[event.target.name] === true ? false : true
                });
            } else {
                this.setState({
                    [event.target.name]: toUPPER(event.target.value)
                });
            }
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
                getListSelect('Sedes', '/' + id, this.props.history).then(listdata => {
                    console.log(listdata);
                    if (listdata.Ciudad != undefined) {
                        let tempArray = [];
                        tempArray.push({
                            label: listdata.Ciudad.Nombre,
                            value: listdata.Ciudad.IdCiudad,
                        });
                        this.setState({
                            "listCiudades": tempArray,
                        });
                    }

                    this.setState({
                        "showLoading": false,
                        "IdSede": listdata.IdSede,
                        "Nombre": listdata.Nombre,
                        "chSedeEE": listdata.sedeEE,
                        "showBtnUpdate": this.state.showBtnDelete === true ? false : (listdata.Inactivo === true ? false : true),
                        "showBtnCreate": false,
                        "ciudadesId": this.state.listCiudades.find(i => i.value === listdata.IdCiudad),
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
                            IdSede: this.state.IdSede,
                            Nombre: this.state.Nombre,
                            Inactivo: false,
                            sedeEE: this.state.chSedeEE,
                            FhCreacion: formatDateP(new Date(), 'yyyy-MM-DD'),
                            IdUser_Ing: localStorage.getItem('LoginUsers'),
                        }
                        AddItem(datasend, 'Sedes;post', history, '').then(result => {
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
                            IdSede: this.state.IdSede,
                            Nombre: this.state.Nombre,
                            Inactivo: false,
                            sedeEE: this.state.chSedeEE,
                            IdCiudad:this.state.ciudadesId.value,
                            IdUser_Act: localStorage.getItem('LoginUsers'),
                            Fh_Act: new Date(),
                        }
                        UpdateItem(this.state.IdSede, datasend, 'Sedes;put', history, '').then(result => {
                            this.onChangeInfo(this.state.IdSede);
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
        DeleteItem(this.state.IdSede, 'Sedes', this.props.history, '/Maestros/BusquedaSedes');
    }

    onGoNewItem() {
        localStorage.setItem('ActionItem', '');
        this.props.history.push('/Maestros/BusquedaSedes');
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
                UpdateItem(this.state.IdSede, datasend, 'Sedes;put', history, '').then(result => {
                    this.onChangeInfo(this.state.IdSede);
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
            return "Agregar SEDES"
        } else {
            return "Consultar / Modificar / Eliminar SEDES"
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
                                            <FloatingLabelInput id="IdSede" name="IdSede" style={{ paddingLeft: '2%' }} label="Id.Sede" value={this.state.IdSede} onChange={this.onInputchange} onKeyDown={this.onInputchange} required />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput value={this.state.Nombre} style={{ paddingLeft: '2%', width: '324px' }} onChange={this.onInputchange} label="Nombre" id="Nombre" name="Nombre" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '324px' }} >
                                                <AsyncSelect
                                                    options={this.state.listCiudades}
                                                    styles={customSelectStyles}
                                                    value={this.state.ciudadesId}
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    isClearable
                                                    placeholder="Ciudad"
                                                    loadOptions={event => this.onAsyncOptionsSelect("ciudadesId", event)}
                                                    onChange={event => this.onSelectchange("ciudadesId", event)}
                                                ></AsyncSelect>
                                            </div>
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" style={{ marginLeft: 'auto', marginRight: '0' }}  >
                                            <CLabel htmlFor="estado" style={{ width: '70px' }} className="pr-1">Estado</CLabel>
                                            <CBadge color={getEstado(this.state.estado)}>
                                                {(this.state.estado)}
                                            </CBadge>&nbsp;
                                            <CButton
                                                style={{ float: "right", display: this.state.estado === 'ACTIVO' ? 'flex' : 'none' }}
                                                color="danger"
                                                variant="outline"
                                                shape="square"
                                                onClick={() => this.onDeleteItem(this.state.IdSede)}
                                                size="sm">{<CIcon name="cil-x" alt="delete" />}
                                            </CButton>
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <CInputCheckbox id="chSedeEE" name="chSedeEE" checked={this.state.chSedeEE} onChange={this.onInputchange} /> SedeEE
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
export default tiposEntrega