"use client";

import "./page.scss";

import { Layout } from "../shared/layout";

function Obras() {
  return (
    <main className="obras container mt-3">
      <h1>Obras</h1>
    </main>
  );
}

export default function Page() {
  return (
    <Layout>
      <Obras />
    </Layout>
  );
}

