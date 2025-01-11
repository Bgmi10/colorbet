import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { baseurl } from "../utils/constants";
interface LoginActivity{
 id: number,
 browser: string,
 os: string,
 ip: string,
 loginTime: string;
 logoutTime: string;
 authMethod: string;
 isp: string;
 location: string;
 deviceModel: string | null;
 deviceType: string;
}
interface Payment {
  id: number;
  upiRef: string;
  amount: number;
  userId: number;
  status: string;
  createdAt: string;
  senderMobile: string; 
  remarks: string;
  senderName: string;
}
interface Withdrawal{
  id: string;
  withdrawalStatus: string;
  userId: number 
  bankAccountId: number
  amount: number
  transactionId: string;
  createdAt: string;
  completedAt: string;       
  payoutMethod: string;
  withdrawalFee: number;
  amountToTransfer: number;
 }
interface AccountStatus {
  id: number;
  verified: boolean;
  bankAccountId: number;
  reason: string;    
  createdAt: string;
}
interface BankAccount {
  id: Number;
  accountNumber: string;
  ifscCode: string;   
  upiId: string;  
  bankName: string;  
  userId: string;  
  accountHolderName: string;  
  email: string;  
  createdAt: string;
  updatedAt: string      
  accountStatus: AccountStatus[]   
  bankImage: string
}
interface User{
  email: string;
  userName: string;
  memberId: string;
  balance: number
  role: string;
  avatarUrl: string;
  loginActivities: LoginActivity[];
  payments: Payment[];
  withdrawals: Withdrawal[];
  bankAccounts: BankAccount[];
}

export const AuthContext = createContext<{
  user: User | null;
  isAuthenticated: boolean | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  Logout: () => Promise<void>;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);
  const [isLoading, setIsLoading] = useState(true);

  const getUser = async () => {
    try {
      const res = await axios.get(`${baseurl}/api/auth/userprofile`, {
        withCredentials: true,
      });
      const json = await res.data;
      if (json) {
        setUser(json?.user);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.log(e);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const Logout = async () => {
    try {
      await axios.post(
        `${baseurl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      setIsAuthenticated(false);
      localStorage.clear();
      window.location.href = "/login";
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, setUser, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};