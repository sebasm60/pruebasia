import React from 'react'
import {
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const Page404 = () => {
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <div className="clearfix">
              <h1 className="float-left display-3 mr-4"><CIcon name="cil-x" alt="delete" /></h1>
              <h4 className="pt-3">Oops! Estas Perdido.</h4>
              <p className="text-muted float-left">No se ha permido entrar a la página que buscabas.</p>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page404
