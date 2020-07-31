import { action } from '@cloudio/statex';

export {};

export function getPath(
  ds: string,
  dsAlias: string,
  indexKey?: string
): string[] {
  const rootPath = [ds, dsAlias];
  if (indexKey) {
    rootPath[rootPath.length] = indexKey;
  }
  return rootPath;
}

// @ts-ignore

export const deleteRecordAction = action(
  (
    { get, set },
    { ds, alias, index }: { ds: string; alias: string; index: number }
  ) => {
    const path = getPath(ds, alias);
    let records = get(path) as [];
    // @ts-ignore
    records = records
      .slice(0, index)
      .concat(records.slice(index + 1, records.length));
    set(path, records);
  }
);

export const recordAction = action(
  (
    { get, set },
    {
      store,
      actionType,
      index,
      partialRecord,
    }: { store: any; actionType: string; index: number; partialRecord?: any }
  ) => {
    const ds = store.ds;
    const alias = store.alias;
    let path;
    let records;
    switch (actionType) {
      case 'U':
      case 'D':
        path = getPath(ds, alias, ':index');
        let record = get(path, {
          params: { index },
        });
        // @ts-ignore
        record = { ...record };
        if (partialRecord) {
          // @ts-ignore
          record = { ...record, ...partialRecord };
        }
        // @ts-ignore
        record = { ...record, _rs: actionType };

        // set back to list
        // @ts-ignore
        set(path, record, {
          params: { index },
        });
        break;
      case 'I':
        path = getPath(ds, alias);
        records = get(path) as [];
        records = [...records, { ...partialRecord, _rs: 'I' }];
        set(path, records);
        break;

      case 'DeleteFromStore':
        path = getPath(ds, alias);
        records = get(path) as [];
        // @ts-ignore
        records = records
          .slice(0, index)
          .concat(records.slice(index + 1, records.length));
        set(path, records);
        break;
    }
  }
);
