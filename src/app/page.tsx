"use client";

import "./page.scss";
import { useState } from "react";
import { add, multiply, divide, format } from "mathjs";
import { useIMask } from "react-imask";

export default function Home() {
  return (
    <main className="main container">
      <h1>Calculo de construção</h1>
      <Terreno mesesAteVender={26} />
    </main>
  );
}
function Terreno({ mesesAteVender }: any) {
  const [area, setArea] = useState<number>(0);
  const [valor, setValor] = useState<number>(0);
  const [itbi, setItbi] = useState<number>(0);
  const [escrituraERegistro, setEscrituraERegistro] = useState<number>(0);
  const [iptu, setIptu] = useState<number>(0);

  return (
    <section className="card valor-terreno">
      <div className="card-header">
        Terreno
      </div>
      <div className="row">
        <div className="mb-3 col-md">
          <label className="form-label">ÁREA DO TERRENO</label>
          <Input mask="# m²" onChange={setArea} isNumber={true} />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">VALOR DE AQUISIÇÃO </label>
          <Input mask="R$ #" onChange={setValor} isNumber={true} />
        </div>
        <div className="mb-3 col-md-2">
          <label className="form-label">PREÇO DO M²</label>
          <h6>R$ {divide(valor, area)} / m²</h6>
        </div>
      </div>
      <div className="row">
        <div className="mb-3 col-md">
          <label className="form-label">ITBI</label>
          <input type="text" className="form-control" placeholder="2,00%" value={itbi} onChange={e => setItbi(Number(e.target.value))} />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">ESCRITURA E REGISTRO</label>
          <input type="text" className="form-control" placeholder="1,00%" value={escrituraERegistro} onChange={e => setEscrituraERegistro(Number(e.target.value))} />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">IPTU</label>
          <input type="text" className="form-control" placeholder="R$ 1.200,00/ano" value={iptu} onChange={e => setIptu(Number(e.target.value))} />
        </div>
      </div>
      <div className="row mb-3">
        <label className="form-label">CUSTO TOTAL TERRENO</label>
        <h6>R$ {format(add(add(valor, multiply(valor, add(itbi, escrituraERegistro))), multiply(iptu, divide(mesesAteVender, 12))), 2)}</h6>
        {/* <h6>R$ {(valor + (valor * (itbi + escrituraERegistro)) + (iptu * (mesesAteVender / 12))) || '105.600,00'}</h6> */}
      </div>
    </section>
  )
}

function Input({ mask, onChange, isNumber }: any) {
  const { ref } = useIMask({ mask, radix: '.', lazy: false, blocks: { '#': { mask: Number, expose: true, }, } }, { onAccept: onChangeInput });

  function onChangeInput(value: string) {
    if (isNumber)
      onChange(Number(value.replaceAll(',', '.')));
    else
      onChange(value);
  }

  return <input ref={ref as any} className="form-control" />;
}
