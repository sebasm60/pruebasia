import { ScreenTitle } from '../atoms'
import { DispensacionInterForm } from '../organisms'

export const DispensacionInterTemplate = ({ title }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <ScreenTitle title={title} />

      <div className="flex-1 flex justify-center items-center">
        <DispensacionInterForm />
      </div>
    </div>
  )
}
