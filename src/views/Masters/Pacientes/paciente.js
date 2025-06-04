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
    CInput,
    CTextarea,
    CListGroup,
    CListGroupItem,
    CInputCheckbox,
    CSpinner,
    CBadge,
    CModal,
    CModalBody,
    CModalTitle,
    CModalHeader,
    CModalFooter,
    CCollapse
} from '@coreui/react'
import swal from 'sweetalert'
import CIcon from '@coreui/icons-react'
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import customSelectStyles from 'src/reusable/customSelectStyles'
import UpdateItem from 'src/reusable/AccionsUpdate'
import AddItem from 'src/reusable/AccionsPost'
import DeleteItem from 'src/reusable/AccionsDelete'
import getListSelect from 'src/reusable/GetList'
import getPermissions from 'src/reusable/GetPermissions'
import { formatDateP, toUPPER, syncDelay } from 'src/reusable/Util'
import estrato from 'src/reusable/maestros/estratos'
import zonas from 'src/reusable/maestros/zonas'
import { getEstado } from 'src/reusable/Util'
import FloatingLabelInput from 'react-floating-label-input'
import { CustomValueContainer } from 'src/reusable/CustomControl'
import validateRequiredFields from 'src/reusable/RequiredFields'

import 'src/scss/style_print.scss';

const camposRequired = [
    { label: 'idPaciente' },
    { label: 'pNombre' },
    { label: 'pApellido' },
    { label: 'telefono' },
    { label: 'fhNacimiento' },
    { label: 'regimenId' },
    { label: 'barrio' },
    { label: 'direccion' },
    { label: 'convenioId' },
    { label: 'escolaridadId' },
    { label: 'estratoId' },
    { label: 'zonaId' },
    // { label: 'acudiente' },
    // { label: 'celularAcudiente' },
    { label: 'tipoId' },
    { label: 'generoId' },
    { label: 'afiliacionId' },
    { label: 'ciudadesId' },
    { label: 'email' },
    { label: 'nacionalidadId' },
]

class paciente extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IdMenu: 'Menu-pacientes',
            id: props.match.params.id,
            IsShow: false,
            listPermissions: [],
            listTiposId: [],
            listGeneros: [],
            listRegimen: [],
            listConvenios: [],
            listNivelEscolaridad: [],
            listEstrato: [],
            listZona: [],
            listCiudades: [],
            listAfiliaciones: [],
            listMarcas: [],
            listTiposVias: [],
            listLetras: [],
            listComplemento: [],
            listPaises: [],
            idPaciente: '',
            idRealPaciente: '',
            pNombre: '',
            sNombre: '',
            pApellido: '',
            sApellido: '',
            codEPS: '',
            telefono: '',
            fhNacimiento: '',
            fhCreacion: '',
            fhExpedicion: '',
            regimenId: '',
            ciudad: '',
            barrio: '',
            direccion: '',
            complemento: '',
            convenioId: '',
            escolaridadId: '',
            nacionalidadId: '',
            estratoId: '',
            zonaId: '',
            contacto: '',
            acudiente: '',
            celularAcudiente: '',
            comentario: '',
            estado: '',
            tipoId: '',
            generoId: '',
            afiliacionId: '',
            ciudadesId: '',
            departamento: '',
            email: '',
            direccionNumero3: '',
            direccionNumero2: '',
            direccionNumero: '',
            direccionComplemento: '',
            direccionComplemento2: '',
            direccionLetra2: '',
            direccionLetra: '',
            direccionTipoVia: { label: '', value: '', select: false },
            showBtnCreate: false,
            showBtnUpdate: false,
            showLoading: true,
            showAyudaDireccion: false,
            showBtnInterpolaridad: false,
        };
        this.onInputchange = this.onInputchange.bind(this);
        this.onSelectchange = this.onSelectchange.bind(this);
        this.onInputclear = this.onInputclear.bind(this);
        this.onSubmitFormUpdate = this.onSubmitFormUpdate.bind(this);
        this.onSubmitFormCreate = this.onSubmitFormCreate.bind(this);
        this.onSubmitFormDelete = this.onSubmitFormDelete.bind(this);
        this.ObtenerMestros = this.ObtenerMestros.bind(this);
        this.onChangeInfoPaciente = this.onChangeInfoPaciente.bind(this);
        this.onGoInterpolInfoPaciente = this.onGoInterpolInfoPaciente.bind(this);
        this.onGoNewPaciente = this.onGoNewPaciente.bind(this);
        this.onDeletePaciente = this.onDeletePaciente.bind(this);
        this.onChangeCiudad = this.onChangeCiudad.bind(this);
        this.onAsyncOptionsSelect = this.onAsyncOptionsSelect.bind(this);
        this.onOpenAyudaDireccion = this.onOpenAyudaDireccion.bind(this);
        this.onCloseAyudaDireccion = this.onCloseAyudaDireccion.bind(this);
        this.onApplyAyudaDireccion = this.onApplyAyudaDireccion.bind(this);
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
        console.log('patient_creation_interpolarity');
        console.log(localStorage.getItem('patient_creation_interpolarity'));
        this.setState({
            "showBtnInterpolaridad": localStorage.getItem('patient_creation_interpolarity')
        });
        let history = this.props.history;
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
                    "listTiposId": tempArray,
                });
                getListSelect('Generos', '?Inactivo=false', history).then(listdata => {
                    let tempArray = [];
                    listdata.data.forEach(element => {
                        tempArray.push({
                            label: element.Nombre,
                            value: element.IdGenero,
                            select: false
                        });
                    });
                    this.setState({
                        "listGeneros": tempArray,
                    });
                    getListSelect('NivelEscolaridad', '?Inactivo=false', history).then(listdata => {
                        let tempArray = [];
                        listdata.data.forEach(element => {
                            tempArray.push({
                                label: element.Nombre,
                                value: element.IdNivelEscol,
                                select: false
                            });
                        });
                        this.setState({
                            "listNivelEscolaridad": tempArray,
                        });
                        getListSelect('Regimenes', '?Inactivo=false', history).then(listdata => {
                            let tempArray = [];
                            listdata.data.forEach(element => {
                                tempArray.push({
                                    label: element.Nombre,
                                    value: element.IdRegimen,
                                    select: false
                                });
                            });
                            this.setState({
                                "listRegimen": tempArray,
                            });
                            getListSelect('Afiliaciones', '?Inactivo=false', history).then(listdata => {
                                let tempArray = [];
                                listdata.data.forEach(element => {
                                    tempArray.push({
                                        label: element.Nombre,
                                        value: element.IdAfiliacion,
                                        select: false
                                    });
                                });
                                this.setState({
                                    "listAfiliaciones": tempArray,
                                });
                                getListSelect('Marcas', '?Inactivo=false', history).then(listdata => {
                                    let tempArray = [];

                                    listdata.data.forEach(element => {
                                        tempArray.push({
                                            label: element.Nombre,
                                            value: element.IdMarca,
                                            select: false
                                        });
                                    });
                                    this.setState({
                                        "listMarcas": tempArray
                                    });
                                    getListSelect('TiposVia', '', history).then(listdata => {
                                        let tempArray = [];
                                        listdata.data.forEach(element => {
                                            tempArray.push({
                                                label: element.Nombre,
                                                value: element.TipoVia,
                                                select: false
                                            });
                                        });
                                        this.setState({
                                            "listTiposVias": tempArray,
                                        });

                                        getListSelect('LetrasVia', '', history).then(listdata => {
                                            let tempArray = [];
                                            listdata.data.forEach(element => {
                                                tempArray.push({
                                                    label: element.LetraVia,
                                                    value: element.LetraVia,
                                                    select: false
                                                });
                                            });
                                            this.setState({
                                                "listLetras": tempArray,
                                            });

                                            getListSelect('OrientacionVia', '', history).then(listdata => {
                                                let tempArray = [];
                                                listdata.data.forEach(element => {
                                                    tempArray.push({
                                                        label: element.Orientacion,
                                                        value: element.Orientacion,
                                                        select: false
                                                    });
                                                });
                                                this.setState({
                                                    "listComplemento": tempArray,
                                                });
                                                getListSelect('Paises', '', history).then(listdata => {
                                                    let tempArray = [];
                                                    listdata.data.forEach(element => {
                                                        tempArray.push({
                                                            label: element.Nombre,
                                                            value: element.IdPais,
                                                        });
                                                    });
                                                    this.setState({
                                                        "listPaises": tempArray,
                                                    });
                                                    if (this.state.id !== '_add') {
                                                        this.setState({
                                                            "idPaciente": this.state.id,
                                                            "showLoading": true
                                                        });
                                                        this.onChangeInfoPaciente(this.state.id);
                                                    } else {
                                                        this.setState({
                                                            "showLoading": false,
                                                            "showBtnCreate": true,
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
                });
            });
        });

        this.setState({
            "listEstrato": estrato,
            "listZona": zonas,
        });
    }

    onInputchange(event) {
        if (event.target.name.includes('listMarcas')) {
            let elementFind = this.state.listMarcas.find(i => i.value === event.target.id);
            elementFind.select = elementFind.select === true ? false : true;
            this.setState({
                "listMarcas": this.state.listMarcas
            });
        } else {
            if (event.target.name === "idPaciente") {
                this.setState({
                    [event.target.name]: toUPPER(event.target.value)
                });
                if (event.code === "Tab") {
                    this.onChangeInfoPaciente(event.target.value);
                }
            } else if (event.target.name === "email") {
                this.setState({
                    [event.target.name]: (event.target.value)
                });
            }
            else {
                this.setState({
                    [event.target.name]: toUPPER(event.target.value)
                });
            }
        }
    }

    onOpenAyudaDireccion() {
        this.setState({
            "showAyudaDireccion": true,
        });
    }

    onApplyAyudaDireccion() {
        this.setState({
            "showAyudaDireccion": false,
            "direccion": this.state.direccionTipoVia.value
                + ' ' + this.state.direccionNumero
                + '' + this.state.direccionLetra.value
                + ' ' + this.state.direccionComplemento.value
                + ' ' + this.state.direccionNumero2
                + '' + this.state.direccionLetra2.value
                + ' ' + this.state.direccionNumero3
                + ' ' + this.state.direccionComplemento2.value
        });
    }

    onCloseAyudaDireccion() {
        this.setState({
            "showAyudaDireccion": false,
        });
    }

    onInputclear() {
        this.setState({
            idRealPaciente: '',
            pNombre: '',
            sNombre: '',
            pApellido: '',
            sApellido: '',
            codEPS: '',
            telefono: '',
            fhNacimiento: '',
            fhCreacion: '',
            fhExpedicion: '',
            ciudad: '',
            barrio: '',
            direccion: '',
            complemento: '',
            contacto: '',
            acudiente: '',
            email: '',
            nacionalidadId: '',
            celular: '',
            celularAcudiente: '',
            comentario: '',
            estado: '',
            tipoId: '',
            generoId: '',
            afiliacionId: '',
            ciudadesId: '',
            convenioId: '',
            escolaridadId: '',
            estratoId: '',
            zonaId: '',
            regimenId: '',
            departamento: '',
            direccionNumero3: '',
            direccionNumero2: '',
            direccionNumero: '',
            direccionComplemento: { label: '', value: '', select: false },
            direccionComplemento2: { label: '', value: '', select: false },
            direccionLetra2: { label: '', value: '', select: false },
            direccionLetra: { label: '', value: '', select: false },
            direccionTipoVia: { label: '', value: '', select: false },
            showBtnCreate: true,
            showBtnUpdate: false
        });

        this.state.listMarcas.forEach((element) => {
            element.select = false;
        });
        this.setState({
            "listMarcas": this.state.listMarcas
        });
    }

    onSelectchange(selector, event) {
        this.setState({
            [selector]: event
        });
        if (selector === 'ciudadesId' && event !== null) {
            this.onChangeCiudad(event.value);
        }
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

    onChangeCiudad(item) {
        getListSelect('Ciudades', '/' + item, this.props.history).then(listdata => {
            this.setState({
                "departamento": listdata.Departamento.Nombre,
            });
        });
    }

    onGoInterpolInfoPaciente() {
        if (this.state.tipoId !== '') {
            this.setState({
                "showLoading": true,
            });
            let history = this.props.history;
            let convenio = localStorage.getItem('patient_creation_interpolarity_convenio');
            console.log(convenio);
            if (convenio !== '' && convenio !== undefined) {
                getListSelect('Obtener_datos_paciente_interpolaridad', '/tipoDoc/' + this.state.tipoId.value + '/convenio/' + convenio + '/id/' + this.state.idPaciente, history).then(listdata => {
                    console.log(listdata);
                    if (listdata != null) {
                        syncDelay(600);
                        this.onChangeInfoPaciente(this.state.idPaciente);
                        if (listdata.orders.length > 0) {
                            let tmplistSaldosMed = [];
                            /*  listdata.orders.forEach(item => {
                                 if (item.formula.status === "N" && new Date(item.formula.fechaVencimiento).getTime() >= new Date().getTime()) {
                                     let numOrden = item.orderNumber;
                                     item.formula.tratamiento.forEach(element => {
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
                                             let tempArray = [];
                                             tempArray.push({
                                                 id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                 nombre: "No POS",
                                                 aplica: element.producto.medicamento.Medicamento.NoPOS
                                             });
                                             tempArray.push({
                                                 id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                 nombre: "Requiere Lasa",
                                                 aplica: element.producto.medicamento.Medicamento.Lasa
                                             });
                                             tempArray.push({
                                                 id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                 nombre: "Requiere Cadena de Frio",
                                                 aplica: element.producto.medicamento.Medicamento.Frio
                                             });
                                             tempArray.push({
                                                 id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                 nombre: "Requiere Educacion",
                                                 aplica: element.producto.medicamento.Medicamento.Educacion
                                             });
                                             tempArray.push({
                                                 id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                 nombre: "Validar 1ra Entrega",
                                                 aplica: element.producto.medicamento.Medicamento.Validar1ra
                                             });
                                             tempArray.push({
                                                 id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                 nombre: "Es Fotosensible",
                                                 aplica: element.producto.medicamento.Medicamento.Fotosensible
                                             });
                                             tempArray.push({
                                                 id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                 nombre: "Es Aplicacion",
                                                 aplica: element.producto.medicamento.Medicamento.Aplicacion
                                             });
                                             tempArray.push({
                                                 id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                 nombre: "Es Fraccionable",
                                                 aplica: element.producto.medicamento.Medicamento.Fraccionable
                                             });
                                             tempArray.push({
                                                 id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                 nombre: "Es Controlado",
                                                 aplica: element.producto.medicamento.Medicamento.Controlado
                                             });
                                             tempArray.push({
                                                 id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                 nombre: "Es Regulado",
                                                 aplica: element.producto.medicamento.Medicamento.Regulado
                                             });
                                             tempArray.push({
                                                 id: 'alertMedi' + tempArray.length + item.id + item.orderNumber,
                                                 nombre: "Requiere Codigo Barras",
                                                 aplica: element.producto.medicamento.Medicamento.Barras
                                             });
                                             element.statusAlerta = "alerta"
                                             this.setState({
                                                 "ListAlarmaMedicamentos": tempArray
                                             });
         
                                         } else {
                                             element.statusAlerta = "no"
                                         }
         
                                         element.id = createUUID();
                                         element.saldosLoteSelect = { Saldo: 0 };
                                         element.saldosSelect = {};
                                         element.itemSelect = false;
                                         element.cantidadEntregada = 0;
                                         getListSelect('Medicamento', '/' + element.producto.medicamento.IdMedicamento + '?mostrarSaldos=true&Bodega=' + localStorage.getItem('BodegaID'), this.props.history)
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
                                                                         "sumValorTx": this.state.sumValorTx + (item.interop.formula.cobro.valor),
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
         
                                                 this.setState({
                                                     listSaldosMed: tmplistSaldosMed
                                                 });
                                             });
         
                                     });
                                     this.state.IsShow.push(item.orderNumber);
                                 }
                                 syncDelay(400);
         
                                 this.setState({
                                     "ListNivel": listdata.orders,
                                     listSaldosMed: tmplistSaldosMed,
                                 });
         
                                 //this.sumPayments();
         
                             }); */

                        } else {
                            swal("Advertencia", "No se encontraron Ordenes con la informacion ingresada", "warning");
                        }
                    }
                    else {
                        swal("Advertencia", "No se encontraron Ordenes con la informacion ingresada", "warning");
                    }
                    this.setState({
                        showLoading: false
                    });
                });
            } else {
                swal("Advertencia", "no hay convenio para buscar la interpolaridad", "warning");
            }
        } else {
            swal("Advertencia", "Debe Seleccionar el tipo de Identificacion", "warning");
        }
    }

    onChangeInfoPaciente(id) {
        this.onInputclear();
        if (localStorage.getItem('ActionItem') === 'Retiro') {
            this.setState({
                "showLoading": true,
                "showBtnUpdate": true,
            });
        }
        getPermissions(this.state.IdMenu, 'Consulta', this.props.history).then(resultPermiss => {
            if (resultPermiss) {
                getListSelect('Paciente', '/' + id, this.props.history).then(listdata => {
                    console.log(listdata);
                    if (listdata !== null) {
                        let tempArray = [];
                        tempArray.push({
                            label: listdata.Ciudad.Nombre,
                            value: listdata.Ciudad.IdCiudad,
                        });
                        this.setState({
                            "listCiudades": tempArray,
                        });
                        if (listdata.IdNacionalidad === "") { listdata.IdNacionalidad = 169 }
                        if (listdata.Estrato === "") { listdata.Estrato = "3" }
                        if (listdata.ZonaUR === "" || listdata.ZonaUR === "'") { listdata.ZonaUR = "U" }
                        if (listdata.FhCreacion.includes("1900-01-01")) { listdata.FhCreacion = new Date() }
                        this.setState({
                            "showLoading": false,
                            "idRealPaciente": listdata.IdReal,
                            "tipoId": this.state.listTiposId.find(i => i.value === listdata.IdTipoId),
                            "pNombre": listdata.Nombre1,
                            "sNombre": listdata.Nombre2,
                            "pApellido": listdata.Apellido1,
                            "sApellido": listdata.Apellido2,
                            "generoId": this.state.listGeneros.find(i => i.value === listdata.IdGenero),
                            "codEPS": listdata.CodigoEPS,
                            "telefono": listdata.Telefono,
                            "celular": listdata.Celular,
                            "fhNacimiento": formatDateP(listdata.FhNacimiento, 'yyyy-MM-DD'),
                            "fhCreacion": formatDateP(listdata.FhCreacion, 'yyyy-MM-DD'),
                            "fhExpedicion": formatDateP(listdata.FhExpedicion, 'yyyy-MM-DD'),
                            "regimenId": this.state.listRegimen.find(i => i.value === listdata.IdRegimen),
                            "afiliacionId": this.state.listAfiliaciones.find(i => i.value === listdata.IdAfiliacion),
                            "ciudadesId": this.state.listCiudades.find(i => i.value === listdata.IdCiudad),
                            "convenioId": this.state.listConvenios.find(i => i.value === listdata.IdConvenio),
                            "estratoId": this.state.listEstrato.find(i => i.value === listdata.Estrato),
                            "zonaId": this.state.listZona.find(i => i.value === listdata.ZonaUR),
                            "nacionalidadId": this.state.listPaises.find(i => i.value === listdata.IdNacionalidad === "" ? 169 : listdata.IdNacionalidad),
                            "escolaridadId": this.state.listNivelEscolaridad.find(i => i.value === listdata.IdNivelEscol),
                            "barrio": listdata.Barrio,
                            "email": listdata.Email,
                            "direccion": listdata.Direccion,
                            "complemento": listdata.Direccion2,
                            "contacto": listdata.Contacto,
                            "acudiente": listdata.Acudiente,
                            "celularAcudiente": listdata.CelAcudiente,
                            "comentario": listdata.Comentario,
                            "showBtnUpdate": this.state.showBtnDelete === true ? false : (listdata.Inactivo === true ? false : true),
                            "showBtnCreate": false,
                            "estado": listdata.Inactivo === true ? 'INACTIVO' : 'ACTIVO'
                        });
                        listdata.Marcas.forEach((element) => {
                            if (this.state.listMarcas.length > 0) {
                                let elementFind = this.state.listMarcas.find(i => i.value === element.IdMarca);
                                elementFind.select = true;
                            }
                        });
                        this.setState({
                            "listMarcas": this.state.listMarcas
                        });
                        console.log(this.state);
                        if (this.state.ciudadesId !== undefined) {
                            this.onChangeCiudad(this.state.ciudadesId.value);
                        }
                        this.setState({
                            "showBtnUpdate": true,
                        });
                    } else {
                        this.setState({
                            "showLoading": false,
                            "showBtnCreate": true,
                            "idPaciente": this.state.id,
                        });
                        this.getTitle();
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
                        this.state.listMarcas.forEach((element) => {
                            if (element.select) {
                                const listSelect = {
                                    IdMarca: element.value
                                }
                                tempArray.push(listSelect);
                            }
                        });
                        const datasend = {
                            IdPaciente: this.state.idPaciente,
                            IdReal: this.state.idRealPaciente,
                            CodigoEPS: this.state.codEPS,
                            Nombre: this.state.pNombre + ' ' + this.state.sNombre + ' ' + this.state.pApellido + ' ' + this.state.sApellido,
                            Nombre1: this.state.pNombre,
                            Nombre2: this.state.sNombre,
                            Apellido1: this.state.pApellido,
                            Apellido2: this.state.sApellido,
                            Telefono: this.state.telefono,
                            Celular: this.state.celular,
                            FhNacimiento: this.state.fhNacimiento,
                            FhExpedicion: this.state.fhExpedicion,
                            Barrio: this.state.barrio,
                            Direccion: this.state.direccion,
                            Direccion2: this.state.complemento,
                            GeorefX: '',
                            GeorefY: '',
                            Estrato: this.state.estratoId.value,
                            ZonaUR: this.state.zonaId.value,
                            Contacto: this.state.contacto,
                            Comentario: this.state.comentario,
                            Acudiente: this.state.acudiente,
                            CelAcudiente: this.state.celularAcudiente,
                            Inactivo: false,
                            FhCreacion: formatDateP(new Date(), 'yyyy-MM-DD'),
                            IdUser_Ing: localStorage.getItem('user'),
                            IdTipoId: this.state.tipoId.value,
                            IdGenero: this.state.generoId.value,
                            IdRegimen: this.state.regimenId.value,
                            IdAfiliacion: this.state.afiliacionId.value,
                            IdCiudad: this.state.ciudadesId.value,
                            IdConvenio: this.state.convenioId.value,
                            IdNivelEscol: this.state.escolaridadId.value,
                            IdNacionalidad: this.state.nacionalidadId.value,
                            Email: this.state.email,
                            Marcas: tempArray
                        }
                        AddItem(datasend, 'Paciente;post', history, '').then(result => {
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
                        this.state.listMarcas.forEach((element) => {
                            if (element.select) {
                                const listSelect = {
                                    IdMarca: element.value
                                }
                                tempArray.push(listSelect);
                            }
                        });

                        const datasend = {
                            IdReal: this.state.idRealPaciente,
                            CodigoEPS: this.state.codEPS,
                            Nombre: this.state.pNombre + ' ' + this.state.sNombre + ' ' + this.state.pApellido + ' ' + this.state.sApellido,
                            Nombre1: this.state.pNombre,
                            Nombre2: this.state.sNombre,
                            Apellido1: this.state.pApellido,
                            Apellido2: this.state.sApellido,
                            Telefono: this.state.telefono,
                            Celular: this.state.celular,
                            FhNacimiento: this.state.fhNacimiento,
                            FhExpedicion: this.state.fhExpedicion,
                            Barrio: this.state.barrio,
                            Direccion: this.state.direccion,
                            Direccion2: this.state.complemento,
                            GeorefX: '',
                            GeorefY: '',
                            Estrato: this.state.estratoId.value,
                            ZonaUR: this.state.zonaId.value,
                            Contacto: this.state.contacto,
                            Comentario: this.state.comentario,
                            Acudiente: this.state.acudiente,
                            CelAcudiente: this.state.celularAcudiente,
                            Inactivo: false,
                            IdUser_Act: localStorage.getItem('user'),
                            Fh_Act: new Date(),
                            FhCreacion: this.state.fhCreacion,
                            IdTipoId: this.state.tipoId.value,
                            IdGenero: this.state.generoId.value,
                            IdRegimen: this.state.regimenId.value,
                            IdAfiliacion: this.state.afiliacionId.value,
                            IdCiudad: this.state.ciudadesId.value,
                            IdConvenio: this.state.convenioId.value,
                            IdNivelEscol: this.state.escolaridadId.value,
                            IdNacionalidad: this.state.nacionalidadId.value,
                            Email: this.state.email,
                            Marcas: tempArray
                        }
                        console.log(datasend);
                        UpdateItem(this.state.idPaciente, datasend, 'Paciente;put', history, '').then(result => {
                            this.onChangeInfoPaciente(this.state.idPaciente);
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
        DeleteItem(this.state.idPaciente, 'Paciente', this.props.history, '/Maestros/BusquedaPas');
    }

    onGoNewPaciente() {
        localStorage.setItem('ActionItem', '');
        this.props.history.push('/Maestros/BusquedaPas');
    }

    toggleSeeMarcas() {
        this.setState({
            "IsShow": this.state.IsShow === true ? false : true
        });
    }

    onDeletePaciente(id) {
        getPermissions(this.state.IdMenu, 'Retiro', this.props.history).then(resultPermiss => {
            if (resultPermiss) {
                const { history } = this.props;
                let tempArray = [];
                this.state.listMarcas.forEach((element) => {
                    if (element.select) {
                        const listSelect = {
                            IdMarca: element.value
                        }
                        tempArray.push(listSelect);
                    }
                });

                const datasend = {
                    Inactivo: true,
                    IdUser_Act: localStorage.getItem('user'),
                    FhInactivo: new Date(),
                }
                UpdateItem(this.state.idPaciente, datasend, 'Paciente;put', history, '').then(result => {
                    this.onChangeInfoPaciente(this.state.idMedicamento);
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
        if (this.state.id === '_add' || this.state.showBtnCreate === true) {
            return "Agregar PACIENTE"
        } else {
            return "Consultar / Modificar / Eliminar PACIENTE"
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
                                    .
                                </div>
                            </CCardHeader>
                            <CCardBody>
                                <CCol md="12">
                                    <CForm inline>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput id="idPaciente" name="idPaciente" style={{ paddingLeft: '2%' }} label="Id.Paciente" value={this.state.idPaciente} onChange={this.onInputchange} onKeyDown={this.onInputchange} required />
                                        </CFormGroup>

                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '324px' }} >
                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    options={this.state.listTiposId}
                                                    styles={customSelectStyles}
                                                    value={this.state.tipoId}
                                                    isClearable
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    placeholder="Tipo Id"
                                                    onChange={event => this.onSelectchange("tipoId", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" ><CButton style={{ display: this.state.showBtnInterpolaridad == 'true' ? 'block' : 'none' }} size="sm" color="primary" onClick={this.onGoInterpolInfoPaciente}>Interop</CButton></CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Fh. Expedicion" style={{ width: '161px', paddingLeft: '2%' }} type='date' value={this.state.fhExpedicion} onChange={this.onInputchange} id="fhExpedicion" name="fhExpedicion" />
                                        </CFormGroup>
                                    </CForm>

                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput value={this.state.pNombre} style={{ paddingLeft: '2%' }} onChange={this.onInputchange} label="1er Nombre" id="pNombre" name="pNombre" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput value={this.state.sNombre} style={{ paddingLeft: '2%' }} onChange={this.onInputchange} label="2do Nombre" id="sNombre" name="sNombre" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput value={this.state.pApellido} style={{ paddingLeft: '2%' }} onChange={this.onInputchange} label="1er Apellido" id="pApellido" name="pApellido" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput value={this.state.sApellido} style={{ paddingLeft: '2%' }} onChange={this.onInputchange} label="2do Apellido" id="sApellido" name="sApellido" required="True" />
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <CInput id="nombreCompleto" name='nombreCompleto' className="form-control form-control-sm" style={{ width: '490px', color: "#321fdb", fontWeight: "600", fontSize: "1em" }} disabled defaultValue={this.state.pNombre + ' ' + this.state.sNombre + ' ' + this.state.pApellido + ' ' + this.state.sApellido} value={this.state.pNombre + ' ' + this.state.sNombre + ' ' + this.state.pApellido + ' ' + this.state.sApellido} />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput value={this.state.codEPS} style={{ paddingLeft: '2%' }} onChange={this.onInputchange} label="Cod.EPS" id="codEPS" name="codEPS" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Telefono" type='number' style={{ paddingLeft: '2%' }} value={this.state.telefono} maxLength={7} onChange={this.onInputchange} id="telefono" name="telefono" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Celular" type='number' style={{ paddingLeft: '2%' }} maxLength={10} value={this.state.celular} onChange={this.onInputchange} id="celular" name="celular" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Fh. Nacimiento" style={{ width: '161px', paddingLeft: '2%' }} type='date' value={this.state.fhNacimiento} onChange={this.onInputchange} id="fhNacimiento" name="fhNacimiento" required="True" />
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '324px' }} >
                                                <Select
                                                    options={this.state.listGeneros}
                                                    styles={customSelectStyles}
                                                    value={this.state.generoId}
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    isClearable
                                                    placeholder="Genero"
                                                    onChange={event => this.onSelectchange("generoId", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '324px' }} >
                                                <Select
                                                    options={this.state.listRegimen}
                                                    styles={customSelectStyles}
                                                    value={this.state.regimenId}
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    isClearable
                                                    placeholder="Regimen"
                                                    onChange={event => this.onSelectchange("regimenId", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '324px' }} >
                                                <Select
                                                    options={this.state.listAfiliaciones}
                                                    styles={customSelectStyles}
                                                    value={this.state.afiliacionId}
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    isClearable
                                                    placeholder="Afiliación"
                                                    onChange={event => this.onSelectchange("afiliacionId", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>

                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
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
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Departamento" style={{ width: '320px', paddingLeft: '2%' }} value={this.state.departamento} id="departamento" name="departamento" ReadOnly="true" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput id="idRealPaciente" style={{ paddingLeft: '2%' }} name='idRealPaciente' label="Id Real" value={this.state.idRealPaciente} onChange={this.onInputchange} required />
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Correo" style={{ width: '486px', paddingLeft: '2%' }} value={this.state.email} onChange={this.onInputchange} id="email" name="email" required="True" />
                                        </CFormGroup>
                                        <div style={{ width: '324px' }} >
                                            <Select
                                                options={this.state.listPaises}
                                                styles={customSelectStyles}
                                                value={this.state.nacionalidadId}
                                                components={{
                                                    ValueContainer: CustomValueContainer
                                                }}
                                                isClearable
                                                placeholder="Nacionalidad"
                                                onChange={event => this.onSelectchange("nacionalidadId", event)}
                                            ></Select>
                                        </div>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Barrio" style={{ width: '486px', paddingLeft: '2%' }} value={this.state.barrio} onChange={this.onInputchange} id="barrio" name="barrio" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Dirección" style={{ width: '322px', paddingLeft: '2%' }} value={this.state.direccion} onChange={this.onInputchange} id="direccion" name="direccion" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <CButton size="sm" onClick={this.onOpenAyudaDireccion}>
                                                <CIcon name="cil-info" alt="Info Direccion" />
                                            </CButton>
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Complemento" style={{ width: '322px', paddingLeft: '2%' }} value={this.state.complemento} onChange={this.onInputchange} id="complemento" name="complemento" required="True" />
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '324px' }} >
                                                <Select
                                                    options={this.state.listConvenios}
                                                    styles={customSelectStyles}
                                                    value={this.state.convenioId}
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    isClearable
                                                    placeholder="Convenio"
                                                    onChange={event => this.onSelectchange("convenioId", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '324px' }} >
                                                <Select
                                                    options={this.state.listNivelEscolaridad}
                                                    styles={customSelectStyles}
                                                    value={this.state.escolaridadId}
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    isClearable
                                                    placeholder="Escolaridad"
                                                    onChange={event => this.onSelectchange("escolaridadId", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '162px' }} >
                                                <Select
                                                    options={this.state.listEstrato}
                                                    styles={customSelectStyles}
                                                    value={this.state.estratoId}
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    isClearable
                                                    placeholder="Estrato"
                                                    onChange={event => this.onSelectchange("estratoId", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <div style={{ width: '162px' }} >
                                                <Select
                                                    options={this.state.listZona}
                                                    styles={customSelectStyles}
                                                    value={this.state.zonaId}
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                    }}
                                                    isClearable
                                                    placeholder="Zona"
                                                    onChange={event => this.onSelectchange("zonaId", event)}
                                                ></Select>
                                            </div>
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Contacto" style={{ width: '322px', paddingLeft: '2%' }} value={this.state.contacto} onChange={this.onInputchange} id="contacto" name="contacto" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Acudiente" style={{ width: '322px', paddingLeft: '2%' }} value={this.state.acudiente} onChange={this.onInputchange} id="acudiente" name="acudiente" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Celular" type='number' minLength={6} maxLength={10} style={{ width: '322px', paddingLeft: '2%' }} value={this.state.celularAcudiente} onChange={this.onInputchange} id="celularAcudiente" name="celularAcudiente" required="True" />
                                        </CFormGroup>
                                        <CFormGroup className="pr-1" >
                                            <FloatingLabelInput label="Fh. Creacion" type='date' style={{ width: '161px', paddingLeft: '2%' }} value={this.state.fhCreacion} onChange={this.onInputchange} id="fhCreacion" name="fhCreacion" disabled />
                                        </CFormGroup>
                                    </CForm>
                                    <CForm inline style={{ paddingTop: '0.8%' }}>
                                        <CFormGroup className="pr-1" >
                                            <div class="form-float scheme-des">
                                                <CTextarea style={{ width: '830px', fontWeight: '600', fontSize: "1em" }}
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
                                                onClick={() => this.onDeletePaciente(this.state.idPaciente)}
                                                size="sm">{<CIcon name="cil-x" alt="delete" />}
                                            </CButton>
                                        </CFormGroup>
                                    </CForm><br></br>
                                    <CCard>
                                        <CCardHeader color='secondary'>
                                            <div className="card-header-actions justify-content-md-end">
                                                <CButton
                                                    color="secondary"
                                                    onClick={() => { this.toggleSeeMarcas() }}
                                                    className={'mb-1'}>
                                                    Ver Marcas
                                                </CButton>
                                            </div>
                                        </CCardHeader>

                                        <div className="transition-all duration-300" style={{
                                            maxHeight: this.state.IsShow ? '1000px' : '0px',
                                            overflow: 'hidden',
                                            transition: 'max-height 0.5s ease',
                                        }}>
                                            <CForm inline style={{ paddingTop: '0.8%' }}>
                                                <CFormGroup className="pr-1" >
                                                    <CListGroup horizontal='sm'>
                                                        {this.state.listMarcas.map(elemento => (
                                                            <CListGroupItem key={'k' + elemento.value} value={elemento.value}>
                                                                <CInputCheckbox disabled="true" id={elemento.value} name={'listMarcas' + elemento.value} checked={elemento.select} onChange={this.onInputchange} />
                                                                {elemento.label}
                                                            </CListGroupItem>
                                                        ))}
                                                    </CListGroup>
                                                </CFormGroup>
                                            </CForm>
                                        </div>
                                    </CCard>
                                </CCol>
                            </CCardBody>
                            <CCardFooter>
                                <CButton type="submit" size="sm" className="float-left" color="warning" onClick={this.onInputclear}><CIcon name="cil-x" /> Limpiar</CButton>
                                <CButton type="submit" size="sm" className="float-right" color="primary" style={{ display: this.state.showBtnCreate ? 'block' : 'none' }} onClick={this.onSubmitFormCreate}><CIcon name="cil-plus" /> Guardar Información</CButton>
                                <CButton type="submit" size="sm" className="float-right" color="primary" style={{ display: this.state.showBtnUpdate ? 'block' : 'none' }} onClick={this.onSubmitFormUpdate}><CIcon name="cil-pencil" /> Guardar cambios</CButton>
                                <CButton type="submit" size="sm" className="float-right" color="primary" style={{ display: this.state.showBtnDelete ? 'block' : 'none' }} onClick={this.onSubmitFormDelete}><CIcon name="cil-pencil" /> Eliminar Item</CButton>
                                <CButton type="submit" size="sm" className="float-right" color="warning" onClick={this.onGoNewPaciente}><CIcon name="cil-arrow-top" alt="plus" /> Volver</CButton>
                            </CCardFooter>
                        </CCard>
                    </CCol>
                </CRow>
                <CModal size='lg' show={this.state.showAyudaDireccion} closeOnBackdrop={false}>
                    <CModalHeader>
                        <CModalTitle>Direccion</CModalTitle>
                        <div className="card-header-actions justify-content-md-end">
                            <CButton
                                style={{ float: "right" }}
                                onClick={this.onCloseAyudaDireccion}
                                size="sm">{<CIcon name="cil-x" alt="x" />}
                            </CButton>
                        </div>
                    </CModalHeader>
                    <CModalBody>
                        <CRow>
                            <CCol md="12">
                                <CForm inline style={{ paddingTop: '0.8%' }}>
                                    <CFormGroup className="pr-1" >
                                        <div style={{ width: '162px' }} >
                                            <Select
                                                options={this.state.listTiposVias}
                                                styles={customSelectStyles}
                                                value={this.state.direccionTipoVia}
                                                components={{
                                                    ValueContainer: CustomValueContainer
                                                }}
                                                placeholder="Tipo Via"
                                                onChange={event => this.onSelectchange("direccionTipoVia", event)}
                                            ></Select>
                                        </div>
                                    </CFormGroup>
                                    <CFormGroup className="pr-1" >
                                        <FloatingLabelInput label="Numero" type="number" style={{ paddingLeft: '2%' }} value={this.state.direccionNumero} onChange={this.onInputchange} id="direccionNumero" name="direccionNumero" required="True" />
                                    </CFormGroup>
                                    <CFormGroup className="pr-1" >
                                        <div style={{ width: '162px' }} >
                                            <Select
                                                options={this.state.listLetras}
                                                styles={customSelectStyles}
                                                value={this.state.direccionLetra}
                                                components={{
                                                    ValueContainer: CustomValueContainer
                                                }}
                                                placeholder="Letra"
                                                onChange={event => this.onSelectchange("direccionLetra", event)}
                                            ></Select>
                                        </div>
                                    </CFormGroup>
                                    <CFormGroup className="pr-1" >
                                        <div style={{ width: '162px' }} >
                                            <Select
                                                options={this.state.listComplemento}
                                                styles={customSelectStyles}
                                                value={this.state.direccionComplemento}
                                                components={{
                                                    ValueContainer: CustomValueContainer
                                                }}
                                                placeholder="Orientacion"
                                                onChange={event => this.onSelectchange("direccionComplemento", event)}
                                            ></Select>
                                        </div>
                                    </CFormGroup>
                                </CForm>
                                <CForm inline style={{ paddingTop: '0.8%' }}>
                                    <CFormGroup className="pr-1" >
                                        <FloatingLabelInput label="Numero" type="number" style={{ paddingLeft: '2%' }} value={this.state.direccionNumero2} onChange={this.onInputchange} id="direccionNumero2" name="direccionNumero2" required="True" />
                                    </CFormGroup>
                                    <CFormGroup className="pr-1" >
                                        <div style={{ width: '162px' }} >
                                            <Select
                                                options={this.state.listLetras}
                                                styles={customSelectStyles}
                                                value={this.state.direccionLetra2}
                                                components={{
                                                    ValueContainer: CustomValueContainer
                                                }}
                                                placeholder="Letra"
                                                onChange={event => this.onSelectchange("direccionLetra2", event)}
                                            ></Select>
                                        </div>
                                    </CFormGroup>
                                    <CFormGroup className="pr-1" >
                                        <div style={{ width: '162px' }} >
                                            <Select
                                                options={this.state.listComplemento}
                                                styles={customSelectStyles}
                                                value={this.state.direccionComplemento2}
                                                components={{
                                                    ValueContainer: CustomValueContainer
                                                }}
                                                placeholder="Orientacion"
                                                onChange={event => this.onSelectchange("direccionComplemento2", event)}
                                            ></Select>
                                        </div>
                                    </CFormGroup>
                                    <CFormGroup className="pr-1" >
                                        <FloatingLabelInput label="Numero" type="number" style={{ paddingLeft: '2%' }} value={this.state.direccionNumero3} onChange={this.onInputchange} id="direccionNumero3" name="direccionNumero3" required="True" />
                                    </CFormGroup>
                                </CForm>
                                <CForm inline style={{ paddingTop: '0.8%' }}>
                                    <CFormGroup className="pr-1" >
                                        <CInput style={{ width: '450px', paddingLeft: '2%', color: "#321fdb" }}
                                            disabled
                                            defaultValue={
                                                this.state.direccionTipoVia
                                                + ' ' + this.state.direccionNumero
                                                + '' + this.state.direccionLetra
                                                + ' ' + this.state.direccionComplemento
                                                + ' ' + this.state.direccionNumero2
                                                + '' + this.state.direccionLetra2
                                                + '' + this.state.direccionNumero3
                                                + '' + this.state.direccionComplemento2}
                                            value={
                                                this.state.direccionTipoVia.value
                                                + ' ' + this.state.direccionNumero
                                                + '' + this.state.direccionLetra.value
                                                + ' ' + this.state.direccionComplemento.value
                                                + ' ' + this.state.direccionNumero2
                                                + '' + this.state.direccionLetra2.value
                                                + ' ' + this.state.direccionNumero3
                                                + ' ' + this.state.direccionComplemento2.value} ></CInput>
                                    </CFormGroup>
                                </CForm>
                            </CCol>
                        </CRow>
                    </CModalBody>
                    <CModalFooter>
                        <CButton onClick={this.onApplyAyudaDireccion}>Aplicar</CButton>
                    </CModalFooter>
                </CModal>
            </>
        )
    }
}
export default paciente