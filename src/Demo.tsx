// @ts-nocheck
import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { EditingState } from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
} from '@devexpress/dx-react-grid-material-ui';
import {
  useStateX,
  useStateXGetter,
  useStateXSetter,
  useStateXValueRemover,
  selector,
  useRemoveStateX,
} from '@cloudio/statex';
import { getDataStore } from './Store';

export default function Demo() {
  const refresh = () => {
    const filter = { _deleted: 'N' };
    store.query(filter);
  };

  const columns = [
    { name: '_id', title: 'Id' },
    { name: 'name', title: 'Name' },
    { name: 'gender', title: 'Gender' },
    // { name: 'bloodGroup', title: 'Blood Group' },
  ];
  useStateX(['employee', 'list'], []);
  useStateX(['employee', 'deleted-list'], []);
  const ds = 'app-employees';
  const alias = 'employeesStore';
  const get = useStateXGetter();
  const set = useStateXSetter();

  const remover = useRemoveStateX(['employee', 'deleted-list']);

  const store = getDataStore(ds, alias, set, get, remover);

  const rows: any = store.getRecords();

  const [editingStateColumnExtensions] = useState([
    { columnName: '_id', editingEnabled: false },
  ]);

  const commitChanges = ({ added, changed, deleted }) => {
    let changedRows;
    if (added) {
      Object.keys(added).forEach((key) => {
        store.insertRecordPartial(added[key]);
      });
    }
    if (changed) {
      Object.keys(changed).forEach((key) => {
        store.updateRecordPartial(parseInt(key), changed[key]);
      });
    }
    if (deleted) {
      Object.keys(deleted).forEach((key) => {
        store.delete(parseInt(deleted[key]));
      });
    }
    console.log(changedRows);
    store.save();
    // store.query();
  };

  return (
    <>
      <button onClick={refresh}>Refresh</button>
      <Grid rows={rows} columns={columns}>
        <EditingState
          onCommitChanges={commitChanges}
          columnExtensions={editingStateColumnExtensions}
          // onDeletedRowIdsChange={onDeleteRows}
        />
        <Table />
        <TableHeaderRow />
        <TableEditRow />
        <TableEditColumn showAddCommand showEditCommand showDeleteCommand />
      </Grid>
    </>
  );
}
