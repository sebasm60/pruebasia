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
    CTextarea,
    CInputCheckbox,
    CSpinner,
    CBadge,
    CListGroup,
    CListGroupItem,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CDataTable,
    CButtonGroup
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import swal from 'sweetalert'
import customSelectStyles from 'src/reusable/customSelectStyles'
import UpdateItem from 'src/reusable/AccionsUpdate'
import AddItem from 'src/reusable/AccionsPost'
import DeleteItem from 'src/reusable/AccionsDelete'
import getPermissions from 'src/reusable/GetPermissions'
import getListSelect from 'src/reusable/GetList'
import validateRequiredFields from 'src/reusable/RequiredFields'
import { formatDateP, toUPPER, formatCurrency, removeformatCurrency } from 'src/reusable/Util'
import { getEstado } from 'src/reusable/Util'
import FloatingLabelInput from 'react-floating-label-input'
import { CustomValueContainer } from 'src/reusable/CustomControl'

import 'src/scss/style_print.scss';

const camposRequired = [
    { label: 'codigoERP' },
    { label: 'mNombre' },
    { label: 'mGenerico' },
    { label: 'pctIVA' },
    { label: 'laboratorio' },
    { label: 'presentacion' },
    { label: 'concentracion' },
    { label: 'CUM' },
    { label: 'expediente' },
    { label: 'qMinDispen' },
    { label: 'marcaCcial' },
    { label: 'IUM' },
    { label: 'rInvima' },
    { label: 'fhVtoRInv' },
    { label: 'rangoTtura' },
    { label: 'IdUnidad' },
    { label: 'IdFormaFtica' },
    { label: 'IdViaAdmon' },
    { label: 'IdGrupoRInv' },
    { label: 'IdModalidad' },
    { label: 'IdEstadoRInv' },
    { label: 'IdATC' },
    { label: 'IdUbicacion' },
    { label: 'chDescontinuado' },
    { label: 'chBarras' },
    { label: 'chRegulado' },
    { label: 'chControlado' },
    { label: 'chFraccionable' },
    { label: 'chAplicacion' },
    { label: 'chFotosensible' },
    { label: 'chEducacion' },
    { label: 'chFrio' },
    { label: 'chLasa' },
    { label: 'chNoPOS' },
]
const camposRequiredSubMenu = [
    { label: 'AsigPLU' },
    { label: 'AsigPLUPrecio' },
    { label: 'IdConvenio' },
]
class medicamento extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
            IdMenu: 'Menu-medicamentos',
            IdSubMenu1: 'Menu-medicamentosplu',
            id: props.match.params.id,
            dataResultAsigPLU: [],
            listPermissions: [],
            listUnidades: [],
            listFormasftica: [],
            listViasAdmon: [],
            listGruposRInv: [],
            listEstadosRInv: [],
            listModalidades: [],
            listATC: [],
            listUbicaciones: [],
            listIVAS: [],
            listConvenios: [],
            idMedicamento: '',
            codigoERP: '',
            codigoZENTRIA: '',
            mNombre: '',
            mGenerico: '',
            pctIVA: 0,
            laboratorio: '',
            presentacion: '',
            concentracion: '',
            CUM: '',
            expediente: '',
            qMinDispen: '',
            marcaCcial: '',
            IUM: '',
            rInvima: '',
            fhVtoRInv: '',
            rangoTtura: '',
            IdUnidad: '',
            IdFormaFtica: '',
            IdViaAdmon: '',
            IdGrupoRInv: '',
            IdModalidad: '',
            IdEstadoRInv: '',
            IdATC: '',
            IdUbicacion: '',
            comentario: '',
            nivelRiesgo:0,
            estado: '',
            IdConvenio: '',
            chDescontinuado: false,
            fhDescontinuado: '',
            chBarras: false,
            chRegulado: false,
            chControlado: false,
            chFraccionable: false,
            chAplicacion: false,
            chFotosensible: false,
            chEducacion: false,
            chFrio: false,
            chLasa: false,
            chNoPOS: false,
            chValidar1ra:false,
            showBtnCreate: false,
            showBtnUpdate: false,
            showLoading: true,
            showPLUAsignados: false,
            showBtnPluAsiganados: false
        };
        this.onInputchange = this.onInputchange.bind(this);
        this.onSelectchange = this.onSelectchange.bind(this);
        this.onInputclear = this.onInputclear.bind(this);
        this.onSubmitFormUpdate = this.onSubmitFormUpdate.bind(this);
        this.onSubmitFormCreate = this.onSubmitFormCreate.bind(this);
        this.onSubmitFormDelete = this.onSubmitFormDelete.bind(this);
        this.ObtenerMestros = this.ObtenerMestros.bind(this);
        this.onChangeInfoMedicamento = this.onChangeInfoMedicamento.bind(this);
        this.onGoNewMedicamento = this.onGoNewMedicamento.bind(this);
        this.onDeleteMedicamento = this.onDeleteMedicamento.bind(this);
        this.onOpenPluAsignados = this.onOpenPluAsignados.bind(this);
        this.onClosePluAsignados = this.onClosePluAsignados.bind(this);
        this.onFindActionsSubMenu1 = this.onFindActionsSubMenu1.bind(this);
        this.onSubmitFormCreatePluAsignados = this.onSubmitFormCreatePluAsignados.bind(this);
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
        let history = this.props.history;
        getListSelect('Unidades', '?Inactivo=false', history).then(listdata => {
            let tempArray = [];
            listdata.data.forEach(element => {
                tempArray.push({
                    label: element.Nombre,
                    value: element.IdUnidad,
                    select: false
                });
            });
            this.setState({
                "listUnidades": tempArray
            });


            getListSelect('Formasftica', '?Inactivo=false', history).then(listdata => {
                let tempArray = [];
                listdata.data.forEach(element => {
                    tempArray.push({
                        label: element.Nombre,
                        value: element.IdFormaFtica,
                        select: false
                    });
                });
                this.setState({
                    "listFormasftica": tempArray
                });
                getListSelect('ViasAdmon', '?Inactivo=false', history).then(listdata => {
                    let tempArray = [];
                    listdata.data.forEach(element => {
                        tempArray.push({
                            label: element.Nombre,
                            value: element.IdViaAdmon,
                            select: false
                        });
                    });
                    this.setState({
                        "listViasAdmon": tempArray
                    });
                    getListSelect('GruposRInv', '?Inactivo=false', history).then(listdata => {
                        let tempArray = [];
                        listdata.data.forEach(element => {
                            tempArray.push({
                                label: element.Nombre,
                                value: element.IdGrupoRInv,
                                select: false
                            });
                        });
                        this.setState({
                            "listGruposRInv": tempArray
                        });
                        getListSelect('EstadosRInv', '?Inactivo=false', history).then(listdata => {
                            let tempArray = [];
                            listdata.data.forEach(element => {
                                tempArray.push({
                                    label: element.Nombre,
                                    value: element.IdEstadoRInv,
                                    select: false
                                });
                            });
                            this.setState({
                                "listEstadosRInv": tempArray
                            });
                            getListSelect('Modalidades', '?Inactivo=false', history).then(listdata => {
                                let tempArray = [];
                                listdata.data.forEach(element => {
                                    tempArray.push({
                                        label: element.Nombre,
                                        value: element.IdModalidad,
                                        select: false
                                    });
                                });
                                this.setState({
                                    "listModalidades": tempArray
                                });
                                getListSelect('ATC', '?Inactivo=false', history).then(listdata => {
                                    let tempArray = [];
                                    listdata.data.forEach(element => {
                                        tempArray.push({
                                            label: element.Nombre,
                                            value: element.IdATC,
                                            select: false
                                        });
                                    });
                                    this.setState({
                                        "listATC": tempArray
                                    });

                                    getListSelect('Ubicaciones', '?Inactivo=false', history).then(listdata => {
                                        let tempArray = [];
                                        listdata.data.forEach(element => {
                                            tempArray.push({
                                                label: element.Nombre,
                                                value: element.IdUbicacion,
                                                select: false
                                            });
                                        });
                                        this.setState({
                                            "listUbicaciones": tempArray
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
                                                "listConvenios": tempArray
                                            });
                                        });

                                        if (this.state.id !== '_add') {
                                            this.setState({
                                                "idMedicamento": this.state.id,
                                                "showLoading": true,
                                                "showBtnPluAsiganados": true,
                                                dataResultAsigPLU: []
                                            });
                                            this.onChangeInfoMedicamento(this.state.id);
                                        } else {
                                            this.setState({
                                                "showLoading": false,
                                                "showBtnCreate": true,
                                                "showBtnPluAsiganados": false,
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    onInputchange(event) {
        if (event.target.name.includes('ch')) {
            this.setState({
                [event.target.name]: this.state[event.target.name] === true ? false : true
            });
        } else {
            if (event.target.name === "idMedicamento") {
                this.setState({
                    [event.target.name]: toUPPER(event.target.value)
                });
                if (event.code === "Tab") {
                    this.onChangeInfoMedicamento(event.target.value);
                }
            }
            else if (event.target.id.split(';')[1] === "Currency") {
                let num = removeformatCurrency(event.target.value)
                this.setState({
                    [event.target.name]: formatCurrency("en-US", "USD", 0, num)
                });
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
            codigoERP: '',
            codigoZENTRIA: '',
            mNombre: '',
            mGenerico: '',
            pctIVA: 0,
            nivelRiesgo:0,
            laboratorio: '',
            presentacion: '',
            concentracion: '',
            CUM: '',
            expediente: '',
            qMinDispen: '',
            marcaCcial: '',
            IUM: '',
            rInvima: '',
            fhVtoRInv: '',
            rangoTtura: '',
            IdUnidad: '',
            IdFormaFtica: '',
            IdViaAdmon: '',
            IdGrupoRInv: '',
            IdModalidad: '',
            IdEstadoRInv: '',
            IdATC: '',
            IdUbicacion: '',
            comentario: '',
            estado: '',
            chDescontinuado: false,
            fhDescontinuado: '',
            chBarras: false,
            chRegulado: false,
            chControlado: false,
            chFraccionable: false,
            chAplicacion: false,
            chFotosensible: false,
            chEducacion: false,
            chFrio: false,
            chLasa: false,
            chNoPOS: false,
            showBtnCreate: true,
            showBtnUpdate: false,
            showPLUAsignados: false
        });
    }

    onSelectchange(selector, event) {
        this.setState({
            [selector]: event
        });
    }

    onChangeInfoMedicamento(id) {
        this.onInputclear();
        if (localStorage.getItem('ActionItem') === 'Retiro') {
            this.setState({
                "showLoading": true,
                "showBtnDelete": true,
            });
        }
        getPermissions(this.state.IdMenu, 'Consulta', this.props.history).then(resultPermiss => {
            if (resultPermiss) {
                getListSelect('Medicamento', '/' + id, this.props.history).then(listdata => {
                    let tempArray = [];
                    tempArray.push({
                        label: listdata.Unidad.Nombre,
                        value: listdata.Unidad.IdUnidad,
                    });
                    this.setState({
                        "listUnidades": tempArray,
                    });

                    console.log(listdata);
                    this.setState({
                        "showLoading": false,
                        codigoERP: listdata.CodigoERP,
                        codigoZENTRIA: listdata.CodigoZENTRIA,
                        mNombre: listdata.Nombre,
                        mGenerico: listdata.Generico,
                        laboratorio: listdata.Laboratorio,
                        presentacion: listdata.Presentacion,
                        concentracion: listdata.Concentracion,
                        CUM: listdata.CUM,
                        expediente: listdata.Expediente,
                        qMinDispen: listdata.QMinDispen,
                        marcaCcial: listdata.MarcaCcial,
                        IUM: listdata.IUM,
                        rInvima: listdata.RInvima,
                        fhVtoRInv: formatDateP(listdata.FhVtoRInv, 'yyyy-MM-DD'),
                        rangoTtura: listdata.RangoTtura,
                        IdUnidad: this.state.listUnidades.find(i => i.value === listdata.IdUnidad),
                        IdFormaFtica: this.state.listFormasftica.find(i => i.value === listdata.IdFormaFtica),
                        IdViaAdmon: this.state.listViasAdmon.find(i => i.value === listdata.IdViaAdmon),
                        IdGrupoRInv: this.state.listGruposRInv.find(i => i.value === listdata.IdGrupoRInv),
                        IdModalidad: this.state.listModalidades.find(i => i.value === listdata.IdModalidad),
                        IdEstadoRInv: this.state.listEstadosRInv.find(i => i.value === listdata.IdEstadoRInv),
                        IdATC: this.state.listATC.find(i => i.value === listdata.IdATC),
                        IdUbicacion: this.state.listUbicaciones.find(i => i.value === listdata.IdUbicacion),
                        pctIVA: listdata.PctIVA,
                        comentario: listdata.Comentario,
                        nivelRiesgo:listdata.NivelRiesgo,
                        estado: listdata.Inactivo === true ? 'INACTIVO' : 'ACTIVO',
                        chDescontinuado: listdata.Descontinuado,
                        fhDescontinuado: formatDateP(listdata.FhDescontinuado, 'yyyy-MM-DD'),
                        chBarras: listdata.Barras,
                        chRegulado: listdata.Regulado,
                        chControlado: listdata.Controlado,
                        chFraccionable: listdata.Fraccionable,
                        chAplicacion: listdata.Aplicacion,
                        chFotosensible: listdata.Fotosensible,
                        chEducacion: listdata.Educacion,
                        chFrio: listdata.Frio,
                        chLasa: listdata.Lasa,
                        chValidar1ra: listdata.Validar1ra,
                        chNoPOS: listdata.NoPOS,
                        "showBtnUpdate": this.state.showBtnDelete === true ? false : (listdata.Inactivo === true ? false : true),
                        "showBtnCreate": false,
                    });
                    console.log(this.state);
                    if (listdata.Marcas !== undefined) {
                        listdata.Marcas.forEach((element) => {
                            if (this.state.listMarcas.length > 0) {
                                let elementFind = this.state.listMarcas.find(i => i.value === element.IdMarca);
                                elementFind.select = true;
                            }
                        });
                        this.setState({
                            "listMarcas": this.state.listMarcas
                        });
                    }
                });
            } else {
                swal("Advertencia", "Sin Permisos Ingreso", "warning");
            }
        });
    }

    onAsyncOptionsSelect(selector, event) {
        if (selector === 'IdUnidad' && event !== null) {
            return new Promise((resolve, reject) => {
                getListSelect('Unidades', '?page=1&limit=50&search=' + event + '', this.props.history).then(listdata => {
                    let tempArray = [];
                    listdata.data.forEach(element => {
                        tempArray.push({
                            label: element.Nombre,
                            value: element.IdUnidad,
                            select: false
                        });
                    });
                    resolve(tempArray);
                });
            });
        }
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
                            IdMedicamento: this.state.idMedicamento,
                            CodigoERP: this.state.codigoERP,
                            CodigoZENTRIA: this.state.codigoZENTRIA,
                            Nombre: this.state.mNombre,
                            Generico: this.state.mGenerico,
                            PctIVA: this.state.pctIVA,
                            Laboratorio: this.state.laboratorio,
                            Presentacion: this.state.presentacion,
                            Concentracion: this.state.concentracion,
                            CUM: this.state.CUM,
                            Expediente: this.state.expediente,
                            QMinDispen: this.state.qMinDispen,
                            MarcaCcial: this.state.marcaCcial,
                            IUM: this.state.IUM,
                            RInvima: this.state.rInvima,
                            FhVtoRInv: formatDateP(this.state.fhVtoRInv, 'yyyy-MM-DD'),
                            IdATC: this.state.IdATC.value,
                            Barras: this.state.chBarras,
                            Regulado: this.state.chRegulado,
                            Controlado: this.state.chControlado,
                            Fraccionable: this.state.chFraccionable,
                            Aplicacion: this.state.chAplicacion,
                            Fotosensible: this.state.chFotosensible,
                            Educacion: this.state.chEducacion,
                            NivelRiesgo: this.state.nivelRiesgo,
                            Frio: this.state.chFrio,
                            RangoTtura: this.state.rangoTtura,
                            Lasa: this.state.chLasa,
                            Validar1ra:this.state.chValidar1ra,
                            NoPOS: this.state.chNoPOS,
                            Comentario: this.state.comentario,
                            Agotado: false,
                            FhCreacion: formatDateP(new Date(), 'yyyy-MM-DD'),
                            Inactivo: this.state.estado === 'INACTIVO' ? true : false,
                            Unidad: this.state.IdUnidad.value,
                            ViaAdmon: this.state.IdViaAdmon.value,
                            IdUnidad: this.state.IdUnidad.value,
                            IdFormaFtica: this.state.IdFormaFtica.value,
                            IdViaAdmon: this.state.IdViaAdmon.value,
                            IdGrupoRInv: this.state.IdGrupoRInv.value,
                            IdEstadoRInv: this.state.IdEstadoRInv.value,
                            IdModalidad: this.state.IdModalidad.value,
                            IdUbicacion: this.state.IdUbicacion.value,
                            IdUser_Ing: localStorage.getItem('LoginUsers'),
                        }
                        AddItem(datasend, 'Medicamento;post', history, '/Maestros/medicamento/' + this.state.idMedicamento).then(result => {
                            this.ObtenerMestros();
                            this.setState({
                                "showLoading": false
                            });
                        });
                    } else {
                        this.setState({
                            "showLoading": false
                        });
                    }
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
                            CodigoERP: this.state.codigoERP,
                            CodigoZENTRIA: this.state.codigoZENTRIA,
                            Nombre: this.state.mNombre,
                            Generico: this.state.mGenerico,
                            PctIVA: this.state.pctIVA,
                            Laboratorio: this.state.laboratorio,
                            Presentacion: this.state.presentacion,
                            Concentracion: this.state.concentracion,
                            CUM: this.state.CUM,
                            Expediente: this.state.expediente,
                            QMinDispen: this.state.qMinDispen,
                            MarcaCcial: this.state.marcaCcial,
                            IUM: this.state.IUM,
                            RInvima: this.state.rInvima,
                            FhVtoRInv: formatDateP(this.state.fhVtoRInv, 'yyyy-MM-DD'),
                            IdATC: this.state.IdATC.value,
                            Barras: this.state.chBarras,
                            Regulado: this.state.chRegulado,
                            Controlado: this.state.chControlado,
                            Fraccionable: this.state.chFraccionable,
                            Aplicacion: this.state.chAplicacion,
                            Fotosensible: this.state.chFotosensible,
                            Educacion: this.state.chEducacion,
                            Validar1ra:this.state.chValidar1ra,
                            NivelRiesgo: this.state.nivelRiesgo,
                            Frio: this.state.chFrio,
                            RangoTtura: this.state.rangoTtura,
                            Lasa: this.state.chLasa,
                            NoPOS: this.state.chNoPOS,
                            Comentario: this.state.comentario,
                            Agotado: false,
                            Fh_Act: formatDateP(new Date(), 'yyyy-MM-DD'),
                            Inactivo: this.state.estado === 'INACTIVO' ? true : false,
                            Unidad: this.state.IdUnidad.value,
                            ViaAdmon: this.state.IdViaAdmon.value,
                            IdUnidad: this.state.IdUnidad.value,
                            IdFormaFtica: this.state.IdFormaFtica.value,
                            IdViaAdmon: this.state.IdViaAdmon.value,
                            IdGrupoRInv: this.state.IdGrupoRInv.value,
                            IdEstadoRInv: this.state.IdEstadoRInv.value,
                            IdModalidad: this.state.IdModalidad.value,
                            IdUbicacion: this.state.IdUbicacion.value,
                            IdUser_Act: localStorage.getItem('LoginUsers'),
                        }
                        UpdateItem(this.state.idMedicamento, datasend, 'Medicamento;put', history, '').then(result => {
                            this.onChangeInfoMedicamento(this.state.idMedicamento);
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
        DeleteItem(this.state.idMedicamento, 'Medicamento', this.props.history, '/Maestros/BusquedaMed');
    }

    onGoNewMedicamento() {
        localStorage.setItem('ActionItem', '');
        this.props.history.push('/Maestros/BusquedaMed');
    }

    onDeleteMedicamento(id) {
        getPermissions(this.state.IdMenu, 'Retiro', this.props.history).then(resultPermiss => {
            if (resultPermiss) {
                const { history } = this.props;

                const datasend = {
                    Inactivo: true,
                    IdUser_Act: localStorage.getItem('LoginUsers'),
                    FhInactivo: new Date(),
                }

                UpdateItem(this.state.idMedicamento, datasend, 'Medicamento;put', history, '').then(result => {
                    this.onChangeInfoMedicamento(this.state.idMedicamento);
                });
                this.setState({
                    "showLoading": false
                });
                //DeleteItem(id, 'Medicamento', this.props.history);
            } else {
                swal("Advertencia", "Sin Permisos RETIRO", "warning");
            }
        });
    }

    onOpenPluAsignados() {
        getPermissions(this.state.IdSubMenu1, 'Consulta', this.props.history).then(resultPermiss => {
            if (resultPermiss) {

                this.setState({
                    AsigPLU: '',
                    AsigPLUPrecio: '',
                    showPLUAsignados: true,
                });

                console.log(this.state);
                getListSelect('MedicamentoPLU', '?IdMedicamento=' + this.state.idMedicamento, this.props.history).then(listdata => {
                    this.setState({
                        "dataResultAsigPLU": listdata.data
                    });
                });

            } else {
                swal("Advertencia", "Sin Permisos Ingreso", "warning");
            }
        });

    }

    onClosePluAsignados() {
        this.setState({
            showPLUAsignados: false,
            AsigPLU: '',
            AsigPLUPrecio: '',
            dataResultAsigPLU: []
        });
    }

    onFindActionsSubMenu1(item, filter) {
        let tempArray = JSON.parse(localStorage.getItem('permissions'));
        if (tempArray !== undefined) {
            let permissions = tempArray.find(i => i.IdMenu === this.state.IdSubMenu1);
            if (permissions !== undefined) {
                switch (filter) {
                    default:
                        return <div><label>'No se encontraron permisos'</label></div>;
                    case "Ingreso":
                        if (permissions.Ingreso) {
                            return <div>
                                <CButton
                                    style={{ float: "right" }}
                                    color="primary"
                                    shape="square"
                                    visible="false"
                                    onClick={() => this.onSubmitFormCreatePluAsignados()}
                                    size="sm">
                                    {<CIcon name="cil-plus" alt="plus" />}Agregar
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
                                    onClick={() => this.onOpenActionsPluAsignados(item, filter)}
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

    onSubmitFormCreatePluAsignados() {
        getPermissions(this.state.IdSubMenu1, 'Ingreso', this.props.history).then(resultPermiss => {
            if (resultPermiss) {
                this.setState({
                    "showLoading": true
                });
                validateRequiredFields(this.state, camposRequiredSubMenu).then(result => {
                    if (result) {
                        let conenioExistente = this.state.dataResultAsigPLU.find(i => i.value === this.state.IdConvenio.value);
                        console.log(conenioExistente);
                        if (conenioExistente !== undefined) {
                            swal("Advertencia", "Este Convenio ya posee PLU Asignado", "warning");
                        }
                        else {
                            const { history } = this.props;
                            let numPrecio = removeformatCurrency(this.state.AsigPLUPrecio)
                            const datasend = {
                                IdMedicamento: this.state.idMedicamento,
                                IdConvenio: this.state.IdConvenio.value,
                                PLU: this.state.AsigPLU,
                                Precio: numPrecio,
                                PctajeIVA: 0,
                            }
                            AddItem(datasend, 'MedicamentoPLU;post', history, '').then(result => {
                                this.onOpenPluAsignados();
                            });
                        }
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

    onOpenActionsPluAsignados(item, filter) {
        console.log(item)
        this.setState({
            "showLoading": true
        });

        switch (filter) {
            default:
                break;
            case "Retiro":
                DeleteItem('medicamentos/' + item.IdMedicamento + '/convenio/' + item.IdConvenio, 'MedicamentoPLU', this.props.history);
                break;
        }

        this.setState({
            "showLoading": false
        });
    }

    getTitle() {
        if (this.state.id === '_add') {
            return "Agregar MEDICAMENTO"
        } else {
            return "Consultar / Modificar / Eliminar MEDICAMENTO"
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
                                <div className="card-header-actions justify-content-md-end">
                                    {/*   <CButton
                                        style={{ float: "right" }}
                                        color="warning"
                                        variant="outline"
                                        shape="square" onClick={this.onGoNewMedicamento}
                                        size="sm">{<CIcon name="cil-plus" alt="plus" />}
                                    </CButton> */}
                                </div>
                            </CCardHeader>
                            <CCardBody>
                                <CCol md="12">
                                    <CForm inline>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Id.Medicamento" style={{ paddingLeft: '2%' }} id="idMedicamento" name="idMedicamento" value={this.state.idMedicamento} onChange={this.onInputchange} onKeyDown={this.onInputchange} required />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Id ERP" style={{ paddingLeft: '2%' }} id="codigoERP" name='codigoERP' value={this.state.codigoERP} onChange={this.onInputchange} required />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Id Zentria" style={{ paddingLeft: '2%' }} id="codigoZENTRIA" name='codigoZENTRIA' value={this.state.codigoZENTRIA} onChange={this.onInputchange} required />
                                        </CFormGroup>                                        
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                    <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Generico" style={{ width: '985px', paddingLeft: '2%' }} value={this.state.mGenerico} onChange={this.onInputchange} id="mGenerico" name="mGenerico" required="True" />
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Nombre" style={{ width: '985px', paddingLeft: '2%' }} value={this.state.mNombre} onChange={this.onInputchange} id="mNombre" name="mNombre" required="True" />
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Laboratorio" style={{ width: '985px', paddingLeft: '2%' }} value={this.state.laboratorio} onChange={this.onInputchange} id="laboratorio" name="laboratorio" required="True" />
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Marca Comercial" style={{ width: '490px', paddingLeft: '2%' }} value={this.state.marcaCcial} onChange={this.onInputchange} id="marcaCcial" name="marcaCcial" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Presentacion" style={{ width: '490px', paddingLeft: '2%' }} value={this.state.presentacion} onChange={this.onInputchange} id="presentacion" name="presentacion" />
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Concentracion" style={{ width: '324px', paddingLeft: '2%' }} maxLength={10} value={this.state.concentracion} onChange={this.onInputchange} id="concentracion" name="concentracion" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="IUM" style={{ paddingLeft: '2%' }} value={this.state.IUM} onChange={this.onInputchange} id="IUM" name="IUM" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="CUM" style={{ paddingLeft: '2%' }} value={this.state.CUM} onChange={this.onInputchange} id="CUM" name="CUM" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Expediente" style={{ paddingLeft: '2%' }} maxLength={20} value={this.state.expediente} onChange={this.onInputchange} id="expediente" name="expediente" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Cantidad Min." style={{width: '150px', paddingLeft: '2%' }} type='number' maxLength={20} value={this.state.qMinDispen} onChange={this.onInputchange} id="qMinDispen" name="qMinDispen" required="True" />
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '322px' }} >
                                                <Select
                                                    options={this.state.listFormasftica}
                                                    styles={customSelectStyles}
                                                    value={this.state.IdFormaFtica}
                                                    isClearable
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    placeholder="Forma Farmaceútica"
                                                    onChange={event => this.onSelectchange("IdFormaFtica", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '330px' }} >
                                                <AsyncSelect
                                                    options={this.state.listUnidades}
                                                    styles={customSelectStyles}
                                                    value={this.state.IdUnidad}
                                                    isClearable
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    placeholder="Unidad"
                                                    loadOptions={event => this.onAsyncOptionsSelect("IdUnidad", event)}
                                                    onChange={event => this.onSelectchange("IdUnidad", event)}
                                                ></AsyncSelect>
                                            </div>
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '330px' }} >
                                                <Select
                                                    options={this.state.listViasAdmon}
                                                    styles={customSelectStyles}
                                                    value={this.state.IdViaAdmon}
                                                    isClearable
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    placeholder="Via administración"
                                                    onChange={event => this.onSelectchange("IdViaAdmon", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '322px' }} >
                                                <Select
                                                    options={this.state.listModalidades}
                                                    styles={customSelectStyles}
                                                    value={this.state.IdModalidad}
                                                    isClearable
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    placeholder="Modalidad"
                                                    onChange={event => this.onSelectchange("IdModalidad", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '330px' }} >
                                                <Select
                                                    options={this.state.listATC}
                                                    styles={customSelectStyles}
                                                    value={this.state.IdATC}
                                                    isClearable
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    placeholder="ATC"
                                                    onChange={event => this.onSelectchange("IdATC", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '330px' }} >
                                                <Select
                                                    options={this.state.listUbicaciones}
                                                    styles={customSelectStyles}
                                                    value={this.state.IdUbicacion}
                                                    isClearable
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    placeholder="Ubicacion"
                                                    onChange={event => this.onSelectchange("IdUbicacion", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="R.Invima" style={{ paddingLeft: '2%' }} value={this.state.rInvima} onChange={this.onInputchange} id="rInvima" name="rInvima" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Fh. Vecimiento" style={{ width: '151px', paddingLeft: '2%' }} type='date' value={this.state.fhVtoRInv} onChange={this.onInputchange} id="fhVtoRInv" name="fhVtoRInv" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '330px' }} >
                                                <Select
                                                    options={this.state.listGruposRInv}
                                                    styles={customSelectStyles}
                                                    value={this.state.IdGrupoRInv}
                                                    isClearable
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    placeholder="Grupo Inv"
                                                    onChange={event => this.onSelectchange("IdGrupoRInv", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '330px' }} >
                                                <Select
                                                    options={this.state.listEstadosRInv}
                                                    styles={customSelectStyles}
                                                    value={this.state.IdEstadoRInv}
                                                    isClearable
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    placeholder="Estado Grupo Inv"
                                                    onChange={event => this.onSelectchange("IdEstadoRInv", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>

                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="R Temperatura" style={{ paddingLeft: '2%' }} value={this.state.rangoTtura} onChange={this.onInputchange} id="rangoTtura" name="rangoTtura" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="% IVA" type="number" style={{ paddingLeft: '2%' }} value={this.state.pctIVA} onChange={this.onInputchange} id="pctIVA" name="pctIVA" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Nivel Riesgo" maxLength={1}  style={{ paddingLeft: '2%' }} value={this.state.nivelRiesgo} onChange={this.onInputchange} id="nivelRiesgo" name="nivelRiesgo" required="True" />
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <CListGroup horizontal='sm'>
                                                <CListGroupItem key={'chRegulado'} >
                                                    <CInputCheckbox id="chRegulado" name="chRegulado" checked={this.state.chRegulado}
                                                        onChange={this.onInputchange} /> Es Regulado
                                                </CListGroupItem>
                                                <CListGroupItem key={'chControlado'} >
                                                    <CInputCheckbox id="chControlado" name="chControlado" checked={this.state.chControlado}
                                                        onChange={this.onInputchange} /> Es Controlado
                                                </CListGroupItem>
                                                <CListGroupItem key={'chFraccionable'} >
                                                    <CInputCheckbox id="chFraccionable" name="chFraccionable" checked={this.state.chFraccionable}
                                                        onChange={this.onInputchange} /> Es Fraccionable
                                                </CListGroupItem>
                                                <CListGroupItem key={'chAplicacion'} >
                                                    <CInputCheckbox id="chAplicacion" name="chAplicacion" checked={this.state.chAplicacion}
                                                        onChange={this.onInputchange} /> Es Aplicacion
                                                </CListGroupItem>
                                                <CListGroupItem key={'chFotosensible'} >
                                                    <CInputCheckbox id="chFotosensible" name="chFotosensible" checked={this.state.chFotosensible}
                                                        onChange={this.onInputchange} /> Es Fotosensible
                                                </CListGroupItem>
                                                <CListGroupItem key={'chNoPOS'} >
                                                    <CInputCheckbox id="chNoPOS" name="chNoPOS" checked={this.state.chNoPOS}
                                                        onChange={this.onInputchange} /> No POS
                                                </CListGroupItem>
                                            </CListGroup>
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <CListGroup horizontal='sm'>
                                                <CListGroupItem key={'chBarras'} >
                                                    <CInputCheckbox id="chBarras" name="chBarras" checked={this.state.chBarras}
                                                        onChange={this.onInputchange} /> Requiere Codigo Barras
                                                </CListGroupItem>
                                                <CListGroupItem key={'chEducacion'} >
                                                    <CInputCheckbox id="chEducacion" name="chEducacion" checked={this.state.chEducacion}
                                                        onChange={this.onInputchange} /> Requiere Educacion
                                                </CListGroupItem>
                                                <CListGroupItem key={'chFrio'} >
                                                    <CInputCheckbox id="chFrio" name="chFrio" checked={this.state.chFrio}
                                                        onChange={this.onInputchange} /> Requiere Cadena de Frio
                                                </CListGroupItem>
                                                <CListGroupItem key={'chLasa'} >
                                                    <CInputCheckbox id="chLasa" name="chLasa" checked={this.state.chLasa}
                                                        onChange={this.onInputchange} /> Requiere Lasa
                                                </CListGroupItem>
                                                <CListGroupItem key={'chValidar1ra'} >
                                                    <CInputCheckbox id="chValidar1ra" name="chValidar1ra" checked={this.state.chValidar1ra}
                                                        onChange={this.onInputchange} /> Validar 1ra Entrega
                                                </CListGroupItem>
                                            </CListGroup>
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <div class="form-float scheme-des">
                                                <CTextarea style={{ width: '850px',fontWeight:'600',fontSize:"1em" }}
                                                    className="form-control form-control-sm inputText"
                                                    onChange={this.onInputchange}
                                                    id="comentario" name="comentario"
                                                    rows="3"
                                                    value={this.state.comentario}
                                                    placeholder=''
                                                />
                                                <label class="floating-label">Comentario</label>
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
                                                onClick={() => this.onDeleteMedicamento(this.state.idMedicamento)}
                                                size="sm">{<CIcon name="cil-x" alt="delete" />}
                                            </CButton>
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <CInputCheckbox id="chDescontinuado" name="chDescontinuado" checked={this.state.chDescontinuado}
                                                onChange={this.onInputchange} /> Descontinuado
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Fh. Descontin" style={{ width: '155px', paddingLeft: '2%' }} type='date' value={this.state.fhDescontinuado} onChange={this.onInputchange} id="fhDescontinuado" name="fhDescontinuado" required="True" />
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CButton type="submit" size="sm" className="float-right" color="primary" style={{ display: this.state.showBtnPluAsiganados ? 'block' : 'none' }} onClick={this.onOpenPluAsignados}>PLU Asignados</CButton>
                                    </CForm>
                                </CCol>
                            </CCardBody>
                            <CCardFooter>
                                <CButton type="submit" size="sm" className="float-left" color="warning" onClick={this.onInputclear}><CIcon name="cil-x" /> Limpiar</CButton>
                                <CButton type="submit" size="sm" className="float-right" color="primary" style={{ display: this.state.showBtnCreate ? 'block' : 'none' }} onClick={this.onSubmitFormCreate}><CIcon name="cil-plus" /> Guardar Información</CButton>
                                <CButton type="submit" size="sm" className="float-right" color="primary" style={{ display: this.state.showBtnUpdate ? 'block' : 'none' }} onClick={this.onSubmitFormUpdate}><CIcon name="cil-pencil" /> Guardar cambios</CButton>
                                <CButton type="submit" size="sm" className="float-right" color="primary" style={{ display: this.state.showBtnDelete ? 'block' : 'none' }} onClick={this.onSubmitFormDelete}><CIcon name="cil-pencil" /> Eliminar Item</CButton>
                                <CButton className="float-right" color="warning" onClick={this.onGoNewMedicamento} size="sm"><CIcon name="cil-arrow-left" /> Volver </CButton>
                            </CCardFooter>
                        </CCard>
                    </CCol>
                </CRow>
                <CModal show={this.state.showPLUAsignados} closeOnBackdrop={false}>
                    <CModalHeader>
                        <CModalTitle>PLU Asignados</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CRow>
                            <CCol>
                                <CForm inline style={{ paddingTop: '0.8%' }}>
                                    <CFormGroup className="pr-1" >
                                        <div style={{ width: '420px' }}>
                                            <Select
                                                options={this.state.listConvenios}
                                                styles={customSelectStyles}
                                                isClearable
                                                components={{
                                                    ValueContainer: CustomValueContainer
                                                }}
                                                placeholder="Convenio"
                                                onChange={event => this.onSelectchange("IdConvenio", event)}
                                            ></Select>
                                        </div>
                                    </CFormGroup>
                                </CForm>
                                <CForm inline style={{ paddingTop: '0.8%' }}>
                                    <CFormGroup className="pr-1" >
                                        <FloatingLabelInput label="PLU" style={{ paddingLeft: '2%' }} value={this.state.AsigPLU} onChange={this.onInputchange} id="AsigPLU" name="AsigPLU" required="True" />
                                    </CFormGroup>
                                    <CFormGroup className="pr-1" >
                                        <FloatingLabelInput label="PrecioPLU" style={{ paddingLeft: '2%' }} value={this.state.AsigPLUPrecio} type="Currency" onChange={this.onInputchange} id="AsigPLUPrecio;Currency" name="AsigPLUPrecio" required="True" />
                                    </CFormGroup>
                                    <CFormGroup className="pr-1" >
                                        {this.onFindActionsSubMenu1('', 'Ingreso')}
                                    </CFormGroup>
                                </CForm>
                            </CCol>
                        </CRow>
                        <hr></hr>
                        <CRow>
                            <CDataTable
                                items={this.state.dataResultAsigPLU}
                                fields={[
                                    { key: 'IdConvenio', label: 'IdConvenio' },
                                    { key: 'Nombre', label: 'Convenio' },
                                    { key: 'PLU', label: 'PLU' },
                                    { key: 'Precio', label: 'Precio' },
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
                                    'Nombre':
                                        (item) => (
                                            <td>
                                                {toUPPER(item.Convenio.Nombre)}
                                            </td>
                                        ),
                                    'Precio':
                                        (item) => (
                                            <td>
                                                {formatCurrency("en-US", "USD", 0, item.Precio)}
                                            </td>
                                        ),
                                    'Acciones':
                                        (item, index) => {
                                            return (
                                                <>
                                                    <td className="py-2">
                                                        <CButtonGroup role="group">
                                                            {/* {item.Inactivo === false ? this.onFindActionsSubMenu1(item, 'Inactivar') : this.onFindActionsSubMenu1(item, 'Activar')} */}
                                                            {this.onFindActionsSubMenu1(item, 'Retiro')}
                                                        </CButtonGroup>
                                                    </td>
                                                </>
                                            )
                                        },
                                }}
                            />
                        </CRow>
                    </CModalBody>
                    <CModalFooter>
                        <CButton onClick={this.onClosePluAsignados}>Cerrar</CButton>
                    </CModalFooter>
                </CModal>
            </>
        )
    }
}
export default medicamento