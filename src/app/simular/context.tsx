"use client";

import BigNumber from "bignumber.js";
import { useRouter, useSearchParams } from "next/navigation";
import React, { createContext, useState, useEffect } from "react"
import { AvailableCollections, useStorage } from "../contexts/storage";

interface SimuladorContextType {
  area: BigNumber | undefined, setArea: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  valor: BigNumber | undefined, setValor: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  itbi: BigNumber | undefined, setItbi: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  escrituraERegistro: BigNumber | undefined, setEscrituraERegistro: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  iptu: BigNumber | undefined, setIptu: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  valorTotal: BigNumber | undefined, setValorTotal: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  valorEntrada: BigNumber | undefined, setValorEntrada: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  taxaDeJuros: BigNumber | undefined, setTaxaDeJuros: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  mesDeInicio: BigNumber | undefined, setMesDeInicio: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  prazo: BigNumber | undefined, setPrazo: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  saveAll: () => {}
}

const SimuladorContext = createContext<SimuladorContextType>({
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
  saveAll: () => { },
} as any)

export function SimuladorProvider(props: any) {
  const searchParams = useSearchParams();
  const router = useRouter()
  const [area, setArea] = useState<BigNumber>();
  const [valor, setValor] = useState<BigNumber>();
  const [itbi, setItbi] = useState<BigNumber>();
  const [escrituraERegistro, setEscrituraERegistro] = useState<BigNumber>();
  const [iptu, setIptu] = useState<BigNumber>();
  const [valorTotal, setValorTotal] = useState<BigNumber>();
  const [valorEntrada, setValorEntrada] = useState<BigNumber>();
  const [taxaDeJuros, setTaxaDeJuros] = useState<BigNumber>();
  const [mesDeInicio, setMesDeInicio] = useState<BigNumber>();
  const [prazo, setPrazo] = useState<BigNumber>();
  const { add, update, get, isDbOk } = useStorage();

  useEffect(() => {
    if (isDbOk)
      load();
  }, [isDbOk]);

  async function load() {
    const sim = searchParams.get('sim');

    if (sim != null) {
      const simulacao = await get(AvailableCollections.simulador, sim);

      setArea(simulacao.area && BigNumber(simulacao.area));
      setValor(simulacao.valor && BigNumber(simulacao.valor));
      setItbi(simulacao.itbi && BigNumber(simulacao.itbi));
      setEscrituraERegistro(simulacao.escrituraERegistro && BigNumber(simulacao.escrituraERegistro));
      setIptu(simulacao.iptu && BigNumber(simulacao.iptu));
      setValorTotal(simulacao.valorTotal && BigNumber(simulacao.valorTotal));
      setValorEntrada(simulacao.valorEntrada && BigNumber(simulacao.valorEntrada));
      setTaxaDeJuros(simulacao.taxaDeJuros && BigNumber(simulacao.taxaDeJuros));
      setMesDeInicio(simulacao.mesDeInicio && BigNumber(simulacao.mesDeInicio));
      setPrazo(simulacao.prazo && BigNumber(simulacao.prazo));
    }
  }

  async function saveAll() {
    console.log('start save all');
    const sim = searchParams.get('sim');
    const simulacao = { area, valor, itbi, escrituraERegistro, iptu, valorTotal, valorEntrada, taxaDeJuros, mesDeInicio, prazo };

    Object.keys(simulacao).forEach(key => {
      // @ts-ignore
      if (simulacao[key]?.toNumber != null) {
        // @ts-ignore
        simulacao[key] = simulacao[key]?.toNumber();
      }
    })

    if (sim) {
      console.log(`start update id: ${sim}`);

      update(AvailableCollections.simulador, sim, simulacao)
    } else {
      console.log('start creating new');
      const { id, ok } = await add(AvailableCollections.simulador, simulacao);

      if (ok)
        router.push(`/simular?sim=${id}`);
    }

    console.log('end save all');
  }

  return (
    <SimuladorContext.Provider
      value={{
        area, setArea,
        valor, setValor,
        itbi, setItbi,
        escrituraERegistro, setEscrituraERegistro,
        iptu, setIptu,
        valorTotal, setValorTotal,
        valorEntrada, setValorEntrada,
        taxaDeJuros, setTaxaDeJuros,
        mesDeInicio, setMesDeInicio,
        prazo, setPrazo,
        saveAll,
      }}
      {...props}
    />
  )
}

export const useSimulador = () => React.useContext(SimuladorContext)