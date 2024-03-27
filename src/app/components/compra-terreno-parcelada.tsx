"use client";
import { useEffect, useState } from "react";
import BigNumber from 'bignumber.js';
import extenso from "extenso";
import { Input } from "./input";

interface CustomProps {
  valorTotalTerreno?: BigNumber
}

export function CompraTerrenoParcelada({ valorTotalTerreno }: CustomProps) {
  const [valorEntrada, setValorEntrada] = useState<BigNumber>();
  const [taxaDeJuros, setTaxaDeJuros] = useState<BigNumber>();
  const [mesDeInicio, setMesDeInicio] = useState<BigNumber>();
  const [prazo, setPrazo] = useState<BigNumber>();

  const saldo = valorTotalTerreno && valorEntrada ? valorTotalTerreno.minus(valorEntrada) : null;
  const valorDaParcela = !!prazo && !!taxaDeJuros && !!saldo ? calcularPagamentoMensal(taxaDeJuros.toNumber(), prazo?.toNumber(), saldo?.toNumber()) : null;
  const valorTotalParcelado = prazo && valorDaParcela && valorEntrada ? prazo.times(valorDaParcela).plus(valorEntrada) : null;

  return (
    <section className="card compra-terreno-parcelada mb-3">
      <div className="card-header">
        Compra terreno parcelada
      </div>
      <div className="row mb-3">
        <div className="col-md">
          <label className="form-label">Valor Da Entrada Sinal</label>
          <Input onChange={setValorEntrada} type="number" groupSymbolLeft="R$" />
          <div className="form-text">{!!valorEntrada && extenso(valorEntrada.integerValue().toNumber(), { mode: 'currency' })}</div>
        </div>
        <div className="col-md">
          <label className="form-label">Saldo</label>
          <h6>R$ {saldo?.toFormat(2)} / m²</h6>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md">
          <label className="form-label">Taxa De Juros</label>
          <Input onChange={setTaxaDeJuros} type="number" groupSymbolRight="A.M." isPercent />
        </div>
        <div className="col-md">
          <label className="form-label">Mês De Início</label>
          <Input onChange={setMesDeInicio} type="number" />
        </div>
        <div className="col-md">
          <label className="form-label">Prazo em meses</label>
          <Input onChange={setPrazo} type="number" />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md">
          <label className="form-label">Mês Da Última Parcela</label>
          <h6>{mesDeInicio && prazo && mesDeInicio.plus(prazo).minus(1).toFormat(2)}</h6>
        </div>
        <div className="col-md">
          <label className="form-label">Valor da parcela</label>
          <h6>{valorDaParcela?.toFormat(2)}</h6>
          <div className="form-text">{!!valorDaParcela && extenso(valorDaParcela.integerValue().toNumber(), { mode: 'currency' })}</div>
        </div>
        <div className="col-md">
          <label className="form-label">Valor Total Parcelado</label>
          <h6>{valorTotalParcelado?.toFormat(2)}</h6>
          <div className="form-text">{!!valorTotalParcelado && extenso(valorTotalParcelado.integerValue().toNumber(), { mode: 'currency' })}</div>
        </div>
      </div>
    </section>
  );
}


function calcularPagamentoMensal(taxa: number, nper: number, vp: number, vf = 0, tipo = 0) {
  // Converte a taxa de juros anual para mensal
  const taxaMensal = taxa / 12 / 100;

  // Calcula o fator de pagamento
  const fator = Math.pow(1 + taxaMensal, nper);

  // Calcula o pagamento mensal
  let pagamento = (vp * taxaMensal * fator) / (fator - 1);

  // Se o tipo for 1, considera pagamentos no início do período
  if (tipo === 1) {
    pagamento *= 1 + taxaMensal;
  }

  // Subtrai o valor futuro (se fornecido)
  pagamento -= vf;

  return BigNumber(pagamento);
}

window.a = calcularPagamentoMensal;