"use client";

import BigNumber from "bignumber.js";
import { useRouter, useSearchParams } from "next/navigation";
import React, { createContext, useState, useEffect } from "react"
import { useStorage } from "../contexts/storage";
import { Simulacao } from "../utils/db-repository";

interface SimuladorContextType extends Simulacao {
  setTitulo: React.Dispatch<React.SetStateAction<string | undefined>>,
  setArea: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setValor: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setItbi: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setEscrituraERegistro: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setIptu: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setValorTotal: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setValorEntrada: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setTaxaDeJuros: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setMesDeInicio: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setPrazo: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setAreaConstruidaTotal: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setAreaConstruidaEquivalente: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setCustoCUB: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setCustoHistoricoInterno: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setCustoOrcado: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setCustoProjetos: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setCustoTerraplanagem: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setCustoPaisagismo: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setOutrosCustos: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setMesDeInicioObra: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  setDuracaoObra: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  saveAll: () => {}
}

const SimuladorContext = createContext<SimuladorContextType>({
  setTitulo: () => { },
  setArea: () => { },
  setValor: () => { },
  setItbi: () => { },
  setEscrituraERegistro: () => { },
  setIptu: () => { },
  setValorTotal: () => { },
  setValorEntrada: () => { },
  setTaxaDeJuros: () => { },
  setMesDeInicio: () => { },
  setPrazo: () => { },
  setAreaConstruidaTotal: () => { },
  setAreaConstruidaEquivalente: () => { },
  setCustoCUB: () => { },
  setCustoHistoricoInterno: () => { },
  setCustoOrcado: () => { },
  setCustoProjetos: () => { },
  setCustoTerraplanagem: () => { },
  setCustoPaisagismo: () => { },
  setOutrosCustos: () => { },
  setMesDeInicioObra: () => { },
  setDuracaoObra: () => { },
  saveAll: () => { },
} as any)

export function SimuladorProvider(props: any) {
  const searchParams = useSearchParams();
  const router = useRouter()
  const [titulo, setTitulo] = useState<string>();
  const [area, setArea] = useState<BigNumber>();
  const [valor, setValor] = useState<BigNumber>();
  const [itbi, setItbi] = useState<BigNumber>();
  const [escrituraERegistro, setEscrituraERegistro] = useState<BigNumber>();
  const [iptu, setIptu] = useState<BigNumber>();
  const [valorEntrada, setValorEntrada] = useState<BigNumber>();
  const [taxaDeJuros, setTaxaDeJuros] = useState<BigNumber>();
  const [mesDeInicio, setMesDeInicio] = useState<BigNumber>();
  const [prazo, setPrazo] = useState<BigNumber>();
  const [areaConstruidaTotal, setAreaConstruidaTotal] = useState<BigNumber>();
  const [areaConstruidaEquivalente, setAreaConstruidaEquivalente] = useState<BigNumber>();
  const [custoCUB, setCustoCUB] = useState<BigNumber>();
  const [custoHistoricoInterno, setCustoHistoricoInterno] = useState<BigNumber>();
  const [custoOrcado, setCustoOrcado] = useState<BigNumber>();
  const [custoProjetos, setCustoProjetos] = useState<BigNumber>();
  const [custoTerraplanagem, setCustoTerraplanagem] = useState<BigNumber>();
  const [custoPaisagismo, setCustoPaisagismo] = useState<BigNumber>();
  const [outrosCustos, setOutrosCustos] = useState<BigNumber>();
  const [mesInicioObra, setMesDeInicioObra] = useState<BigNumber>();
  const [duracaoObra, setDuracaoObra] = useState<BigNumber>();
  const { repository, isDbOk } = useStorage();

  useEffect(() => {
    isDbOk && load();
  }, [isDbOk]);

  async function load() {
    const sim = searchParams.get('sim');

    if (sim != null) {
      const simulacao = await repository.getSimulacao(sim);

      console.log(simulacao);

      setTitulo(simulacao.titulo);
      setArea(simulacao.area && BigNumber(simulacao.area));
      setValor(simulacao.valor && BigNumber(simulacao.valor));
      setItbi(simulacao.itbi && BigNumber(simulacao.itbi));
      setEscrituraERegistro(simulacao.escrituraERegistro && BigNumber(simulacao.escrituraERegistro));
      setIptu(simulacao.iptu && BigNumber(simulacao.iptu));
      setValorEntrada(simulacao.valorEntrada && BigNumber(simulacao.valorEntrada));
      setTaxaDeJuros(simulacao.taxaDeJuros && BigNumber(simulacao.taxaDeJuros));
      setMesDeInicio(simulacao.mesDeInicio && BigNumber(simulacao.mesDeInicio));
      setPrazo(simulacao.prazo && BigNumber(simulacao.prazo));
    }
  }

  async function saveAll() {
    console.log('start save all');
    const sim = searchParams.get('sim');
    const simulacao = { titulo, area, valor, itbi, escrituraERegistro, iptu, valorEntrada, taxaDeJuros, mesDeInicio, prazo } as any;

    Object.keys(simulacao).forEach(key => {
      // @ts-ignore
      if (simulacao[key]?.toNumber != null) {
        // @ts-ignore
        simulacao[key] = simulacao[key]?.toNumber();
      }
    })

    simulacao.id = sim;

    const result = await repository.save(simulacao)

    console.log(result);

    if (sim == null)
      router.push(`/simular?sim=${result.id}`);

    console.log('end save all');
  }

  return (
    <SimuladorContext.Provider
      value={{
        titulo, setTitulo,
        area, setArea,
        valor, setValor,
        itbi, setItbi,
        escrituraERegistro, setEscrituraERegistro,
        iptu, setIptu,
        valorEntrada, setValorEntrada,
        taxaDeJuros, setTaxaDeJuros,
        mesDeInicio, setMesDeInicio,
        prazo, setPrazo,
        areaConstruidaTotal, setAreaConstruidaTotal,
        areaConstruidaEquivalente, setAreaConstruidaEquivalente,
        custoCUB, setCustoCUB,
        custoHistoricoInterno, setCustoHistoricoInterno,
        custoOrcado, setCustoOrcado,
        custoProjetos, setCustoProjetos,
        custoTerraplanagem, setCustoTerraplanagem,
        custoPaisagismo, setCustoPaisagismo,
        outrosCustos, setOutrosCustos,
        mesInicioObra, setMesDeInicioObra,
        duracaoObra, setDuracaoObra,
        saveAll,
      }}
      {...props}
    />
  )
}

export const useSimulador = () => React.useContext(SimuladorContext)