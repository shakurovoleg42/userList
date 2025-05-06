import React, { useEffect, useState } from "react";
import { createStore } from "./store";
import { userReducer } from "./reducer";
import { v4 as uuidv4 } from "uuid";
import type { User } from "./types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";

const store = createStore(userReducer, { users: [] });

export default function App() {
  const [users, setUsers] = useState<User[]>(store.getState().users);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setUsers(store.getState().users);
    });
    return unsubscribe;
  }, []);

  const addUser = async () => {
    const res = await fetch("https://api.api-ninjas.com/v1/randomuser", {
      headers: { "X-Api-Key": "wUXtFhZd2o2TjxqPS74HPA==LEA0Wjdete6faGXd" },
    });
    const data = await res.json();
    console.log(data);
    const user: User = {
      id: uuidv4(),
      username: data.username,
      name: data.name,
      address: data.address,
      email: data.email,
      sex: data.sex,
      birthday: data.birthday,
    };

    store.dispatch({ type: "ADD_USER", payload: user });
  };

  const deleteUser = (id: string) => {
    store.dispatch({ type: "DELETE_USER", payload: id });
  };

  const updateUser = (user: User) => {
    store.dispatch({ type: "UPDATE_USER", payload: user });
    setSelectedUser(null);
  };
  console.log(users);
  console.log(selectedUser);

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col">
      <button
        onClick={addUser}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add User
      </button>

      <table className="w-full border text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Username</th>
            <th className="border px-3 py-2">Sex</th>
            <th className="border px-3 py-2">Address</th>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Birthday</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setSelectedUser(user);
                setOpen(true);
              }}
            >
              <td className="border px-3 py-2">{user.username}</td>
              <td className="border px-3 py-2">{user.sex}</td>
              <td className="border px-3 py-2">{user.address}</td>
              <td className="border px-3 py-2">{user.name}</td>
              <td className="border px-3 py-2">{user.email}</td>
              <td className="border px-3 py-2">{user.birthday}</td>
              <td className="border px-3 py-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteUser(user.id);
                  }}
                  className="text-red-600 hover:underline bg-red-100 px-2 py-1 rounded cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUser && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit address user</DialogTitle>
              <DialogDescription>
                <div className="mt-6 p-4 border rounded bg-gray-50">
                  <h2 className="text-lg font-semibold mb-4">Edit User</h2>
                  <p className="mb-2">
                    <strong>Name:</strong> {selectedUser.name}
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p className="mb-2">
                    <strong>Sex:</strong> {selectedUser.sex}
                  </p>
                  <p className="mb-2">
                    <strong>Birthday:</strong> {selectedUser.birthday}
                  </p>

                  <label className="block mb-1 font-semibold">Address:</label>
                  <input
                    className="border p-2 w-full mb-4"
                    value={selectedUser.address}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        address: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() => updateUser(selectedUser)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
