import { FaSpinner } from "react-icons/fa";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center flex-1 justify-center h-full bg-gradient-to-br from-blue-100 to-white text-blue-800">
      <FaSpinner className="animate-spin text-5xl mb-4" />
      <h1 className="text-2xl font-semibold">Cargando modulo...</h1>
      <p className="text-sm text-gray-600 mt-2">Por favor espera un momento</p>
    </div>
  );
};

export default LoadingScreen;
