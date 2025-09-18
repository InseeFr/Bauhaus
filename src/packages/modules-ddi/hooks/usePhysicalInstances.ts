import { useQuery } from '@tanstack/react-query';

import { DDIApi } from '../../sdk';

export const usePhysicalInstances = () => {
    return useQuery({
        queryKey: ['physicalInstances'],
        queryFn: () => DDIApi.getPhysicalInstances(),
    });
};