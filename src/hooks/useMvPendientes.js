import { useQuery } from 'react-query';
import { getMvPendientes } from '../api/getMovimientos';
import { useGetMasters } from './useGetMasters';

export const useMvPendientes = () => {

  const { convenios } = useGetMasters();

  const query = useQuery({
    queryKey: ['mvPendientes'],
    queryFn: getMvPendientes,
    staleTime: 5 * 60 * 1000,
  });

  return { ...query, convenios }
};
