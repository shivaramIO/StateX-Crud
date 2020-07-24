import {
  useStateX,
  useStateXValueSetter,
  useStateXValue,
  StateXGetter,
  useStateXGetter,
  StateXSetter,
  useStateXSetter,
} from '@cloudio/statex';
import debounce from 'debounce';

class Store {
  ds = '';
  alias: string;
  records: any = [];
  currentRecord: any;
  currentRecordIndex = -1;
  get: StateXGetter = useStateXGetter();
  set: StateXSetter = useStateXSetter();
  constructor(ds: string, alias: string) {
    this.ds = ds;
    this.alias = alias;
  }

  getRecords() {
    return this.records;
  }
  query() {
    console.log('this', this);
    const reqBody = {
      [this.alias]: {
        ds: this.ds,
        query: {
          filter: {},
        },
      },
    };
    let bearer_token = 'WfKc_ZsfwBrhE2Ae8ZLoo';
    const bearer = 'Bearer ' + bearer_token;
    const url = 'http://localhost:3000/api';
    const options = {
      method: 'POST',
      headers: { Authorization: bearer, 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data);

        this.records = data[this.alias].data;
        if (data[this.alias].data.length) {
          this.currentRecord = data[this.alias].data[0];
          this.currentRecordIndex = 0;
        } else {
          this.currentRecord = null;
          this.currentRecordIndex = -1;
        }

        this.set(
          ['root', 'page22', this.ds, this.alias, 'records'],
          this.records
        );
      })
      .catch((error) => console.log('error from fetching', error));
    return this.records;
  }
  debounceQuery = debounce(this.query, 300);
}

const cache = new Map<string, Store>();
export const getDataStore = (ds: string, alias: string) => {
  let store = cache.get(ds + alias);
  if (!store) {
    store = new Store(ds, alias);
    cache.set(ds + alias, store);
  }

  //   store.records.push({ id: 0, name: 'Bharath', gender: 'M', bloodGroup: 'B+' });
  //   store.records.push({ id: 1, name: 'Shiva', gender: 'M', bloodGroup: 'O+' });
  //   store.records.push({
  //     id: 2,
  //     name: 'Jaswanth',
  //     gender: 'M',
  //     bloodGroup: 'B+',
  //   });
  const records = store.records;
  const query = store.query;
  return store;
};

export default Store;
