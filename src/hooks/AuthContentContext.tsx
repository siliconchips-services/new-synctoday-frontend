import React, { createContext, useContext, useState } from 'react';

interface AuthContent {
  left_section: {
    app_name: string | null;
    text_1: string | null;
    text_2: string | null;
  };
  right_section: {
    title: string | null;
    login_id_label: string | null;
    password_label: string | null;
    button_label: string | null;
  };
}

interface AuthContentContextType {
  authContent: AuthContent | null;
  setAuthContent: React.Dispatch<React.SetStateAction<AuthContent | null>>;
}

const AuthContentContext = createContext<AuthContentContextType | undefined>(
  undefined,
);

export const AuthContentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authContent, setAuthContent] = useState<AuthContent | null>(null);

  return (
    <AuthContentContext.Provider value={{ authContent, setAuthContent }}>
      {children}
    </AuthContentContext.Provider>
  );
};

export const useAuthContent = () => {
  const context = useContext(AuthContentContext);
  if (!context) {
    throw new Error(
      'useAuthContent must be used within an AuthContentProvider',
    );
  }
  return context;
};
