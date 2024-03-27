"use client";

import BigNumber from "bignumber.js";
import { AppProviders } from "../contexts";

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
    <AppProviders>{children}</AppProviders>
  );
}