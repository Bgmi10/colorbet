import axios from "axios";
import { useEffect, useState } from "react";
import { baseurl } from "../../utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCheck, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

interface User {
  balance: number;
  memberId: string;
  role: string;
  email: string;
  userName: string;
  isSuspended: boolean;
}

interface Toast {
  message: string;
  type: "success" | "error";
  id: number;
}

export default function ManageUsers() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCredits, setIsAddCredits] = useState(false);
  const [isSuspend, setIsSuspend] = useState(false);
  const [selectedUser, setSelectedUser] = useState<null | User>(null);
  const [adminCredits, setAdminCredits] = useState<number | string>('');
  const [suspensionDays, setSuspensionDays] = useState<number | string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${baseurl}/api/admin/users`, {
        withCredentials: true,
      });
      setAllUsers(res.data.data);
      setFilteredUsers(res.data.data);
    } catch (error) {
      showToast("Failed to fetch users", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter((user) => 
        user.memberId.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, allUsers]);

  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const handleAddCredits = (user: User) => {
    setIsAddCredits(true);
    setSelectedUser(user);
    setAdminCredits('');
  };

  const handleSuspend = (user: User) => {
    setIsSuspend(true);
    setSelectedUser(user);
    setSuspensionDays('');
  };

  const submitAddCredits = async () => {
    if (!selectedUser || !adminCredits || Number(adminCredits) <= 0) {
      showToast("Please enter a valid amount", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.put(`${baseurl}/api/admin/users`, {
        memberId: selectedUser.memberId,
        balance: Number(adminCredits),
      }, { withCredentials: true });

      if (res.status === 200) {
        showToast(`₹${adminCredits} credits added successfully`, "success");
        setIsAddCredits(false);
        fetchUsers(); // Refresh the users list
      }
    } catch (error) {
      showToast("Failed to add credits", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const submitSuspend = async () => {
    if (!selectedUser || !suspensionDays || Number(suspensionDays) <= 0) {
      showToast("Please enter valid suspension days", "error");
      return;
    }

    setIsLoading(true);
    try {
      const suspensionEndTime = new Date();
      suspensionEndTime.setDate(suspensionEndTime.getDate() + Number(suspensionDays));
      
      const res = await axios.put(`${baseurl}/api/admin/suspend`, {
        email: selectedUser.email,
        suspensionEndTime: suspensionEndTime.toISOString(),
      }, { withCredentials: true });

      if (res.status === 200) {
        showToast(`User suspended for ${suspensionDays} days`, "success");
        setIsSuspend(false);
        fetchUsers(); // Refresh the users list
      }
    } catch (error) {
      showToast("Failed to suspend user", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (memberId: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setIsLoading(true);
      try {
        const res = await axios.delete(`${baseurl}/api/admin/user`, {
          data: { memberId },
          withCredentials: true,
        });

        if (res.status === 200) {
          showToast("User deleted successfully", "success");
          fetchUsers(); // Refresh the users list
        }
      } catch (error) {
        showToast("Failed to delete user", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <button className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300">
            Add New User
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              className="w-full p-3 pl-4 border border-gray-300 rounded-md outline-none focus:border-blue-500 transition"
              placeholder="Search by Member ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faClose} />
              </button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!isLoading && (
          <>
            <div className="overflow-x-auto hidden lg:block">
              <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Player ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Balance
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.memberId} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{user.memberId}</td>
                        <td className="px-4 py-3">{user.userName}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">{user.role}</td>
                        <td className="px-4 py-3">₹{user.balance}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.isSuspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {user.isSuspended ? "Suspended" : "Active"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center space-x-1">
                            <button className="bg-green-500 text-white py-1 px-2 rounded-md hover:bg-green-600 transition">
                              Edit
                            </button>
                            <button 
                              className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition"
                              onClick={() => handleDeleteUser(user.memberId)}
                            >
                              Delete
                            </button>
                            <button 
                              className="bg-yellow-500 text-white py-1 px-2 rounded-md hover:bg-yellow-600 transition"
                              onClick={() => handleSuspend(user)}
                            >
                              Suspend
                            </button>
                            <button 
                              className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 transition"
                              onClick={() => handleAddCredits(user)}
                            >
                              Add Credits
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                        No users found matching the search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden grid grid-cols-1 gap-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div key={user.memberId} className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="font-bold text-lg">{user.userName}</h2>
                      <span className={`px-2 py-1 rounded-full text-xs ${user.isSuspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {user.isSuspended ? "Suspended" : "Active"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">ID: {user.memberId}</p>
                    <p className="text-sm text-gray-600 mb-1">Email: {user.email}</p>
                    <p className="text-sm text-gray-600 mb-1">Role: {user.role}</p>
                    <p className="text-sm font-medium mb-3">Balance: ₹{user.balance}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button className="bg-green-500 text-white py-1 px-3 rounded-md text-sm hover:bg-green-600 transition">
                        Edit
                      </button>
                      <button 
                        className="bg-red-500 text-white py-1 px-3 rounded-md text-sm hover:bg-red-600 transition"
                        onClick={() => handleDeleteUser(user.memberId)}
                      >
                        Delete
                      </button>
                      <button 
                        className="bg-yellow-500 text-white py-1 px-3 rounded-md text-sm hover:bg-yellow-600 transition"
                        onClick={() => handleSuspend(user)}
                      >
                        Suspend
                      </button>
                      <button 
                        className="bg-blue-500 text-white py-1 px-3 rounded-md text-sm hover:bg-blue-600 transition"
                        onClick={() => handleAddCredits(user)}
                      >
                        Add Credits
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No users found matching the search criteria
                </div>
              )}
            </div>
          </>
        )}

        {/* Add Credits Modal */}
        {isAddCredits && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button 
                onClick={() => setIsAddCredits(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
              >
                <FontAwesomeIcon icon={faClose} size="lg" />
              </button>
              
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Add Credits</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Player ID:</span>
                  <span className="font-medium">{selectedUser.memberId}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Username:</span>
                  <span className="font-medium">{selectedUser.userName}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Current Balance:</span>
                  <span className="font-medium text-green-600">₹{selectedUser.balance}</span>
                </div>
                
                <div>
                  <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Credits to Add:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input 
                      id="credits"
                      type="number" 
                      className="w-full p-3 pl-8 rounded-md border border-gray-300 focus:border-blue-500 outline-none transition"
                      placeholder="0"
                      value={adminCredits}
                      onChange={(e) => setAdminCredits(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <button 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-medium transition flex justify-center items-center"
                    onClick={submitAddCredits}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                    ) : (
                      "Add Credits"
                    )}
                  </button>
                  
                  <p className="text-center text-sm text-gray-500 mt-3">
                    New Balance will be: ₹{Number(selectedUser.balance) + (Number(adminCredits) || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suspend User Modal */}
        {isSuspend && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button 
                onClick={() => setIsSuspend(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
              >
                <FontAwesomeIcon icon={faClose} size="lg" />
              </button>
              
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Suspend User</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Username:</span>
                  <span className="font-medium">{selectedUser.userName}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{selectedUser.email}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Current Status:</span>
                  <span className={`font-medium ${selectedUser.isSuspended ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedUser.isSuspended ? "Suspended" : "Active"}
                  </span>
                </div>
                
                <div>
                  <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">
                    Suspension Duration (days):
                  </label>
                  <input 
                    id="days"
                    type="number" 
                    className="w-full p-3 rounded-md border border-gray-300 focus:border-blue-500 outline-none transition"
                    placeholder="Enter number of days"
                    value={suspensionDays}
                    onChange={(e) => setSuspensionDays(e.target.value)}
                  />
                </div>
                
                <div className="pt-2">
                  <button 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-md font-medium transition flex justify-center items-center"
                    onClick={submitSuspend}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                    ) : (
                      "Suspend User"
                    )}
                  </button>
                  
                  {Number(suspensionDays) > 0 && (
                    <p className="text-center text-sm text-gray-500 mt-3">
                      User will be suspended until: {format(new Date(new Date().setDate(new Date().getDate() + Number(suspensionDays))), "PPP")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
          {toasts.map((toast) => (
            <div 
              key={toast.id}
              className={`p-3 rounded-md shadow-lg flex items-center space-x-2 animate-slideIn ${
                toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
              style={{ 
                minWidth: "250px", 
                animation: "slideIn 0.3s ease-out forwards" 
              }}
            >
              <FontAwesomeIcon 
                icon={toast.type === "success" ? faCheck : faExclamationCircle} 
                className="text-white"
              />
              <span>{toast.message}</span>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>
      </div>
    </>
  );
}