import { createContext, useEffect, useState } from "react";

export const AccountContext = createContext(
  {} as {
    id: string;
    setId: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
  }
);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState(localStorage.getItem("id") ?? "");
  const [password, setPassword] = useState(
    localStorage.getItem("password") ?? ""
  );

  useEffect(() => {
    localStorage.setItem("id", id);
    localStorage.setItem("password", password);
  }, [id, password]);

  return (
    <AccountContext.Provider value={{ id, setId, password, setPassword }}>
      {children}
    </AccountContext.Provider>
  );
}
