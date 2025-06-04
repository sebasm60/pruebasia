import React, { Component } from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CLabel,
    CInputFile,
    CButtonGroup,
    CBadge,
    CSpinner
} from '@coreui/react'
import Select from 'react-select';
import swal from 'sweetalert'
import CIcon from '@coreui/icons-react'
import AddItem from 'src/reusable/AccionsPost'
import getPermissions from 'src/reusable/GetPermissions'
import { formatDateP, toUPPER } from 'src/reusable/Util'
import customSelectStyles from 'src/reusable/customSelectStyles'
import getListSelect from 'src/reusable/GetList'
import { CustomValueContainer } from 'src/reusable/CustomControl'
import validateRequiredFields from 'src/reusable/RequiredFields'

const camposRequired = [
    { label: 'conveniosId' }
]

class CargarArchivo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IdMenu: 'Menu-afiliaciones',
            file: '',
            listConvenios: [],
            conveniosId: 0,
            showLoading: false
        };
        this.onSubmitFormFind = this.onSubmitFormFind.bind(this);
        this.onInputchange = this.onInputchange.bind(this);
        this.ObtenerMestros = this.ObtenerMestros.bind(this);
        this.onSelectchange = this.onSelectchange.bind(this);
    }
    componentDidMount() {
        this.ObtenerMestros();
    }

    ObtenerMestros() {
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
                'listConvenios': tempArray,
                'listConveniosAllData': listdata.data
            });
        });
    }

    onInputchange(event) {
        this.setState({
            [event.target.name]: event.target.files[0]
        });
    }
    onSelectchange(selector, event) {
        this.setState({
            [selector]: event
        });
    }
    onSubmitFormFind() {
        this.setState({
            "showLoading": true
        });

        getPermissions(this.state.IdMenu, 'Ingreso', this.props.history).then(resultPermiss => {
            if (resultPermiss) {
                validateRequiredFields(this.state, camposRequired).then(result => {
                    if (result) {
                        const { history } = this.props;

                        const formData = new FormData();
                        formData.append('file', this.state.file);
                        formData.append('IdConvenio', this.state.conveniosId.value);
                        console.log(this.state.conveniosId.value);
                        AddItem(formData, 'Domicilio_Carga;post', history, '').then(result => {
                            this.onInputclear();
                        });
                    }
                });

            } else {
                swal("Advertencia", "Sin Permisos INGRESO", "warning");
            }
        });
    }

    onInputclear() {
        this.setState({
            file: '',
            conveniosId: 0,
            showLoading: false
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
                            <CCardBody>
                                <CRow>
                                    <CCol md="2"><label>Seleccionar Convenio:</label></CCol>
                                    <CCol md='5'>
                                        <div style={{ width: '350px' }} >
                                            <Select
                                                options={this.state.listConvenios}
                                                styles={customSelectStyles}
                                                value={this.state.conveniosId}
                                                isClearable
                                                components={{
                                                    ValueContainer: CustomValueContainer
                                                }}
                                                placeholder='Convenio'
                                                onChange={event => this.onSelectchange('conveniosId', event)}
                                            ></Select>
                                        </div>
                                    </CCol>
                                </CRow>

                                <CRow style={{ paddingTop: '0.8%' }}>
                                    <CCol md="2"><label>Cargar Archivo:</label></CCol>

                                    <CCol xs="3" md="9">
                                        <CInputFile id="file" name="file" accept=".csv" onChange={this.onInputchange} />
                                    </CCol>
                                    <CCol md="1">
                                        <CButton
                                            style={{ float: "right" }}
                                            color="primary"
                                            variant="outline"
                                            shape="square" onClick={this.onSubmitFormFind}
                                            size="sm">Cargar</CButton>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>

                    </CCol>
                </CRow>
            </>
        )
    }
}
export default CargarArchivo