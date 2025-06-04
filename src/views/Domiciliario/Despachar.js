import React, { Component } from 'react';
import {
    CLabel,
    CBadge,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CRow,
    CButton,
    CCardFooter,
    CFormGroup,
    CTextarea,
    CListGroup,
    CListGroupItem,
    CForm,
    CCardTitle,
    CCollapse,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CSpinner,
    CInput,
    CButtonGroup
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Select from 'react-select';
import { ExportToExcel } from 'src/reusable/ExportToExcel';
import { formatDateP, toUPPER } from 'src/reusable/Util'
import customSelectStyles from 'src/reusable/customSelectStyles'
import FloatingLabelInput from 'react-floating-label-input'
import getListSelect from 'src/reusable/GetList'
import swal from 'sweetalert';
import UpdateItemPut from 'src/reusable/AccionsUpdatePut'
import { CustomValueContainer } from 'src/reusable/CustomControl'
import validateRequiredFields from 'src/reusable/RequiredFields'

const camposRequired = [
    { label: 'tpTrasportadorId' },
]
class IndexDespacharDomi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IdMenu: 'Menu-estados-dom',
            idEntrega: '',
            tpTrasportadorId: '',
            fecha: '',
            tpOrdenId: 0,
            cantidadDomi: 0,
            listTrasportador: [],
            listDespachar: [],
            listOrden: [],
            showLoading: false,
            isExport: false,
        };
        this.ObtenerMestros = this.ObtenerMestros.bind(this);
        this.onSelectchange = this.onSelectchange.bind(this);
        this.onInputchange = this.onInputchange.bind(this);
        this.onCallEntregasEntrega = this.onCallEntregasEntrega.bind(this);
        this.onCallEntregasMasivo = this.onCallEntregasMasivo.bind(this);
        this.onSubmitFormCreate = this.onSubmitFormCreate.bind(this);
        this.onFindActions = this.onFindActions.bind(this);
        this.onOpenActions = this.onOpenActions.bind(this);
        this.onInputclear = this.onInputclear.bind(this);
        this.onActionDelete=this.onActionDelete.bind(this);
    }

    componentDidMount() {
        this.ObtenerMestros();
    }

    ObtenerMestros() {
        let history = this.props.history;
        getListSelect('Operadores', '', history).then(listdata => {
            let tempArray = [];
            listdata.data.forEach(element => {
                tempArray.push({
                    label: element.Nombre,
                    value: element.IdOperador,
                    select: false
                });
            });
            console.log(listdata);
            this.setState({
                "listTrasportador": tempArray,
            });
        });

        let tempArray = [];
        tempArray.push({
            label: 'EXCLUSIVOS',
            value: 'E',
            select: false
        });
        tempArray.push({
            label: 'INTEGRADOS',
            value: 'I',
            select: false
        });
        this.setState({
            'listOrden': tempArray,
        });
    }

    onInputchange(event) {
        this.setState({
            [event.target.name]: toUPPER(event.target.value)
        });
        if (event.target.name === "idEntrega") {
            if (event.code === "Tab") {
                this.onCallEntregasEntrega(event.target.value);
            }
        }
    }

    onInputclear() {
        this.setState({
            idEntrega: '',
            tpTrasportadorId: '',
            listTrasportador: [],
            listDespachar: [],
        });
    }

    onSelectchange(selector, event) {
        this.setState({
            [selector]: event
        });
    }

    onCallEntregasMasivo() {
        this.setState({
            showLoading: true,
            listDespachar: []
        });
        getListSelect('Caja', '?fhInicial=' + formatDateP(this.state.fecha, 'yyyy-MM-DD') + '&typeOrder=' + this.state.tpOrdenId.value + '&limit=' + this.state.cantidadDomi, this.props.history)
            .then(listdata => {
                console.log(listdata)
                if (listdata.data.length > 0) {
                    listdata.data.forEach(element => {
                        this.state.listDespachar.push({
                            IdPaciente: element.IdPaciente,
                            IdTipoId: element.IdTipoId,
                            NoEntrega: element.NoEntrega,
                            Pagado: element.Pagado,
                            Prefijo: element.Prefijo,
                            Fecha: element.Fecha,
                            Fh_Entrega: element.Fh_Entrega,
                            NombrePaciente: element.Paciente.Nombre,
                            CiudadPaciente: element.Paciente.IdCiudad,
                            DireccionPaciente: element.Paciente.Direccion,
                            ComentarioPaciente: element.Paciente.Comentario,
                        });
                    });
                    this.setState({ 'showLoading': false });
                } else {
                    this.setState({ 'showLoading': false });
                    swal('Advertencia', 'No hay informacion con el dato buscado', 'warning');
                }
            });
    }

    onCallEntregasEntrega(idEntrega) {
        this.setState({
            showLoading: true,
        });
        let data = this.state.listDespachar.find(i => i.DatoBusqueda === idEntrega);
        console.log(data);
        if (data === undefined) {
            getListSelect('Entregas', '?prefijoEntrega=' + idEntrega + '', this.props.history)
                .then(listdata => {
                    console.log(listdata)
                    if (listdata.data.length > 0) {
                        listdata.data.forEach(element => {
                            this.state.listDespachar.push({
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
                                DatoBusqueda: idEntrega
                            });
                        });
                        this.setState({ 'showLoading': false });
                    } else {
                        this.setState({ 'showLoading': false });
                        swal('Advertencia', 'No hay informacion con el dato buscado', 'warning');
                    }
                });
        } else {
            this.setState({ 'showLoading': false });
            swal("Advertencia", "Entrega ya en lista", "warning");
        }
    }

    onFindActions(item, filter) {
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
        </div>
        // let tempArray = JSON.parse(localStorage.getItem('permissions'));
        // if (tempArray !== undefined) {
        //     console.log(tempArray);
        //     let permissions = tempArray.find(i => i.IdMenu === this.state.IdMenu);
        //     if (permissions !== undefined) {
        //         switch (filter) {
        //             default:
        //                 return <div><label>'No se encontraron permisos'</label></div>;
        //             case "Ingreso":
        //                 if (permissions.Ingreso) {
        //                     return <div>
        //                         <CButton
        //                             style={{ float: "right" }}
        //                             color="warning"
        //                             shape="square"
        //                             visible="false"
        //                             onClick={() => this.onOpenActions(item, filter)}
        //                             size="sm">
        //                             {<CIcon name="cil-plus" alt="plus" />}
        //                         </CButton>
        //                     </div>;
        //                 }
        //                 break;
        //             case "Retiro":
        //                 if (permissions.Retiro) {
        //                     return <div>
        //                         <CButton
        //                             color="dark"
        //                             variant="outline"
        //                             shape="square"
        //                             visible="false"
        //                             onClick={() => this.onOpenActions(item, filter)}
        //                             size="sm">
        //                             {<CIcon name="cil-trash" alt="trash" />}
        //                         </CButton>
        //                     </div>;
        //                 }
        //                 break;
        //             case "Consulta":
        //                 if (permissions.Consulta) {
        //                     return <div>
        //                         <CButton
        //                             color="dark"
        //                             variant="outline"
        //                             shape="square"
        //                             visible="false"
        //                             onClick={() => this.onOpenActions(item, filter)}
        //                             size="sm">
        //                             {<CIcon name="cil-Search" alt="Search" />}
        //                         </CButton>
        //                     </div>;
        //                 }
        //                 break;
        //             case "Edicion":
        //                 if (permissions.Edicion) {
        //                     return <div>
        //                         <CButton
        //                             color="dark"
        //                             variant="outline"
        //                             shape="square"
        //                             visible="false"
        //                             onClick={() => this.onOpenActions(item, filter)}
        //                             size="sm">
        //                             {<CIcon name="cil-pencil" alt="pen" />}
        //                         </CButton>
        //                     </div>;
        //                 }
        //                 break;
        //             case "Inactivar":
        //                 if (permissions.Edicion) {
        //                     return <div>
        //                         <CButton
        //                             color="dark"
        //                             variant="outline"
        //                             shape="square"
        //                             visible="false"
        //                             onClick={() => this.onOpenActions(item, filter)}
        //                             size="sm">
        //                             {<CIcon name="cil-x-circle" alt="pen" />}
        //                         </CButton>
        //                     </div>;
        //                 }
        //                 break;
        //             case "Activar":
        //                 if (permissions.Edicion) {
        //                     return <div>
        //                         <CButton
        //                             color="dark"
        //                             variant="outline"
        //                             shape="square"
        //                             visible="false"
        //                             onClick={() => this.onOpenActions(item, filter)}
        //                             size="sm">
        //                             {<CIcon name="cil-circle" alt="pen" />}
        //                         </CButton>
        //                     </div>;
        //                 }
        //                 break;
        //         }
        //     } else {
        //         return <CCol md="1"><label>'No se encontraron permisos'</label></CCol>;
        //     }
        // }
        // else {
        //     return <CCol md="1"><label>'No se encontraron permisos'</label></CCol>;
        // }
    }

    onOpenActions(item, filter) {
        console.log(item);
        this.setState({
            "showLoading": true
        });
        localStorage.setItem('ActionItem', filter);
        switch (filter) {
            default:
                swal("Advertencia", "Filtro de Accion no Encontrado", "warning");
                break;
            case "Consulta":
            case "Edicion":
            case "Ingreso":
            case "Inactivar":
            case "Activar":
                //this.props.history.push('/Maestros/afiliacion/_add');
                break;
            case "Retiro":
                swal("Eliminar items", "Favor confirme que desea inactivar el items", "warning", {
                    buttons: ["Cancelar", "Confirmar"],
                }).then((value) => {
                    console.log(value);
                    if (value === true) {
                        console.log(this.state.listDespachar);
                        this.onActionDelete(item);
                    }
                });
                break;
        }

        this.setState({
            "showLoading": false
        });
    }
    onActionDelete(item) {
        this.state.listDespachar.forEach(function (currentValue, index, arr) {
            console.log(currentValue.IdPaciente);
            console.log(arr);
            if (currentValue.IdPaciente === item.IdPaciente) {
                console.log(index);
                arr.splice(index, 1);
            }
        });
        this.setState({
            "listDespachar": this.state.listDespachar
        });
    }
    onSubmitFormCreate() {
        const { history } = this.props;
        let tempArray = [];
        this.state.listDespachar.forEach(element => {
            tempArray.push({
                NoEntrega: element.NoEntrega,
                Prefijo: element.Prefijo
            });
        });
        const datasend = {
            IdOperador: this.state.tpTrasportadorId.value,
            fhInicial: formatDateP(this.state.fecha, 'yyyy-MM-DD'),
            entregas: tempArray,
        }
        console.log(datasend);
        validateRequiredFields(this.state, camposRequired).then(result => {
            if (result) {
                swal("Validacion Descarga", "Valide la descarga del archivo?, Desea continuar", "warning", {
                    buttons: ["Cancelar", "OK"],
                })
                    .then((value) => {
                        if (value) {
                            if (value === true) {
                                UpdateItemPut('', datasend, 'Caja;PUT', history, '').then(result => {
                                    this.onInputclear();
                                });
                            }
                        }
                    });
            }
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
                                Despachar
                                <div className="card-header-actions"></div>
                            </CCardHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol md="3">
                                        <div style={{ width: '250px' }} >
                                            <Select
                                                options={this.state.listTrasportador}
                                                styles={customSelectStyles}
                                                value={this.state.tpTrasportadorId}
                                                isClearable
                                                components={{
                                                    ValueContainer: CustomValueContainer
                                                }}
                                                placeholder='Trasportador'
                                                onChange={event => this.onSelectchange('tpTrasportadorId', event)}
                                            ></Select>
                                        </div>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol md="3">
                                        <CForm inline style={{ paddingTop: '0.8%' }}>
                                            <CFormGroup className='pr-1' >
                                                <div style={{ width: '250px' }} >
                                                    <Select
                                                        options={this.state.listOrden}
                                                        styles={customSelectStyles}
                                                        value={this.state.tpOrdenId}
                                                        isClearable
                                                        components={{
                                                            ValueContainer: CustomValueContainer
                                                        }}
                                                        placeholder='Tipo Domicilio'
                                                        onChange={event => this.onSelectchange('tpOrdenId', event)}
                                                    ></Select>
                                                </div>
                                            </CFormGroup>
                                        </CForm>
                                    </CCol>
                                    <CCol md="2">
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Fecha Entrega" style={{ width: '161px', paddingLeft: '2%' }} type='date' value={this.state.fecha} onChange={this.onInputchange} id="fecha" name="fecha" required="True" />
                                        </CFormGroup>
                                    </CCol>
                                    <CCol md="2">
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Cantidad Mostrar" style={{ width: '161px', paddingLeft: '2%' }} type='number' value={this.state.cantidadDomi} onChange={this.onInputchange} id="cantidadDomi" name="cantidadDomi" required="True" />
                                        </CFormGroup>
                                    </CCol>
                                    <CCol md="1">
                                        <CButton
                                            style={{ float: "right" }}
                                            color="primary"
                                            variant="outline"
                                            shape="square" onClick={this.onCallEntregasMasivo}
                                            size="sm">Buscar</CButton>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol md="3"> <FloatingLabelInput label='Entrega' style={{ paddingLeft: '2%' }} id='idEntrega' value={this.state.idEntrega} name='idEntrega' onChange={this.onInputchange} onKeyDown={this.onInputchange} /></CCol>
                                </CRow>
                                <hr></hr>
                                <CDataTable
                                    items={this.state.listDespachar}
                                    fields={[
                                        { key: 'IdPaciente', label: 'IdPaciente' },
                                        { key: 'IdTipoId', label: 'Tipo Id' },
                                        { key: 'NombrePaciente', label: 'Nombre' },
                                        { key: 'Prefijo', label: 'Prefijo' },
                                        { key: 'NoEntrega', label: 'Nro.Entrega' },
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
                                    sorter
                                    columnFilter
                                    scopedSlots={{
                                        'NombrePaciente':
                                            (item) => (
                                                <td>
                                                    {toUPPER(item.NombrePaciente)}
                                                </td>
                                            ),
                                        'Acciones':
                                            (item, index) => {
                                                return (
                                                    <>
                                                        <td className="py-2">
                                                            <CButtonGroup role="group">
                                                                {this.onFindActions(item, 'Retiro')}
                                                            </CButtonGroup>
                                                        </td>
                                                    </>
                                                )
                                            },
                                    }}
                                />
                            </CCardBody>
                            <CCardFooter>
                                <CButton type="submit" size="sm" className="float-left" color="warning" onClick={this.onInputclear}><CIcon name="cil-x" /> Limpiar</CButton>
                                <CButton type="submit" size="sm" className="float-right" color="primary" onClick={this.onSubmitFormCreate}><CIcon name="cil-plus" /> Guardar</CButton>

                                <div className="float-right" >
                                    <ExportToExcel apiData={this.state.listDespachar} fileName={'ArmarCaja_' + this.state.fecha + '_' + this.state.listTrasportador.value} title={''} ></ExportToExcel>
                                </div>
                            </CCardFooter>
                        </CCard>
                    </CCol>
                </CRow>
            </>
        )
    }
}
export default IndexDespacharDomi
