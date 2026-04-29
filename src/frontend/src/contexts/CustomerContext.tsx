import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface CustomerSession {
  name: string;
  phone: string;
}

interface CustomerContextValue {
  currentCustomer: CustomerSession | null;
  login: (phone: string, name: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const SESSION_KEY = "tbah_customer_phone";
const NAME_KEY = "tbah_customer_name";

const CustomerContext = createContext<CustomerContextValue | null>(null);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [currentCustomer, setCurrentCustomer] =
    useState<CustomerSession | null>(() => {
      try {
        const phone = sessionStorage.getItem(SESSION_KEY);
        const name = sessionStorage.getItem(NAME_KEY);
        if (phone) return { phone, name: name ?? phone };
      } catch {
        /* ignore */
      }
      return null;
    });

  // Sync on storage events (multiple tabs)
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === SESSION_KEY) {
        if (e.newValue) {
          const name = sessionStorage.getItem(NAME_KEY) ?? e.newValue;
          setCurrentCustomer({ phone: e.newValue, name });
        } else {
          setCurrentCustomer(null);
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback((phone: string, name: string) => {
    try {
      sessionStorage.setItem(SESSION_KEY, phone);
      sessionStorage.setItem(NAME_KEY, name);
    } catch {
      /* ignore */
    }
    setCurrentCustomer({ phone, name });
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(NAME_KEY);
    } catch {
      /* ignore */
    }
    setCurrentCustomer(null);
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        currentCustomer,
        login,
        logout,
        isLoggedIn: !!currentCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer(): CustomerContextValue {
  const ctx = useContext(CustomerContext);
  if (!ctx)
    throw new Error("useCustomer must be used inside <CustomerProvider>");
  return ctx;
}
