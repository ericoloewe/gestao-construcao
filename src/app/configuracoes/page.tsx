"use client";

import { useState } from "react";
import { AuthButton } from "../components/auth-button";
import { Layout } from "../shared/layout";
import "./page.scss";
import { Loader } from "../components/loader";
import { useStorage } from "../contexts/storage";
import { useEnv } from "../contexts/env";

function Configuracoes() {
  const [isLoading, setIsLoading] = useState(false);
  const { isDbOk, repository } = useStorage();
  const { aplicationName } = useEnv()

  async function exportToDb() {
    setIsLoading(true);

    const dump = await repository.exportOriginalDump();

    const blob = new Blob([dump], { type: "application/pdf" });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);

    const fileName = `${aplicationName}.db`;
    link.download = fileName;
    link.click();

    setIsLoading(false);
  }

  const isAllLoading = isLoading || !isDbOk

  return (
    <main className="main container mt-3">
      <h1>Configurações da aplicação</h1>
      <article className={`${isAllLoading && 'is-loading'}`}>
        {isAllLoading
          ? <Loader />
          : (
            <>
              <section className="card">
                <h5 className="card-header">Carregar dados de um arquivo</h5>
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">Escolha um arquivo do tipo .db</label>
                    <input className="form-control" type="file" id="formFile" accept=".db,.sqlite" />
                  </div>
                  <button type="button" className="btn btn-secondary">Clique para carregar dados de um arquivo</button>
                </div>
              </section>
              <section className="card">
                <h5 className="card-header">Exportar dados para um arquivo</h5>
                <div className="card-body">
                  <button type="button" className="btn btn-secondary" onClick={exportToDb}>Clique para exportar dados para um arquivo</button>
                </div>
              </section>
              <section className="card gdrive">
                <h5 className="card-header">Google drive</h5>
                <div className="card-body">
                  <AuthButton />
                </div>
              </section>
            </>
          )}
      </article>
    </main>
  );
}

export default function Page() {
  return (
    <Layout>
      <Configuracoes />
    </Layout>
  );
}

