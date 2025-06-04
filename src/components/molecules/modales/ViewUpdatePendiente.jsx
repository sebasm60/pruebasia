import React from 'react'

export const ViewUpdatePendiente = ({ isUpdate = false }) => {
  return (
    <div>
      {
        isUpdate ? <h1>Actualizar Pendiente</h1> : <h1>Resumen De Pendiente</h1>
      }
    </div>
  )
}
