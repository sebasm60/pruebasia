import React from 'react'
import TheContent from './TheContent'
import TheSidebar from './TheSidebar'
import TheFooter from './TheFooter'
import TheHeader from './TheHeader'


const TheLayout = () => {

  return (
    <div className="c-app c-default-layout flex h-full">
      <TheSidebar />
      <div className="c-wrapper flex flex-col flex-1 h-full">
        <TheHeader />
        <div className="c-body h-full flex-1">
          <TheContent />
        </div>
        <TheFooter />
      </div>
    </div>
  )
}

export default TheLayout
