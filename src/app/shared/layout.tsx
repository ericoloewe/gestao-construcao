"use client";

import BigNumber from "bignumber.js";
import { AppProviders } from "../contexts";
import { Header } from "../components/header";

BigNumber.config({
  FORMAT: {
    // decimal separator
    decimalSeparator: ',',
    // grouping separator of the integer part
    groupSeparator: '.',
  }
});

export function Layout({ children }: any) {
  return (
    <AppProviders>
      <Header />
      {children}
    </AppProviders>
  );
}