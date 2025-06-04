import { useHistory } from "react-router-dom";

export const useNavigation = () => {
  const history = useHistory();

  const goTo = (route) => {
    if (route) {
      history.push(route);
    } else {
      console.warn("Ruta no encontrada");
    }
  };

  const redirectToLogin = () => {
    history.push("/login");
  };

  return { goTo, redirectToLogin };
};
