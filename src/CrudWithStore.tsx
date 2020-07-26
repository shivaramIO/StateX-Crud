import React from 'react';

import { useDataStore } from './useDataStore';
function CrudWithStore() {
  const store = useDataStore('app-employees', 'employeesStore');
  console.log('query', store);

  return (
    <>
      <h2> crud with store</h2>
      <button onClick={() => store.query()}>Query</button>
      <button
        onClick={() => {
          console.log('getrecords', store.getRecords());
        }}>
        Get Records
      </button>
    </>
  );
}

export default CrudWithStore;
