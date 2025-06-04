import React from 'react'
import { useHistory } from 'react-router-dom'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
  CButton,CModalFooter,CFormGroup,CForm,CCol,CRow,CModalBody,CModal,
  CLink,CModalHeader,CModalTitle
} from '@coreui/react'
import CIcon from '@coreui/icons-react'




const TheHeaderDropdown = () => {

  let history = useHistory();

  function LogOut() {
    localStorage.removeItem("LoginToken");
    localStorage.removeItem("LoginUsers");
    history.push('/Login');
  }
  function CambioSedeEE() {
    history.push('/profile/'+localStorage.getItem("user"));
  }


  return (
    <>
      <CDropdown
        inNav
        className="c-header-nav-items mx-2"
        direction="down"
      >
        <CDropdownToggle className="c-header-nav-link" caret={false}>
          <div className="c-avatar">
            <CImg
              src={'avatars/user-img.jpg'}
              className="c-avatar-img"
              alt="admin@bootstrapmaster.com"
            />
          </div>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem
            header
            tag="div"
            color="light"
            className="text-center"
          >
            <strong>Cuenta</strong>
          </CDropdownItem>
          <CDropdownItem>
            <CIcon name="cil-bell" className="mfe-2" />
            Actualizaciones
            <CBadge color="info" className="mfs-auto">42</CBadge>
          </CDropdownItem>
          <CDropdownItem>
            <CIcon name="cil-task" className="mfe-2" />
            Tareas
            <CBadge color="danger" className="mfs-auto">42</CBadge>
          </CDropdownItem>
          <CDropdownItem
            header
            tag="div"
            color="light"
            className="text-center"
          >
            <strong>Configuracion</strong>
          </CDropdownItem>
          <CDropdownItem onClick={CambioSedeEE} >
            <CIcon name="cil-user" className="mfe-2" />Cambio Clave
          </CDropdownItem>
          <CDropdownItem divider />
          <CDropdownItem>
            <CLink onClick={LogOut} >
              <CIcon name="cil-lock-locked" className="mfe-2" />
              Salida Segura
            </CLink>

          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      
    </>
  )
}

export default TheHeaderDropdown
