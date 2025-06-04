import React, { useEffect, useState } from 'react';
import { useBuscarMedicamento } from 'src/hooks';
import moment from 'moment';

moment.locale('es');

export const InventarioPLU = ({ convenioId, medicamento }) => {
  const { buscarAllSaldos } = useBuscarMedicamento(convenioId);
  const [saldos, setSaldos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const coloresPastel = [
    '#FFF',
    '#cbd5C9',
  ];

  useEffect(() => {
    const fetchSaldos = async () => {
      if (medicamento) {
        const resultado = await buscarAllSaldos(medicamento);
        const saldosOrdenados = (resultado || []).sort((a, b) => {
          const nombreA = a.Bodega?.toLowerCase() || '';
          const nombreB = b.Bodega?.toLowerCase() || '';
          if (nombreA < nombreB) return -1;
          if (nombreA > nombreB) return 1;
          return new Date(a.FechaVto) - new Date(b.FechaVto);
        });
        setSaldos(saldosOrdenados);
      }
    };
    fetchSaldos();
  }, [medicamento]);

  const getColorByVencimiento = (fechaVto) => {
    const hoy = moment();
    const fecha = moment(fechaVto);
    const meses = fecha.diff(hoy, 'months');
    if (meses <= 3) return 'bg-red-100 text-red-800';
    if (meses <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-white text-gray-800';
  };

  const saldosFiltrados = saldos.filter((s) => {
    const termino = busqueda.toLowerCase();
    return (
      s.Bodega?.toLowerCase().includes(termino) ||
      s.Lote?.toLowerCase().includes(termino) ||
      String(s.Saldo).includes(termino) ||
      moment(s.FechaVto).format('DD/MM/YYYY').includes(termino)
    );
  });

  const colorPorBodega = {};
  let colorIndex = 0;

  saldosFiltrados.forEach((s) => {
    if (!colorPorBodega[s.Bodega]) {
      colorPorBodega[s.Bodega] = coloresPastel[colorIndex % coloresPastel.length];
      colorIndex++;
    }
  });

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Inventario</h2>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Buscar por bodega, lote, saldo o fecha"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200 shadow-md rounded-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 border">Bodega</th>
              <th className="p-2 border">Lote</th>
              <th className="p-2 border">Saldo</th>
              <th className="p-2 border">Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            {saldosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 p-4">No hay saldos disponibles</td>
              </tr>
            ) : (
              saldosFiltrados.map((s, idx) => (
                <tr
                  key={idx}
                  className="transition-all"

                >
                  <td style={{ backgroundColor: colorPorBodega[s.Bodega] }} className="p-2 border">{s.Bodega}</td>
                  <td className="p-2 border font-mono">{s.Lote}</td>
                  <td className="p-2 border text-right">{Number(s.Saldo).toLocaleString('es-CO')}</td>
                  <td className={`${getColorByVencimiento(s.FechaVto)} p-2 border`}>
                    {moment(s.FechaVto).format('DD MMM YYYY')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
