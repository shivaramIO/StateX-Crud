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
  useStateXValue,
} from '@cloudio/statex';
import { getDataStore } from './Store';

export default () => {
  useStateX(['employee', 'list'], []);
  const ds = 'app-employees';
  const alias = 'employeesStore';
  const get = useStateXGetter();
  const set = useStateXSetter();
  const store = getDataStore(ds, alias, set, get);

  const rows: any = store.getRecords();
  const [columns] = useState([
    { name: '_id', title: 'Id' },
    { name: 'name', title: 'Name' },
    { name: 'gender', title: 'Gender' },
    // { name: 'bloodGroup', title: 'Blood Group' },
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
    store.query();
  };

  return (
    <Paper>
      <Grid rows={rows} columns={columns}>
        <EditingState onCommitChanges={commitChanges} />
        <Table />
        <TableHeaderRow />
        <TableEditRow />
        <TableEditColumn showAddCommand showEditCommand showDeleteCommand />
      </Grid>
    </Paper>
  );
};
