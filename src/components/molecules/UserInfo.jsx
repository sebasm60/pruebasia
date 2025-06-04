export const UserInfo = ({ name, sede, rol, isStrategic }) => {
  return (
    <div>
      <h2 className="text-red-600 text-2xl font-bold">Servicio Dispensación Helpharma</h2>
      <p className="text-gray-800 text-lg">
        Bienvenido, <span className="font-bold">{name}</span>.
      </p>
      <p className="text-gray-600">
        <span className="font-bold">{sede}</span>
      </p>
      <p className="text-gray-600">
        <span className="font-bold">{rol}</span>
      </p>
      {isStrategic && (
        <p className="text-blue-700 font-semibold">Equipo Estratégico</p>
      )}
    </div>
  );
};
