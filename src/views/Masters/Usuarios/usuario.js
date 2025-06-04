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

import 'src/scss/style_print.scss';

const camposRequired = [
    { label: 'IdUsuario' },
    { label: 'Nombre' },
    { label: 'Email' },
    { label: 'ciudadesId' },
    { label: 'rolId' },
    { label: 'Telefono' },
    { label: 'sedeId' },
    { label: 'typeOrdersId' },
]
class usuario extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IdMenu: 'Menu-usuarios',
            id: props.match.params.id,
            listPermissions: [],
            listCiudades: [],
            listSedes: [],
            listRoles: [],
            listPerfiles: [],
            listTypeOrders: [],
            IdUsuario: '',
            Id: '',
            Nombre: '',
            estado: '',
            Email: '',
            Telefono: '',
            ciudadesId: '',
            sedeId: '',
            rolId: '',
            typeOrdersId: '',
            chMultisede: false,
            showBtnCreate: false,
            showBtnUpdate: false,
            showLoading: true,
            showChangePassword: false,
            PasswordOld: '',
            PasswordComfirm: '',
            Password: '',
            chUsuarioEE: false,
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
        this.onOpenChangePassword = this.onOpenChangePassword.bind(this);
        this.onCloseChangePassword = this.onCloseChangePassword.bind(this);
        this.onSubmitFormCreateChangePassword = this.onSubmitFormCreateChangePassword.bind(this);
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

    ObtenerMestros() {
        getListSelect('Sedes', '?Inactivo=false', this.props.history).then(listdata => {
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
                "listSedes": tempArray
            });

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

                getListSelect('Perfiles', '?Inactivo=false', this.props.history).then(listdata => {
                    let tempArray = [];
                    listdata.data.forEach(element => {
                        tempArray.push({
                            label: element.Nombre,
                            value: element.IdPerfil,
                            select: false
                        });
                    });
                    this.setState({
                        "listPerfiles": tempArray
                    });

                    getListSelect('USUARIOS', '/order-type', this.props.history).then(listdata => {
                        this.setState({
                            "listTypeOrders": listdata.orderTypes
                        });
                    })

                    if (this.state.id !== '_add') {
                        this.setState({
                            "Id": this.state.id,
                            "showLoading": true
                        });
                        this.onChangeInfo(this.state.id);
                    } else {
                        this.setState({
                            "showLoading": false,
                            "showBtnCreate": true,
                        });
                    }
                });
            });
        });
    }

    onInputchange(event) {
        if (event.target.name.includes('listPerfiles')) {
            let elementFind = this.state.listPerfiles.find(i => i.value === event.target.id);
            elementFind.select = elementFind.select === true ? false : true;
            this.setState({
                "listPerfiles": this.state.listPerfiles
            });
        } else {
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
    }

    onInputclear() {
        this.setState({
            IdUsuario: '',
            estado: '',
            Nombre: '',
            Id: '',
            Email: '',
            ciudadesId: '',
            sedeId: '',
            rolId: '',
            Telefono: '',
            showBtnCreate: true,
            showBtnUpdate: false
        });
        this.state.listPerfiles.forEach((element) => {
            element.select = false;
        });
        this.setState({
            "listPerfiles": this.state.listPerfiles
        });
    }

    onSelectchange(selector, event) {
        this.setState({
            [selector]: event
        });
    }

    onChangeInfo(id) {
        this.onInputclear();
        if (localStorage.getItem('ActionItem') === 'Retiro') {
            this.setState({
                "showLoading": true,
                "showBtnDelete": true,
            });
        }
        getPermissions(this.state.IdMenu, 'Consulta', this.props.history).then(resultPermiss => {
            if (resultPermiss) {
                console.log('usuarios');
                getListSelect('usuarios', '/' + id, this.props.history).then(listdata => {
                    console.log(listdata);
                    if (listdata.Ciudad !== undefined && listdata.Ciudad !== null) {
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
                        "IdUsuario": listdata.IdUsuario,
                        "Id": listdata.Id,
                        "Nombre": listdata.Nombre,
                        "Email": listdata.Email,
                        "Telefono": listdata.Telefono,
                        "ciudadesId": this.state.listCiudades.find(i => i.value === listdata.IdCiudad),
                        "sedeId": this.state.listSedes.find(i => i.value === listdata.IdSede),
                        "rolId": this.state.listRoles.find(i => i.value === listdata.IdRol),
                        "typeOrdersId": this.state.listTypeOrders.find(i => i.value === listdata.typeOrder),
                        "showBtnUpdate": this.state.showBtnDelete === true ? false : (listdata.Inactivo === true ? false : true),
                        "chMultisede": listdata.Multisede,
                        "showBtnCreate": false,
                        "PasswordOld": listdata.Password,
                        "estado": listdata.Inactivo === true ? 'INACTIVO' : 'ACTIVO',
                        "chUsuarioEE": listdata.usuarioEE,
                    });
                    if (listdata.Perfiles !== undefined) {
                        listdata.Perfiles.forEach((element) => {
                            if (this.state.listPerfiles.length > 0) {
                                let elementFind = this.state.listPerfiles.find(i => i.value === element.IdPerfil);
                                elementFind.select = true;
                            }
                        });
                        this.setState({
                            "listPerfiles": this.state.listPerfiles
                        });
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
                        let tempArray = [];

                        this.state.listPerfiles.forEach((element) => {
                            if (element.select) {
                                const listSelect = {
                                    IdPerfil: element.value
                                }
                                tempArray.push(listSelect);
                            }
                        });

                        const datasend = {
                            IdUsuario: this.state.IdUsuario,
                            Nombre: this.state.Nombre,
                            Inactivo: false,
                            Email: this.state.Email,
                            IdCiudad: this.state.ciudadesId.value,
                            IdSede: this.state.sedeId.value,
                            IdRol: this.state.rolId.value,
                            Multisede: this.state.chMultisede,
                            usuarioEE: this.state.chUsuarioEE,
                            Telefono: this.state.Telefono,
                            FhCreacion: formatDateP(new Date(), 'yyyy-MM-DD'),
                            IdUser_Ing: localStorage.getItem('LoginUsers'),
                            Perfiles: tempArray,
                            typeOrder: this.state.typeOrdersId.value
                        }
                        AddItem(datasend, 'usuarios;post', history, '').then(result => {
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
                        let tempArray = [];
                        this.state.listPerfiles.forEach((element) => {
                            if (element.select) {
                                const listSelect = {
                                    IdPerfil: element.value
                                }
                                tempArray.push(listSelect);
                            }
                        });
                        const datasend = {
                            IdUsuario: this.state.IdUsuario,
                            Nombre: this.state.Nombre,
                            Inactivo: false,
                            Email: this.state.Email,
                            IdCiudad: this.state.ciudadesId.value,
                            IdRol: this.state.rolId.value,
                            IdSede: this.state.sedeId.value,
                            Telefono: this.state.Telefono,
                            Multisede: this.state.chMultisede,                            
                            usuarioEE: this.state.chUsuarioEE,
                            IdUser_Act: localStorage.getItem('LoginUsers'),
                            Fh_Act: new Date(),
                            Perfiles: tempArray,
                            typeOrder: this.state.typeOrdersId.value
                        }
                        UpdateItem(this.state.Id, datasend, 'usuarios;put', history, '').then(result => {
                            this.onChangeInfo(this.state.Id);
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
        DeleteItem(this.state.Id, 'usuarios', this.props.history, '/Maestros/BusquedaUser');
    }

    onGoNewItem() {
        localStorage.setItem('ActionItem', '');
        this.props.history.push('/Maestros/BusquedaUser');
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
                UpdateItem(this.state.Id, datasend, 'usuarios;put', history, '').then(result => {
                    this.onChangeInfo(this.state.IdUsuario);
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
            return "Agregar USUARIOS"
        } else {
            return "Consultar / Modificar / Eliminar USUARIOS"
        }
    }

    onOpenChangePassword() {
        this.setState({
            showChangePassword: true,
        });
    }

    onCloseChangePassword() {
        this.setState({
            showChangePassword: false,
            Password: '',
            PasswordComfirm: '',
        });
    }

    onSubmitFormCreateChangePassword() {
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
                            </CCardHeader>
                            <CCardBody>
                                <CCol md="12">
                                    <CForm inline>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput id="Id" name="Id" style={{ paddingLeft: '2%' }} label="Id." value={this.state.Id} onChange={this.onInputchange} onKeyDown={this.onInputchange} required />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput id="IdUsuario" name="IdUsuario" style={{ paddingLeft: '2%' }} label="Id.Usuario" value={this.state.IdUsuario} onChange={this.onInputchange} required />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput value={this.state.Nombre} style={{ paddingLeft: '2%', width: '324px' }} onChange={this.onInputchange} label="Nombre" id="Nombre" name="Nombre" required="True" />
                                        </CFormGroup>
                                        <CFormGroup>
                                            <CButton size="sm" style={{ width: '324px',visibility:'hidden' }} className="float-right" color="primary" onClick={this.onOpenChangePassword}>Cambiar Clave</CButton>
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput id="Email" name="Email" style={{ paddingLeft: '2%', width: '324px' }} label="Email" value={this.state.Email} onChange={this.onInputchange} required />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput id="Telefono" name="Telefono" style={{ paddingLeft: '2%', width: '324px' }} label="Telefono" value={this.state.Telefono} type="number" size={10} onChange={this.onInputchange} required />
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
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <CInputCheckbox id="chMultisede" name="chMultisede" checked={this.state.chMultisede} onChange={this.onInputchange} /> Multisede
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '243px' }} >
                                                <Select
                                                    options={this.state.listSedes}
                                                    styles={customSelectStyles}
                                                    value={this.state.sedeId}
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    isMulti={this.state.chMultisede}
                                                    isClearable
                                                    placeholder="Sede"
                                                    onChange={event => this.onSelectchange("sedeId", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
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
                                                    options={this.state.listTypeOrders}
                                                    styles={customSelectStyles}
                                                    value={this.state.typeOrdersId}
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    isClearable
                                                    placeholder="Tipo Orden"
                                                    onChange={event => this.onSelectchange("typeOrdersId", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <label>Perfiles: </label>
                                            <CListGroup horizontal='sm'>
                                                {this.state.listPerfiles.map(elemento => (
                                                    <CListGroupItem key={'k' + elemento.value} value={elemento.value}>
                                                        <CInputCheckbox id={elemento.value} name={'listPerfiles' + elemento.value} checked={elemento.select} onChange={this.onInputchange} />
                                                        {elemento.label}
                                                    </CListGroupItem>
                                                ))}
                                            </CListGroup>
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
                                                onClick={() => this.onDeleteItem(this.state.IdUsuario)}
                                                size="sm">{<CIcon name="cil-x" alt="delete" />}
                                            </CButton>
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <CInputCheckbox id="chUsuarioEE" name="chUsuarioEE" checked={this.state.chUsuarioEE} onChange={this.onInputchange} /> UsuarioEE
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
                <CRow>
                    <CModal show={this.state.showChangePassword} closeOnBackdrop={false}>
                        <CModalHeader>
                            <CModalTitle>Cambiar Clave</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CRow>
                                <CCol>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Clave" style={{ paddingLeft: '2%', width: '424px' }} type="Password" value={this.state.Password} onChange={this.onInputchange} id="Password" name="Password" required="True" />
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '3%' }}>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Confirmacion Clave" style={{ paddingLeft: '2%', width: '424px' }} type="Password" value={this.state.PasswordComfirm} onChange={this.onInputchange} id="PasswordComfirm" name="PasswordComfirm" required="True" />
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '3%' }}>
                                        <CFormGroup className="pr-1" >
                                            <CButton
                                                style={{ float: "right", width: '424px' }}
                                                color="primary"
                                                shape="square"
                                                visible="false"
                                                onClick={() => this.onSubmitFormCreateChangePassword()}
                                                size="sm">Cambiar
                                            </CButton>
                                        </CFormGroup>
                                    </CForm>
                                </CCol>
                            </CRow>
                        </CModalBody>
                        <CModalFooter>
                            <CButton onClick={this.onCloseChangePassword}>Cerrar</CButton>
                        </CModalFooter>
                    </CModal>
                </CRow>
            </>
        )
    }
}
export default usuario