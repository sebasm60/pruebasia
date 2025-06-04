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
    CSpinner,
} from '@coreui/react'
import swal from 'sweetalert'

import CIcon from '@coreui/icons-react'
import UpdateItem from 'src/reusable/AccionsUpdate'
import AddItem from 'src/reusable/AccionsPost'
import DeleteItem from 'src/reusable/AccionsDelete'
import getListSelect from 'src/reusable/GetList'
import getPermissions from 'src/reusable/GetPermissions'
import { formatDateP, toUPPER } from 'src/reusable/Util'
import Select from 'react-select';
import customSelectStyles from 'src/reusable/customSelectStyles'
import { CustomValueContainer } from 'src/reusable/CustomControl'

import { getEstado } from 'src/reusable/Util'
import FloatingLabelInput from 'react-floating-label-input'
import validateRequiredFields from 'src/reusable/RequiredFields'


import 'src/scss/style_print.scss';

const camposRequired = [
    { label: 'rolId' },
    { label: 'sedesId' },
    { label: 'IdBodega' },
]
class rolesSedes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IdMenu: 'Menu-rolessede',
            IdSede: props.match.params.idSede,
            IdRol: props.match.params.idRol,
            listPermissions: [],
            listRoles: [],
            listSedes: [],
            rolId: '',
            sedesId: '',
            IdBodega: '',
            estado: '',
            IdConsecutivoENT: '',
            IdConsecutivoFA_ERP: '',
            IdConsecutivoRE_ERP: '',
            IdConsecutivoRE2_ERP: '',
            IdConsecutivoRE3_ERP: '',
            IdConsecutivoRE4_ERP: '',
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
        getListSelect('Roles', '?Inactivo=false', this.props.history).then(listdata => {
            let tempArray = [];
            console.log(listdata);
            listdata.data.forEach(element => {
                tempArray.push({
                    label: element.Nombre,
                    value: element.IdRol,
                    select: false
                });
            });
            this.setState({
                "listRoles": tempArray
            });
            getListSelect('Sedes', '?Inactivo=false', this.props.history).then(listdata => {
                let tempArray = [];
                listdata.data.forEach(element => {
                    tempArray.push({
                        label: element.Nombre,
                        value: element.IdSede,
                        select: false
                    });
                });

                this.setState({
                    "listSedes": tempArray
                });
                if (this.state.IdSede !== '_add') {
                    this.setState({
                        "showLoading": true
                    });

                    this.onChangeInfo(this.state.IdSede, this.state.IdRol);
                } else {
                    this.setState({
                        "showLoading": false,
                        "showBtnCreate": true,
                    });
                }
            });
        });
    }

    onInputchange(event) {
        if (event.target.name === "IdRol") {
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
            rolId: '',
            sedesId: '',
            IdBodega: '',
            estado: '',
            IdConsecutivoENT: '',
            IdConsecutivoFA_ERP: '',
            IdConsecutivoRE_ERP: '',
            IdConsecutivoRE2_ERP: '',
            IdConsecutivoRE3_ERP: '',
            IdConsecutivoRE4_ERP: '',
            showBtnCreate: true,
            showBtnUpdate: false
        });
    }

    onSelectchange(selector, event) {
        this.setState({
            [selector]: event
        });
        console.log(this.state);
        console.log(selector);
        console.log(event);
    }

    onChangeInfo(idSede, idRol) {
        this.onInputclear();
        if (localStorage.getItem('ActionItem') === 'Retiro') {
            this.setState({
                "showLoading": true,
                "showBtnDelete": true,
            });
        }
        console.log(idRol);
        getPermissions(this.state.IdMenu, 'Consulta', this.props.history).then(resultPermiss => {
            if (resultPermiss) {
                getListSelect('RolesSedes', '/sede/' + idSede + '/rol/' + idRol, this.props.history).then(listdata => {
                    if (listdata !== null) {
                        console.log(listdata);
                        this.setState({
                            "showLoading": false,
                            "Nombre": listdata.Nombre,
                            "IdBodega": listdata.IdBodega,
                            "IdConsecutivoENT": listdata.IdConsecutivoENT,
                            "IdConsecutivoFA_ERP": listdata.IdConsecutivoFA_ERP,
                            "IdConsecutivoRE_ERP": listdata.IdConsecutivoRE_ERP,
                            "IdConsecutivoRE2_ERP": listdata.IdConsecutivoRE2_ERP,
                            "IdConsecutivoRE3_ERP": listdata.IdConsecutivoRE3_ERP,
                            "IdConsecutivoRE4_ERP": listdata.IdConsecutivoRE4_ERP,
                            "rolId": this.state.listRoles.find(i => i.value === listdata.IdRol),
                            "sedesId": this.state.listSedes.find(i => i.value === listdata.IdSede),
                            "showBtnUpdate": this.state.showBtnDelete === true ? false : (listdata.Inactivo === true ? false : true),
                            "showBtnCreate": false,
                            "estado": listdata.Inactivo === true ? 'INACTIVO' : 'ACTIVO'
                        });

                        console.log(this.state);
                    }
                    else {
                        swal("Advertencia", "Datos no encontrados", "warning");
                    }
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
                            IdRol: this.state.rolId.value,
                            IdSede: this.state.sedesId.value,
                            "IdBodega": this.state.IdBodega,
                            "IdConsecutivoENT": this.state.IdConsecutivoENT,
                            "IdConsecutivoFA_ERP": this.state.IdConsecutivoFA_ERP,
                            "IdConsecutivoRE_ERP": this.state.IdConsecutivoRE_ERP,
                            "IdConsecutivoRE2_ERP": this.state.IdConsecutivoRE2_ERP,
                            "IdConsecutivoRE3_ERP": this.state.IdConsecutivoRE3_ERP,
                            "IdConsecutivoRE4_ERP": this.state.IdConsecutivoRE4_ERP,
                            Inactivo: false,
                            FhCreacion: formatDateP(new Date(), 'yyyy-MM-DD'),
                            IdUser_Ing: localStorage.getItem('LoginUsers'),
                        }
                        AddItem(datasend, 'RolesSedes;post', history, '').then(result => {
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
                            IdRol: this.state.rolId.value,
                            IdSede: this.state.sedesId.value,
                            "IdBodega": this.state.IdBodega,
                            "IdConsecutivoENT": this.state.IdConsecutivoENT,
                            "IdConsecutivoFA_ERP": this.state.IdConsecutivoFA_ERP,
                            "IdConsecutivoRE_ERP": this.state.IdConsecutivoRE_ERP,
                            "IdConsecutivoRE2_ERP": this.state.IdConsecutivoRE2_ERP,
                            "IdConsecutivoRE3_ERP": this.state.IdConsecutivoRE3_ERP,
                            "IdConsecutivoRE4_ERP": this.state.IdConsecutivoRE4_ERP,
                            Inactivo: false,
                            IdUser_Act: localStorage.getItem('LoginUsers'),
                            Fh_Act: new Date(),
                        }
                        UpdateItem('sede/'+this.state.sedesId.value+'/rol/'+datasend.IdRol, datasend, 'RolesSedes;put', history, '').then(result => {
                            this.onChangeInfo(result.IdRol);
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
        DeleteItem(this.state.IdRol, 'RolesSedes', this.props.history, '/Maestros/BusquedaRolesSedes');
    }

    onGoNewItem() {
        localStorage.setItem('ActionItem', '');
        this.props.history.push('/Maestros/BusquedaRolesSedes');
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
                UpdateItem(this.state.IdRol, datasend, 'RolesSedes;put', history, '').then(result => {
                    this.onChangeInfo(this.state.IdRol);
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
            return "Agregar ROLES SEDES"
        } else {
            return "Consultar / Modificar / Eliminar ROLES SEDES"
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
                                            <div style={{ width: '243px' }} >
                                                <Select
                                                    options={this.state.listRoles}
                                                    styles={customSelectStyles}
                                                    value={this.state.rolId}
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    isClearable
                                                    placeholder="Rol"
                                                    onChange={event => this.onSelectchange("rolId", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '243px' }} >
                                                <Select
                                                    options={this.state.listSedes}
                                                    styles={customSelectStyles}
                                                    value={this.state.sedesId}
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    isClearable
                                                    placeholder="Sede"
                                                    onChange={event => this.onSelectchange("sedesId", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput id="IdBodega" name="IdBodega" style={{ paddingLeft: '2%' }} label="Id.Bodega" value={this.state.IdBodega} onChange={this.onInputchange} onKeyDown={this.onInputchange} required />
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput id="IdConsecutivoENT" name="IdConsecutivoENT" style={{ paddingLeft: '2%', width: '324px' }} label="Id.ConsecutivoENT" value={this.state.IdConsecutivoENT} onChange={this.onInputchange} required />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput id="IdConsecutivoFA_ERP" name="IdConsecutivoFA_ERP" style={{ paddingLeft: '2%', width: '324px' }} label="Id.ConsecutivoFA" value={this.state.IdConsecutivoFA_ERP} onChange={this.onInputchange} required />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput id="IdConsecutivoRE_ERP" name="IdConsecutivoRE_ERP" style={{ paddingLeft: '2%', width: '324px' }} label="Id.ConsecutivoRE" value={this.state.IdConsecutivoRE_ERP} onChange={this.onInputchange} required />
                                        </CFormGroup>

                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput id="IdConsecutivoRE2_ERP" name="IdConsecutivoRE2_ERP" style={{ paddingLeft: '2%', width: '324px' }} label="Id.ConsecutivoRE2" value={this.state.IdConsecutivoRE2_ERP} onChange={this.onInputchange} required />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput id="IdConsecutivoRE3_ERP" name="IdConsecutivoRE3_ERP" style={{ paddingLeft: '2%', width: '324px' }} label="Id.ConsecutivoRE3" value={this.state.IdConsecutivoRE3_ERP} onChange={this.onInputchange} required />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput id="IdConsecutivoRE4_ERP" name="IdConsecutivoRE4_ERP" style={{ paddingLeft: '2%', width: '324px' }} label="Id.ConsecutivoRE4" value={this.state.IdConsecutivoRE4_ERP} onChange={this.onInputchange} required />
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
export default rolesSedes