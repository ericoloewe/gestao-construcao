"use client";

import "./page.scss";

import { Layout } from "../shared/layout";

function Compras() {
  return (
    <main className="compras container mt-3">
      <h1>Compras</h1>
    </main>
  );
}

export default function Page() {
  return (
    <Layout>
      <Compras />
    </Layout>
  );
}

