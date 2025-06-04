import { FaPills, FaUser, FaClinicMedical, FaFileInvoice } from "react-icons/fa";

export const useServices = () => {
  const services = [
    { title: "Dispensación", route: "/DespachoInter", Icon: FaClinicMedical },
    { title: "Dispensación manual", route: "/DespachoManual", Icon: FaFileInvoice },
    { title: "Catálogo de Medicamentos", route: "/Maestros/BusquedaMed", Icon: FaPills },
    { title: "Catálogo de Pacientes", route: "/Maestros/BusquedaPas", Icon: FaUser },
  ];

  return { services };
};
