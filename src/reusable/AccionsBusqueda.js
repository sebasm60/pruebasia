import React from 'react'
import {
    CButton,
    CCol
} from '@coreui/react'

const AccionsBusqueda = props => {
    const {
        IdMenu,
        filter,
        ...rest
    } = props

    function Valida() {
        let tempArray = JSON.parse(localStorage.getItem('permissions'));
        if (tempArray !== undefined) {
            let permissions = tempArray.find(i => i.IdMenu === IdMenu);
            if (permissions !== undefined) {
                switch (filter) {
                    case "Retiro":
                        if (permissions.Retiro) {
                            return <td className="py-2">
                                <CButton
                                    color="danger"
                                    variant="outline"
                                    shape="square"
                                    visible="false"
                                    //onClick={() => DeleteItem(data.Id, 'usuarios', history)}
                                    size="sm">
                                    {filter}
                                </CButton>
                            </td>;
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
    return (
        { Valida }
    )
}

export default React.memo(AccionsBusqueda)