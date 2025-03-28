import axios from "axios";
import { useEffect, useState } from "react";
import { baseurl } from "../../utils/constants";

interface User {
  balance: number;
  memberId: string;
  role: string;
  email: string;
  userName: string;
}

export default function ManageUsers() {
  const [data, setData] = useState<User[]>([]);
  const [searchquery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    const res = await axios.get(`${baseurl}/api/admin/users`, {
      withCredentials: true,
    });
    setData(res.data.data);
  };

  useEffect(() => {
    const filteredUsers = data.filter((user) =>
        Object.values(user).some((value) =>
          value.toString().toLowerCase().includes(searchquery.toLowerCase())
        )
      );
      setData(filteredUsers);
  },[searchquery]); 

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <button className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600">
            Add New User
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md outline-none"
            placeholder="Search users..."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto hidden lg:block">
          <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Player ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Username
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Role
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Balance
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">
                  Actions
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.memberId} className="border-b">
                  <td className="px-4 py-2">{user.memberId}</td>
                  <td className="px-4 py-2">{user.userName}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">₹{user.balance}</td>
                  <td className="px-4 py-2 text-center">
                    <button className="bg-green-500 text-white py-1 px-2 rounded-md hover:bg-green-600 mr-2">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600">
                      Delete
                    </button>
                    <button className="bg-yellow-500 ml-2 text-white py-1 px-2 rounded-md hover:bg-yellow-600">
                      Suspend   
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Cards */}
        <div className="lg:hidden grid grid-cols-1 gap-6">
          {data.map((user) => (
            <div key={user.memberId} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="font-bold text-lg mb-2">{user.userName}</h2>
              <p className="text-sm text-gray-500">Email: {user.email}</p>
              <p className="text-sm text-gray-500">Role: {user.role}</p>
              <p className="text-sm text-gray-500">Balance: ₹{user.balance}</p>
              <div className="mt-4">
                <button className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600 mr-2">
                  Edit
                </button>
                <button className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600">
                  Delete
                </button>
                <button className="bg-yellow-500 ml-2 text-white py-1 px-2 rounded-md hover:bg-yellow-600">
                  Suspend   
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination (Optional) */}
        {/* Add pagination controls here if needed */}
      </div>
    </>
  );
}
