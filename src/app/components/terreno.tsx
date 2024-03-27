"use client";
import { useEffect, useState } from "react";
import BigNumber from 'bignumber.js';
import extenso from "extenso";
import { Input } from "./input";

export function Terreno({ mesesAteVender }: any) {
  const [area, setArea] = useState<BigNumber>();
  const [valor, setValor] = useState<BigNumber>();
  const [itbi, setItbi] = useState<BigNumber>();
  const [escrituraERegistro, setEscrituraERegistro] = useState<BigNumber>();
  const [iptu, setIptu] = useState<BigNumber>();
  const [valorTotal, setValorTotal] = useState<BigNumber>();

  useEffect(() => {
    if (valor && itbi && escrituraERegistro && iptu && mesesAteVender) {
      const mesesAteVenderBig = BigNumber(mesesAteVender);
      const mesesDoAno = BigNumber(12);

      /* <h6>R$ {(valor + (valor * (itbi + escrituraERegistro)) + (iptu * (mesesAteVender / 12))) || '105.600,00'}</h6> */
      setValorTotal(valor.plus(valor.times(itbi.plus(escrituraERegistro))).plus(iptu.times(mesesAteVenderBig.div(mesesDoAno))));
    }

  }, [valor, itbi, escrituraERegistro, iptu, mesesAteVender]);


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
          <Input onChange={setValor} type="number" min="1" groupSymbolLeft="R$" />
          <div className="form-text">{!!valor && extenso(valor.integerValue().toNumber(), { mode: 'currency' })}</div>
        </div>
        <div className="mb-3 col-md-2">
          <label className="form-label">PREÇO DO M²</label>
          <h6>R$ {area && valor && valor.div(area).toFormat(2)} / m²</h6>
        </div>
      </div>
      <div className="row">
        <div className="mb-3 col-md">
          <label className="form-label">ITBI</label>
          <Input onChange={setItbi} type="number" min="1" step="any" groupSymbolRight="%" isPercent />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">ESCRITURA E REGISTRO</label>
          <Input onChange={setEscrituraERegistro} type="number" min="1" step="any" groupSymbolRight="%" isPercent />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">IPTU</label>
          <Input onChange={setIptu} type="number" min="1" step="any" groupSymbolLeft="R$" groupSymbolRight="ano" />
        </div>
      </div>
      <div className="row mb-3">
        <label className="form-label">CUSTO TOTAL TERRENO</label>
        {/* <h6>R$ {format(add(add(valor, multiply(valor, add(itbi, escrituraERegistro))), multiply(iptu, divide(mesesAteVender, 12))), 2)}</h6> */}
        {/* <h6>R$ {(valor + (valor * (itbi + escrituraERegistro)) + (iptu * (mesesAteVender / 12))) || '105.600,00'}</h6> */}
        <h6>R$ {valorTotal?.toFormat(2)}</h6>
        <div className="form-text">{!!valorTotal && extenso(valorTotal.integerValue().toNumber(), { mode: 'currency' })}</div>
      </div>
    </section>
  );
}
