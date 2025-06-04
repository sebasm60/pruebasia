import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'

// routes config
import routes from '../routes'
import LoadingScreen from 'src/components/atoms/LoadingScreen'

const TheContent = () => {
  return (
    <main className="">
      <Suspense fallback={
        <div className="fixed inset-0 z-50">
          <LoadingScreen />
        </div>}
      >
        <Switch>
          {routes.map((route, idx) => {
            return route.component && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={props => (
                  <div className='h-full'>
                    <route.component {...props} />
                  </div>
                )} />
            )
          })}
          <Redirect from="/" to="/dashboard" />
        </Switch>
      </Suspense>
    </main>
  )
}

export default React.memo(TheContent)
