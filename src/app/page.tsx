"use client";

import "./page.scss";
// import { add, multiply, divide, format } from "mathjs";

import { Terreno } from "./components/terreno";

export default function Home() {
  return (
    <main className="main container">
      <h1>Calculo de construção</h1>
      <form>
        <Terreno mesesAteVender={26} />
      </form>
    </main>
  );
}
