import { FiMenu, FiX } from "react-icons/fi";

export default function AdminWelcome ({ toggleSidebar, isOpen }: { toggleSidebar: any, isOpen: boolean }) {
    return(
        <>
          <div className="flex-1 from-white via-yellow-50 to-yellow-200 bg-transparent bg-gradient-to-t p-4 sm:p-8 overflow-y-auto">
              <div className="flex justify-between items-center sm:hidden">
                <button
                  onClick={toggleSidebar}
                  className="text-3xl focus:outline-none"
                >
                  {isOpen ? <FiX /> : <FiMenu />}
                </button>
                <h1 className="text-2xl font-bold">Admin Panel</h1>
              </div>
              <h1 className="text-3xl font-bold mb-4">Welcome, Admin</h1>
              <p>This is the main content area. Use the navigation to explore different admin sections.</p>
          </div>
        </>
    )
}