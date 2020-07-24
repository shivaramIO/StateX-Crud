import React from 'react';
import {
  useStateX,
  useStateXValueSetter,
  useStateXValue,
} from '@cloudio/statex';
import { getDataStore } from './useStateXStore';

function CrudWithStore() {
  const store = getDataStore('app-employees', 'employeesStore');

  const recordsList = store.query();
  console.log('recordsList', recordsList);

  console.log('store ', store);
  console.log('cuurent record', store.currentRecord);
  store.records.map((rec: any) => console.log(rec, 'rec'));

  return (
    <>
      <h2> crud with store</h2>;
    </>
  );
  // const employees = store.query();
  //iterate employees
}

export default CrudWithStore;
