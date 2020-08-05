import React from 'react';

const EditableCell = (props) => {
  return (
    <td>
      <input
        type='text'
        name={props.cellData.type}
        id={props.cellData.id}
        value={props.cellData.value}
        onChange={props.onProductTableUpdate}
      />
    </td>
  );
};

export default EditableCell;
