import React from 'react';
import EditableCell from './EditableCell';

const EmployeeRow = (props: any) => {
  const onDelEvent = () => {
    props.onDelEvent(props.id);
  };

  return (
    <tr>
      <EditableCell
        onEmployeeTableUpdate={props.onEmployeeTableUpdate}
        cellData={{
          type: '_id',
          value: props.employee._id,
          id: props.id,
        }}
      />
      <EditableCell
        onEmployeeTableUpdate={props.onEmployeeTableUpdate}
        cellData={{
          type: 'name',
          value: props.employee.name,
          id: props.id,
        }}
      />
      <EditableCell
        onEmployeeTableUpdate={props.onEmployeeTableUpdate}
        cellData={{
          type: 'gender',
          value: props.employee.gender,
          id: props.id,
        }}
      />
      <td className='del-cell'>
        <input
          type='button'
          onClick={onDelEvent}
          value='X'
          className='del-btn'
        />
      </td>
    </tr>
  );
};

export default EmployeeRow;
