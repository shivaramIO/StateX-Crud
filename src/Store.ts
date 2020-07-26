import { StateXGetter, StateXSetter } from '@cloudio/statex';

const url = 'http://localhost:3000/api';

const getOptions = (reqBody: any) => {
  let bearer_token = 'WfKc_ZsfwBrhE2Ae8ZLoo';
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

  constructor(ds: string, alias: string, set: StateXSetter, get: StateXGetter) {
    this.ds = ds;
    this.alias = alias;
    this.set = set;
    this.get = get;
  }
  getRecords() {
    // return this.get(['root', 'page22', this.ds, this.alias, 'records']);
    return this.get(['employee', 'list']);
  }

  setRecords(records: any) {
    // this.set(['root', 'page22', this.ds, this.alias, 'records'], records);
    this.set(['employee', 'list'], records);
  }
  query() {
    const reqBody = {
      [this.alias]: {
        ds: this.ds,
        query: {
          filter: {},
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
          if (record._id === storeRecord._id) {
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
  save() {
    //@ts-ignore
    const dirtyRecords = this.getRecords().filter(
      (record: any) => record._rs !== 'Q'
    );
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
        this.updateRecords(data[this.alias].data);
      })
      .catch((error) => console.log('error from fetching', error));
  }
  delete(id: number) {
    const currentRecord: any = this.get(['employee', 'list', ':id'], {
      params: {
        id,
      },
    });
    const partialRecord = { _rs: 'D' };
    const newRecord = { ...currentRecord, ...partialRecord };
    this.set(['employee', 'list', ':id'], newRecord, {
      params: {
        id,
      },
    });
  }
}

const cache = new Map<string, Store>();
export const getDataStore = (
  ds: string,
  alias: string,
  set: StateXSetter,
  get: StateXGetter
) => {
  let store = cache.get(ds + alias);
  if (!store) {
    store = new Store(ds, alias, set, get);
    cache.set(ds + alias, store);
  }
  return store;
};

export default Store;
