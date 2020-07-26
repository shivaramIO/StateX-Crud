import { getDataStore } from './Store';
// import useStore from 'views/Streams/hooks/useStore';
import { useMemo } from 'react';

export const useDataStore = <T>(ds: string, alias: string) => {
  const store = useMemo(() => getDataStore(ds, alias), [ds, alias]);
  //   const path = useMemo(() => ['store', alias], [alias]);
  //   const [storeData] = useStore<StoreState<T>>(path);
  //   return { ...storeData, store };

  return store;
};
