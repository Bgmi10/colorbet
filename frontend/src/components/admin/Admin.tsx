import { useState } from "react";
import AdminWelcome from "./AdminWelcome";
import AdminLiveChat from "./AdminLiveChat";
import GoOnline from "./GoOnline";
import ManageUsers from "./ManageUsers";

export default function Admin() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectednav, setSelectedNav] = useState("");
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navData = [
    {
      id: 1,
      name: "Live Chat",
    },
    {
      id: 2,
      name: "Manage Users"
    },
    {
      id: 3,
      name: "Reports"
    },
    {
      id: 4,
      name: "Settings"
    },
    {
      id: 5,
      name: "Go Online"
    },
    {
      id: 6, 
      name: "General Support"
    }
  ]

  return (
    <>
      <div className="h-screen flex flex-col sm:flex-row">
        <aside
          className={`bg-gray-800 text-white sm:w-64 w-full sm:relative fixed inset-y-0 sm:block transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 sm:translate-x-0`}
        >
          <div className="p-4 text-center text-2xl font-bold border-b border-gray-700 text-yellow-500">
            Admin Panel
          </div>
          <nav className="p-4 space-y-4">
      
          {
            navData.map((i) => (
              <div key={i.id}>
                  <div className={`block px-4 py-2 rounded hover:bg-gray-700 cursor-pointer`} onClick={() => {
                    setSelectedNav(i.name) 
                    setIsOpen(false)
                  }
                  }>
                     {i.name}
                   </div>
              </div>
            ))
          }
          </nav>
        </aside>
       { selectednav  === "" &&  <AdminWelcome isOpen={isOpen} toggleSidebar={toggleSidebar} /> }
       { selectednav  === "Live Chat" &&  <AdminLiveChat setIsOpen={toggleSidebar} /> }
       { selectednav === "Go Online" && <GoOnline /> }
       { selectednav === "Manage Users" && <ManageUsers /> }       
      </div>
    </>
  );
}
