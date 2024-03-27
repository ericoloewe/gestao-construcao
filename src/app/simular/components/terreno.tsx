"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import BigNumber from 'bignumber.js';
import extenso from "extenso";
import { Input } from "../../components/input";
import { useSimulador } from "../context";

interface CustomProps {
  mesesAteVender: number
  onValorTotalTerrenoChange: Dispatch<SetStateAction<BigNumber | undefined>>
}

export function Terreno({ mesesAteVender, onValorTotalTerrenoChange }: CustomProps) {
  const { area, setArea, valor, setValor, itbi, setItbi, escrituraERegistro, setEscrituraERegistro, iptu, setIptu, valorTotal, setValorTotal, } = useSimulador();

  useEffect(() => {
    if (valor && itbi && escrituraERegistro && iptu && mesesAteVender) {
      const mesesAteVenderBig = BigNumber(mesesAteVender);
      const mesesDoAno = BigNumber(12);

      /* <h6>R$ {(valor + (valor * (itbi + escrituraERegistro)) + (iptu * (mesesAteVender / 12))) || '105.600,00'}</h6> */
      setValorTotal(valor.plus(valor.times(itbi.plus(escrituraERegistro))).plus(iptu.times(mesesAteVenderBig.div(mesesDoAno))));
    }

  }, [valor, itbi, escrituraERegistro, iptu, mesesAteVender]);

  useEffect(() => {
    onValorTotalTerrenoChange(valorTotal);
  }, [valorTotal]);

  return (
    <section className="card valor-terreno mb-3">
      <div className="card-header">
        Terreno
      </div>
      <div className="row">
        <div className="mb-3 col-md">
          <label className="form-label">Área Do Terreno</label>
          <Input onChange={setArea} type="number" groupSymbolRight="m²" value={area} />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">Valor De Aquisição</label>
          <Input onChange={setValor} type="number" min="1" groupSymbolLeft="R$" value={valor} />
          <div className="form-text">{!!valor && extenso(valor.integerValue().toNumber(), { mode: 'currency' })}</div>
        </div>
        <div className="mb-3 col-md-2">
          <label className="form-label">Preço Do M²</label>
          <h6>R$ {area && valor && valor.div(area).toFormat(2)} / m²</h6>
        </div>
      </div>
      <div className="row">
        <div className="mb-3 col-md">
          <label className="form-label">Itbi</label>
          <Input onChange={setItbi} type="number" min="1" step="any" groupSymbolRight="%" isPercent />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">Escritura E Registro</label>
          <Input onChange={setEscrituraERegistro} type="number" min="1" step="any" groupSymbolRight="%" isPercent />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">Iptu</label>
          <Input onChange={setIptu} type="number" min="1" step="any" groupSymbolLeft="R$" groupSymbolRight="ano" />
        </div>
      </div>
      <div className="row mb-3">
        <label className="form-label">Custo Total Terreno</label>
        {/* <h6>R$ {format(add(add(valor, multiply(valor, add(itbi, escrituraERegistro))), multiply(iptu, divide(mesesAteVender, 12))), 2)}</h6> */}
        {/* <h6>R$ {(valor + (valor * (itbi + escrituraERegistro)) + (iptu * (mesesAteVender / 12))) || '105.600,00'}</h6> */}
        <h6>R$ {valorTotal?.toFormat(2)}</h6>
        <div className="form-text">{!!valorTotal && extenso(valorTotal.integerValue().toNumber(), { mode: 'currency' })}</div>
      </div>
    </section>
  );
}
