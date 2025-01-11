import axios from "axios";
import { useState } from "react";
import { baseurl } from "../../utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import ButtonLoader from "../bindbank/ButtonLoader";
import Header from "../Header";

export default function ChangePassword() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });
  const [isshowOldPassword, setIsShowOldPassword] = useState(false);
  const [isshowNewPassword, setIsShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async () => {
    if (!form.newPassword || !form.oldPassword) {
      setError("Both old and new passwords are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${baseurl}/api/auth/change-password`,
        { oldPassword: form.oldPassword, newPassword: form.newPassword },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setSuccess("Password changed successfully!");
      }
    } catch (e: any) {
      setError(e.response.data.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <>
      <Header link="/profile" title="Change Password"/> 
      <div className="h-screen dark:bg-gray-900 flex items-center justify-center flex-col">
        <div className="dark:bg-gray-800 bg-slate-200 flex flex-col items-center rounded-md gap-3 p-5 w-full max-w-md">
          <div className="w-full relative">
            <input
              type={isshowOldPassword ? "text" : "password"}
              name="oldPassword"
              placeholder="Old Password"
              className="w-full dark:bg-gray-700 p-3 rounded-md outline-none dark:text-white text-gray-700"
              onChange={handleChange}
            />
            <FontAwesomeIcon
              icon={isshowOldPassword ? faEye : faEyeSlash}
              className="absolute right-3 top-3 dark:text-gray-900 text-gray-700 cursor-pointer"
              onClick={() => setIsShowOldPassword(!isshowOldPassword)}
            />
          </div>
  
          <div className="w-full relative mt-4">
            <input
              type={isshowNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              className="w-full dark:bg-gray-700 p-3 rounded-md outline-none dark:text-white text-gray-700"
              onChange={handleChange}
            />
            <FontAwesomeIcon
              icon={isshowNewPassword ? faEye : faEyeSlash}
              className="absolute right-3 top-3 dark:text-gray-900 text-gray-700 cursor-pointer"
              onClick={() => setIsShowNewPassword(!isshowNewPassword)}
            />
          </div>
    
          {error && <p className="text-red-500 text-sm mt-2" role="alert">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2" role="alert">{success}</p>}
  
          <button
            className={`bg-yellow-500 text-white p-3 rounded-md w-full mt-4 font-serif transition-all ${loading ? "cursor-not-allowed opacity-50" : "hover:bg-yellow-600"}`}
            onClick={handleSubmit}
            disabled={loading}
            aria-busy={loading}
            aria-live="polite"
          >
            <ButtonLoader value="submit" loader={loading}/>
          </button>
        </div>
      </div>
    </>
  );
}
