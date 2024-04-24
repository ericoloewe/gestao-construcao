"use client";

import "./page.scss";

import { Layout } from "../shared/layout";

function Clientes() {
  return (
    <main className="clientes container mt-3">
      <h1>Clientes</h1>
    </main>
  );
}

export default function Page() {
  return (
    <Layout>
      <Clientes />
    </Layout>
  );
}

