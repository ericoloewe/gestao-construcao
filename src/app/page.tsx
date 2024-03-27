"use client";

import "./page.scss";
// import { add, multiply, divide, format } from "mathjs";

import { useState } from "react";
import BigNumber from "bignumber.js";
import { Layout } from "./shared/layout";

export default function Home() {
  const [valorTotalTerreno, setValorTotalTerreno] = useState<BigNumber>();

  return (
    <Layout>
      <main className="main container">

      </main>
    </Layout>
  );
}
