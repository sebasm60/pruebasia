import { IconButton } from "../atoms";

import { useRecentOrders } from "../../hooks/useRecentOrders";
import { AiOutlinePrinter } from "react-icons/ai";
import { formatCurrency } from "src/reusable/Util";
import { FaWindowClose } from "react-icons/fa";
import moment from "moment";

moment.locale('es');

export const RecentOrders = () => {
  const { searchTerm, handleSearch, filteredOrders, handlePrint } = useRecentOrders();

  return (
    <div className="bg-white p-3 rounded-lg shadow-md flex flex-1 flex-col w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Últimas Órdenes Entregadas</h2>
      {
        filteredOrders?.length > 0 ?
          <>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre, fecha o número..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>

            <ul className="overflow-y-auto max-h-[calc(100vh-20rem)] pr-2 space-y-1">
              {filteredOrders.map((order, i) => (
                <li key={i} className="px-2 py-2 border border-gray-200 rounded-lg flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-all duration-300 transform shadow-sm hover:shadow-md">
                  <div>
                    <p className="font-semibold text-gray-900">Nro. Entrega: {order?.valuesEntregas[0]?.entrega?.NoEntrega}</p>
                    <p className="text-gray-600">{order?.valuesEntregas[0]?.entrega?.Reclamante}</p>
                    <p className="text-gray-600"> {moment(order?.Fh_Ing).format('LLL')}</p>
                    <p className="text-green-600 font-semibold"> {formatCurrency('es-CO', 'COP', 0, order?.valuesEntregas[0]?.entrega?.Total)}</p>
                  </div>
                  <IconButton icon={AiOutlinePrinter} size={20} onClick={() => handlePrint(order)} />
                </li>
              ))}
            </ul>
          </>
          :
          <div className="flex flex-col justify-center items-center h-full">
            <FaWindowClose className="text-red-500 h-12 w-12" />
            <h1 className="text-slate-900 text-lg mt-2">No se encontraron órdenes</h1>
          </div>
      }
    </div>
  );
};
