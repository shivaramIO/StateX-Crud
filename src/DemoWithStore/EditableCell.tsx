import React from 'react';

const EditableCell = (props: any) => {
  return (
    <td>
      <input
        type='text'
        name={props.cellData.type}
        id={props.cellData.id}
        value={props.cellData.value}
        onChange={props.onEmployeeTableUpdate}
      />
    </td>
  );
};

export default EditableCell;
