import React from 'react';
import { useStateXValue, useStateX } from '@cloudio/statex';
// import EmloyeesUIWithStore from './EmloyeesUIWithStore';
import Demo from './Demo';
import CrudTable from './CrudTable';

function JSONPayload() {
  const json = useStateX([], []);
  // useStateXValue(['employee', 'list'], []);
  return (
    <>
      <h4>Path Object</h4>
      <pre>{JSON.stringify(json, null, 2)}</pre>;
    </>
  );
}

function App() {
  const columns2 = [
    { name: '_id', title: 'Id' },
    { name: 'name', title: 'Name' },
    { name: 'gender', title: 'Gender' },
    { name: 'bloodGroup', title: 'Blood Group' },
  ];
  return (
    <>
      <h2>Demo Employees Grid</h2>
      <Demo />

      {/* <h2>Demo Employees Grid2</h2>
      <Demo columns={columns2} /> */}

      <JSONPayload />
    </>
  );
}

export default App;
