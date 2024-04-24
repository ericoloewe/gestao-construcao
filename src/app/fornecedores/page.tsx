"use client";

import "./page.scss";

import { Layout } from "../shared/layout";

function Fornecedores() {
  return (
    <main className="fornecedores container mt-3">
      <h1>Fornecedores</h1>
    </main>
  );
}

export default function Page() {
  return (
    <Layout>
      <Fornecedores />
    </Layout>
  );
}

