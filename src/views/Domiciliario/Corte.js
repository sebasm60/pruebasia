import React, { Component } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CRow,
    CButton,
    CCardFooter,
    CSpinner,
    CButtonGroup
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { ExportToExcel } from 'src/reusable/ExportToExcel';
import FloatingLabelInput from 'react-floating-label-input'
import getListSelect from 'src/reusable/GetList'
import getPermissions from 'src/reusable/GetPermissions'
import swal from 'sweetalert';
import { formatDateP, toUPPER, formatDate, getEstadoName } from 'src/reusable/Util'

class CorteDomi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IdMenu: 'Menu-caja',
            prefijo: '',
            desdeNoEntrega: '',
            hastaNoEntrega: '',
            listDespachar: [],
            showLoading: false,
        };
        this.ObtenerMestros = this.ObtenerMestros.bind(this);
        this.onSelectchange = this.onSelectchange.bind(this);
        this.onInputchange = this.onInputchange.bind(this);
        this.onCallEntregasEntrega = this.onCallEntregasEntrega.bind(this);
        // this.onSubmitFormFind = this.onSubmitFormFind.bind(this);
        this.onFindActions = this.onFindActions.bind(this);
        this.onOpenActions = this.onOpenActions.bind(this);
        this.onInputclear = this.onInputclear.bind(this);
    }

    componentDidMount() {
        this.ObtenerMestros();
    }

    ObtenerMestros() {
    }
    onInputchange(event) {
        this.setState({
            [event.target.name]: toUPPER(event.target.value)
        });
    }

    onInputclear() {
        this.setState({
            prefijo: '',
            desdeNoEntrega: '',
            hastaNoEntrega: '',
            listDespachar: [],
        });
    }

    onSelectchange(selector, event) {
        this.setState({
            [selector]: event
        });
    }

    onCallEntregasEntrega() {
        this.setState({
            showLoading: true,
            listDespachar: []
        });

        getListSelect('Entregas', '/consolidado/caja?Prefijo=' + this.state.prefijo + '&DesdeNoEntrega=' + this.state.desdeNoEntrega + '&HastaNoEntrega=' + this.state.hastaNoEntrega, this.props.history)
            .then(listdata => {
                console.log(listdata)
                if (listdata != null) {
                    if (listdata.data.length > 0) {
                        let tempArray = [];
                        listdata.data.forEach(element => {
                            tempArray.push({
                                IdLote: element.IdLote,
                                IdMedicamento: element.IdMedicamento,
                                total: element.total,
                                NombreMedicamento: element.Medicamento.Nombre,
                                Ubicacion: element.Medicamento.Ubicacion.Nombre,
                            });
                        });
                        if (tempArray !== null) {
                            tempArray = tempArray.sort((a, b) => {
                                const compareName = a.NombreMedicamento.localeCompare(b.NombreMedicamento);
                                const compareTitle = a.IdLote.localeCompare(b.IdLote);
                                return compareName || compareTitle;
                            });
                        }
                        this.setState({
                            listDespachar: tempArray
                        });
                        this.setState({ 'showLoading': false });
                    } else {
                        this.setState({ 'showLoading': false });
                        swal('Advertencia', 'No hay informacion con el dato buscado', 'warning');
                    }
                }
                else {
                    this.setState({ 'showLoading': false });
                    swal('Advertencia', 'No hay informacion con el dato buscado', 'warning');
                }
            });
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
                console.log(this.state.listDespachar);
                this.state.listDespachar.forEach(function (currentValue, index, arr) {
                    console.log(currentValue.Id);
                    console.log(arr);
                    if (currentValue.Id === item.Id) {
                        console.log(index);
                        arr.splice(index, 1);
                    }
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
                                Corte Domicilio
                                <div className="card-header-actions"></div>
                            </CCardHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol md="3"> <FloatingLabelInput label='Prefijo' style={{ paddingLeft: '2%' }} id='prefijo' value={this.state.prefijo} name='prefijo' onChange={this.onInputchange} /></CCol>
                                    <CCol md="4"> <FloatingLabelInput label='Desde N.Entrega' style={{ paddingLeft: '2%' }} id='desdeNoEntrega' value={this.state.desdeNoEntrega} name='desdeNoEntrega' onChange={this.onInputchange} /></CCol>
                                    <CCol md="4"> <FloatingLabelInput label='Hasta N.Entrega' style={{ paddingLeft: '2%' }} id='hastaNoEntrega' value={this.state.hastaNoEntrega} name='hastaNoEntrega' onChange={this.onInputchange} /></CCol>
                                    <CCol md="1">
                                        <CButton
                                            style={{ float: "right" }}
                                            color="primary"
                                            variant="outline"
                                            shape="square" onClick={this.onCallEntregasEntrega}
                                            size="sm">Buscar</CButton>
                                    </CCol>
                                </CRow>
                                <hr></hr>
                                <CDataTable
                                    items={this.state.listDespachar}
                                    fields={[
                                        { key: 'IdMedicamento', label: 'IdMedicamento' },
                                        { key: 'NombreMedicamento', label: 'Nombre' },
                                        { key: 'IdLote', label: 'IdLote' },
                                        { key: 'total', label: 'Total Cantidad' },
                                    ]}
                                    itemsPerPage={20}
                                    pagination
                                    sorter
                                    columnFilter
                                    scopedSlots={{
                                        'NombreMedicamento':
                                            (item) => (
                                                <td>
                                                    {toUPPER(item.NombreMedicamento)}
                                                </td>
                                            ),
                                    }}
                                />
                            </CCardBody>
                            <CCardFooter>
                                <CButton type="submit" size="sm" className="float-left" color="warning" onClick={this.onInputclear}><CIcon name="cil-x" /> Limpiar</CButton>
                                <div className="float-right" >
                                    <ExportToExcel apiData={this.state.listDespachar} fileName={'Corte_' + this.state.prefijo + '_' + this.state.desdeNoEntrega+'-'+this.state.hastaNoEntrega} title={' Reporte Nombre: Corte Domiciliario\n Prefijo:' + this.state.prefijo + '\n Entrega Desde: ' + this.state.desdeNoEntrega + ' - Entrega Hasta: ' + this.state.hastaNoEntrega}></ExportToExcel>
                                </div>
                            </CCardFooter>
                        </CCard>
                    </CCol>
                </CRow>
            </>
        )
    }
}

export default CorteDomi
