import React, { Component } from 'react';
import {
    CButton
} from '@coreui/react'
import { getTextHTML } from 'src/views/pages/test/functions'

class IndexTest extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }

    render() {
        return (
            <>
                <CButton
                    color='warning'
                    variant='outline'
                    shape='square'
                    onClick={() => getTextHTML()}
                    size='sm'>Aplicar</CButton>
            </>
        )
    }

}

export default IndexTest
