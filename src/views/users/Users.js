import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CButton,
  CInputCheckbox,
  CFormGroup,
  CLabel,
  CInput,
  CFormText,
  CCardFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import usersData from './UsersData'

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'alerta': return 'danger'
    default: return 'primary'
  }
}

const Users = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/users?page=${newPage}`)
  }


  const fields = [
    { key: 'selected', label: '' },
    { key: 'orden', label: 'Orden' },
    { key: 'typePlan', label: 'Tipo Plan' },
    { key: 'registered', label: 'Fecha Ordenes', _style: { width: '10%' }, },
    { key: 'registeredVencimiento', label: 'Fecha Vencimiento', _style: { width: '10%' }, },
    {
      key: 'Acciones',
      label: '',
      _style: { width: '1%' },
      sorter: false,
      filter: false
    }
  ]

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page])

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol><h3>Dispensación</h3></CCol>
              <CCol><div className="card-header-actions justify-content-md-end">
                <CButton color="success" className="me-md-2">Siguiente Paciente</CButton>
              </div></CCol>
            </CRow>
            <br></br>
            <CForm inline>
              <CFormGroup className="pr-1">
                <CLabel htmlFor="exampleInputName2" className="pr-1">Convenio</CLabel>
                <CSelect custom name="ccmonth" className="form-control form-control-sm" id="ccmonth">
                  <option value="1">Seleccionar..</option>
                  <option value="2">2</option>
                </CSelect>
              </CFormGroup>
              <CFormGroup className="pr-1">
                <CLabel htmlFor="exampleInputName2" className="pr-1">Id.Paciente</CLabel>
                <CInput id="exampleInputName2" className="form-control form-control-sm" type="number" placeholder="Identificacion" required />
              </CFormGroup>
              <CFormGroup className="pr-1">
                <CLabel htmlFor="exampleInputName2" className="pr-1">Tipo Id</CLabel>
                <CInput id="exampleInputName2" className="form-control form-control-sm" disabled style={{ width: '3rem' }} placeholder="CC" required />              </CFormGroup>

              <CFormGroup className="pr-1">
                <CLabel htmlFor="exampleInputName2" className="pr-1">Nombre</CLabel>
                <CInput id="exampleInputName2" className="form-control form-control-sm" disabled value={"LUIS FERNANDO GRANDA IBARRA"} required />
              </CFormGroup>
              <CFormGroup className="pr-1">
                <CLabel htmlFor="exampleInputName2" className="pr-1">Fecha Nacimiento</CLabel>
                <CInput id="exampleInputName2" className="form-control form-control-sm" disabled value={"01/01/2023"} style={{ width: '5rem' }} required />
              </CFormGroup>
              <div className="pr-1" ><CIcon name="cil-info" alt="Informacion Paciente" /></div>
              <CFormGroup variant="checkbox" className="checkbox">
                <CInputCheckbox id="checkbox2" name="checkbox2" disabled value="option2" />
                <CLabel htmlFor="exampleInputName2" className="pr-1">Paciente Con Marca</CLabel>
              </CFormGroup>
            </CForm>
            <CForm inline style={{ paddingTop: '7px' }}>
              <CFormGroup className="pr-1">
                <CLabel htmlFor="exampleInputName2" className="pr-1">Reclama</CLabel>
                <CInput id="exampleInputName2" type="number" className="form-control form-control-sm" placeholder="Identificacion" required />
              </CFormGroup>
              <CFormGroup className="pr-2">
                <CLabel htmlFor="exampleInputName2" className="pr-2">Nombre</CLabel>
                <CInput id="exampleInputName2" className="form-control form-control-sm" placeholder="Nombre Reclamante" required />
              </CFormGroup>
              <CFormGroup className="pr-1">
                <CLabel htmlFor="exampleInputName2" className="pr-1">Parentesco</CLabel>
                <CSelect custom name="ccmonth" className="form-control form-control-sm" id="ccmonth">
                  <option value="1">Seleccionar..</option>
                  <option value="2">2</option>
                </CSelect>
              </CFormGroup>

            </CForm>
            <CForm inline style={{ paddingTop: '7px' }}>
              <CFormGroup className="pr-1">
                <CLabel htmlFor="exampleInputName2" className="pr-1">Tipo Dispensacion</CLabel>
                <CSelect custom name="ccmonth" className="form-control form-control-sm" id="ccmonth">
                  <option value="1">Seleccionar..</option>
                  <option value="2">2</option>
                </CSelect>
              </CFormGroup>
            </CForm>
          </CCardHeader>
          <CCardBody>
            <br></br>
            <CRow>
              <CDataTable
                items={usersData}
                fields={fields}
                itemsPerPage={20}
                pagination
                hover
                size='sm'
                activePage={page}
                clickableRows
                onRowClick={(item) => history.push(`/users/${item.id}`)}
                scopedSlots={{
                  'selected':
                    (item) => (
                      <td>
                        <CFormGroup variant="checkbox" className="checkbox">
                          <CInputCheckbox id="checkbox2" name="checkbox2" value="option2" />
                        </CFormGroup>
                      </td>
                    ),
                  'registered':
                    (item) => (
                      <td>
                        <CLabel>{item.registered}</CLabel>
                      </td>
                    ),
                    'registeredVencimiento':
                      (item) => (
                        <td>
                          <CLabel>{item.registered}</CLabel>
                        </td>
                      ),
                  'Acciones':
                    (item, index) => {
                      return (
                        <>
                          <td className="py-2">
                            <CButton
                              color="warning"
                              variant="outline"
                              shape="square"
                              size="sm"
                            >
                              {'Detalle'}
                            </CButton>
                            <CButton
                              color="primary"
                              variant="outline"
                              shape="square"
                              size="sm">
                              <CIcon name="cil-plus" alt="agregar" />
                            </CButton>
                          </td>
                        </>
                      )
                    },
                }}
              />
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Users
