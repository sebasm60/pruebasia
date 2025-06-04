import React, { Component } from 'react';
import {
    CCol,
    CRow,
} from '@coreui/react'
import { AccionsBusqueda } from 'src/reusable'

class LogSyncBi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            historyRoute:this.props.history
        };
    }
    componentDidMount() {
    }

    render() {
        return (
            <>
                <CRow>
                    <CCol md="12">
                        <AccionsBusqueda name="paciente" text="Pacientes" history={this.state.historyRoute} />
                    </CCol>
                </CRow>
            </>
        )
    }
}
export default LogSyncBi