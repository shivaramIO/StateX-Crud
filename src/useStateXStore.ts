import { useStateXValue } from '@cloudio/statex';
import useDataStore from './useDataStore';

export default (ds: string, alias: string) => {
  //todo use pageId in path
  useStateXValue([ds, alias], []);
  const store = useDataStore(ds, alias);

  return {
    query: store.query,
    insertRecordPartial: store.insertRecordPartial,
    updateRecord: store.updateRecord,
    deleteRecord: store.delete,
    dirtyRecords: store.dirtyRecords,
    save: store.save,
    records: store.records,
    isDirty: store.isDirty,
  };
};
