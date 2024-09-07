"use client";

import { Provider } from "jotai";

interface JotaProviderProps {
  children: React.ReactNode;
}

export const JotaProvider = ({ children }: JotaProviderProps) => {
  return <Provider>{children}</Provider>;
};
