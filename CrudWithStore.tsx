import React, { useState } from 'react';

import { getDataStore } from './useStateXStore';

function CrudWithStore() {
  const [recs, setRecs] = useState([]);
  const { records, query, currentRecord, currentRecordIndex } = getDataStore(
    'app-employees',
    'employeesStore'
  );

  let arrOfRecords: any = [];

  console.log(
    'query ',
    query.then((rec) => {
      //   setRecs(rec);
      arrOfRecords.push(rec);
      console.log('recs', recs);
    })
  );

  var result = arrOfRecords.map((record: any) => ({ name: record.name }));
  console.log('result', result);

  return (
    <>
      <h2> crud with store</h2>
      currentRecord:{currentRecord}
      currentRecordIndex:{currentRecordIndex}
      {/* {recs.map((record: any) => {
        console.log('individualrecord', record);
      })} */}
      {/* {result} */}
    </>
  );
}

export default CrudWithStore;
