import { Icon, Title } from "../atoms";
import { useNavigation } from "src/hooks";

export const ServiceCard = ({ title, route, IconComponent }) => {
  const { goTo } = useNavigation();

  return (
    <div
      onClick={() => goTo(route)}
      className="relative group p-4 w-full sm:w-60 h-20 border border-blue-700 rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg"
    >
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

      {/* Brillo */}
      <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:animate-shine z-10 pointer-events-none" />

      {/* Contenido */}
      <div className="relative z-20 flex items-center space-x-3">
        <div className="transition-colors duration-500 text-blue-800 group-hover:text-white">
          <Icon IconComponent={IconComponent} size={24} />
        </div>
        <div className="transition-colors duration-500 text-blue-800 group-hover:text-white">
          <Title text={title} />
        </div>
      </div>
    </div>
  );
};
