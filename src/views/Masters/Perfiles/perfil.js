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
    CDataTable,
    CInputCheckbox,
    CCollapse,
    CListGroup,
    CListGroupItem
} from '@coreui/react'
import swal from 'sweetalert'
import CIcon from '@coreui/icons-react'
import UpdateItem from 'src/reusable/AccionsUpdate'
import AddItem from 'src/reusable/AccionsPost'
import DeleteItem from 'src/reusable/AccionsDelete'
import getListSelect from 'src/reusable/GetList'
import getPermissions from 'src/reusable/GetPermissions'
import { formatDateP, toUPPER } from 'src/reusable/Util'
import { getEstado } from 'src/reusable/Util'
import accionMenu from 'src/reusable/maestros/accionMenu'
import FloatingLabelInput from 'react-floating-label-input'
import validateRequiredFields from 'src/reusable/RequiredFields'


import 'src/scss/style_print.scss';

const camposRequired = [
    { label: 'IdPerfil' },
    { label: 'Nombre' },
]
class perfil extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IdMenu: 'Menu-perfiles',
            IdMenu2: 'Menu-menus',
            IdMenu3: 'Menu-perfilesmenu',
            id: props.match.params.id,
            listPermissions: [],
            listMenu: [],
            listMenuActivos: [],
            IsShow: [],
            listAccionesMenu: [],
            IdPerfil: props.match.params.id,
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
        this.onSubmitFormUpdateSubMenu = this.onSubmitFormUpdateSubMenu.bind(this);
        this.onSubmitFormCreate = this.onSubmitFormCreate.bind(this);
        this.onSubmitFormDelete = this.onSubmitFormDelete.bind(this);
        this.ObtenerMestros = this.ObtenerMestros.bind(this);
        this.onChangeInfo = this.onChangeInfo.bind(this);
        this.onGoNewItem = this.onGoNewItem.bind(this);
        this.onDeleteItem = this.onDeleteItem.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
        this.onValueState = this.onValueState.bind(this);
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
        getPermissions(this.state.IdMenu2, 'Ingreso', this.props.history).then(resultPermiss => {
            if (resultPermiss) {
                getListSelect('Menus', '', this.props.history).then(listdata => {
                    console.log(listdata);
                    if (listdata.data !== undefined) {
                        this.setState({
                            "listMenu": listdata.data
                        });
                    }

                    getPermissions(this.state.IdMenu3, 'Ingreso', this.props.history).then(resultPermiss => {
                        if (resultPermiss) {
                            this.setState({
                                "listAccionesMenu": accionMenu,
                            });
                            getListSelect('Perfiles_Menu', '?IdPerfil=' + this.state.IdPerfil, this.props.history).then(listdata => {
                                console.log(listdata);
                                if (listdata.data !== undefined) {
                                    this.setState({
                                        "listMenuActivos": listdata.data
                                    });
                                }
                            });
                        }
                    });


                });
            }
        });


        if (this.state.id !== '_add') {
            this.setState({
                "IdPerfil": this.state.id,
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

        console.log(event.target)
        if (event.target.name === "IdPerfil") {
            this.setState({
                [event.target.name]: toUPPER(event.target.value)
            });
            if (event.code === "Tab") {
                this.onChangeInfo(event.target.value);
            }
        }
        else if (event.target.name.includes('listAccionesMenu')) {
            let datasplit = event.target.name.split('_');
            let elementFind = this.state.listMenuActivos.find(i => i.IdMenu === datasplit[1]);
            if (elementFind !== undefined) {
                let stateElement = elementFind[datasplit[2]];
                console.log(elementFind[datasplit[2]])
                elementFind[datasplit[2]] = !stateElement;

                this.setState({
                    "listMenuActivos": this.state.listMenuActivos
                });
            } else {
                let menuFind = this.state.listMenu.find(i => i.IdMenu === datasplit[1]);
                let tempArray = [];
                tempArray.push({
                    accion: 'Nuevo',
                    Menu: menuFind,
                    IdMenu: datasplit[1],
                    IdPerfil: this.state.IdPerfil,
                    ["" + datasplit[2] + ""]: true
                });
                this.state.listMenuActivos = tempArray;
                this.setState({
                    "listMenuActivos": this.state.listMenuActivos
                });
            }
            console.log(this.state.listMenuActivos);

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
                getListSelect('Perfiles', '/' + id, this.props.history).then(listdata => {
                    this.setState({
                        "showLoading": false,
                        "IdPerfil": listdata.IdPerfil,
                        "Nombre": listdata.Nombre,
                        "showBtnUpdate": this.state.showBtnDelete === true ? false : (listdata.Inactivo === true ? false : true),
                        "showBtnCreate": false,
                        "estado": listdata.Inactivo === true ? 'INACTIVO' : 'ACTIVO'
                    });


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
                            IdPerfil: this.state.IdPerfil,
                            Nombre: this.state.Nombre,
                            Inactivo: false,
                            FhCreacion: formatDateP(new Date(), 'yyyy-MM-DD'),
                            IdUser_Ing: localStorage.getItem('LoginUsers'),
                        }
                        AddItem(datasend, 'Perfiles;post', history, '').then(result => {
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
                            IdPerfil: this.state.IdPerfil,
                            Nombre: this.state.Nombre,
                            Inactivo: false,
                            IdUser_Act: localStorage.getItem('LoginUsers'),
                            Fh_Act: new Date(),
                        }
                        UpdateItem(this.state.IdPerfil, datasend, 'Perfiles;put', history, '').then(result => {
                            console.log("UpdateItemPerfiles");
                            this.onSubmitFormUpdateSubMenu();
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

    onSubmitFormUpdateSubMenu() {
        getPermissions(this.state.IdMenu3, 'Edicion', this.props.history).then(resultPermiss => {
            if (resultPermiss) {
                this.setState({
                    "showLoading": true
                });
                console.log(this.state.listMenu);
                if (this.state.listMenu.length > 0) {
                    const { history } = this.props;
                    this.state.listMenu.forEach((element) => {
                        let elementFind = this.state.listMenuActivos.find(i => i.IdMenu === element.IdMenu);
                        if (elementFind !== undefined) {

                            const datasend = {
                                IdPerfil: elementFind.IdPerfil,
                                IdMenu: elementFind.IdMenu,
                                Ejecuta: elementFind.Ejecuta,
                                Ingreso: elementFind.Ingreso,
                                Edicion: elementFind.Edicion,
                                Retiro: elementFind.Retiro,
                                Consulta: elementFind.Consulta,
                                InfoSelf: elementFind.InfoSelf,
                            }
                            console.log("Perfiles_Menu");
                            console.log(datasend);
                            if (elementFind.accion === 'Nuevo') {
                                AddItem(datasend, 'Perfiles_Menu;post', history, '').then(result => {
                                    this.ObtenerMestros();
                                });
                            }
                            else {
                                UpdateItem('perfil' + elementFind.IdPerfil + '/menu/' + elementFind.IdMenu, datasend, 'Perfiles_Menu;put', history, '')
                                    .then(result => {
                                        this.ObtenerMestros();
                                        this.setState({
                                            "showLoading": false
                                        });
                                    });
                            }
                        }
                    });
                } else {
                    this.setState({
                        "showLoading": false
                    });
                }
            } else {
                swal("Advertencia", "Sin Permisos EDICION", "warning");
            }
        });
    }

    onSubmitFormDelete() {
        DeleteItem(this.state.IdPerfil, 'Perfiles', this.props.history, '/Maestros/BusquedaPerf');
    }

    onGoNewItem() {
        localStorage.setItem('ActionItem', '');
        this.props.history.push('/Maestros/BusquedaPerf');
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
                UpdateItem(this.state.IdPerfil, datasend, 'Perfiles;put', history, '').then(result => {
                    this.onChangeInfo(this.state.IdPerfil);
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
            return "Agregar PERFILES"
        } else {
            return "Consultar / Modificar / Eliminar PERFILES"
        }
    }

    toggleDetails(items) {
        if (this.state.IsShow.includes(items.IdMenu)) {
            const position = this.state.IsShow.indexOf(items.IdMenu)
            this.state.IsShow.splice(position, 1)
        }
        else {
            this.state.IsShow.push(items.IdMenu);
        }
        this.setState({
            "IsShow": this.state.IsShow
        });
    }

    onValueState(idInfoMenu, accionMenu) {
        if (this.state.listMenuActivos !== undefined) {
            let elementFind = this.state.listMenuActivos.find(i => i.IdMenu === idInfoMenu.IdMenu);
            if (elementFind !== undefined) {
                return elementFind[accionMenu];
            }
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
                                            <FloatingLabelInput id="IdPerfil" name="IdPerfil" style={{ paddingLeft: '2%' }} label="Id.Unidad" value={this.state.IdPerfil} onChange={this.onInputchange} onKeyDown={this.onInputchange} required />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput value={this.state.Nombre} style={{ paddingLeft: '2%', width: '324px' }} onChange={this.onInputchange} label="Nombre" id="Nombre" name="Nombre" required="True" />
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
                                                onClick={() => this.onDeleteItem(this.state.IdPerfil)}
                                                size="sm">{<CIcon name="cil-x" alt="delete" />}
                                            </CButton>
                                        </CFormGroup>
                                    </CForm>
                                </CCol>
                                <hr></hr>
                                <CCol md="12">
                                    <CDataTable
                                        items={this.state.listMenu}
                                        fields={[
                                            // { key: 'selected', label: '' },
                                            { key: 'IdMenu', label: 'IdMenu' },
                                            { key: 'Nombre', label: 'Nombre' },
                                            { key: 'Posicion', label: 'Posicion' },
                                            {
                                                key: 'Acciones',
                                                label: '',
                                                sorter: false,
                                                filter: false
                                            }
                                        ]}
                                        itemsPerPage={10}
                                        pagination
                                        columnFilter
                                        hover
                                        size='sm'
                                        scopedSlots={{
                                            /* 'selected':
                                                (item) => (
                                                   /*  <td>
                                                        <CFormGroup variant="checkbox" className="checkbox">
                                                            <CInputCheckbox id="checkboxAllOrden" value={item.id} checked={item.ordenSelect} name="checkboxAllOrden" onChange={this.onInputchange} />
                                                        </CFormGroup>
                                                    </td> 
                                                ), */
                                            'Acciones':
                                                (item, index) => {
                                                    return (
                                                        <>
                                                            <td className=" text-right">
                                                                <CButton
                                                                    color="warning"
                                                                    variant="outline"
                                                                    shape="square"
                                                                    size="sm"
                                                                    onClick={() => { this.toggleDetails(item) }}
                                                                >
                                                                    {this.state.IsShow.includes(item.IdMenu) ? <CIcon name="cil-zoom-out" alt="plus" /> : <CIcon name="cil-zoom-in" alt="plus" />}
                                                                </CButton>
                                                            </td>
                                                        </>
                                                    )
                                                },
                                            'details':
                                                (itemP, index) => {
                                                    return (
                                                        <CCollapse show={this.state.IsShow.includes(itemP.IdMenu)}>
                                                            <CCardBody>
                                                                <CListGroup horizontal='sm'>
                                                                    {this.state.listAccionesMenu.map(elemento => (
                                                                        <CListGroupItem key={'k' + elemento.value} value={elemento.value}>
                                                                            <CInputCheckbox id={elemento.value} name={'listAccionesMenu_' + itemP.IdMenu + '_' + elemento.value} checked={this.onValueState(itemP, elemento.value)} onChange={this.onInputchange} />
                                                                            {elemento.label}
                                                                        </CListGroupItem>
                                                                    ))}
                                                                </CListGroup>
                                                            </CCardBody>
                                                        </CCollapse>
                                                    )
                                                }
                                        }}
                                    />
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
export default perfil