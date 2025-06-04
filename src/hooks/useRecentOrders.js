import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getEntregasByUser } from "src/api";
import { generateSoporteEntrega } from "src/reports";

export const useRecentOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  const { isLoading, data: orders = [] } = useQuery({
    queryKey: ["ordenes"],
    queryFn: getEntregasByUser,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (orders.length === 0) return;

    const results = orders.filter((order) =>
      order?.valuesEntregas[0]?.entrega?.NoEntrega.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order?.valuesEntregas[0]?.entrega?.Reclamante?.toString().toLowerCase().includes(searchTerm) ||
      order?.Fh_Ing?.includes(searchTerm)
    );

    setFilteredOrders(results);
  }, [searchTerm, orders]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePrint = (orderNumber) => {
    generateSoporteEntrega(orderNumber);
  };

  return {
    searchTerm,
    handleSearch,
    filteredOrders,
    handlePrint,
    isLoading,
  };
};
