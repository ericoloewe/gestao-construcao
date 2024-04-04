"use client";

import "./page.scss";
// import { add, multiply, divide, format } from "mathjs";

import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { Layout } from "./shared/layout";
import { useStorage } from "./contexts/storage";
import { Simulacao } from "./utils/db-repository";
import Link from "next/link";

function Home() {
  const { isDbOk, repository } = useStorage();

  const [simulacoes, setSimulacoes] = useState<Simulacao[]>([]);

  useEffect(() => {
    isDbOk && load();
  }, [isDbOk]);

  async function load() {
    const result = await repository.list();

    console.log(result);

    setSimulacoes(result);
  }

  return (
    <main className="main container">
      {simulacoes.map(x => (
        <div key={x.id.toNumber()} className="card">
          <div className="card-body">
            <h5 className="card-title">{x.titulo}</h5>
            <h6 className="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
            <p className="card-text">Area terreno: {x.area?.toNumber()}</p>
            <Link href={`/simular?sim=${x.id}`} className="btn btn-secondary">Ver simulação</Link>
          </div>
        </div>
      ))}
    </main>
  );

}

export default function Page() {

  return (
    <Layout>
      <Home />
    </Layout>
  );
}
