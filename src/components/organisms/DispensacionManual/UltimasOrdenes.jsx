import moment from "moment/moment";
import { InputField } from "src/components/molecules";

export const UltimasOrdenesYComentario = ({ entregas, control }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Últimas órdenes entregadas */}
      <fieldset className="border border-black px-2 py-2 rounded-lg shadow-md">
        <legend className="text-base font-semibold text-gray-700 select-none px-1">
          Últimas Órdenes Entregadas
        </legend>
        <div className="overflow-x-auto">
          <table className="w-full border border-blue-00 rounded-md text-sm text-gray-700">
            <thead className="bg-blue-600 font-semibold text-white">
              <tr>
                <th className="border p-2 text-center">No. Entrega</th>
                <th className="border p-2 text-center">Fecha</th>
                <th className="border p-2 text-center">Orden</th>
                <th className="border p-2 text-center">Nombre</th>
                <th className="border p-2 text-center">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {
                entregas.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="border p-4 text-center text-gray-400 italic">
                      No se encontraron entregas recientes
                    </td>
                  </tr>
                ) : (
                  entregas?.flatMap((entrega, i) =>
                    entrega?.valuesEntregas?.flatMap((med, j) => (
                      med?.mvEntrega?.map(orden => (
                        <tr key={`${i}-${j}`}>
                          <td className="border p-2 text-center">{med?.entrega?.prefijoEntrega}</td>
                          <td className="border p-2 text-center"> {moment(med?.entrega?.Fh_Ing).locale("es").format("DD MMM YYYY hh:mm:ss")}</td>
                          <td className="border p-2 text-center">{orden?.Orden}</td>
                          <td className="border p-2 text-left">{orden?.Nombre}</td>
                          <td className="border p-2 text-center">{orden?.QtyEntrega}</td>
                        </tr>
                      ))
                    ))
                  )
                )
              }
            </tbody>
          </table>
        </div>
      </fieldset>

      {/* Comentario */}
      <fieldset className="border border-black px-2 py-2 rounded-lg shadow-md">
        <legend className="text-base font-semibold text-gray-700 select-none px-1">
          Comentario
        </legend>

        <InputField
          controlForm={control}
          nameController="comentario"
          label="Comentario"
          isTextarea
          rows={3}
        />
      </fieldset>
    </div>
  );
};
