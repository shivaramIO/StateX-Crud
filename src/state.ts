import { atom } from '@cloudio/statex';

import { Employee } from './types';

const initialList: Employee[] = [
  { id: 0, name: 'Bharath', gender: 'M', bloodGroup: 'B+' },
  { id: 1, name: 'Shiva', gender: 'M', bloodGroup: 'O+' },
  { id: 2, name: 'Jaswanth', gender: 'M', bloodGroup: 'B+' },
];

export const employeeListAtom = atom({
  path: ['employee', 'list'],
  defaultValue: initialList,
});

export const employeeGenderAtom = atom({
  path: ['employee', 'gender'],
  defaultValue: '',
});
export const editingAtom = atom({
  path: ['employee', 'isEditing'],
  defaultValue: false,
});

// export const addEmployeeAction = action(({ set }, data: Employee) => {
//     set(employeeListAtom, (oldEmpList) => [
//         ...oldEmpList,
//         {
//           id: getId(),
//           name,
//           gender,
//           bloodGroup,
//         },
//       ]);
//   });
// export const addEmployeeAction = action()
