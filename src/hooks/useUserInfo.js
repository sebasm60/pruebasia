import { useState, useEffect } from "react";

export const useUserInfo = (refreshTrigger) => {
  const [user, setUser] = useState({
    name: "",
    sede: "",
    rol: "",
    isStrategic: false,
  });

  useEffect(() => {
    setUser({
      name: localStorage.getItem("LoginUsers") || "Usuario",
      sede: localStorage.getItem("SedeUsers") || "Desconocida",
      rol: localStorage.getItem("RolUsers") || "Sin rol",
      isStrategic: localStorage.getItem("usuarioEE") === "true",
    });
  }, [refreshTrigger]);

  return { user };
};
