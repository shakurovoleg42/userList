// types.ts
// types.ts
export interface User {
  id: string;
  username: string;
  name: string;
  address: string;
  email: string;
  sex: string;
  birthday: string;
}

export type Action =
  | { type: "ADD_USER"; payload: User }
  | { type: "DELETE_USER"; payload: string } // по id
  | { type: "UPDATE_USER"; payload: User };

export interface State {
  users: User[];
}
