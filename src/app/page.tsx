"use client";

import "./page.scss";
import { useState } from "react";
import { add, multiply, divide, format } from "mathjs";
import extenso from "extenso";

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
          <Input onChange={setArea} type="number" groupSymbolRight="m²" />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">VALOR DE AQUISIÇÃO </label>
          <Input onChange={setValor} type="number" min="1" step="any" groupSymbolLeft="R$" />
          <div className="form-text">{!!valor && extenso(valor, { mode: 'currency' })}</div>
        </div>
        <div className="mb-3 col-md-2">
          <label className="form-label">PREÇO DO M²</label>
          <h6>R$ {area && valor && format(divide(valor, area), 2)} / m²</h6>
        </div>
      </div>
      <div className="row">
        <div className="mb-3 col-md">
          <label className="form-label">ITBI</label>
          <Input onChange={setItbi} type="number" min="1" step="any" groupSymbolLeft="%" />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">ESCRITURA E REGISTRO</label>
          <Input onChange={setEscrituraERegistro} type="number" min="1" step="any" groupSymbolLeft="%" />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">IPTU</label>
          <Input onChange={setIptu} type="number" min="1" step="any" groupSymbolLeft="R$" groupSymbolRight="ano" />
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

function Input(props: any) {
  const { onChange, isNumber, groupSymbolLeft, groupSymbolRight, ...otherProps } = props;

  function onChangeInput(event: any) {
    const { value } = event.target

    if (props.type === 'number')
      onChange(Number(value));
    else
      onChange(value);
  }

  const input = <input className="form-control" onChange={onChangeInput} {...otherProps} />;

  return groupSymbolLeft || groupSymbolRight ? (
    <div className="input-group mb-3">
      {groupSymbolLeft && <span className="input-group-text">{groupSymbolLeft}</span>}
      {input}
      {groupSymbolRight && <span className="input-group-text">{groupSymbolRight}</span>}
    </div>
  ) : input;
}