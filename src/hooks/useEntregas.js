import { useQuery } from 'react-query';
import { getEntregas } from '../api/getMovimientos';
import { useGetMasters } from './useGetMasters';

export const useEntregas = () => {
  const { convenios } = useGetMasters();

  const query = useQuery({
    queryKey: ['entregas'],
    queryFn: getEntregas,
    staleTime: 5 * 60 * 1000,
  });

  return { ...query, convenios }

};
