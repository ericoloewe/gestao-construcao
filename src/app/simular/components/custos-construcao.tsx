"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import BigNumber from 'bignumber.js';
import { Input } from "../../components/input";
import { useSimulador } from "../context";
import { SimuladorUtil } from "@/app/utils/simulador";

interface CustomProps {
}

export function CustosConstrucao({ }: CustomProps) {
  const [custoObra, setCustoObra] = useState<BigNumber>();
  const [custoTotalDeConstrucao, setCustoTotalDeConstrucao] = useState<BigNumber>();
  const [tipoDeCustoEscolhido, setTipoDeCustoEscolhido] = useState<string>();
  const { areaConstruidaTotal, setAreaConstruidaTotal, areaConstruidaEquivalente, setAreaConstruidaEquivalente, custoCUB, setCustoCUB, custoHistoricoInterno, setCustoHistoricoInterno, custoOrcado, setCustoOrcado, custoProjetos, setCustoProjetos, custoTerraplanagem, setCustoTerraplanagem, custoPaisagismo, setCustoPaisagismo, outrosCustos, setOutrosCustos, } = useSimulador();

  useEffect(() => {
    // if (valor && itbi && escrituraERegistro && iptu) {
    //   setCustoObra(SimuladorUtil.valorTotal(valor, itbi, escrituraERegistro, iptu, SimuladorUtil.MESES_ATE_VENDER));
    // }

  }, [areaConstruidaEquivalente, custoCUB, custoHistoricoInterno, custoOrcado, tipoDeCustoEscolhido]);

  return (
    <section className="card valor-terreno mb-3">
      <div className="card-header">
        Custos de Construção
      </div>
      <div className="row">
        <div className="mb-3 col-md">
          <label className="form-label">Área Construída Total</label>
          <Input onChange={setAreaConstruidaTotal} type="number" groupSymbolRight="m²" value={areaConstruidaTotal} />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">Área Construída equivalente</label>
          <Input onChange={setAreaConstruidaEquivalente} type="number" groupSymbolRight="m²" value={areaConstruidaEquivalente} />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">CUB Referência</label>
          {/* @ts-ignore */}
          <Input type="text" value={"R1-B"} />
        </div>
      </div>
      <div className="row">
        <div className="mb-3 col-md">
          <label className="form-label">Custo CUB</label>
          <Input onChange={setCustoCUB} type="number" min="1" step="any" groupSymbolRight="R$" groupSymbolLeft="m²" value={custoCUB} />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">Custo Histórico Interno</label>
          <Input onChange={setCustoHistoricoInterno} type="number" min="1" step="any" groupSymbolRight="R$" groupSymbolLeft="m²" value={custoHistoricoInterno} />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">Custo Orçado</label>
          <Input onChange={setCustoOrcado} type="number" min="1" step="any" groupSymbolRight="R$" groupSymbolLeft="m²" value={custoOrcado} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="mb-3 col-md">
          <label className="form-label">Custo Escolhido</label>
          <select className="form-control" value={tipoDeCustoEscolhido} onChange={e => setTipoDeCustoEscolhido(e.target.value)}>
            <option value="cub">CUB</option>
            <option value="historico">Histórico</option>
            <option value="orçamento">Orçamento</option>
          </select>
        </div>
        <label className="form-label">Custo da obra</label>
        <h6>R$ {custoObra?.toFormat(2)}</h6>
        <div className="form-text">{SimuladorUtil.extenso(custoObra, { mode: 'currency' })}</div>
      </div>
      <div className="row">
        <div className="mb-3 col-md">
          <label className="form-label">Custo Projetos</label>
          <Input onChange={setCustoProjetos} type="number" min="1" step="any" groupSymbolRight="R$" value={custoProjetos} />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">Custo Terraplanagem</label>
          <Input onChange={setCustoTerraplanagem} type="number" min="1" step="any" groupSymbolRight="R$" value={custoTerraplanagem} />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">Custo Paisagismo</label>
          <Input onChange={setCustoPaisagismo} type="number" min="1" step="any" groupSymbolRight="R$" value={custoPaisagismo} />
        </div>
        <div className="mb-3 col-md">
          <label className="form-label">Outros custos</label>
          <Input onChange={setOutrosCustos} type="number" min="1" step="any" groupSymbolRight="R$" value={outrosCustos} />
        </div>
      </div>
      <div className="row mb-3">
        <label className="form-label">Custo total de construção</label>
        <h6>R$ {custoTotalDeConstrucao?.toFormat(2)}</h6>
        <div className="form-text">{SimuladorUtil.extenso(custoTotalDeConstrucao, { mode: 'currency' })}</div>
      </div>
    </section>
  );
}
