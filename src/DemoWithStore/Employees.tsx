// @ts-nocheck
import React, { useState } from 'react';

import useStateXStore from '../useStateXStore';
import EmployeeTable from './EmployeeTable';

export default function Demo() {
  const ds = 'app-employees';
  const alias = 'employeesStore';
  const {
    deleteRecord,
    query,
    insertRecordPartial,
    updateRecord,
    records,
    save,
    isDirty,
  } = useStateXStore(ds, alias);

  const saveClick = () => {
    save();
  };

  const handleAddEvent = (evt) => {
    const employee = {
      id: null,
      name: '',
      gender: '',
    };
    insertRecordPartial(employee);
  };

  const handleEmployeeTable = (evt) => {
    const partialRecord = {};
    if (evt.target.name == 'name') {
      partialRecord.name = evt.target.value;
    }
    if (evt.target.name == 'gender') {
      partialRecord.gender = evt.target.value;
    }
    updateRecord(parseInt(evt.target.id), partialRecord);
  };

  const handleRowDel = (id) => {
    console.log('><', parseInt(id));
    deleteRecord(parseInt(id));
  };

  const employees: any = records().filter((record: any) => record._rs !== 'D');

  const refresh = () => {
    const filter = { _deleted: 'N' };
    query(filter);
  };

  return (
    <>
      <button style={{ marginLeft: '50px' }} onClick={refresh}>
        Refresh
      </button>
      <button style={{ marginLeft: '100px' }} onClick={saveClick}>
        Save
      </button>
      <EmployeeTable
        onEmployeeTableUpdate={handleEmployeeTable}
        onRowAdd={handleAddEvent}
        onRowDel={handleRowDel}
        employees={employees}
        // filterText={filterText}
      />
    </>
  );
}
