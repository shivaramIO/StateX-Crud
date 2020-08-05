import React from 'react';
import EmployeeRow from './EmployeeRow';

const EmployeeTable = (props: any) => {
  const rowDel = props.onRowDel;
  const employee = props.employees.map(function (employee: any, index: number) {
    return (
      <EmployeeRow
        onEmployeeTableUpdate={props.onEmployeeTableUpdate}
        employee={employee}
        onDelEvent={rowDel}
        id={index}
        key={index}
      />
    );
  });
  return (
    <>
      <button type='button' onClick={props.onRowAdd}>
        Add
      </button>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>_id</th>
            <th>name</th>
            <th>gender</th>
          </tr>
        </thead>

        <tbody>{employee}</tbody>
      </table>
    </>
  );
};

export default EmployeeTable;
