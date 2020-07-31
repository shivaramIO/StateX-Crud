import { StateXGetter, StateXSetter } from '@cloudio/statex';
import { getPath } from './state';
import { post } from './api';

class Store {
  ds: string;
  alias: string;
  get: StateXGetter;
  set: StateXSetter;
  recordAction: any;
  recordsPath: string[];
  recordIndexPath: string[];

  constructor(
    ds: string,
    alias: string,
    set: StateXSetter,
    get: StateXGetter,
    recordAction: any
  ) {
    this.ds = ds;
    this.alias = alias;
    this.set = set;
    this.get = get;
    this.recordAction = recordAction;
    this.recordsPath = getPath(ds, alias);
    this.recordIndexPath = getPath(ds, alias, ':index');
  }

  records = () => {
    return this.get(this.recordsPath);
  };

  setRecords = (records: any) => {
    this.set(this.recordsPath, records);
  };

  query = async (filter: any) => {
    const reqBody = {
      [this.alias]: {
        ds: this.ds,
        query: {
          filter,
        },
      },
    };
    await post(reqBody)
      .then((response) => {
        this.setRecords(response[this.alias].data);
      })
      .catch((error) => console.log('error from fetching', error));
  };

  updateRecord = (index: number, partialRecord: any) => {
    // todo
    this.recordAction({
      store: this,
      actionType: 'U',
      index,
      partialRecord,
    });
  };

  insertRecordPartial = (partialRecord: any) => {
    this.recordAction({
      store: this,
      actionType: 'I',
      index: -1,
      partialRecord,
    });
  };

  // TODO: update records using index
  updateRecords = (records: any) => {
    const storeRecords: any = this.records();
    records.forEach((record: any) => {
      const recIndex = storeRecords.indexOf(record);
      // index based logic not working
      if (recIndex > 0) {
        const currentRecord: any = this.get(this.recordIndexPath, {
          params: {
            id: recIndex,
          },
        });

        const newRecord = { ...currentRecord, ...record };
        this.set(this.recordIndexPath, newRecord, {
          params: {
            id: recIndex,
          },
        });
      } else {
        storeRecords.forEach((storeRecord: any) => {
          if (record.name === storeRecord.name) {
            const recIdx = storeRecords.indexOf(storeRecord);
            if (record._deleted === 'Y' || record._rs === 'D') {
              // remove from list using index
              this.deleteFromStore(recIdx);
            } else {
              const newRecord = { ...storeRecord, ...record };
              this.set(this.recordIndexPath, newRecord, {
                params: {
                  index: recIdx,
                },
              });
            }
          }
        });
      }
    });
  };

  dirtyRecords = () => {
    // @ts-ignore
    let dirtyRecords = this.records().filter(
      // @ts-ignore
      (record: any) => record._rs !== 'Q'
    );
    return dirtyRecords;
  };

  isDirty = () => {
    return this.dirtyRecords().length > 0;
  };

  save = async () => {
    const dirtyRecords = this.dirtyRecords();
    const reqBody = {
      [this.alias]: {
        ds: this.ds,
        data: dirtyRecords,
      },
    };

    await post(reqBody)
      .then((response) => {
        // update store records with db records
        this.updateRecords(response[this.alias].data);
      })
      .catch((error) => console.log('error from fetching', error));
  };

  delete = (index: number) => {
    this.recordAction({
      store: this,
      actionType: 'D',
      index,
    });
  };

  deleteFromStore = (index: number) => {
    this.recordAction({
      store: this,
      actionType: 'DeleteFromStore',
      index,
    });
  };
}

export default Store;
