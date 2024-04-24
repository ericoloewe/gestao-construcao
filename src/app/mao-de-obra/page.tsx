"use client";

import "./page.scss";

import { Layout } from "../shared/layout";

function MaoDeObra() {
  return (
    <main className="mao-de-obra container mt-3">
      <h1>Mao de obra</h1>
    </main>
  );
}

export default function Page() {
  return (
    <Layout>
      <MaoDeObra />
    </Layout>
  );
}

