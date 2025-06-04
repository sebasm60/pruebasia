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
    CInputCheckbox,
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
import {
    formatDateP, toUPPER, formatCurrency,
    removeformatCurrency, getColorAlert,
    syncDelay, createUUID, formatNumber,
    getEstado, getEstadoName, getColorAlertFechaVto
} from 'src/reusable/Util'
import getListSelect from 'src/reusable/GetList'
import customSelectStyles from 'src/reusable/customSelectStyles'
import usersData from '../Despacho/UsersData'
import FloatingLabelInput from 'react-floating-label-input'
import { CustomValueContainer } from 'src/reusable/CustomControl'
import validateRequiredFields from 'src/reusable/RequiredFields'
import AddItem from 'src/reusable/AccionsPost'
import 'src/scss/style_print.scss';
import swal from 'sweetalert';
import { getTextHTML } from 'src/views/Despacho/DocPdf'

const camposRequiredAcumulacionManual = [
    { label: 'MnNroOrden' },
    { label: 'MnIdTipoPlan' },
    { label: 'MnfhOrden' },
    { label: 'MnVtofhOrden' },
    { label: 'MnPLU' },
    { label: 'MnCantidadAuto' },
    { label: 'MnIdLote' },
    { label: 'MnSaldoLote' },
    { label: 'MnCantidadEnt' },
    { label: 'MnValorUni' },
    { label: 'MnValorTotal' },
]
const camposRequiredEncabezado = [
    { label: 'conveniosId' },
    { label: 'tipoEntregaId' },
    { label: 'idPaciente' },
    { label: 'tipoId' },
    { label: 'RIdentificacion' },
    { label: 'RNombre' },
    { label: 'parentescoId' }
]
const camposRequiredMedioPago = [
    // { label: 'medioPagoId_1' },
    // { label: 'valorPagoId_1' },
]

class IndexDispatchDomi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ListUltimasEntregasPaciente: [],
            ListNivel: [],
            Listdetails: [],
            ListAlarmaMedicamentos: [],
            ListMarcasPaciente: [],
            listConvenios: [],
            listConveniosAllData: [],
            listTiposEntregas: [],
            listParentescos: [],
            IsShow: [],
            infoPaciente: [],
            jsonResumenPago: [],
            listLote: [],
            listOrden: [],
            listTiposId: [],
            listSaldosMed: [],
            listTipoPlan: [],
            listFormasPago: [],
            listBusquedaMedicamento: [],
            listBusquedaSaldosMedicamento: [],
            nameMedicamentos: '',
            idAlarmaMedicamentos: 0,
            idConvenio: 0,
            tpOrdenId: 0,
            tipoEntregaId: '',
            idPaciente: '',
            showAlertMedicamentos: false,
            showAlertMarcasPacientes: false,
            showBuscarMedicamento: false,
            showBuscarSaldosMedicamento: false,
            showLoading: true,
            showIngresoManual: false,
            ccInterpolaridad: false,
            bloqueoidPaciente: false,
            MnNroOrden: '',
            MnIdTipoPlan: '',
            MnfhOrden: formatDateP(new Date(), 'yyyy-MM-DD'),
            MnVtofhOrden: formatDateP(new Date(), 'yyyy-MM-DD'),
            MnPLU: '',
            MnNombreMedicamento: '',
            BuscarSaldoNombreMedicamento: '',
            MnCodigoMedicamento: '',
            MnLoteMedicamento: [],
            MnMedicamento: [],
            TpEntregaMvto: [],
            MnMIPRES: '',
            MnCantidadEnt: 0,
            MnCantidadAuto: 0,
            MnIdLote: '',
            MnSaldoLote: '',
            MnValorUni: '',
            MnValorIVA: '',
            MnValorTotal: '',
            MnCoPago: '',
            conveniosId: '',
            tipoId: '',
            parentescoId: '',
            sumValorTx: 0,
            sumNetoValorTx: 0,
            sumIVAValorTx: 0,
            sumFleteValorTx: 0,
            medioPagoId_1: '',
            medioPagoId_2: '',
            medioPagoId_3: '',
            valorPagoId_1: '',
            valorPagoId_2: '',
            valorPagoId_3: '',
            comentario: '',
            valorPagado: '',
            cambio: '',
            BuscarNombreMedicamento: '',
            BuscarPLUMedicamento: '',
            bodyReciboModal: getTextHTML(''),
            conveniosIdBlock: false,
            tipoEntregaIdBlock: false,
            cantAlarmas: []
        };
        this.ObtenerDetails = this.ObtenerDetails.bind(this);
        this.ObtenerMestros = this.ObtenerMestros.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
        this.distinctJson = this.distinctJson.bind(this);
        this.selectItemProducto = this.selectItemProducto.bind(this);
        this.newFila = this.newFila.bind(this);
        this.deleteFila = this.deleteFila.bind(this);
        this.openAlertMedicamentos = this.openAlertMedicamentos.bind(this);
        this.onHideAlertMedicamentos = this.onHideAlertMedicamentos.bind(this);
        this.onOpenBuscarMedicamento = this.onOpenBuscarMedicamento.bind(this);
        this.onHideBuscarMedicamento = this.onHideBuscarMedicamento.bind(this);
        this.onOpenBuscarSaldoMedicamento = this.onOpenBuscarSaldoMedicamento.bind(this);
        this.onHideBuscarSaldoMedicamento = this.onHideBuscarSaldoMedicamento.bind(this);
        this.openAlertMarcaPaciente = this.openAlertMarcaPaciente.bind(this);
        this.onHideAlertMarcaPaciente = this.onHideAlertMarcaPaciente.bind(this);
        this.onChangeAllOrden = this.onChangeAllOrden.bind(this);
        this.onChangeItemOrden = this.onChangeItemOrden.bind(this);
        this.onChangeInfoPaciente = this.onChangeInfoPaciente.bind(this);
        this.onChangeInfoMedicamento = this.onChangeInfoMedicamento.bind(this);
        this.onGoInfoMedicamento = this.onGoInfoMedicamento.bind(this);
        this.onGoInfoPaciente = this.onGoInfoPaciente.bind(this);
        this.onInputchange = this.onInputchange.bind(this);
        this.onInputclear = this.onInputclear.bind(this);
        this.onSearchOrden = this.onSearchOrden.bind(this);
        this.onAcumularOrdenManual = this.onAcumularOrdenManual.bind(this);
        this.onSelectchange = this.onSelectchange.bind(this);
        this.onDuplicateProducto = this.onDuplicateProducto.bind(this);
        this.openMediosPagos = this.openMediosPagos.bind(this);
        this.onSaveEntrega = this.onSaveEntrega.bind(this);
        this.onFindMedicamentoPopUp = this.onFindMedicamentoPopUp.bind(this);
        this.onSeleccionarBusquedaMedicamento = this.onSeleccionarBusquedaMedicamento.bind(this);
        this.onBuscarMedicamentoPlu = this.onBuscarMedicamentoPlu.bind(this);
        this.onPrintRecibo = this.onPrintRecibo.bind(this);
        this.onCallEntregasPaciente = this.onCallEntregasPaciente.bind(this);
        this.onCallHistoricoOrden = this.onCallHistoricoOrden.bind(this);
        this.onBuscarSaldosMedicamento = this.onBuscarSaldosMedicamento.bind(this);
    }

    componentDidMount() {
        console.log(localStorage.getItem('Domicilio'))
        if (localStorage.getItem('Domicilio') == "true") {
            this.ObtenerMestros();
        }
        else {
            swal("Advertencia", "Sin Permisos Ingreso", "warning");
        }
    }

    ObtenerMestros() {
        let history = this.props.history;
        let tempArray = [];
        if (localStorage.getItem("typeOrder") == "E") {
            tempArray.push({
                label: 'EXCLUSIVOS',
                value: 'EXCLUSIVOS',
                select: false
            });
        } else {
            tempArray.push({
                label: 'INTEGRADOS',
                value: 'INTEGRADOS',
                select: false
            });
        }
        this.setState({
            'listOrden': tempArray,
            tpOrdenId: tempArray
        });
        getListSelect('Convenios', '?Inactivo=false', history).then(listdata => {
            let tempArray = [];
            listdata.data.forEach(element => {
                tempArray.push({
                    label: element.Nombre,
                    value: element.IdConvenio,
                    select: false
                });
            });
            this.setState({
                'listConvenios': tempArray,
                'listConveniosAllData': listdata.data
            });
            getListSelect('TiposId', ' ', history).then(listdata => {
                let tempArray = [];
                listdata.data.forEach(element => {
                    tempArray.push({
                        label: element.IdTipoId + ' (' + element.Nombre + ')',
                        value: element.IdTipoId,
                        select: false
                    });
                });
                this.setState({
                    'listTiposId': tempArray,
                });
                getListSelect('TiposEntrega', '?Inactivo=false', history).then(listdata => {
                    let tempArray = [];
                    listdata.data.forEach(element => {
                        if (element.Domicilio) {
                            tempArray.push({
                                label: element.Nombre,
                                value: element.IdTipoEntrega,
                                select: false
                            });
                        }
                    });
                    this.setState({
                        'listTiposEntregas': tempArray
                    });
                    getListSelect('Parentescos', '?Inactivo=false', history).then(listdata => {
                        let tempArray = [];
                        listdata.data.forEach(element => {
                            tempArray.push({
                                label: element.Nombre,
                                value: element.IdParentesco,
                                select: false
                            });
                        });
                        this.setState({
                            'listParentescos': tempArray
                        });
                        getListSelect('Planes', '?Inactivo=false', history).then(listdata => {
                            let tempArray = [];
                            listdata.data.forEach(element => {
                                tempArray.push({
                                    label: element.Nombre,
                                    value: element.IdPlan,
                                    select: false
                                });
                            });
                            this.setState({
                                'listTipoPlan': tempArray,
                            });
                            getListSelect('MediosPago', '?Inactivo=false', history).then(listdata => {
                                let tempArray = [];
                                listdata.data.forEach(element => {
                                    tempArray.push({
                                        label: element.Nombre,
                                        value: element.IdMedioPago
                                    });
                                });
                                this.setState({
                                    'listFormasPago': tempArray,
                                    showLoading: false
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    onSearchOrden() {
        //ACA TRAER INFORMACION INTEROPERABILIDAD
        this.setState({
            showLoading: true
        });
        if (this.state.tipoId !== '') {
            if (this.state.conveniosId !== '') {
                if (this.state.idPaciente !== '') {
                    if (this.state.ccInterpolaridad === false) {
                        this.setState({
                            'ListAlarmaMedicamentos': [],
                            'ListNivel': [],
                            showIngresoManual: true,
                            showLoading: false
                        });
                    } else {
                        this.distinctJson();
                        this.setState({
                            showIngresoManual: false
                        });
                    }
                } else {
                    this.setState({
                        showLoading: false
                    });
                    swal('Advertencia', 'Debe ingresar el id del paciente para buscar la orden', 'warning');
                }
            } else {
                this.setState({
                    showLoading: false
                });
                swal('Advertencia', 'Debe ingresar seleccionar el convenio para buscar la orden', 'warning');
            }
        } else {
            this.setState({
                showLoading: false
            });
            swal('Advertencia', 'Debe ingresar seleccionar el Tipo Id para buscar la orden', 'warning');
        }
    }

    onInputclear() {
        this.setState({
            ListNivel: [],
            Listdetails: [],
            ListAlarmaMedicamentos: [],
            ListMarcasPaciente: [],
            IsShow: [],
            infoPaciente: [],
            jsonResumenPago: [],
            listLote: [],
            listSaldosMed: [],
            ListUltimasEntregasPaciente: [],
            nameMedicamentos: '',
            idConvenio: 0,
            // tipoEntregaId: '',
            showAlertMedicamentos: false,
            showAlertMarcasPacientes: false,
            showBuscarMedicamento: false,
            showBuscarSaldosMedicamento: false,
            showIngresoManual: false,
            //ccInterpolaridad: false,            
            bloqueoidPaciente: false,
            MnNroOrden: '',
            MnIdTipoPlan: '',
            MnfhOrden: '',
            MnVtofhOrden: '',
            MnPLU: '',
            MnNombreMedicamento: '',
            MnCodigoMedicamento: '',
            MnLoteMedicamento: [],
            MnMedicamento: [],
            MnMIPRES: '',
            MnCantidadAuto: 0,
            MnIdLote: '',
            MnSaldoLote: '',
            MnValorUni: '',
            MnValorIVA: '',
            MnValorTotal: '',
            MnCoPago: '',
            // conveniosId: '',
            tipoId: '',
            parentescoId: '',
            idPaciente: '',
            sumValorTx: 0,
            sumIVAValorTx: 0,
            sumNetoValorTx: 0,
            sumFleteValorTx: 0,
            medioPagoId_1: '',
            medioPagoId_2: '',
            medioPagoId_3: '',
            valorPagoId_1: '',
            valorPagoId_2: '',
            valorPagoId_3: '',
            comentario: '',
            valorPagado: '',
            cambio: '',
            RIdentificacion: '',
            RNombre: '',
            pdf_nroEntrega: '',
            pdf_convenio: '',
            pdf_fecha: '',
            pdf_nombrePaciente: '',
            pdf_tpEntrega: '',
            pdf_nitPaciente: '',
            pdf_observaciones: '',
            pdf_Elaborado: '',
            pdf_Reclamante: '',
            pdf_idReclamante: '',
            pdf_Telefono: '',
            pdf_Celular: '',
            pdf_Barrio: '',
            pdf_Direccion: '',
            pdf_FhEntrega: '',
            pdf_TD: '',
            pdf_Pagado: '',
            pdf_Bodega: '',
            pdf_convenio_interpolaridad: '',
            TpEntregaMvto: [],
            conveniosIdBlock: false,
            tipoEntregaIdBlock: false
        });
    }

    distinctJson() {
        let history = this.props.history;
        getListSelect('Obtener_datos_paciente_interpolaridad', '/tipoDoc/' + this.state.tipoId.value + '/convenio/' + this.state.conveniosId.value + '/id/' + this.state.idPaciente, history).then(listdata => {
            console.log(listdata);
            if (listdata != null) {
                if (listdata.orders.length > 0) {
                    let tmplistSaldosMed = [];
                    let tempArray = [];
                    let tempArrayAlert = [];
                    console.log(listdata.domicilios[0].observationOrder);

                    this.setState({
                        'comentario': listdata.domicilios[0].observationOrder,
                        sumFleteValorTx: listdata.domicilios[0].shippingFee,
                        sumValorTx: this.state.sumValorTx + listdata.domicilios[0].shippingFee
                    });
                    listdata.orders.forEach(item => {
                        console.log(item);
                        if (item.formula.status === 'N' && new Date(item.formula.fechaVencimiento).getTime() >= new Date().getTime()) {
                            let numOrden = item.orderNumber;
                            item.formula.tratamiento.forEach(element => {
                                if (element.producto.medicamento?.Medicamento !== undefined) {
                                    if (this.state.ListAlarmaMedicamentos.filter((items => items.idMedicamento === element.producto.medicamento.IdMedicamento)).length <= 0) {
                                        if (element.producto.medicamento.Medicamento.Barras
                                            || element.producto.medicamento.Medicamento.Regulado
                                            || element.producto.medicamento.Medicamento.Controlado
                                            || element.producto.medicamento.Medicamento.Fraccionable
                                            || element.producto.medicamento.Medicamento.Aplicacion
                                            || element.producto.medicamento.Medicamento.Fotosensible
                                            || element.producto.medicamento.Medicamento.Validar1ra
                                            || element.producto.medicamento.Medicamento.Educacion
                                            || element.producto.medicamento.Medicamento.Frio
                                            || element.producto.medicamento.Medicamento.Lasa
                                            || element.producto.medicamento.Medicamento.NoPOS) {
                                            tempArray.push({
                                                id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                nombre: 'No POS',
                                                aplica: element.producto.medicamento.Medicamento.NoPOS,
                                                idMedicamento: element.producto.medicamento.IdMedicamento
                                            });
                                            tempArray.push({
                                                id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                nombre: 'Requiere Lasa',
                                                aplica: element.producto.medicamento.Medicamento.Lasa,
                                                idMedicamento: element.producto.medicamento.IdMedicamento
                                            });
                                            tempArray.push({
                                                id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                nombre: 'Requiere Cadena de Frio',
                                                aplica: element.producto.medicamento.Medicamento.Frio,
                                                idMedicamento: element.producto.medicamento.IdMedicamento
                                            });
                                            tempArray.push({
                                                id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                nombre: 'Requiere Educacion',
                                                aplica: element.producto.medicamento.Medicamento.Educacion,
                                                idMedicamento: element.producto.medicamento.IdMedicamento
                                            });
                                            tempArray.push({
                                                id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                nombre: 'Validar 1ra Entrega',
                                                aplica: element.producto.medicamento.Medicamento.Validar1ra,
                                                idMedicamento: element.producto.medicamento.IdMedicamento
                                            });
                                            tempArray.push({
                                                id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                nombre: 'Es Fotosensible',
                                                aplica: element.producto.medicamento.Medicamento.Fotosensible,
                                                idMedicamento: element.producto.medicamento.IdMedicamento
                                            });
                                            tempArray.push({
                                                id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                nombre: 'Es Aplicacion',
                                                aplica: element.producto.medicamento.Medicamento.Aplicacion,
                                                idMedicamento: element.producto.medicamento.IdMedicamento
                                            });
                                            tempArray.push({
                                                id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                nombre: 'Es Fraccionable',
                                                aplica: element.producto.medicamento.Medicamento.Fraccionable,
                                                idMedicamento: element.producto.medicamento.IdMedicamento
                                            });
                                            tempArray.push({
                                                id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                nombre: 'Es Controlado',
                                                aplica: element.producto.medicamento.Medicamento.Controlado,
                                                idMedicamento: element.producto.medicamento.IdMedicamento
                                            });
                                            tempArray.push({
                                                id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                nombre: 'Es Regulado',
                                                aplica: element.producto.medicamento.Medicamento.Regulado,
                                                idMedicamento: element.producto.medicamento.IdMedicamento
                                            });
                                            tempArray.push({
                                                id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                nombre: 'Requiere Codigo Barras',
                                                aplica: element.producto.medicamento.Medicamento.Barras,
                                                idMedicamento: element.producto.medicamento.IdMedicamento
                                            });
                                            element.statusAlerta = 'alerta';
                                            tempArrayAlert.push({
                                                idMedicamento: element.producto.medicamento.IdMedicamento
                                            });
                                            this.setState({
                                                'ListAlarmaMedicamentos': tempArray,
                                                'cantAlarmas': tempArrayAlert
                                            });

                                        } else {
                                            element.statusAlerta = 'no'
                                        }
                                    }
                                    element.id = createUUID();
                                    element.saldosLoteSelect = { Saldo: 0 };
                                    element.saldosSelect = {};
                                    element.itemSelect = false;
                                    element.cantidadEntregada = 0;
                                    getListSelect('Medicamento', '/' + element.producto.medicamento.IdMedicamento + '?mostrarSaldos=true&Bodega=' + localStorage.getItem('BodegaID') + '&IdConvenio=' + this.state.conveniosId.value, this.props.history)
                                        .then(listdataMed => {
                                            let tempArray = [];
                                            let cantEntregada = element.cantidad;
                                            if (listdataMed.saldos !== undefined) {
                                                if (listdataMed.saldos !== null) {
                                                    let cantSaldoRecorrido = 0;
                                                    listdataMed.saldos.forEach(elementSaldo => {
                                                        if (elementSaldo.Lote !== null) {
                                                            tempArray.push({
                                                                label: elementSaldo.Lote,
                                                                value: elementSaldo.Lote,
                                                                bodega: elementSaldo.Bodega,
                                                                FechaVto: elementSaldo.FechaVto,
                                                                Saldo: elementSaldo.Saldo,
                                                                IdMedicamento: element.producto.medicamento.IdMedicamento,
                                                                IdOrden: numOrden,
                                                                Id: element.id
                                                            });
                                                            if (cantSaldoRecorrido === 0 && element.cantidadEntregada === 0) {
                                                                element.itemSelect = true;
                                                                //sumValorTx = (item.interop.formula.cobro.valor);
                                                                this.setState({
                                                                    'sumValorTx': this.state.sumValorTx + (item.interop.formula.cobro.valor),
                                                                    sumNetoValorTx: this.state.sumNetoValorTx + (item.interop.formula.cobro.valor),
                                                                });

                                                                if (elementSaldo.Saldo <= element.cantidad) {
                                                                    element.cantidadEntregada = elementSaldo.Saldo;
                                                                } else {
                                                                    element.cantidadEntregada = element.cantidad;
                                                                }
                                                                element.saldosSelect = tempArray[cantSaldoRecorrido];
                                                                element.saldosLoteSelect = tempArray[0];
                                                            }
                                                            tmplistSaldosMed.push(tempArray);
                                                            this.state.listSaldosMed.push(tempArray);
                                                            cantEntregada -= element.cantidadEntregada;
                                                            cantSaldoRecorrido += 1;
                                                        }
                                                    });

                                                    element.saldos = tempArray;
                                                    if (cantEntregada > 0 && listdataMed.saldos.length > 1) {
                                                        this.newFila(item, element)
                                                    }
                                                }
                                            }
                                            if (listdataMed.vigencias !== undefined) {
                                                if (listdataMed.vigencias.length > 0) {
                                                    element.producto.medicamento.vigenciasFechaFinal = listdataMed.vigencias[0].codigoplu;
                                                    if (listdataMed.vigencias[0]?.fechafinal != '') {
                                                        if (new Date(listdataMed.vigencias[0].fechafinal).getTime() >= new Date().getTime()) {
                                                            element = '';
                                                        }
                                                    }
                                                }
                                            }


                                            this.setState({
                                                listSaldosMed: tmplistSaldosMed
                                            });
                                        });
                                }
                            });
                            this.state.IsShow.push(item.orderNumber);
                        }
                        syncDelay(400);

                        this.setState({
                            'ListNivel': listdata.orders,
                            listSaldosMed: tmplistSaldosMed,
                        });
                    });
                } else {
                    swal('Advertencia', 'No se encontraron Domicilios con la informacion ingresada', 'warning');
                }
            }
            else {
                swal('Advertencia', 'No se encontraron Domicilios con la informacion ingresada', 'warning');
            }
            this.setState({
                showLoading: false
            });
        });
    }

    ObtenerDetails(id) {
        id = String(id).replace('[', '').replace(']', '');
        var orden = this.state.ListNivel.filter(items => items.id + items.orderNumber === parseInt(id));
        this.setState({
            'Listdetails': orden[0].formula.tratamiento
        });
    }

    toggleDetails(items) {
        if (this.state.IsShow.includes(items.orderNumber)) {

            const position = this.state.IsShow.indexOf(items.orderNumber)
            this.state.IsShow.splice(position, 1)
        }
        else {
            this.state.IsShow.push(items.orderNumber);
        }
        this.setState({
            'IsShow': this.state.IsShow
        });
    }

    newFila(itemOrden, itemProducto) {
        let newProduc = this.onDuplicateProducto(itemProducto);
        const newList = this.state.ListNivel.map((item) => {
            if (item.orderNumber === itemOrden.orderNumber) {
                let cantEntregado = itemProducto.cantidad;
                itemProducto.ProdDuplicado = true;
                item.formula.tratamiento.forEach(elementSaldo => {
                    cantEntregado -= elementSaldo.cantidadEntregada
                });
                if (cantEntregado > 0) {
                    itemProducto.saldos.forEach(elementSaldo => {
                        if (elementSaldo.value !== itemProducto.saldosSelect.value) {
                            newProduc.saldosSelect = elementSaldo;
                            newProduc.saldosLoteSelect = elementSaldo;
                            if (elementSaldo.Saldo <= cantEntregado) {
                                newProduc.cantidadEntregada = elementSaldo.Saldo;
                            } else {
                                newProduc.cantidadEntregada = cantEntregado;
                            }
                        }
                    });
                    item.formula.tratamiento.push(newProduc);
                }
            }
            return item;
        });

        this.setState({
            'ListNivel': newList
        });
        this.state.IsShow.push(itemOrden.orderNumber);
    }

    deleteFila(itemOrden, itemProducto) {
        if (itemProducto.ProdDuplicado === true) {
            swal("Eliminar items", "Favor confirme que desea inactivar el items", "warning", {
                buttons: ["Cancelar", "Confirmar"],
            })
                .then((value) => {
                    if (value === true) {
                        console.log(itemProducto.id);
                        const newList = this.state.ListNivel.map((item) => {
                            console.log(item.formula.tratamiento);
                            if (item.orderNumber === itemOrden.orderNumber) {
                                item.formula.tratamiento.forEach(function (currentValue, index, arr) {
                                    console.log(item.formula.tratamiento[index].id);
                                    if (item.formula.tratamiento[index].id === itemProducto.id) {
                                        console.log(index);
                                        item.formula.tratamiento.splice(index, 1);
                                        console.log(item.formula.tratamiento);
                                    }
                                });
                            }
                            return item;
                        });

                        this.setState({
                            'ListNivel': newList
                        });
                    }
                });
        } else {
            swal('Advertencia', 'No se puede eliminar Itemns no se encuentra duplicado', 'warning');
        }
    }

    selectItemProducto(select) {
        var jsonSelect = usersData.filter(items => items.id === select.id && items.medicamento === select.medicamento);
        var total = (jsonSelect[0].total).replace('$', '').replace('.', '');
        for (var i = 0; i < usersData.length; i++) {
            if (usersData[i].id === select.id) {
                usersData[i].totalSelect = total;
            }
        }
    }

    openAlertMarcaPaciente(openPop) {
        this.setState({
            showAlertMarcasPacientes: openPop,
        });
    }

    openAlertMedicamentos(item, openPop) {
        this.setState({
            showAlertMedicamentos: openPop,
            nameMedicamentos: item.producto.medicamento.IdMedicamento + ' ' + item.producto.descripcion,
            idAlarmaMedicamentos: item.producto.medicamento.IdMedicamento
        });
        console.log(this.state.nameMedicamentos);
        console.log(this.state.idAlarmaMedicamentos);
        console.log(this.state.ListAlarmaMedicamentos);
    }

    onOpenBuscarMedicamento() {
        this.setState({
            showBuscarMedicamento: this.state.showBuscarMedicamento === true ? false : true
        });

    }

    onOpenBuscarSaldoMedicamento(item, openPop) {
        this.setState({
            nameMedicamentos: item.producto.medicamento.IdMedicamento + ' ' + item.producto.descripcion,
            showBuscarSaldosMedicamento: openPop
        });
        this.onBuscarSaldosMedicamento(item.producto.medicamento.Medicamento.IdMedicamento)
    }

    openMediosPagos(item, openPop) {
        this.setState({
            showAlertMedicamentos: openPop,
            nameMedicamentos: item.producto.medicamento.IdMedicamento + ' ' + item.producto.descripcion,
            idAlarmaMedicamentos: item.producto.medicamento.IdMedicamento
        });
    }

    onHideAlertMedicamentos(id) {
        this.setState({
            showAlertMedicamentos: false
        });
    }

    onHideBuscarMedicamento() {
        this.setState({
            showBuscarMedicamento: false
        });
    }

    onHideBuscarSaldoMedicamento() {
        this.setState({
            showBuscarSaldosMedicamento: false
        });
    }

    onHideAlertMarcaPaciente(id) {
        this.setState({
            showAlertMarcasPacientes: false
        });
    }

    onInputchange(event) {
        if (event.target.name === 'checkboxAllOrden') {
            this.onChangeAllOrden(event.target.value);
        } else if (event.target.name === 'checkboxItemsOrden') {
            this.onChangeItemOrden(event.target.value);
        } else if (event.target.name === 'idPaciente') {
            this.setState({
                [event.target.name]: toUPPER(event.target.value)
            });
            if (event.code === 'Tab') {
                if (this.state.conveniosId !== "" && this.state.tipoEntregaId !== "") {
                    this.onChangeInfoPaciente(event.target.value);

                    this.setState({
                        'tipoEntregaIdBlock': true,
                        'conveniosIdBlock': true
                    });
                } else {
                    swal('Advertencia', 'Debe Seleccionar Convenio y Tipo Entrega', 'warning');
                }
            }
        }
        else if (event.target.name === 'MnPLU') {
            this.setState({
                [event.target.name]: toUPPER(event.target.value)
            });
            if (event.code === 'Tab') {
                this.onBuscarMedicamentoPlu('', event.target.value);
            }
        }
        else if (event.target.id.split(';')[1] === 'Currency') {
            let num = removeformatCurrency(event.target.value)
            this.setState({
                [event.target.name]: formatCurrency('en-US', 'USD', 0, num)
            });

            if (event.target.id.split(';')[0].includes('valorPagoId')) {
                let valorPagoId1 = 0;
                let valorPagoId2 = 0;
                let valorPagoId3 = 0;
                if (this.state.valorPagoId_1 !== '') {
                    valorPagoId1 = parseFloat(removeformatCurrency(this.state.valorPagoId_1));
                }
                if (this.state.valorPagoId_2 !== '') {
                    valorPagoId2 = parseFloat(removeformatCurrency(this.state.valorPagoId_2));
                }
                if (this.state.valorPagoId_3 !== '') {
                    valorPagoId3 = parseFloat(removeformatCurrency(this.state.valorPagoId_3));
                }

                let sumValorPagado =
                    (event.target.name === 'valorPagoId_1' ? num : valorPagoId1) +
                    (event.target.name === 'valorPagoId_2' ? num : valorPagoId2) +
                    (event.target.name === 'valorPagoId_3' ? num : valorPagoId3);

                console.log(this.state.sumValorTx);
                let cambio = sumValorPagado - parseFloat(this.state.sumValorTx);
                this.setState({
                    valorPagado: formatCurrency('en-US', 'USD', 0, sumValorPagado),
                    cambio: formatCurrency('en-US', 'USD', 0, cambio)
                });
            }

            let MnValorUni = removeformatCurrency(this.state.MnValorUni);
            let MnValorIVA = removeformatCurrency(this.state.MnValorIVA);
            if (this.state.MnCantidadEnt > 0 && MnValorUni >= 0 && MnValorIVA >= 0) {
                let num = (this.state.MnCantidadEnt * MnValorUni) * (1 - (MnValorIVA / 100));
                this.setState({
                    MnValorTotal: formatCurrency('en-US', 'USD', 0, num)
                });
            }


        }
        else if (event.target.name === 'MnCantidadEnt') {
            if (this.state.MnCantidadAuto > 0) {
                if (event.target.value !== '') {
                    if (parseInt(this.state.MnCantidadAuto) >= parseInt(event.target.value)) {
                        this.setState({
                            [event.target.name]: toUPPER(event.target.value)
                        });
                        let MnValorUni = removeformatCurrency(this.state.MnValorUni);
                        let MnValorIVA = removeformatCurrency(this.state.MnValorIVA);
                        if (this.state.MnCantidadEnt > 0 && MnValorUni >= 0 && MnValorIVA >= 0) {
                            let num = (this.state.MnCantidadEnt * MnValorUni) + MnValorIVA;
                            this.setState({
                                MnValorTotal: formatCurrency('en-US', 'USD', 0, num)
                            });
                        }
                    } else {
                        swal('Advertencia', 'La Cantidad Entregada no puede ser MAYOR a la Autorizada', 'warning');
                    }
                } else {
                    this.setState({
                        [event.target.name]: toUPPER(event.target.value)
                    });
                }
            } else {
                swal('Advertencia', 'Debe Ingresar Primero la CANTIDAD AUTORIZADA', 'warning');
            }
        }
        else if (event.target.name === 'MnCantidadAuto') {
            this.setState({
                [event.target.name]: toUPPER(event.target.value)
            });
            if (event.code === 'Tab') {
                if (this.state.MnNombreMedicamento !== '') {
                    if (this.state.MnLoteMedicamento.length > 0 && this.state.MnLoteMedicamento[0].label !== null) {
                        this.state.MnLoteMedicamento.forEach(elementSaldo => {
                            console.log(elementSaldo);
                            console.log(this.state.MnCantidadEnt);
                            if (elementSaldo.Saldo >= event.target.value && (this.state.MnCantidadEnt === 0 || this.state.MnCantidadEnt === '')) {
                                this.setState({
                                    'MnIdLote': elementSaldo,
                                    'MnCantidadEnt': event.target.value,
                                    'MnSaldoLote': elementSaldo.Saldo
                                });
                            }
                        });

                    } else {
                        swal('Advertencia', 'El Medicamento buscado no tiene lote para hacer la entrega', 'warning');
                    }
                } else {
                    swal('Advertencia', 'Debe Ingresar El Medicamento Primero', 'warning');
                }
            }
        }
        else if (event.target.id.split(';')[0] === 'item_cantidadEntregada') {
            const newList = this.state.ListNivel.map((item) => {
                if (item.orderNumber === event.target.id.split(';')[1]) {//ORDEN
                    item.formula.tratamiento.forEach(elementProduct => {
                        if (elementProduct.id === event.target.id.split(';')[2]) {//ID
                            console.log(elementProduct);
                            elementProduct.cantidadEntregada = 0;
                            elementProduct.itemSelect = false;
                            if (elementProduct.cantidad >= event.target.value && elementProduct.saldosLoteSelect.Saldo >= event.target.value) {
                                elementProduct.cantidadEntregada = event.target.value
                            }
                            else {
                                if (elementProduct.saldosLoteSelect.Saldo >= elementProduct.cantidad) {
                                    elementProduct.cantidadEntregada = elementProduct.cantidad
                                } else {
                                    elementProduct.cantidadEntregada = elementProduct.saldosLoteSelect.Saldo
                                }
                            }
                            if (elementProduct.cantidadEntregada > 0) {
                                elementProduct.itemSelect = true;
                            }

                            return elementProduct.updatedItem;
                        }
                    });
                }
                return item;
            });
            this.setState({
                'ListNivel': newList
            });
        }
        else {

            this.setState({
                [event.target.name]: toUPPER(event.target.value)
            });
        }
    }

    onSelectchange(selector, event) {
        this.setState({
            [selector]: event
        });
        if (selector === 'conveniosId' && event !== null) {
            let existConvenio = this.state.listConveniosAllData.find(i => i.IdConvenio === event.value);
            this.setState({
                'ccInterpolaridad': existConvenio.Interop
            });
        }
        if (selector === 'TpSaldoId') {
            const newList = this.state.ListNivel.map((item) => {
                if (item.orderNumber === event.IdOrden) {
                    item.formula.tratamiento.forEach(elementProduct => {
                        if (elementProduct.id === event.Id) {
                            elementProduct.saldosLoteSelect = event
                            return elementProduct.updatedItem;
                        }
                    });
                }
                return item;
            });
            this.setState({
                'ListNivel': newList
            });
        }
        if (selector === 'MnIdLote') {
            if (event.value !== null) {
                this.setState({
                    'MnSaldoLote': event.Saldo
                });
            }
        }

        if (this.state.conveniosId !== "" || this.state.tipoEntregaId !== "") {
            if (selector === "conveniosId" || selector === "tipoEntregaId") {
                this.setState({
                    'tipoEntregaIdBlock': true,
                    'conveniosIdBlock': true
                });
            }
        }
    }

    onChangeAllOrden(id) {
        var orden = this.state.ListNivel.filter(items => items.id === id);
        orden[0].ordenSelect = orden[0].ordenSelect === true ? false : true;
        orden[0].medicamento.map(elemento => (
            elemento.itemSelect = elemento.itemSelect === true ? false : true
        ));
        this.setState({
            'ListNivel': this.state.ListNivel
        });
    }

    onChangeItemOrden(id) {
        let ordenId = id.split(';')[0];
        let serialId = id.split(';')[1];
        var orden = this.state.ListNivel.filter(items => items.orderNumber === ordenId);
        if (orden.length > 0) {
            orden[0].formula.tratamiento.filter(items => items.id === serialId).forEach(elemento => {
                elemento.itemSelect = elemento.itemSelect === true ? false : true
            });
        }
        this.setState({
            'ListNivel': this.state.ListNivel
        });
    }

    onGoInfoPaciente(id) {
        if (this.state.infoPaciente.length > 0) { window.open(window.location.origin + `#/Maestros/paciente/${id}`, '_blank', ''); }
        else {
            swal('Advertencia', 'Ingrese el Paciente', 'warning');
        }
    }

    onGoInfoMedicamento(id) {
        if (id != undefined) { window.open(window.location.origin + `#/Maestros/medicamento/${id}`, '_blank', ''); }
        else {
            swal('Advertencia', 'Ingrese el Paciente', 'warning');
        }
    }

    onChangeInfoPaciente(id) {
        this.setState({
            showLoading: true
        });
        if (id.length > 0) {
            getListSelect('Paciente', '/' + id, this.props.history).then(listdata => {
                console.log(listdata)
                if (listdata !== null) {
                    const tempArray = [];
                    tempArray.push({
                        nombreCompleto: listdata.Nombre,
                        tipoIdentificacion: this.state.listTiposId.find(i => i.value === listdata.IdTipoId),
                        fechaNacimiento: listdata.FhNacimiento,
                        Pmarcas: listdata.Marcas.length > 0 ? true : false,
                    });
                    this.setState({
                        bloqueoidPaciente: true,
                        showLoading: false,
                        'infoPaciente': tempArray,
                        ListMarcasPaciente: listdata.Marcas,
                        tipoId: this.state.listTiposId.find(i => i.value === listdata.IdTipoId),
                        parentescoId: this.state.listParentescos.find(i => i.value === '0'),
                        RIdentificacion: id,
                        RNombre: toUPPER(listdata.Nombre)
                    });

                    this.onCallEntregasPaciente();
                } else {
                    this.setState({
                        showLoading: false
                    });
                    //if (this.state.ccInterpolaridad === false) {
                    swal({
                        title: 'Advertencia',
                        text: 'Usuario No existente Desea Crearlo?',
                        icon: 'warning',
                        buttons: ['Cancelar', 'Crear'],
                    })
                        .then((willDelete) => {
                            if (willDelete) {
                                localStorage.setItem('patient_creation_interpolarity', this.state.ccInterpolaridad);
                                localStorage.setItem('patient_creation_interpolarity_convenio', this.state.conveniosId.value);
                                window.open(window.location.origin + `#/Maestros/paciente/${id}`, '_blank', '');
                            }
                        });
                    /*} else {
                        swal('Advertencia', 'No se encontro informacion con la Cedula Ingresada', 'warning');
                    }*/
                }
            });
        }
        else {
            this.setState({
                showLoading: false
            });
        }

    }

    onChangeInfoMedicamento(id) {
        this.setState({
            MnNombreMedicamento: '',
            MnCodigoMedicamento: '',
            MnLoteMedicamento: '',
            MnMedicamento: []
        });
        getListSelect('Medicamento', '/' + id + '?mostrarSaldos=true&Bodega=' + localStorage.getItem('BodegaID'), this.props.history).then(listdata => {
            let tempArray = [];
            if (listdata.saldos !== undefined && listdata.saldos !== null) {
                listdata.saldos.forEach(elementSaldo => {
                    tempArray.push({
                        label: elementSaldo.Lote,
                        value: elementSaldo.Lote,
                        bodega: elementSaldo.Bodega,
                        FechaVto: elementSaldo.FechaVto,
                        Saldo: elementSaldo.Saldo,
                        IdMedicamento: id,
                        Id: createUUID()
                    });
                    this.state.listSaldosMed.push(tempArray);
                });
            } else {
                swal('Advertencia', 'Productos sin Saldos', 'warning');
            }

            this.setState({
                MnNombreMedicamento: listdata.Nombre,
                MnCodigoMedicamento: listdata.CodigoERP,
                MnLoteMedicamento: tempArray,
                MnMedicamento: listdata
            });
        });
    }

    onAcumularOrdenManual() {
        validateRequiredFields(this.state, camposRequiredAcumulacionManual).then(result => {
            if (result) {
                let statusAlerta;
                let producto = [];
                let tratamiento = [];
                let formula = [];
                let cobro = [];
                let pplArray = [];
                let interpol = [];
                let dosis = [];
                let plan = [];
                let aseguradora = [];
                let Medicamento = [];
                let tempArraySaldos = [];
                let tempArrayAlert = [];
                let id = createUUID();
                if (this.state.MnMedicamento.Barras
                    || this.state.MnMedicamento.Regulado
                    || this.state.MnMedicamento.Controlado
                    || this.state.MnMedicamento.Fraccionable
                    || this.state.MnMedicamento.Aplicacion
                    || this.state.MnMedicamento.Fotosensible
                    || this.state.MnMedicamento.Validar1ra
                    || this.state.MnMedicamento.Educacion
                    || this.state.MnMedicamento.Frio
                    || this.state.MnMedicamento.Lasa
                    || this.state.MnMedicamento.NoPOS) {
                    let tempArray = [];
                    tempArray.push({
                        id: 'alertMedi' + tempArray.length + '0' + this.state.MnNroOrden,
                        nombre: 'No POS',
                        aplica: this.state.MnMedicamento.NoPOS
                    });
                    tempArray.push({
                        id: 'alertMedi' + tempArray.length + '0' + this.state.MnNroOrden,
                        nombre: 'Requiere Lasa',
                        aplica: this.state.MnMedicamento.Lasa,
                        idMedicamento: this.state.MnMedicamento.IdMedicamento
                    });
                    tempArray.push({
                        id: 'alertMedi' + tempArray.length + '0' + this.state.MnNroOrden,
                        nombre: 'Requiere Cadena de Frio',
                        aplica: this.state.MnMedicamento.Frio,
                        idMedicamento: this.state.MnMedicamento.IdMedicamento
                    });
                    tempArray.push({
                        id: 'alertMedi' + tempArray.length + '0' + this.state.MnNroOrden,
                        nombre: 'Requiere Educacion',
                        aplica: this.state.MnMedicamento.Educacion,
                        idMedicamento: this.state.MnMedicamento.IdMedicamento
                    });
                    tempArray.push({
                        id: 'alertMedi' + tempArray.length + '0' + this.state.MnNroOrden,
                        nombre: 'Validar 1ra Entrega',
                        aplica: this.state.MnMedicamento.Validar1ra,
                        idMedicamento: this.state.MnMedicamento.IdMedicamento
                    });
                    tempArray.push({
                        id: 'alertMedi' + tempArray.length + '0' + this.state.MnNroOrden,
                        nombre: 'Es Fotosensible',
                        aplica: this.state.MnMedicamento.Fotosensible,
                        idMedicamento: this.state.MnMedicamento.IdMedicamento
                    });
                    tempArray.push({
                        id: 'alertMedi' + tempArray.length + '0' + this.state.MnNroOrden,
                        nombre: 'Es Aplicacion',
                        aplica: this.state.MnMedicamento.Aplicacion,
                        idMedicamento: this.state.MnMedicamento.IdMedicamento
                    });
                    tempArray.push({
                        id: 'alertMedi' + tempArray.length + '0' + this.state.MnNroOrden,
                        nombre: 'Es Fraccionable',
                        aplica: this.state.MnMedicamento.Fraccionable,
                        idMedicamento: this.state.MnMedicamento.IdMedicamento
                    });
                    tempArray.push({
                        id: 'alertMedi' + tempArray.length + '0' + this.state.MnNroOrden,
                        nombre: 'Es Controlado',
                        aplica: this.state.MnMedicamento.Controlado,
                        idMedicamento: this.state.MnMedicamento.IdMedicamento
                    });
                    tempArray.push({
                        id: 'alertMedi' + tempArray.length + '0' + this.state.MnNroOrden,
                        nombre: 'Es Regulado',
                        aplica: this.state.MnMedicamento.Regulado,
                        idMedicamento: this.state.MnMedicamento.IdMedicamento
                    });
                    tempArray.push({
                        id: 'alertMedi' + tempArray.length + '0' + this.state.MnNroOrden,
                        nombre: 'Requiere Codigo Barras',
                        aplica: this.state.MnMedicamento.Barras,
                        idMedicamento: this.state.MnMedicamento.IdMedicamento
                    });
                    statusAlerta = 'alerta';
                    tempArrayAlert.push({
                        idMedicamento: this.state.MnMedicamento.IdMedicamento
                    });
                    this.setState({
                        'ListAlarmaMedicamentos': tempArray,
                        'cantAlarmas': tempArrayAlert
                    });

                } else {
                    statusAlerta = 'no'
                }

                if (this.state.MnLoteMedicamento !== undefined) {
                    this.state.MnLoteMedicamento.forEach(elementSaldo => {
                        tempArraySaldos.push({
                            label: elementSaldo.label,
                            value: elementSaldo.label,
                            bodega: elementSaldo.bodega,
                            FechaVto: elementSaldo.FechaVto,
                            Saldo: elementSaldo.Saldo,
                            IdMedicamento: this.state.MnMedicamento.IdMedicamento,
                            IdOrden: this.state.MnNroOrden,
                            Id: id
                        });
                    })

                }
                dosis.push({
                    duracion: { cantidad: 0 },
                });


                Medicamento.push({
                    MarcaCcial: 'NA'
                })

                let MnMedicamento = this.state.MnMedicamento;
                MnMedicamento.Precio = removeformatCurrency(this.state.MnValorUni)
                MnMedicamento.PctajeIVA = removeformatCurrency(this.state.MnValorIVA)
                MnMedicamento.Medicamento = Medicamento[0];

                this.setState({
                    MnMedicamento: MnMedicamento
                });
                producto.push({
                    descripcion: this.state.MnNombreMedicamento,
                    cantidadDeEntregas: this.state.MnCantidadAuto,
                    medicamento: MnMedicamento,
                });
                tratamiento.push({
                    cantidad: this.state.MnCantidadAuto,
                    producto: producto[0],
                    itemSelect: true,
                    id: id,
                    saldosLoteSelect: { Saldo: this.state.MnIdLote.Saldo },
                    saldosSelect: this.state.MnIdLote,
                    statusAlerta: statusAlerta,
                    saldos: tempArraySaldos,
                    dosis: dosis[0]
                });
                cobro.push({
                    valor: removeformatCurrency(this.state.MnValorTotal)
                })
                formula.push({
                    fechaVencimiento: this.state.MnVtofhOrden,
                    fechaServicio: this.state.MnfhOrden,
                    tratamiento: tratamiento,
                    cobro: cobro[0]
                });

                plan.push({
                    nombre: ''
                });

                aseguradora.push({
                    plan: plan[0]
                })

                interpol.push({
                    formula: formula[0],
                    aseguradora: aseguradora[0]
                });

                pplArray.push({
                    identificationType: this.state.tipoId,
                    identification: this.state.idPaciente,
                    orderNumber: this.state.MnNroOrden,
                    formula: formula[0],
                    interop: interpol[0]
                });

                console.log(pplArray);

                let json = pplArray;

                this.state.IsShow.push(this.state.MnNroOrden);

                this.setState({
                    'ListNivel': json
                });


            }
        });
    }

    onDuplicateProducto(dataProducto) {
        let id = createUUID();
        let producto = [];
        let tratamiento = [];
        let saldo = [];
        producto.push({
            descripcion: dataProducto.producto.descripcion,
            cantidadDeEntregas: dataProducto.producto.cantidadDeEntregas,
            numeroEntregaActual: dataProducto.producto.numeroEntregaActual,
            medicamento: dataProducto.producto.medicamento,
        });

        dataProducto.saldos.forEach(elementProduct => {
            saldo.push({
                Id: id,
                label: elementProduct.label,
                value: elementProduct.value,
                bodega: elementProduct.bodega,
                Saldo: elementProduct.Saldo,
                IdOrden: elementProduct.IdOrden,
                IdMedicamento: elementProduct.IdMedicamento,
                FechaVto: elementProduct.FechaVto
            });
        });

        tratamiento.push({
            cantidad: dataProducto.cantidad,
            producto: producto[0],
            itemSelect: true,
            id: id,
            saldosLoteSelect: dataProducto.saldosLoteSelect,
            saldosSelect: dataProducto.saldosSelect,
            statusAlerta: dataProducto.statusAlerta,
            saldos: saldo,
            dosis: dataProducto.dosis
        });
        let jsonP = tratamiento[0];
        return jsonP;
    }

    onSaveEntrega() {
        //VALIDA ENCABEZADO
        validateRequiredFields(this.state, camposRequiredEncabezado).then(result => {
            if (result) {
                this.setState({ 'showLoading': true });
                let tempArrayBody = [];
                let guardarPendientes = false;
                //VALIDA CUERPO
                let cantFaltaEntrega = 0;
                this.state.ListNivel.map((item) => {
                    item.formula.tratamiento.map((itemTratamiento) => {
                        console.log(itemTratamiento);
                        console.log(itemTratamiento.itemSelect);
                        if (itemTratamiento.itemSelect === true || itemTratamiento.itemSelect === "true") {
                            tempArrayBody.push({
                                IdPlan: item.interop.aseguradora.plan.codigo,
                                Orden: item.orderNumber,
                                Fecha: new Date(),
                                FechaVto: item.formula.fechaVencimiento,
                                IdMedicamento: itemTratamiento.producto.medicamento.IdMedicamento,
                                PLU: itemTratamiento.producto.medicamento.PLU,
                                Nombre: itemTratamiento.producto.medicamento.Medicamento.Nombre,
                                QtyOrden: itemTratamiento.cantidad,
                                QtyEntrega: parseFloat(itemTratamiento.cantidadEntregada),
                                IdLote: itemTratamiento.saldosLoteSelect.value,
                                Entregas: itemTratamiento.producto.cantidadDeEntregas,
                                Actual: itemTratamiento.producto.numeroEntregaActual,
                                Mipres: item.formula.mipres,
                                DiasTto: itemTratamiento.dosis.duracion.cantidad,
                                Valor: itemTratamiento.producto.medicamento.Precio,
                                PctajeIVA: itemTratamiento.producto.medicamento.PctajeIVA,
                                PctajeDto: 0,
                                Barra: itemTratamiento.producto.medicamento.Medicamento.Barras + '',
                            });
                            cantFaltaEntrega += 1;
                        }
                    });
                });
                let tempArrayMedioPago = [];
                if (cantFaltaEntrega <= 0) {
                    swal("Guardar Pendietes", "No se ha seleccionado ningun medicamento, desea Guardar Solo Pendientes?", "warning", {
                        buttons: ["Cancelar", "Confirmar"],
                    })
                        .then((value) => {
                            if (value === true) {
                                guardarPendientes = true;

                                let tempArrayHeader = [];
                                tempArrayHeader.push({
                                    Prefijo: '',
                                    FijadoRE: '',
                                    Fecha: formatDateP(new Date(), 'DD-MM-yyyy'),
                                    Hora: formatDateP(new Date(), 'HH:mm:ss'),
                                    IdTipoEntrega: this.state.tipoEntregaId.value,
                                    Reclamante: this.state.RNombre,
                                    IdReclamante: this.state.RIdentificacion,
                                    IdParentesco: this.state.parentescoId.value,
                                    IdTipoId: this.state.tipoId.value,
                                    IdConvenio: this.state.conveniosId.value,
                                    IdPaciente: this.state.idPaciente,
                                    FhNotificado: '',
                                    Notificado: '',
                                    Fh_Entrega: new Date(),
                                    IdUsuario: localStorage.getItem('LoginUsers'),
                                    NumeroERP2: '',
                                    TDERP2: '',
                                    TD2: '',
                                    IdConsecutivo2: '',
                                    NumeroERP: '',
                                    TDERP: '',
                                    TD: '',
                                    IdConsecutivo: '',
                                    Completo: cantFaltaEntrega > 0 ? false : true,
                                    Cambio: this.state.cambio === '' ? 0 : parseFloat(removeformatCurrency(this.state.cambio)),
                                    Pagado: this.state.valorPagado === '' ? 0 : parseFloat(removeformatCurrency(this.state.valorPagado)),
                                    Total: this.state.sumValorTx,
                                    ValorDOM: this.state.sumFleteValorTx,
                                    ValorCR: 0, //cuota retorno
                                    ValorCM: 0,//cuota moderadora
                                    ValorCOP: this.state.sumValorTx, // copago
                                    ValorDto: 0,
                                    ValorIVA: this.state.sumIVAValorTx,
                                    ValorBruto: this.state.sumNetoValorTx,
                                    //EntregasCuadres: tempArrayMedioPago
                                });

                                if (tempArrayMedioPago.length > 0) {
                                    tempArrayHeader.EntregasCuadres = tempArrayMedioPago
                                }

                                const datasend = {
                                    header: tempArrayHeader[0],
                                    body: tempArrayBody,
                                }
                                console.log(datasend);
                                let history = this.props.history;
                                AddItem(datasend, 'Procesar_entregas;post', history, '').then(result => {
                                    console.log(result);
                                    this.setState({ 'showLoading': false });
                                    if (!result.error) {
                                        this.onPrintRecibo(result);
                                        this.onInputclear();
                                    }
                                });
                            }
                        });
                } else {
                    if (cantFaltaEntrega > 0) {
                        //FORMAS DE PAGO
                        console.log(this.state.valorPagado);
                        console.log(this.state.sumValorTx);
                        let pagoValidado = true;
                        //if (parseFloat(removeformatCurrency(this.state.valorPagado)) >= this.state.sumValorTx) {
                        if (this.state.sumValorTx > 0) {
                            validateRequiredFields(this.state, camposRequiredMedioPago).then(result => {
                                if (result) {
                                    if (this.state.medioPagoId_1.value !== '' || this.state.medioPagoId_1.value !== null || this.state.medioPagoId_1.value !== undefined) {
                                        tempArrayMedioPago.push({
                                            Prefijo: '',
                                            IdMedioPago: this.state.medioPagoId_1.value,
                                            Valor: parseFloat(removeformatCurrency(this.state.valorPagoId_1)),
                                            Referencia: '',
                                            IdUsuario: localStorage.getItem('LoginUsers'),
                                            Fh_Entrega: new Date(),
                                        });
                                        pagoValidado = true;
                                    } else {
                                        pagoValidado = false;
                                        swal('Advertencia', 'Debe seleccionar el medio de pago 1', 'warning');
                                    }
                                    if (this.state.valorPagoId_2 > 0) {
                                        if (this.state.medioPagoId_2.value !== '') {
                                            tempArrayMedioPago.push({
                                                Prefijo: '',
                                                IdMedioPago: this.state.medioPagoId_2.value,
                                                Valor: parseFloat(removeformatCurrency(this.state.valorPagoId_2)),
                                                Referencia: '',
                                                IdUsuario: localStorage.getItem('LoginUsers'),
                                                Fh_Entrega: new Date(),
                                            });
                                            pagoValidado = true;
                                        } else {
                                            pagoValidado = false;
                                            swal('Advertencia', 'Debe seleccionar el medio de pago 2', 'warning');
                                        }
                                    }
                                    if (this.state.valorPagoId_3 > 0) {
                                        if (this.state.medioPagoId_3.value !== '') {
                                            tempArrayMedioPago.push({
                                                Prefijo: '',
                                                IdMedioPago: this.state.medioPagoId_3.value,
                                                Valor: parseFloat(removeformatCurrency(this.state.valorPagoId_3)),
                                                Referencia: '',
                                                IdUsuario: localStorage.getItem('LoginUsers'),
                                                Fh_Entrega: new Date(),
                                            });
                                            pagoValidado = true;
                                        } else {
                                            pagoValidado = false;
                                            swal('Advertencia', 'Debe seleccionar el medio de pago 3', 'warning');
                                        }
                                    }

                                    let tempArrayHeader = [];
                                    tempArrayHeader.push({
                                        Prefijo: '',
                                        FijadoRE: '',
                                        Fecha: formatDateP(new Date(), 'DD-MM-yyyy'),
                                        Hora: formatDateP(new Date(), 'HH:mm:ss'),
                                        IdTipoEntrega: this.state.tipoEntregaId.value,
                                        Reclamante: this.state.RNombre,
                                        IdReclamante: this.state.RIdentificacion,
                                        IdParentesco: this.state.parentescoId.value,
                                        IdTipoId: this.state.tipoId.value,
                                        IdConvenio: this.state.conveniosId.value,
                                        IdPaciente: this.state.idPaciente,
                                        FhNotificado: '',
                                        Notificado: '',
                                        Fh_Entrega: new Date(),
                                        IdUsuario: localStorage.getItem('LoginUsers'),
                                        NumeroERP2: '',
                                        TDERP2: '',
                                        TD2: '',
                                        IdConsecutivo2: '',
                                        NumeroERP: '',
                                        TDERP: '',
                                        TD: '',
                                        IdConsecutivo: '',
                                        Completo: cantFaltaEntrega > 0 ? false : true,
                                        Cambio: this.state.cambio === '' ? 0 : parseFloat(removeformatCurrency(this.state.cambio)),
                                        Pagado: this.state.valorPagado === '' ? 0 : parseFloat(removeformatCurrency(this.state.valorPagado)),
                                        Total: this.state.sumValorTx,
                                        ValorDOM: this.state.sumFleteValorTx,
                                        ValorCR: 0, //cuota retorno
                                        ValorCM: 0,//cuota moderadora
                                        ValorCOP: this.state.sumValorTx, // copago
                                        ValorDto: 0,
                                        ValorIVA: this.state.sumIVAValorTx,
                                        ValorBruto: this.state.sumNetoValorTx,
                                        //  EntregasCuadres: tempArrayMedioPago
                                    });
                                    if (tempArrayMedioPago.length > 0) {
                                        tempArrayHeader.EntregasCuadres = tempArrayMedioPago
                                    }

                                    if (tempArrayBody.length > 0 && pagoValidado) {
                                        const datasend = {
                                            header: tempArrayHeader[0],
                                            body: tempArrayBody,
                                        }
                                        console.log(datasend);
                                        let history = this.props.history;
                                        AddItem(datasend, 'Procesar_entregas;post', history, '').then(result => {
                                            console.log(result);
                                            this.setState({ 'showLoading': false });
                                            if (!result.error) {
                                                this.onPrintRecibo(result);
                                                this.onInputclear();
                                            }
                                        });
                                    } else {
                                        this.setState({ 'showLoading': false });
                                        swal('Advertencia', 'No ha completado el registro de los medicamentos entregados o Las formas de pago', 'warning');
                                    }

                                } else {
                                    this.setState({ 'showLoading': false });
                                }
                            });
                        } else {
                            pagoValidado = true
                            let tempArrayHeader = [];
                            tempArrayHeader.push({
                                Prefijo: '',
                                FijadoRE: '',
                                Fecha: formatDateP(new Date(), 'DD-MM-yyyy'),
                                Hora: formatDateP(new Date(), 'HH:mm:ss'),
                                IdTipoEntrega: this.state.tipoEntregaId.value,
                                Reclamante: this.state.RNombre,
                                IdReclamante: this.state.RIdentificacion,
                                IdParentesco: this.state.parentescoId.value,
                                IdTipoId: this.state.tipoId.value,
                                IdConvenio: this.state.conveniosId.value,
                                IdPaciente: this.state.idPaciente,
                                FhNotificado: '',
                                Notificado: '',
                                Fh_Entrega: new Date(),
                                IdUsuario: localStorage.getItem('LoginUsers'),
                                NumeroERP2: '',
                                TDERP2: '',
                                TD2: '',
                                IdConsecutivo2: '',
                                NumeroERP: '',
                                TDERP: '',
                                TD: '',
                                IdConsecutivo: '',
                                Completo: cantFaltaEntrega > 0 ? false : true,
                                Cambio: this.state.cambio === '' ? 0 : parseFloat(removeformatCurrency(this.state.cambio)),
                                Pagado: this.state.valorPagado === '' ? 0 : parseFloat(removeformatCurrency(this.state.valorPagado)),
                                Total: this.state.sumValorTx,
                                ValorDOM: this.state.sumFleteValorTx,
                                ValorCR: 0,
                                ValorCM: 0,
                                ValorCOP: this.state.sumValorTx,
                                ValorDto: 0,
                                ValorIVA: this.state.sumIVAValorTx,
                                ValorBruto: this.state.sumNetoValorTx,
                                // EntregasCuadres: tempArrayMedioPago
                            });
                            if (tempArrayMedioPago.length > 0) {
                                tempArrayHeader.EntregasCuadres = tempArrayMedioPago
                            }

                            if (tempArrayBody.length > 0 && pagoValidado) {
                                const datasend = {
                                    header: tempArrayHeader[0],
                                    body: tempArrayBody,
                                }
                                console.log(datasend);
                                let history = this.props.history;
                                AddItem(datasend, 'Procesar_entregas;post', history, '').then(result => {
                                    this.setState({ 'showLoading': false });
                                    if (!result.error) {
                                        this.onPrintRecibo(result);
                                        this.onInputclear();
                                    }
                                });
                            } else {
                                this.setState({ 'showLoading': false });
                                swal('Advertencia', 'No ha completado el registro de los medicamentos entregados o Las formas de pago', 'warning');
                            }
                        }

                        // } else {
                        //     this.setState({ 'showLoading': false });
                        //     swal('Advertencia', 'No ha completado el pago', 'warning');
                        // }
                    } else {
                        this.setState({ 'showLoading': false });
                        swal('Advertencia', 'No hay medicamentos seleccionados para entregar', 'warning');
                    }
                }
            }
        });
    }

    onFindMedicamentoPopUp() {
        let textBuscar = '';
        if (this.state.BuscarNombreMedicamento !== '') {
            textBuscar = this.state.BuscarNombreMedicamento;
        }
        if (this.state.BuscarPLUMedicamento !== '') {
            textBuscar = this.state.BuscarPLUMedicament;
        }

        getListSelect('Medicamento', '?page=1&limit=200&search=' + textBuscar.trim() + '', this.props.history)
            .then(listdata => {
                this.setState({
                    'listBusquedaMedicamento': listdata.data
                });
            });
    }

    onSeleccionarBusquedaMedicamento(item) {
        console.log(item);
        this.setState({
            MnPLU: item.IdMedicamento,
        });
        this.onChangeInfoMedicamento(item.IdMedicamento);
        this.onBuscarMedicamentoPlu(item.IdMedicamento, '');
        this.onHideBuscarMedicamento();
    }

    onBuscarMedicamentoPlu(idMedicamento, plu) {
        let stringBusqueda = '';
        if (idMedicamento !== '') { stringBusqueda = '?IdMedicamento=' + idMedicamento + '&IdConvenio=' + this.state.idConvenio + '' }
        else if (plu !== '') { stringBusqueda = '?PLU=' + plu + '&IdConvenio=' + this.state.idConvenio + '' }

        getListSelect('MedicamentoPlu', stringBusqueda, this.props.history)
            .then(listdata => {
                console.log(listdata)
            });

        /* if (plu !== '')
        {
            this.onChangeInfoMedicamento(idMedicamento)
        } */

    }

    onPrintRecibo(resultado) {
        console.log(resultado);
        resultado.values.forEach(element => {
            this.setState({
                pdf_nroEntrega: element.entrega.Prefijo + ' ' + element.entrega.NoEntrega,
                pdf_convenio: this.state.conveniosId.label,
                pdf_fecha: formatDateP(element.entrega.Fecha, 'D MMM YYYY'),
                pdf_nombrePaciente: resultado.paciente.Nombre,
                pdf_tpEntrega: this.state.tipoEntregaId.label,
                pdf_nitPaciente: element.entrega.IdPaciente,
                pdf_observaciones: this.state.comentario,
                pdf_Elaborado: localStorage.getItem('LoginUsers'),
                pdf_Reclamante: element.entrega.Reclamante,
                pdf_idReclamante: element.entrega.IdReclamante,
                pdf_Telefono: resultado.paciente.Telefono,
                pdf_Celular: resultado.paciente.Celular,
                pdf_Barrio: resultado.paciente.Barrio,
                pdf_Direccion: resultado.paciente.Direccion,
                pdf_FhEntrega: formatDateP(element.entrega.Fh_Entrega, 'D MMM YYYY'),
                pdf_TD: element.entrega.TD,
                pdf_Pagado: element.entrega.Pagado,
                pdf_Bodega: element.entrega.IdBodega,
                pdf_convenio_interpolaridad: this.state.ccInterpolaridad,
                TpEntregaMvto: element.mvEntrega ? element.mvEntrega : (element.mvEntregas ? element.mvEntregas : null)
            });
        });
        syncDelay(300)
        window.print();
    }

    onCallEntregasPaciente() {
        getListSelect('Transacciones', '/entrega?IdPaciente=' + this.state.RIdentificacion, this.props.history)
            // getListSelect('Entregas', '?IdPaciente=' + this.state.RIdentificacion, this.props.history)
            .then(listdata => {
                console.log(listdata)
                let tempArray = [];
                listdata.data.forEach(elementPpl => {
                    console.log(elementPpl);
                    if (elementPpl.values[0]?.mvEntrega != undefined) {
                        elementPpl.values[0].mvEntrega.forEach(element => {
                            tempArray.push({
                                Id: element.IdTransaccion,
                                // IdBodega: element.IdBodega,
                                // IdConsecutivo: element.IdConsecutivo,
                                // IdPaciente: element.IdPaciente,
                                // IdReclamante: element.IdReclamante,
                                // IdTipoId: element.IdTipoId,
                                NoEntrega: element.NoEntrega,
                                // Pagado: element.Pagado,
                                Prefijo: element.Prefijo,
                                // Fecha: element.Fecha,
                                Fh_Entrega: element.Fecha,
                                // NombrePaciente: element.Paciente.Nombre,
                                IdMedicamento: element.IdMedicamento,
                                NombreMedicamento: element.Nombre,
                                QtyEntrega: element.QtyEntrega,
                            });
                        });
                    }
                });
                tempArray = tempArray.sort((a, b) => b.NoEntrega - a.NoEntrega)
                this.setState({
                    'ListUltimasEntregasPaciente': tempArray,
                });
            });
    }

    onCallHistoricoOrden(idTransaccion) {
        getListSelect('Transacciones', '/entrega/' + idTransaccion, this.props.history)
            .then(listdata => {
                this.onPrintRecibo(listdata);
            });
    }

    onBuscarSaldosMedicamento(idMedicamento) {
        console.log(idMedicamento);
        getListSelect('Medicamento', '/' + idMedicamento + '?mostrarSaldos=true', this.props.history)
            .then(listdataMed => {
                let tempArray = [];
                tempArray = listdataMed.saldos;
                console.log(tempArray);
                if (tempArray !== null) {
                    tempArray = tempArray.sort((a, b) => {
                        const compareName = a.Bodega.localeCompare(b.Bodega);
                        const compareTitle = a.FechaVto.localeCompare(b.FechaVto);
                        return compareName || compareTitle;
                    });
                }


                this.setState({
                    listBusquedaSaldosMedicamento: tempArray
                });
            });
    }

    render() {
        return (
            <>
                <div id='noPrintSection' >
                    <CRow>
                        <CCol md='12'>
                            <div style={{ textAlign: 'center', justifyContent: 'center', display: this.state.showLoading ? 'flex' : 'none' }}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <CSpinner
                                        color='danger'
                                        style={{ width: '5rem', height: '5rem' }}
                                    />
                                </div>
                            </div>
                        </CCol>
                    </CRow>
                    <CRow style={{ display: this.state.showLoading ? 'none' : 'flex' }}>
                        <CCol md='12'>
                            <CCard>
                                <CCardHeader>
                                    <CRow>
                                        <CCol><h3>Dispensación</h3></CCol>
                                        <CCol><div className='card-header-actions justify-content-md-end'>
                                            <CButton color='success'
                                                shape='square'
                                                onClick={() => this.onInputclear()}
                                                className='me-md-2'>Siguiente Paciente</CButton>
                                        </div></CCol>
                                    </CRow>
                                    <br></br>
                                    <CRow>
                                        <CCol md='10'>
                                            <CForm inline>
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
                                                <CFormGroup className='pr-1' >
                                                    <div style={{ width: '350px' }} >
                                                        <Select
                                                            options={this.state.listConvenios}
                                                            styles={customSelectStyles}
                                                            value={this.state.conveniosId}
                                                            isClearable
                                                            isDisabled={this.state.conveniosIdBlock}
                                                            components={{
                                                                ValueContainer: CustomValueContainer
                                                            }}
                                                            placeholder='Convenio'
                                                            onChange={event => this.onSelectchange('conveniosId', event)}
                                                        ></Select>
                                                    </div>
                                                </CFormGroup>
                                                <CFormGroup className='pr-1' >
                                                    <div style={{ width: '350px' }} >
                                                        <Select
                                                            options={this.state.listTiposEntregas}
                                                            styles={customSelectStyles}
                                                            value={this.state.tipoEntregaId}
                                                            isClearable
                                                            isDisabled={this.state.tipoEntregaIdBlock}
                                                            components={{
                                                                ValueContainer: CustomValueContainer
                                                            }}
                                                            placeholder='Tipo Entrega'
                                                            onChange={event => this.onSelectchange('tipoEntregaId', event)}
                                                        ></Select>
                                                    </div>
                                                </CFormGroup>
                                            </CForm>
                                            <CForm inline style={{ paddingTop: '0.8%' }}>
                                                <CFormGroup className='pr-1'>
                                                    <FloatingLabelInput label='Id.Paciente' style={{ paddingLeft: '2%' }} id='idPaciente' disabled={this.state.bloqueoidPaciente} value={this.state.idPaciente} name='idPaciente' onChange={this.onInputchange} onKeyDown={this.onInputchange} />
                                                </CFormGroup>
                                                <CFormGroup className='pr-1'>
                                                    <CFormGroup className='pr-1' >
                                                        <div style={{ width: '260px' }} >
                                                            <Select
                                                                options={this.state.listTiposId}
                                                                styles={customSelectStyles}
                                                                value={this.state.tipoId}
                                                                isClearable
                                                                components={{
                                                                    ValueContainer: CustomValueContainer
                                                                }}
                                                                placeholder='Tipo Id'
                                                                onChange={event => this.onSelectchange('tipoId', event)}
                                                            ></Select>
                                                        </div>
                                                    </CFormGroup> </CFormGroup>
                                                <CFormGroup className='pr-1'>
                                                    <FloatingLabelInput label='Nombre' id='PNombre' style={{ paddingLeft: '2%', width: '350px', color: '#321fdb', fontWeight: '600', fontSize: '1em' }} disabled value={this.state.infoPaciente.length > 0 ? toUPPER(this.state.infoPaciente[0].nombreCompleto) : ''} required />
                                                </CFormGroup>
                                                <CFormGroup className='pr-1'>
                                                    <FloatingLabelInput label='Fh. Nacimiento' id='FNacimiento' name='FNacimiento' style={{ width: '161px', paddingLeft: '2%' }} disabled value={this.state.infoPaciente.length > 0 ? formatDateP(this.state.infoPaciente[0].fechaNacimiento, 'D MMM YYYY') : ''} required />
                                                </CFormGroup>
                                                {/*  <CFormGroup variant='checkbox' className='checkbox'>
                                                <CInputCheckbox id='PMarcas' name='PMarcas' disabled checked={this.state.infoPaciente.length > 0 ? this.state.infoPaciente[0].Pmarcas : false} />
                                                <CLabel htmlFor='PMarcas' className='pr-1'>Paciente Con Marca</CLabel>
                                            </CFormGroup> */}
                                                <CFormGroup className='pr-1'>
                                                    <CBadge color={getColorAlert(this.state.infoPaciente.length > 0 ? this.state.infoPaciente[0].Pmarcas : false)}
                                                        onClick={() => { this.state.infoPaciente.length > 0 ? this.state.infoPaciente[0].Pmarcas == true ? this.openAlertMarcaPaciente(true) : this.openAlertMarcaPaciente(false) : this.openAlertMarcaPaciente(false) }}>
                                                        {this.state.infoPaciente.length > 0 ? this.state.infoPaciente[0].Pmarcas == true ? 'Con marcas' : 'Sin marcas' : 'Sin marcas'}
                                                    </CBadge>
                                                </CFormGroup>
                                            </CForm>
                                            <CForm inline style={{ paddingTop: '0.8%', visibility: 'hidden' }} >
                                                <CFormGroup className='pr-1'>
                                                    <FloatingLabelInput label='Id.Reclama' style={{ paddingLeft: '2%' }} id='RIdentificacion' name='RIdentificacion' value={this.state.RIdentificacion} onChange={this.onInputchange} />
                                                </CFormGroup>
                                                <CFormGroup className='pr-2'>
                                                    <FloatingLabelInput label='Nombre Reclama' style={{ paddingLeft: '2%', width: '300px' }} id='RNombre' name='RNombre' value={this.state.RNombre} onChange={this.onInputchange} required />
                                                </CFormGroup>
                                                <CFormGroup className='pr-1'>
                                                    <div style={{ width: '350px' }} >
                                                        <Select
                                                            options={this.state.listParentescos}
                                                            styles={customSelectStyles}
                                                            value={this.state.parentescoId}
                                                            isClearable
                                                            components={{
                                                                ValueContainer: CustomValueContainer
                                                            }}
                                                            placeholder='Parentesco'
                                                            onChange={event => this.onSelectchange('parentescoId', event)}
                                                        ></Select>
                                                    </div>
                                                </CFormGroup>
                                            </CForm>
                                            <CForm inline >
                                                <CTextarea style={{ width: '84%', fontWeight: '600', fontSize: '1em' }}
                                                    className='form-control form-control-sm inputText'
                                                    onChange={this.onInputchange}
                                                    id='comentario' name='comentario'
                                                    rows='2'
                                                    value={this.state.comentario}
                                                    placeholder='Comentario'
                                                />
                                            </CForm>
                                        </CCol>
                                        <CCol>
                                            <div style={{ paddingTop: '7px' }} className='card-header-actions justify-content-md-end'>
                                                <CButton
                                                    style={{ float: 'right' }}
                                                    color='warning'
                                                    variant='outline'
                                                    shape='square'
                                                    onClick={() => this.onGoInfoPaciente(this.state.idPaciente)}
                                                    size='sm'>{<CIcon name='cil-people' alt='plus' />}
                                                </CButton>
                                            </div></CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol>
                                            <div style={{ paddingTop: '7px' }} className='card-header-actions justify-content-md-end'>
                                                <CButton
                                                    style={{ float: 'right' }}
                                                    color='warning'
                                                    shape='square'
                                                    onClick={() => this.onSearchOrden()}
                                                    size='sm'>{<CIcon name='cil-search' alt='search' />} Cargar Informacion
                                                </CButton>
                                            </div></CCol>
                                    </CRow>
                                </CCardHeader>
                                <CCardBody>
                                    <CRow style={{ display: this.state.showIngresoManual ? 'flex' : 'none' }}>
                                        <CCol md='12'>
                                            <CForm inline style={{ paddingTop: '0.8%' }}>
                                                <CFormGroup className='pr-1' >
                                                    <FloatingLabelInput id='MnNroOrden' name='MnNroOrden' style={{ paddingLeft: '2%' }} label='No.Orden' value={this.state.MnNroOrden} onChange={this.onInputchange} required />
                                                </CFormGroup>
                                                <CFormGroup className='pr-1' >
                                                    <div style={{ width: '161px' }} >
                                                        <Select
                                                            options={this.state.listTipoPlan}
                                                            styles={customSelectStyles}
                                                            value={this.state.MnIdTipoPlan}
                                                            isClearable
                                                            components={{
                                                                ValueContainer: CustomValueContainer
                                                            }}
                                                            placeholder='Tipo Plan'
                                                            onChange={event => this.onSelectchange('MnIdTipoPlan', event)}
                                                        ></Select>
                                                    </div>
                                                </CFormGroup>
                                                <CFormGroup className='pr-1' >
                                                    <FloatingLabelInput label='Fh. Orden' style={{ width: '155px', paddingLeft: '2%' }} type='date' value={this.state.MnfhOrden} onChange={this.onInputchange} id='MnfhOrden' name='MnfhOrden' required='True' />
                                                </CFormGroup>
                                                <CFormGroup className='pr-1' >
                                                    <FloatingLabelInput label='Fh. Vto Orden' style={{ width: '155px', paddingLeft: '2%' }} type='date' value={this.state.MnVtofhOrden} onChange={this.onInputchange} id='MnVtofhOrden' name='MnVtofhOrden' required='True' />
                                                </CFormGroup>
                                            </CForm>
                                            <CForm inline style={{ paddingTop: '0.8%' }}>
                                                <CFormGroup className='pr-1' >
                                                    <FloatingLabelInput id='MnPLU' name='MnPLU' style={{ width: '150px', paddingLeft: '2%' }} label='PLU' value={this.state.MnPLU} onChange={this.onInputchange} onKeyDown={this.onInputchange} required />
                                                </CFormGroup>
                                                <CFormGroup className='pr-1' >
                                                    <CButton size='sm' onClick={this.onOpenBuscarMedicamento}>
                                                        <CIcon name='cil-search' alt='Buscar Medicamento' />
                                                    </CButton>
                                                </CFormGroup>
                                                <CFormGroup className='pr-1' >
                                                    <CInput id='MnNombreMedicamento' name='MnNombreMedicamento' className='form-control form-control-sm' style={{ width: '490px', color: '#321fdb' }} disabled defaultValue={this.state.MnNombreMedicamento} value={this.state.MnNombreMedicamento} />
                                                </CFormGroup>
                                                <CFormGroup className='pr-1' >
                                                    <CInput id='MnCodigoMedicamento' name='MnCodigoMedicamento' className='form-control form-control-sm' style={{ color: '#321fdb' }} disabled defaultValue={this.state.MnCodigoMedicamento} value={this.state.MnCodigoMedicamento} />
                                                </CFormGroup>
                                                <CFormGroup className='pr-1' >
                                                    <FloatingLabelInput id='MnMIPRES' name='MnMIPRES' style={{ paddingLeft: '2%' }} label='MIPRES' value={this.state.MnMIPRES} onChange={this.onInputchange} required />
                                                </CFormGroup>
                                            </CForm>
                                            <CForm inline style={{ paddingTop: '0.8%' }}>
                                                <CFormGroup className='pr-1' >
                                                    <FloatingLabelInput id='MnCantidadAuto' onKeyDown={this.onInputchange} name='MnCantidadAuto' style={{ paddingLeft: '2%' }} label='Cant. Autorizada' value={this.state.MnCantidadAuto} onChange={this.onInputchange} required />
                                                </CFormGroup>
                                                <CFormGroup className='pr-1' >
                                                    <div style={{ width: '161px' }} >
                                                        <Select
                                                            options={this.state.MnLoteMedicamento}
                                                            styles={customSelectStyles}
                                                            value={this.state.MnIdLote}
                                                            components={{
                                                                ValueContainer: CustomValueContainer
                                                            }}
                                                            placeholder='Lote'
                                                            onChange={event => this.onSelectchange('MnIdLote', event)}
                                                        ></Select>
                                                    </div>
                                                </CFormGroup>
                                                <CFormGroup className='pr-1' >
                                                    <FloatingLabelInput id='MnSaldoLote' name='MnSaldoLote' style={{ paddingLeft: '2%' }} label='Saldo Lote' value={this.state.MnSaldoLote} onChange={this.onInputchange} required />
                                                </CFormGroup>
                                                <CFormGroup className='pr-1' >
                                                    <FloatingLabelInput id='MnCantidadEnt' name='MnCantidadEnt' style={{ paddingLeft: '2%' }} label='Cant. Entregada' type='number' value={this.state.MnCantidadEnt} onChange={this.onInputchange} required />
                                                </CFormGroup>
                                                <CFormGroup className='pr-1' >
                                                    <FloatingLabelInput id='MnValorUni;Currency' name='MnValorUni' style={{ paddingLeft: '2%' }} label='Valor Unidad' value={this.state.MnValorUni} onChange={this.onInputchange} required />
                                                </CFormGroup>
                                                <CFormGroup className='pr-1' >
                                                    <FloatingLabelInput id='MnValorIVA;Currency' name='MnValorIVA' style={{ paddingLeft: '2%' }} label='Valor IVA' value={this.state.MnValorIVA} onChange={this.onInputchange} required />
                                                </CFormGroup>
                                                <CFormGroup className='pr-1' >
                                                    <FloatingLabelInput id='MnValorTotal;Currency' name='MnValorTotal' style={{ paddingLeft: '2%', visible: 'hidden' }} label='Valor Total' value={this.state.MnValorTotal} onChange={this.onInputchange} />
                                                </CFormGroup>
                                            </CForm>
                                            <CForm inline style={{ paddingTop: '0.8%' }}>
                                                <CFormGroup className='pr-1' style={{ marginLeft: 'auto', marginRight: '0' }}  >
                                                    <CButton
                                                        style={{ float: 'right' }}
                                                        color='primary'
                                                        shape='square'
                                                        onClick={() => this.onAcumularOrdenManual()}
                                                        size='sm'>Acumular
                                                    </CButton>
                                                </CFormGroup>
                                            </CForm>
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CDataTable
                                            items={this.state.ListNivel}
                                            fields={[
                                                { key: 'selected', label: '', _style: { width: '15%' } },
                                                { key: 'orderNumber', label: 'Orden', _style: { width: '20%' } },
                                                { key: 'typePlan', label: 'Tipo Plan', _style: { width: '20%' } },
                                                { key: 'fechaServicio', label: 'Fecha Orden', _style: { width: '20%' }, },
                                                { key: 'fechaVencimiento', label: 'Fecha Vencimiento', _style: { width: '20%' }, },
                                                { key: 'moderatorfee', label: '', _style: { width: '25%' } },
                                                {
                                                    key: 'Acciones',
                                                    label: '',
                                                    sorter: false,
                                                    filter: false
                                                }
                                            ]}
                                            itemsPerPage={20}
                                            pagination
                                            hover
                                            size='sm'
                                            scopedSlots={{
                                                'selected':
                                                    (item) => (
                                                        <td style={{ backgroundColor: '#d6ebff' }}>
                                                            {/* {<CFormGroup variant='checkbox' className='checkbox'>
                                                            <CInputCheckbox id='checkboxAllOrden' value={item.id} checked={item.ordenSelect} name='checkboxAllOrden' onChange={this.onInputchange} />
                                                        </CFormGroup> } */}
                                                        </td>
                                                    ),
                                                'orderNumber':
                                                    (item) => (
                                                        <td style={{ backgroundColor: '#d6ebff' }}>
                                                            <strong>{item.orderNumber}</strong>
                                                        </td>
                                                    ),
                                                'fechaServicio':
                                                    (item) => (
                                                        <td style={{ backgroundColor: '#d6ebff' }}>
                                                            <strong>{formatDateP(item.formula.fechaServicio, 'D MMM YYYY')}</strong>
                                                        </td>
                                                    ),
                                                'typePlan':
                                                    (item) => (
                                                        <td style={{ backgroundColor: '#d6ebff' }}>
                                                            <strong> {item.interop.aseguradora.plan.nombre}</strong>
                                                        </td>
                                                    ),
                                                'fechaVencimiento':
                                                    (item) => (
                                                        <td style={{ backgroundColor: '#d6ebff' }}>
                                                            <strong>{formatDateP(item.formula.fechaVencimiento, 'D MMM YYYY')}</strong>
                                                        </td>
                                                    ),
                                                'moderatorfee':
                                                    (item) => (
                                                        <td className='text-right' style={{ backgroundColor: '#d6ebff' }}>
                                                            <div>
                                                                <strong>{item.interop.formula.cobro.nombre + ": " + formatCurrency('en-US', 'USD', 0, item.interop.formula.cobro.valor)}</strong>
                                                            </div>
                                                        </td>
                                                    ),
                                                'Acciones':
                                                    (item, index) => {
                                                        return (
                                                            <>
                                                                <td style={{ backgroundColor: '#d6ebff' }} className=' text-right'>
                                                                    {item.interop.formula.cobro.valor > 0 ? <CBadge color={'danger'} onClick={() => { this.zeroOrden(item, true) }}>{'ZERO'}</CBadge> : ''}
                                                                </td>
                                                                {/* <td style={{ backgroundColor: '#d6ebff' }} className=' text-right'>
                                                                    <CButton
                                                                        color='warning'
                                                                        variant='outline'
                                                                        shape='square'
                                                                        size='sm'
                                                                        onClick={() => { this.toggleDetails(item) }}>
                                                                        {this.state.IsShow.includes(item.orderNumber) ? <CIcon name='cil-zoom-out' alt='plus' /> : <CIcon name='cil-zoom-in' alt='plus' />}
                                                                    </CButton>
                                                                </td> */}
                                                            </>
                                                        )
                                                    },
                                                'details':
                                                    (itemP, index) => {
                                                        return (
                                                            //console.log(this.state.ListNivel.filter(items => items.id+items.orderNumber === itemP.id+itemP.orderNumber)[0].formula.tratamiento)
                                                            <CCollapse show={this.state.IsShow.includes(itemP.orderNumber)}>
                                                                <CCardBody>
                                                                    <CDataTable
                                                                        items={this.state.ListNivel.length > 0 ? this.state.ListNivel.filter(items => items.orderNumber === itemP.orderNumber)[0].formula.tratamiento : []}
                                                                        fields={[
                                                                            { key: 'selected', label: '', _style: { width: '10px' } },
                                                                            { key: 'PLU', label: 'PLU', _classes: 'font-weight-bold' },
                                                                            { key: 'descripcion', label: 'Descripcion', _style: { width: '350px' } },
                                                                            // { key: 'MarcaCcial', label: 'Marca', _style: { width: '150px' }, },
                                                                            { key: 'vigencia', label: 'Con\nVigencia', },
                                                                            { key: 'statusAlerta', label: 'Posee Alertas' },
                                                                            { key: 'cantidadAuto', label: 'Qty Autor' },
                                                                            { key: 'lote', label: 'Lote', _style: { width: '150px' }, },
                                                                            { key: 'saldoSede', label: 'Saldo Sede' },
                                                                            { key: 'cantidadEntregada', label: 'Qty Entrega' },
                                                                            { key: 'numeroEntrega', label: 'Entrega' },
                                                                            //{ key: 'cantidadEntrega', label: 'Cantidad Entregas', _style: { width: '2%' }, },
                                                                            // { key: 'MIPRES', label: 'MIPRES', _style: { width: '5%' }, },
                                                                            { key: 'diasTratamiento', label: 'Días\nTratto' },
                                                                            { key: 'valor', label: 'Valor' },
                                                                            { key: 'iva', label: 'IVA' },
                                                                            { key: 'total', label: 'Total' },
                                                                            {
                                                                                key: 'Acciones',
                                                                                label: '',
                                                                                sorter: false,
                                                                                filter: false,
                                                                                _style: { width: '80px' },
                                                                            }
                                                                        ]}
                                                                        itemsPerPage={100}
                                                                        hover
                                                                        clickableRows
                                                                        //onRowClick={(item) => this.selectItemProducto(item)}
                                                                        scopedSlots={{
                                                                            'selected':
                                                                                (item) => (
                                                                                    <td style={{ maxWidth: '20px', minWidth: '20px' }}>
                                                                                        {item.tieneProducto === false ? "" :
                                                                                            <CFormGroup variant='checkbox' className='checkbox'>
                                                                                                <CInputCheckbox id='checkboxItemsOrden' value={itemP.orderNumber + ';' + item.id} readOnly checked={item.itemSelect} name='checkboxItemsOrden' onChange={this.onInputchange} />
                                                                                            </CFormGroup>}
                                                                                    </td>
                                                                                ),
                                                                            'IdMedicamento':
                                                                                (item) => (
                                                                                    <td>
                                                                                        <CButton
                                                                                            color='link'
                                                                                            size='sm'
                                                                                            onClick={() => { this.onGoInfoMedicamento(item.producto.medicamento.IdMedicamento) }}>
                                                                                            {item.producto.medicamento.IdMedicamento}
                                                                                        </CButton>
                                                                                    </td>
                                                                                ),
                                                                            'PLU':
                                                                                (item) => (
                                                                                    <td style={{ maxWidth: '55px', minWidth: '55px' }}>
                                                                                        {item.tieneProducto === false ? "no data" :
                                                                                            <CBadge style={{ fontSize: '1em' }}
                                                                                                onClick={() => { this.onOpenBuscarSaldoMedicamento(item, true) }}>
                                                                                                {item.producto.medicamento.PLU}
                                                                                            </CBadge>
                                                                                        }
                                                                                    </td>
                                                                                ),
                                                                            'descripcion':
                                                                                (item) => (
                                                                                    <td style={{ maxWidth: '200px', minWidth: '200px' }}>
                                                                                        {item.producto.medicamento.Medicamento.Nombre}
                                                                                    </td>
                                                                                ),
                                                                            'MarcaCcial':
                                                                                (item) => (
                                                                                    <td style={{ maxWidth: '150px', minWidth: '150px' }}>
                                                                                        {item.tieneProducto === false ? "no data" : item.producto.medicamento.Medicamento.Laboratorio}
                                                                                    </td>
                                                                                ),
                                                                            'cantidadAuto':
                                                                                (item) => (
                                                                                    <td style={{ maxWidth: '50px', minWidth: '50px' }}>
                                                                                        {item.cantidad}
                                                                                    </td>
                                                                                ),
                                                                            'cantidadEntrega':
                                                                                (item) => (
                                                                                    <td style={{ maxWidth: '50px', minWidth: '50px' }}>
                                                                                        {item.producto.cantidadDeEntregas}
                                                                                    </td>
                                                                                ),
                                                                            'numeroEntrega':
                                                                                (item) => (
                                                                                    <td style={{ maxWidth: '50px', minWidth: '50px' }}>
                                                                                        {item.producto.numeroEntregaActual + ' de ' + item.producto.cantidadDeEntregas}
                                                                                    </td>
                                                                                ),
                                                                            'MIPRES':
                                                                                (item) => (
                                                                                    <td style={{ maxWidth: '50px', minWidth: '50px' }}>
                                                                                        {itemP.formula.mipres}
                                                                                    </td>
                                                                                ),
                                                                            'diasTratamiento':
                                                                                (item) => (
                                                                                    <td style={{ maxWidth: '50px', minWidth: '50px' }}>
                                                                                        {item.dosis.duracion.cantidad}
                                                                                    </td>
                                                                                ),
                                                                            'valor':
                                                                                (item) => (
                                                                                    <td>
                                                                                        {item.tieneProducto === false ? "no data" : formatCurrency('en-US', 'USD', 0, item.producto.medicamento.Precio)}
                                                                                    </td>
                                                                                ),
                                                                            'iva':
                                                                                (item) => (
                                                                                    <td>
                                                                                        {item.tieneProducto === false ? "0" : item.producto.medicamento.PctajeIVA}
                                                                                    </td>
                                                                                ),
                                                                            'total':
                                                                                (item) => (
                                                                                    <td>
                                                                                        {item.tieneProducto === false ? "" : formatCurrency('en-US', 'USD', 0, item.cantidad * item.producto.medicamento.Precio * (1 - (item.producto.medicamento.PctajeIVA / 100)))}
                                                                                    </td>
                                                                                ),
                                                                            'statusAlerta':
                                                                                (item) => (
                                                                                    <td>
                                                                                        <CBadge color={getColorAlert(item.statusAlerta)}
                                                                                            onClick={() => { item.statusAlerta === 'alerta' ? this.openAlertMedicamentos(item, true) : this.openAlertMedicamentos(item, false) }}>
                                                                                            {item.statusAlerta}
                                                                                        </CBadge>
                                                                                    </td>
                                                                                ),
                                                                            'vigencia':
                                                                                (item) => (
                                                                                    <td>
                                                                                        <CBadge style={{ fontSize: '1em' }}>
                                                                                            {item.producto.medicamento?.vigenciasFechaFinal !== undefined ? item.producto.medicamento.vigenciasFechaFinal : 'NA'}
                                                                                        </CBadge>
                                                                                    </td>
                                                                                ),
                                                                            'lote':
                                                                                (item) => (
                                                                                    <td style={{ width: '150px' }}>
                                                                                        <Select
                                                                                            options={item.saldos}
                                                                                            styles={customSelectStyles}
                                                                                            value={item.saldosSelect}
                                                                                            components={{
                                                                                                ValueContainer: CustomValueContainer
                                                                                            }}
                                                                                            placeholder=''
                                                                                            onChange={event => this.onSelectchange('TpSaldoId', event)}
                                                                                        >
                                                                                        </Select>
                                                                                    </td>
                                                                                ),
                                                                            'saldoSede':
                                                                                (item) => (
                                                                                    <td>
                                                                                        {item.saldosLoteSelect !== undefined ? formatNumber('en-US', item.saldosLoteSelect.Saldo) : ''}
                                                                                    </td>
                                                                                ),
                                                                            'cantidadEntregada':
                                                                                (item) => (
                                                                                    <td>
                                                                                        {<CInput
                                                                                            onKeyDown={function (e) {
                                                                                                if (e.keyCode < '48' || e.keyCode > '57') {
                                                                                                    e.preventDefault()
                                                                                                }
                                                                                            }}
                                                                                            style={{ height: '28px' }} value={item.cantidadEntregada} id={'item_cantidadEntregada;' + itemP.orderNumber + ';' + item.id} name='item_cantidadEntregada' onChange={this.onInputchange} />}
                                                                                    </td>
                                                                                ),
                                                                            'Acciones':
                                                                                (item, index) => {
                                                                                    return (
                                                                                        <>
                                                                                            <td className=' text-right'>
                                                                                                <CButton
                                                                                                    color='warning'
                                                                                                    variant='outline'
                                                                                                    shape='square'
                                                                                                    size='sm'
                                                                                                    onClick={() => { this.newFila(itemP, item) }}>
                                                                                                    <CIcon name='cil-plus' alt='plus' size="sm" />
                                                                                                </CButton>
                                                                                                <CButton
                                                                                                    color='warning'
                                                                                                    variant='outline'
                                                                                                    shape='square'
                                                                                                    size='sm'
                                                                                                    onClick={() => { this.deleteFila(itemP, item) }}>
                                                                                                    <CIcon name='cil-trash' alt='trash' size="sm" />
                                                                                                </CButton>
                                                                                            </td>
                                                                                        </>
                                                                                    )
                                                                                },
                                                                        }
                                                                        }
                                                                    />
                                                                </CCardBody>
                                                            </CCollapse>
                                                        )
                                                    }
                                            }
                                            }
                                        />
                                    </CRow>
                                    <CRow>

                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol xs='12' md='12' lg='12'>
                            <CCard>
                                <CCardHeader></CCardHeader>
                                <CCardBody>
                                    <CRow>
                                        <CCol sm={7}>
                                            <CCard>
                                                <CCardBody>
                                                    <CCardTitle>Ultimas Ordenes Entregadas {this.state.infoPaciente.length > 0 ? toUPPER(this.state.infoPaciente[0].nombreCompleto) : ''}</CCardTitle>

                                                    <CDataTable
                                                        items={this.state.ListUltimasEntregasPaciente}
                                                        fields={[
                                                            { key: 'NoEntrega', label: 'No.Entrega', _style: { width: '20%' } },
                                                            { key: 'Fh_Entrega', label: 'Fecha', _style: { width: '20%' } },
                                                            { key: 'IdMedicamento', label: 'Medicamento', _style: { width: '20%' }, },
                                                            { key: 'NombreMedicamento', label: 'Nombre', _style: { width: '20%' }, },
                                                            { key: 'QtyEntrega', label: 'Cantidad', _style: { width: '25%' } },
                                                            // {
                                                            //     key: 'Acciones',
                                                            //     label: '',
                                                            //     sorter: false,
                                                            //     filter: false
                                                            // }
                                                        ]}
                                                        itemsPerPage={15}
                                                        pagination
                                                        hover
                                                        size='sm'
                                                        scopedSlots={{
                                                            'NoEntrega':
                                                                (item) => (
                                                                    <td>
                                                                        {item.Prefijo + '' + item.NoEntrega}
                                                                    </td>
                                                                ),
                                                            'Fh_Entrega':
                                                                (item) => (
                                                                    <td>
                                                                        {formatDateP(item.Fh_Entrega, 'D MMM YYYY')}
                                                                    </td>
                                                                ),
                                                            // 'Acciones':
                                                            // (item) => (
                                                            //     <td>

                                                            //     </td>
                                                            // ),
                                                        }}
                                                    ></CDataTable>
                                                    {/*   <CListGroup>
                                                        {this.state.ListUltimasEntregasPaciente.map(elemento => (
                                                            <CListGroupItem className='d-flex justify-content-between align-items-center'>
                                                                {"Nro.Entrega: " + elemento.NoEntrega} <br></br>
                                                                {"Fh.Entrega " + formatDateP(elemento.Fh_Entrega, 'D MMM YYYY')}<br></br>
                                                                {" " + elemento.NombrePaciente}<br></br>
                                                                <small>{elemento.IdTipoId + "-" + elemento.IdPaciente}<br></br>{" Pagado" + formatCurrency('en-US', 'USD', 0, elemento.Pagado)}</small>
                                                                <CBadge color='primary' shape='pill'>
                                                                    <CIcon name='cilArrowRight'
                                                                        alt='cilArrowRight'
                                                                        onClick={() => this.onCallHistoricoOrden(elemento.Id)} />
                                                                </CBadge>
                                                            </CListGroupItem>
                                                        ))}
                                                    </CListGroup>*/}

                                                </CCardBody>
                                            </CCard>
                                        </CCol>
                                        <CCol lg='5' sm='5' style={{ float: 'right' }}>
                                            <table style={{ width: '100%', padding: 0, border: 0 }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ width: '250px' }}>
                                                            <Select
                                                                options={this.state.listFormasPago}
                                                                styles={customSelectStyles}
                                                                value={this.state.medioPagoId_1}
                                                                isClearable
                                                                components={{
                                                                    ValueContainer: CustomValueContainer
                                                                }}
                                                                placeholder=''
                                                                onChange={event => this.onSelectchange('medioPagoId_1', event)}
                                                            >
                                                            </Select>
                                                        </td>
                                                        <td>
                                                            <FloatingLabelInput label='Pago 1' style={{ paddingLeft: '2%', width: '150px' }} id='valorPagoId_1;Currency' value={this.state.valorPagoId_1} name='valorPagoId_1' type='Currency' onChange={this.onInputchange} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: '250px' }}>
                                                            <Select
                                                                options={this.state.listFormasPago}
                                                                styles={customSelectStyles}
                                                                value={this.state.medioPagoId_2}
                                                                isClearable
                                                                components={{
                                                                    ValueContainer: CustomValueContainer
                                                                }}
                                                                placeholder=''
                                                                onChange={event => this.onSelectchange('medioPagoId_2', event)}
                                                            >
                                                            </Select>
                                                        </td>
                                                        <td>
                                                            <FloatingLabelInput label='Pago 2' style={{ paddingLeft: '2%', width: '150px' }} id='valorPagoId_2;Currency' value={this.state.valorPagoId_2} name='valorPagoId_2' type='Currency' onChange={this.onInputchange} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ width: '250px' }}>
                                                            <Select
                                                                options={this.state.listFormasPago}
                                                                styles={customSelectStyles}
                                                                value={this.state.medioPagoId_3}
                                                                isClearable
                                                                components={{
                                                                    ValueContainer: CustomValueContainer
                                                                }}
                                                                placeholder=''
                                                                onChange={event => this.onSelectchange('medioPagoId_3', event)}
                                                            >
                                                            </Select>
                                                        </td>
                                                        <td>
                                                            <FloatingLabelInput label='Pago 3' style={{ paddingLeft: '2%', width: '150px' }} id='valorPagoId_3;Currency' type='Currency' value={this.state.valorPagoId_3} name='valorPagoId_3' onChange={this.onInputchange} />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <br></br>
                                            <table class='table'>
                                                <tbody>
                                                    <tr>
                                                        <td class='text-start' ><strong>Subtotal</strong></td>
                                                        <td class='text-end'>{formatCurrency('en-US', 'USD', 0, this.state.sumNetoValorTx)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td class='text-start' ><strong>Flete</strong></td>
                                                        <td class='text-end'>{formatCurrency('en-US', 'USD', 0, this.state.sumFleteValorTx)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td class='text-start'><strong>IVA</strong></td>
                                                        <td class='text-end'>{formatCurrency('en-US', 'USD', 0, this.state.sumIVAValorTx)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td class='text-start'><strong>Total</strong></td>
                                                        <td class='text-end'><strong>{formatCurrency('en-US', 'USD', 0, this.state.sumValorTx)}</strong></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table class='table' style={{ width: '100%', padding: 0, border: 0 }}>
                                                <tbody>
                                                    <tr>
                                                        <td class='text-start' style={{ width: '250px' }}><strong>Valor Pagado</strong></td>
                                                        <td>  <FloatingLabelInput label='Valor Pagado' style={{ paddingLeft: '2%', width: '150px' }} id='valorPagado;Currency' value={this.state.valorPagado} name='valorPagado' type='Currency' onChange={this.onInputchange} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td class='text-start' style={{ width: '250px' }}><strong>Cambio</strong></td>
                                                        <td>  <FloatingLabelInput label='Cambio' style={{ paddingLeft: '2%', width: '150px' }} id='cambio;Currency' value={this.state.cambio} name='cambio' type='Currency' onChange={this.onInputchange} /></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className='card-header-actions justify-content-md-end'>
                                                <CButton color='info'
                                                    shape='square'
                                                    onClick={() => this.onSaveEntrega()}
                                                    className='me-md-2'>Guardar Entrega</CButton>
                                                {/* <CButton color='info'
                                                    shape='square'
                                                    onClick={() => this.onCallEntregasPaciente()}
                                                    className='me-md-2'>Ver PDF</CButton> */}
                                            </div>
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                    <CModal show={this.state.showAlertMedicamentos} closeOnBackdrop={false}>
                        <CModalHeader>
                            <CModalTitle>Alertas: {this.state.nameMedicamentos}</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CRow>
                                <CCol xs='12' className='text-center'>
                                    <CListGroup>
                                        {this.state.ListAlarmaMedicamentos.filter((items => items.aplica === true && items.idMedicamento === this.state.idAlarmaMedicamentos)).map(elemento => (
                                            <CListGroupItem key={elemento.id} >
                                                {elemento.aplica === true ? <CIcon name='cil-check' alt='Settings' /> : ''}
                                                {' ' + elemento.nombre}</CListGroupItem>
                                        ))}
                                    </CListGroup>
                                </CCol>
                            </CRow>
                        </CModalBody>
                        <CModalFooter>
                            <CButton onClick={this.onHideAlertMedicamentos}>Cerrar</CButton>
                        </CModalFooter>
                    </CModal>
                    <CModal show={this.state.showAlertMarcasPacientes} closeOnBackdrop={false}>
                        <CModalHeader>
                            <CModalTitle>Marcas del Paciente: {this.state.infoPaciente.length > 0 ? toUPPER(this.state.infoPaciente[0].nombreCompleto) : ''}</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CRow>
                                <CCol xs='12' className='text-center'>
                                    <CListGroup>
                                        {this.state.ListMarcasPaciente.filter((items => items.Inactivo === false)).map(elemento => (
                                            <CListGroupItem key={elemento.IdMarca} >
                                                <CIcon name='cil-check' alt='Settings' />{' ' + elemento.Nombre}</CListGroupItem>
                                        ))}
                                    </CListGroup>
                                </CCol>
                            </CRow>
                        </CModalBody>
                        <CModalFooter>
                            <CButton onClick={this.onHideAlertMarcaPaciente}>Cerrar</CButton>
                        </CModalFooter>
                    </CModal>
                    <CModal show={this.state.showBuscarMedicamento} closeOnBackdrop={false} size={'lg'}>
                        <CModalHeader>
                            <CModalTitle>Buscar Medicamentos</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CRow>
                                <CCol>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className='pr-1' >
                                            <FloatingLabelInput label='PLU' style={{ paddingLeft: '2%' }} value={this.state.BuscarPLUMedicamento} onChange={this.onInputchange} id='BuscarPLUMedicamento' name='BuscarPLUMedicamento' required='True' />
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className='pr-1' >
                                            <FloatingLabelInput label='Nombre Medicamento' style={{ width: '350px', paddingLeft: '2%' }} value={this.state.BuscarNombreMedicamento} onChange={this.onInputchange} id='BuscarNombreMedicamento' name='BuscarNombreMedicamento' required='True' />
                                        </CFormGroup>
                                        <CFormGroup className='pr-1' >
                                            <CButton
                                                color='dark'
                                                variant='outline'
                                                shape='square'
                                                visible='false'
                                                onClick={() => this.onFindMedicamentoPopUp()}
                                                size='sm'>
                                                {'Buscar'}
                                            </CButton>
                                        </CFormGroup>
                                    </CForm>
                                </CCol>
                            </CRow>
                            <hr></hr>
                            <CRow>
                                <CDataTable
                                    items={this.state.listBusquedaMedicamento}
                                    fields={[
                                        { key: 'IdMedicamento', label: 'IdMedicamento' },
                                        { key: 'Nombre', label: 'Nombre' },
                                        { key: 'Generico', label: 'Generico' },
                                        { key: 'Inactivo', label: 'Estado' },
                                        {
                                            key: 'Acciones',
                                            label: '',
                                            _style: { width: '1%' },
                                            sorter: false,
                                            filter: false
                                        }
                                    ]}
                                    columnFilter
                                    itemsPerPage={5}
                                    pagination
                                    scopedSlots={{

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
                                                        <td className='py-2'>
                                                            <CButton
                                                                color='dark'
                                                                variant='outline'
                                                                shape='square'
                                                                onClick={() => this.onSeleccionarBusquedaMedicamento(item)}
                                                                size='sm'>
                                                                {'Seleccionar'}
                                                            </CButton>
                                                        </td>
                                                    </>
                                                )
                                            },
                                    }}
                                />
                            </CRow>
                        </CModalBody>
                        <CModalFooter>
                            <CButton onClick={this.onHideBuscarMedicamento}>Cerrar</CButton>
                        </CModalFooter>
                    </CModal>
                    <CModal show={this.state.showBuscarSaldosMedicamento} closeOnBackdrop={false} size={'lg'}>
                        <CModalHeader>
                            <CModalTitle>Saldos: {this.state.nameMedicamentos}</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CRow>
                                <CDataTable
                                    items={this.state.listBusquedaSaldosMedicamento}
                                    fields={[
                                        { key: 'Bodega', label: 'Bodega' },
                                        { key: 'Lote', label: 'Lote' },
                                        { key: 'Saldo', label: 'Saldo' },
                                        { key: 'FechaVto', label: 'FechaVto' },
                                    ]}
                                    columnFilter
                                    itemsPerPage={15}
                                    pagination
                                    scopedSlots={{
                                        'Bodega':
                                            (item) => (
                                                <td >
                                                    {item.Bodega}
                                                </td>
                                            ),
                                        'Lote':
                                            (item) => (
                                                <td >
                                                    {item.Lote}
                                                </td>
                                            ),
                                        'Saldo':
                                            (item) => (
                                                <td align='right'>
                                                    {formatNumber('en-US', item.Saldo)}
                                                </td>
                                            ),
                                        'FechaVto':
                                            (item) => (
                                                <td style={{ backgroundColor: getColorAlertFechaVto(item.FechaVto) }}>
                                                    <b>{formatDateP(item.FechaVto, 'DD-MM-yyyy')}</b>
                                                </td>
                                            ),
                                    }}
                                />
                            </CRow>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color='primary'
                                shape='square' onClick={this.onHideBuscarSaldoMedicamento}>Cerrar</CButton>
                        </CModalFooter>
                    </CModal>
                </div>
                {/* <div id='printSection' dangerouslySetInnerHTML={{ __html: this.state.bodyReciboModal }}></div>  */}
                <div id='printSection' >
                    <style>
                        {`@media print {.contacts{display: none;}}`}
                    </style>
                    <table width={'100%'}>
                        <tbody>
                            <tr>
                                <td colspan='2'>
                                    <img class='c-sidebar-brand-full' src='https://static.wixstatic.com/media/86007f_0b4a795108ad425dabf0bc7ed3c67106~mv2.png/v1/fill/w_192,h_51,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/86007f_0b4a795108ad425dabf0bc7ed3c67106~mv2.png' height='50' alt='logo-negative' /></td>
                                <td colspan='2' width='350px'>
                                    900277244-4<br></br>
                                    Sede Principal: Carrera 43a N.34–95 Local 298<br></br>
                                    Tel: (4)3220689<br></br>
                                    <table width='100%'><tr>
                                        <td>www.helpharma.com</td>
                                        <td align='right'>
                                            <div style={{ fontWeight: 'bold', marginRight: '30px' }}>SOPORTE ENTREGA <br></br> DE MEDICAMENTO</div>
                                        </td>
                                    </tr></table>
                                    <table width='100%'><tr>
                                        <td>Medellin-Colombia</td>
                                        <td align='right'>
                                            <div style={{ fontWeight: 'bold', marginRight: '30px' }}>No. <p>{this.state.pdf_nroEntrega}</p></div>
                                        </td>
                                    </tr></table>
                                </td>
                                <td colspan='2'>
                                    <img class='c-sidebar-brand-full' src='https://www.latiendadelasbarras.com/wp-content/uploads/2019/07/codigo-39-barras.jpg' height='50' alt='logo-negative' />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br></br>
                    <table width={'100%'}>
                        <tr><td>Domicilio</td></tr>
                    </table>
                    <table border={'1px solid black;'} width={'100%'}>
                        <tr>
                            <th rowspan='2'>SEÑORES:<br></br><p>{this.state.pdf_convenio}</p></th>
                            <td>
                                <table width='100%' ><tr>
                                    <td><b>FECHA FACTURA:</b> {this.state.pdf_fecha}</td>
                                    <td><b>BODEGA:</b> {this.state.pdf_Bodega}</td>
                                </tr></table>
                            </td>
                        </tr>
                        <tr>
                            <td><b>PACIENTE:</b> {this.state.pdf_nombrePaciente}</td>
                        </tr>
                        <tr>
                            <td>
                                <b>TIPO DE VENTA</b><br></br> {this.state.pdf_tpEntrega}</td>
                            <td>
                                <table width='100%' ><tr>
                                    <td><b>CEDULA O NIT</b><br></br>{this.state.pdf_nitPaciente}</td>
                                    <td><b>TIPO DCTO</b><br></br>{this.state.pdf_TD}</td>
                                    <td><b>TIPO PLAN</b><br></br>POS</td>
                                    <td><b>TIPO CARTERA</b><br></br>85</td>
                                </tr></table>
                            </td>
                        </tr>
                        <tr >
                            <td colspan='2'>
                                <table width='100%'>
                                    <tr><td><b>DIRECCION:</b>{this.state.pdf_Direccion}</td></tr>
                                    <tr><td><b>BARRIO:</b>{this.state.pdf_Barrio}</td><td><b></b></td><td><b></b></td></tr>
                                    <tr><td><b>TELEFONO:</b>{this.state.pdf_Telefono}</td><td><b>CELULAR:</b>{this.state.pdf_Celular}</td></tr>
                                    <tr><td colspan='3' height={'50'}><b>OBSERVACIONES:</b>{this.state.pdf_observaciones}</td></tr>
                                </table></td>
                        </tr>
                    </table>
                    <br></br>
                    <table border={'1px solid black;'} width={'100%'}>
                        <tr>
                            <th>Orden</th>
                            <th>Descripcion</th>
                            <th>Cantidad</th>
                            <th>Vr. Unitario</th>
                        </tr>
                        <tbody>
                            {this.state.TpEntregaMvto.map(elemento => (
                                <tr>
                                    <td>{elemento.Orden}</td>
                                    <td>{elemento.Nombre}</td>
                                    <td>{elemento.QtyEntrega}</td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td>Valor a cto moderadora + flete</td>
                                <td></td>
                                <td>{formatCurrency('en-US', 'USD', 0, this.state.pdf_Pagado)}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <br></br>
                    <table width={'100%'}>
                        <tr>
                            <td>Elaborado Por</td>
                            <td>Nombre Quien Recibe</td>
                            <td>Identificacion Quien Recibe</td>
                            <td>Fecha Recibido</td>
                            <td>Tipo Dcto</td>
                        </tr>
                        <tr>
                            <td>___{this.state.pdf_Elaborado}___</td>
                            <td>___{this.state.pdf_Reclamante}___</td>
                            <td>___{this.state.pdf_idReclamante}___</td>
                            <td>___{this.state.pdf_FhEntrega}___</td>
                            <td>___{this.state.pdf_TD}___</td>
                        </tr>
                    </table>
                </div>
            </>
        )
    }
}

export default IndexDispatchDomi
