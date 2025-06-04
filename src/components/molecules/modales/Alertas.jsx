import React from 'react';
import {
  IoWarningOutline,
  IoThermometerOutline,
  IoBanOutline,
  IoSunnyOutline,
  IoCloseOutline
} from 'react-icons/io5';

import { FaSyringe } from "react-icons/fa";

const alertConfig = [
  { key: 'Regulado', label: 'Regulado', icon: <IoWarningOutline />, color: 'bg-red-100 text-red-700' },
  { key: 'Controlado', label: 'Controlado', icon: <IoBanOutline />, color: 'bg-orange-100 text-orange-700' },
  { key: 'Aplicacion', label: 'De Aplicación', icon: <FaSyringe />, color: 'bg-blue-100 text-blue-700' },
  { key: 'Fotosensible', label: 'Fotosensible', icon: <IoSunnyOutline />, color: 'bg-yellow-100 text-yellow-700' },
  { key: 'Frio', label: 'Cadena de frío', icon: <IoThermometerOutline />, color: 'bg-cyan-100 text-cyan-700' },
  { key: 'Agotado', label: 'Agotado', icon: <IoCloseOutline />, color: 'bg-gray-200 text-gray-800' },
];

export default function Alertas({ medicamento }) {
  const alertasActivas = alertConfig.filter(alerta => medicamento?.[alerta.key]);

  if (alertasActivas.length === 0) return <p className="text-sm text-gray-500">Sin alertas</p>;

  return (
    <>
      <h2 className="text-lg font-bold text-gray-700 mb-3">Características del medicamento</h2>
      <div className="flex flex-wrap gap-2">
        {alertasActivas.map((alerta, index) => (
          <div
            key={index}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${alerta.color} border`}
          >
            {alerta.icon}
            {alerta.label}
          </div>
        ))}
      </div>
    </>
  );
}
