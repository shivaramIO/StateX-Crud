import React from 'react';
import { useStateXValue } from '@cloudio/statex';
import Crud from './Crud';

function JSONPayload() {
  const json = useStateXValue([], []);
  return (
    <>
      <h4>Path Object</h4>
      <pre>{JSON.stringify(json, null, '')}</pre>;
    </>
  );
}

function App() {
  return (
    <>
      <h2>Employee Details</h2>
      <Crud />
      <JSONPayload />
    </>
  );
}

export default App;
