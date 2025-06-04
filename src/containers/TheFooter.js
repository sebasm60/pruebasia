import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      {/* <div>
        <a href="https://www.autogas.com.co/" target="_blank" rel="noopener noreferrer">Autogas</a>
        <span className="ml-1">&copy; 2021</span>
      </div> */}
      <div className="mfs-auto">
        <span className="mr-1"></span>
        <a href="https://www.autogas.com.co/" target="_blank" rel="noopener noreferrer">&copy; {new Date().getFullYear()}</a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
