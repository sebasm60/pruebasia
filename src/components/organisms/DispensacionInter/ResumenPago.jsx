import { InputField, InputSelect } from "src/components/molecules";
import { IconButton } from "../../atoms";
import { FaPlus, FaTrash } from "react-icons/fa";
import { formatCurrency } from "src/reusable/Util";
import swal from "sweetalert";
import { getValidationsInter } from "src/helpers";

export const ResumenPago = ({ control, errors, totalGeneral, totalIVA, valorPagado, cambio, subtotalGeneral, mediosDePago, mediosDePagoFields, appendMedio, removeMedio, watch }) => {
  const rules = getValidationsInter({ watch }).resumenPago;
  return (
    <div className="flex flex-col gap-4 w-full">

      <fieldset className="border border-black px-2 py-2 rounded-lg shadow-md">
        <legend className="text-base font-semibold text-gray-700 select-none px-1">Medios de Pago</legend>

        <div className="flex flex-col gap-2">
          {mediosDePagoFields.map((item, index) => (
            <div key={item.id} className="flex gap-2">

              <InputSelect
                controlForm={control}
                nameController={`mediosDePago.${index}.forma`}
                placeholder={`Medio de pago ${index + 1}`}
                options={mediosDePago}
                rules={rules.forma}
                error={errors?.mediosDePago?.[index]?.forma?.message}
                className="w-full"
              />

              <InputField
                controlForm={control}
                nameController={`mediosDePago.${index}.valor`}
                type="number"
                placeholder="Valor"
                rules={rules.valor}
                error={errors?.mediosDePago?.[index]?.valor?.message}
                formatAsCurrency
                showCurrencySymbol
              />

              {mediosDePagoFields.length > 1 && (
                <FaTrash
                  onClick={() => {
                    swal({
                      title: "¿Estás seguro?",
                      text: "Esta acción eliminará el medio de pago.",
                      icon: "warning",
                      buttons: ["Cancelar", "Sí, eliminar"],
                      dangerMode: true,
                    }).then((willDelete) => {
                      if (willDelete) {
                        removeMedio(index);
                        swal("¡Orden eliminada correctamente!", {
                          icon: "success",
                        });
                      }
                    });
                  }}

                  className="text-red-500 hover:text-red-600 cursor-pointer h-5 w-5"
                />
              )}
            </div>
          ))}

          {mediosDePagoFields.length < 3 && (
            <div className="mt-2">
              <IconButton
                icon={FaPlus}
                text="Agregar medio de pago"
                onClick={() => appendMedio({ forma: '', valor: '' })}
                className="bg-blue-500 hover:bg-blue-600"
              />
            </div>
          )}
        </div>
      </fieldset>


      <fieldset className="border border-black px-4 py-2 rounded-lg shadow-md">
        <legend className="text-base font-semibold text-gray-800 select-none px-1">Resumen de Pago</legend>

        <div className="flex flex-col gap-2 text-sm text-gray-700 mt-2">
          <div className="flex justify-between">
            <span className="text-2xl">Subtotal</span>
            <span className="text-2xl">{formatCurrency('es-CO', 'COP', 0, subtotalGeneral)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-2xl">Flete</span>
            <span className="text-2xl">$ 0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-2xl">IVA</span>
            <span className="text-2xl">{formatCurrency('es-CO', 'COP', 0, totalIVA)}</span>
          </div>

          <hr className="my-2 border-gray-300" />

          <div className="flex justify-between font-semibold text-base">
            <span className="text-2xl">Total</span>
            <h2 className="text-2xl">{formatCurrency('es-CO', 'COP', 0, totalGeneral)}</h2>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-2xl">Valor Pagado</span>
            <h2 className="text-2xl">{formatCurrency('es-CO', 'COP', 0, valorPagado)}</h2>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-2xl">Cambio</span>
            <h2 className={`text-2xl font-semibold ${cambio > 0 ? 'text-green-600' :
              cambio < 0 ? 'text-red-600' :
                'text-gray-600'
              }`}>
              {formatCurrency('es-CO', 'COP', 0, cambio)}
            </h2>
          </div>

        </div>
      </fieldset>
    </div>
  )
}
