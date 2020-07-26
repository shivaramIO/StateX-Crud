import React from 'react';
import { useStateXValue } from '@cloudio/statex';
import Crud from './Crud';
import CrudWithStore from './CrudWithStore';
import EmloyeesUIWithStore from './EmloyeesUIWithStore';

function JSONPayload() {
  const json = useStateXValue([], []);
  return (
    <>
      <h4>Path Object</h4>
      <pre>{JSON.stringify(json, null, 2)}</pre>;
    </>
  );
}

function App() {
  return (
    <>
      <h2>Employee Details</h2>
      <EmloyeesUIWithStore />
      <JSONPayload />
    </>
  );
}

export default App;
