import React, { Component } from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CDataTable,
    CInput,
    CButtonGroup,
    CBadge,
    CSpinner
} from '@coreui/react'
import swal from 'sweetalert'
import CIcon from '@coreui/icons-react'
import { toUPPER, getEstado, getEstadoName } from 'src/reusable/Util'
import getListSelect from 'src/reusable/GetList'
import getPermissions from 'src/reusable/GetPermissions'
import UpdateItem from 'src/reusable/AccionsUpdate'
import DeleteItem from 'src/reusable/AccionsDelete'

class BusquedaMediosPago extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IdMenu: 'Menu-mediospago',
            textBuscar: '',
            dataResult: [],
            showLoading: false
        };
        this.onInputchange = this.onInputchange.bind(this);
        this.onSubmitFormFind = this.onSubmitFormFind.bind(this);
        this.onFindActions = this.onFindActions.bind(this);
        this.onOpenActions = this.onOpenActions.bind(this);
    }

    componentDidMount() {
        localStorage.setItem('ActionItem', '');
        this.onSubmitFormFind();
    }

    onInputchange(event) {
        this.setState({
            [event.target.name]: toUPPER(event.target.value)
        });
    }

    onSubmitFormFind() {
        this.setState({
            "dataResult": '',
            "showLoading": true
        });
        getPermissions(this.state.IdMenu, 'Consulta', this.props.history).then(resultPermiss => {
            if (resultPermiss) {
                getListSelect('MediosPago', '?page=1&limit=50&search=' + this.state.textBuscar.trim() + '', this.props.history).then(listdata => {
                    this.setState({
                        "dataResult": listdata.data,
                        "showLoading": false
                    });
                });
            } else {
                swal("Advertencia", "Sin Permisos CONSULTA", "warning");
            }
        });
    }

    onFindActions(item, filter) {
        let tempArray = JSON.parse(localStorage.getItem('permissions'));
        if (tempArray !== undefined) {
            let permissions = tempArray.find(i => i.IdMenu === this.state.IdMenu);
            if (permissions !== undefined) {
                switch (filter) {
                    default:
                        return <div><label>'No se encontraron permisos'</label></div>;
                    case "Ingreso":
                        if (permissions.Ingreso) {
                            return <div>
                                <CButton
                                    style={{ float: "right" }}
                                    color="warning"
                                    shape="square"
                                    visible="false"
                                    onClick={() => this.onOpenActions(item, filter)}
                                    size="sm">
                                    {<CIcon name="cil-plus" alt="plus" />}
                                </CButton>
                            </div>;
                        }
                        break;
                    case "Retiro":
                        if (permissions.Retiro) {
                            return <div>
                                <CButton
                                    color="dark"
                                    variant="outline"
                                    shape="square"
                                    visible="false"
                                    onClick={() => this.onOpenActions(item, filter)}
                                    size="sm">
                                    {<CIcon name="cil-trash" alt="trash" />}
                                </CButton>
                            </div>;
                        }
                        break;
                    case "Consulta":
                        if (permissions.Consulta) {
                            return <div>
                                <CButton
                                    color="dark"
                                    variant="outline"
                                    shape="square"
                                    visible="false"
                                    onClick={() => this.onOpenActions(item, filter)}
                                    size="sm">
                                    {<CIcon name="cil-Search" alt="Search" />}
                                </CButton>
                            </div>;
                        }
                        break;
                    case "Edicion":
                        if (permissions.Edicion) {
                            return <div>
                                <CButton
                                    color="dark"
                                    variant="outline"
                                    shape="square"
                                    visible="false"
                                    onClick={() => this.onOpenActions(item, filter)}
                                    size="sm">
                                    {<CIcon name="cil-pencil" alt="pen" />}
                                </CButton>
                            </div>;
                        }
                        break;
                    case "Inactivar":
                        if (permissions.Edicion) {
                            return <div>
                                <CButton
                                    color="dark"
                                    variant="outline"
                                    shape="square"
                                    visible="false"
                                    onClick={() => this.onOpenActions(item, filter)}
                                    size="sm">
                                    {<CIcon name="cil-x-circle" alt="pen" />}
                                </CButton>
                            </div>;
                        }
                        break;
                    case "Activar":
                        if (permissions.Edicion) {
                            return <div>
                                <CButton
                                    color="dark"
                                    variant="outline"
                                    shape="square"
                                    visible="false"
                                    onClick={() => this.onOpenActions(item, filter)}
                                    size="sm">
                                    {<CIcon name="cil-circle" alt="pen" />}
                                </CButton>
                            </div>;
                        }
                        break;
                }
            } else {
                return <CCol md="1"><label>'No se encontraron permisos'</label></CCol>;
            }
        }
        else {
            return <CCol md="1"><label>'No se encontraron permisos'</label></CCol>;
        }
    }

    onOpenActions(item, filter) {
        this.setState({
            "showLoading": true
        });
        localStorage.setItem('ActionItem', filter);
        switch (filter) {
            default:
                swal("Advertencia", "Filtro de Accion no Encontrado", "warning");
                break;
            case "Ingreso":
                this.props.history.push('/Maestros/MediosPagos/_add');
                break;
            case "Consulta":
            case "Edicion":
                this.props.history.push('/Maestros/MediosPagos/' + item.IdMedioPago + '');
                break;
            case "Retiro":
                DeleteItem(item.IdMedioPago, 'MediosPago', this.props.history);
                break;
            case "Inactivar":
            case "Activar":
                const datasend = {
                    Inactivo: filter === 'Activar' ? false : true,
                    IdUser_Act: localStorage.getItem('LoginUsers'),
                    FhInactivo: new Date(),
                }
                UpdateItem(item.IdMedioPago, datasend, 'MediosPago;put', this.props.history, '').then(result => {
                 this.onSubmitFormFind();
                });
               
                break;
        }

        this.setState({
            "showLoading": false
        });
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
                                Busqueda Maestros
                                <div className="card-header-actions">
                                    {this.onFindActions('', 'Ingreso')}
                                </div>
                            </CCardHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol md="1"><label>Buscar:</label></CCol>
                                    <CCol md="10"><CInput id="textBuscar" name="textBuscar" style={{ paddingLeft: '2%' }} value={this.state.textBuscar} onChange={this.onInputchange} /></CCol>
                                    <CCol md="1">
                                        <CButton
                                            style={{ float: "right" }}
                                            color="primary"
                                            variant="outline"
                                            shape="square" onClick={this.onSubmitFormFind}
                                            size="sm">Buscar</CButton>
                                    </CCol>
                                </CRow>
                                <hr></hr>
                                <CDataTable
                                    items={this.state.dataResult}
                                    fields={[
                                        { key: 'IdMedioPago', label: 'IdMedioPago' },
                                        { key: 'Nombre', label: 'Nombre' },
                                        { key: 'Inactivo', label: 'Estado' },
                                        {
                                            key: 'Acciones',
                                            label: '',
                                            _style: { width: '1%' },
                                            sorter: false,
                                            filter: false
                                        }
                                    ]}
                                    itemsPerPage={20}
                                    pagination                                    
                                    scopedSlots={{
                                        'Nombre':
                                            (item) => (
                                                <td>
                                                    {toUPPER(item.Nombre)}
                                                </td>
                                            ),
                                        'Inactivo':
                                            (item) => (
                                                <td>
                                                    <CBadge color={getEstado(item.Inactivo)}>
                                                        {getEstadoName(item.Inactivo)}
                                                    </CBadge>
                                                </td>
                                            ),
                                        'Acciones':
                                            (item, index) => {
                                                return (
                                                    <>
                                                        <td className="py-2">
                                                            <CButtonGroup role="group">
                                                                {this.onFindActions(item, 'Consulta')}
                                                                {this.onFindActions(item, 'Edicion')}
                                                                {item.Inactivo === false ? this.onFindActions(item, 'Inactivar') : this.onFindActions(item, 'Activar')}
                                                                {this.onFindActions(item, 'Retiro')}
                                                            </CButtonGroup>
                                                        </td>
                                                    </>
                                                )
                                            },
                                    }}
                                />
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </>
        )
    }
}
export default BusquedaMediosPago