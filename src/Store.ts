import {
  StateXGetter,
  StateXSetter,
  StateXRemover,
  useRemoveStateX,
} from '@cloudio/statex';

const url = 'http://localhost:3000/api';

const getOptions = (reqBody: any) => {
  let bearer_token = '2aVEDN9L_Xvmhxf4XMhp8';
  const bearer = 'Bearer ' + bearer_token;
  const options = {
    method: 'POST',
    headers: { Authorization: bearer, 'Content-Type': 'application/json' },
    body: JSON.stringify(reqBody),
  };
  return options;
};

class Store {
  ds = '';
  alias: string;
  get: StateXGetter;
  set: StateXSetter;
  remover: StateXRemover;

  constructor(
    ds: string,
    alias: string,
    set: StateXSetter,
    get: StateXGetter,
    remover: StateXRemover,
  ) {
    this.ds = ds;
    this.alias = alias;
    this.set = set;
    this.get = get;
    this.remover = remover;
  }

  getRecords() {
    // @ts-ignore
    return this.get(['employee', 'list']);
  }

  setRecords(records: any) {
    // this.set(['root', 'page22', this.ds, this.alias, 'records'], records);
    this.set(['employee', 'list'], records);
  }
  query(filter: any) {
    const reqBody = {
      [this.alias]: {
        ds: this.ds,
        query: {
          filter,
        },
      },
    };

    fetch(url, getOptions(reqBody))
      .then((response) => response.json())
      .then((data) => {
        if (data[this.alias].data.length) {
          //   this.currentRecord = data[this.alias].data[0];
          //   this.currentRecordIndex = 0;
        } else {
          //   this.currentRecord = null;
          //   this.currentRecordIndex = -1;
        }
        this.setRecords(data[this.alias].data);
      })
      .catch((error) => console.log('error from fetching', error));
  }
  updateRecord(id: number, name: string) {
    const currentRecord: any = this.get(['employee', 'list', ':id'], {
      params: {
        id,
      },
    });
    const partialRecord = { name, _rs: 'U' };
    const newRecord = { ...currentRecord, ...partialRecord };
    this.set(['employee', 'list', ':id'], newRecord, {
      params: {
        id,
      },
    });
  }

  updateRecordPartial(id: number, partialRecord: any) {
    const currentRecord: any = this.get(['employee', 'list', ':id'], {
      params: {
        id,
      },
    });
    // const partialRecord = { name, _rs: 'U' };

    const newRecord = { ...currentRecord, ...partialRecord, _rs: 'U' };
    this.set(['employee', 'list', ':id'], newRecord, {
      params: {
        id,
      },
    });
  }

  insertRecordPartial(partialRecord: any) {
    this.set(['employee', 'list'], (oldEmpList: any) => [
      ...oldEmpList,
      {
        ...partialRecord,
        // @ts-ignore
        // _id: this.getRecords().length + 1,
        _rs: 'I',
        _deleted: 'N',
      },
    ]);
  }

  updateRecords(records: any) {
    console.log('update records', records);
    const storeRecords: any = this.getRecords();
    records.forEach((record: any) => {
      const recIndex = storeRecords.indexOf(record);
      if (recIndex > 0) {
        const currentRecord: any = this.get(['employee', 'list', ':id'], {
          params: {
            id: recIndex,
          },
        });

        const newRecord = { ...currentRecord, ...record };
        this.set(['employee', 'list', ':id'], newRecord, {
          params: {
            id: recIndex,
          },
        });
      } else {
        storeRecords.forEach((storeRecord: any) => {
          if (record.name === storeRecord.name) {
            const newRecord = { ...storeRecord, ...record };
            this.set(['employee', 'list', ':id'], newRecord, {
              params: {
                id: storeRecords.indexOf(storeRecord),
              },
            });
          }
        });
      }
    });
  }

  getDirtyRecords() {
    // @ts-ignore
    let dirtyRecords = this.getRecords()
      .filter(
        // @ts-ignore
        (record: any) => record._rs !== 'Q',
      )
      .concat(this.get(['employee', 'deleted-list']));

    // @ts-ignore
    // dirtyRecords.concat(this.get(['employee', 'deleted-list']));
    return dirtyRecords;
  }
  save() {
    //@ts-ignore
    const dirtyRecords = this.getDirtyRecords();
    console.log('dirtyRecords', dirtyRecords);
    const reqBody = {
      [this.alias]: {
        ds: this.ds,
        data: dirtyRecords,
      },
    };

    fetch(url, getOptions(reqBody))
      .then((response) => response.json())
      .then((data) => {
        // update store records with db records
        this.set(['employee', 'deleted-list'], []);
        this.updateRecords(data[this.alias].data);
      })
      .catch((error) => console.log('error from fetching', error));
  }
  delete(index: number) {
    const currentRecord: any = this.get(['employee', 'list', ':index'], {
      params: {
        index,
      },
    });

    this.set(['employee', 'deleted-list'], (oldDeleteList: any) => [
      ...oldDeleteList,
      {
        ...currentRecord,
        _rs: 'D',
      },
    ]);

    // delete from original list
    // TODO: Do it using statex remover
    // @ts-ignore
    const original = this.getRecords();
    // @ts-ignore
    const undeleted: any = original.filter(
      // @ts-ignore
      (record: any) => index !== original.indexOf(record),
    );
    this.set(['employee', 'list'], undeleted);
  }
}

const cache = new Map<string, Store>();
export const getDataStore = (
  ds: string,
  alias: string,
  set: StateXSetter,
  get: StateXGetter,
  remover: StateXRemover,
) => {
  let store = cache.get(ds + alias);
  if (!store) {
    store = new Store(ds, alias, set, get, remover);
    cache.set(ds + alias, store);
  }
  return store;
};

export default Store;
