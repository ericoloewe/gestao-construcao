"use client";

import "./page.scss";

import { Terreno } from "./components/terreno";
import { CompraTerrenoParcelada } from "./components/compra-terreno-parcelada";
import { useState } from "react";
import BigNumber from "bignumber.js";
import { Layout } from "../shared/layout";
import { SimuladorProvider, useSimulador } from "./context";
import { Input } from "../components/input";
import Link from "next/link";

function Simulador() {
  const [valorTotalTerreno, setValorTotalTerreno] = useState<BigNumber>();
  const { saveAll, titulo, setTitulo } = useSimulador();

  return (
    <main className="main container mt-3">
      <h1>Simular nova construção</h1>
      <article>
        <section className="card valor-terreno mb-3">
          <div className="card-header">
            Terreno
          </div>
          <div className="mark-section">
            <div className="row">
              <div className="mb-3 col-md">
                <label className="form-label">Como deseja chamar sua simulação?</label>
                <Input onChange={setTitulo} type="text" value={titulo} placeholder="Casa popular 50m²" />
              </div>
            </div>
          </div>
        </section>
        <Terreno onValorTotalTerrenoChange={setValorTotalTerreno} />
        <CompraTerrenoParcelada valorTotalTerreno={valorTotalTerreno} />
        <Link href={'/'} className="btn btn-secondary me-2">Voltar ao inicio</Link>
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

