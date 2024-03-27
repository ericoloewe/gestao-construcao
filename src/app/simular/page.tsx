"use client";

import "./page.scss";

import { Terreno } from "./components/terreno";
import { CompraTerrenoParcelada } from "./components/compra-terreno-parcelada";
import { useState } from "react";
import BigNumber from "bignumber.js";
import { Layout } from "../shared/layout";
import { SimuladorProvider, useSimulador } from "./context";

function Simulador() {
  const [valorTotalTerreno, setValorTotalTerreno] = useState<BigNumber>();
  const { saveAll } = useSimulador();

  return (
    <main className="main container mt-3">
      <h1>Simular nova construção</h1>
      <article>
        <Terreno mesesAteVender={26} onValorTotalTerrenoChange={setValorTotalTerreno} />
        <CompraTerrenoParcelada valorTotalTerreno={valorTotalTerreno} />
        <button type="button" className="btn btn-primary" onClick={saveAll}>Salvar simulação</button>
      </article>
    </main>
  );
}

export default function Page() {

  return (
    <Layout>
      <SimuladorProvider>
        <Simulador />
      </SimuladorProvider>
    </Layout>
  );
}

