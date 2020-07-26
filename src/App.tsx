import React from 'react';
import { useStateXValue, useStateX } from '@cloudio/statex';
// import EmloyeesUIWithStore from './EmloyeesUIWithStore';
import Demo from './Demo';

function JSONPayload() {
  useStateX(['employee', 'list'], []);
  const json = useStateXValue(['employee', 'list'], []);
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
      <h2>Demo Grid</h2>
      <Demo />
      <JSONPayload />
    </>
  );
}

export default App;
