import { useQuery } from "react-query";
import { getMasters } from "src/api";

export const useFetchSelectOptions = (master, filters = "", mapFunction) => {
  const enabled = !!master && filters !== null;

  return useQuery({
    queryKey: ["masterData", master, filters],
    queryFn: async () => {
      const res = await getMasters(master, filters);
      const data = res?.data || [];
      return data
        .map(item => (mapFunction ? mapFunction(item) : null))
        .filter(item => item && item.label && item.value);
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
};
