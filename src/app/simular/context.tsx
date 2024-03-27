"use client";

import BigNumber from "bignumber.js";
import React, { createContext, useState, useEffect } from "react"

interface SimuladorContextType {
  area: BigNumber | undefined,
  setArea: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  valor: BigNumber | undefined,
  setValor: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  itbi: BigNumber | undefined,
  setItbi: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  escrituraERegistro: BigNumber | undefined,
  setEscrituraERegistro: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  iptu: BigNumber | undefined,
  setIptu: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  valorTotal: BigNumber | undefined,
  setValorTotal: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  valorEntrada: BigNumber | undefined,
  setValorEntrada: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  taxaDeJuros: BigNumber | undefined,
  setTaxaDeJuros: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  mesDeInicio: BigNumber | undefined,
  setMesDeInicio: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
  prazo: BigNumber | undefined,
  setPrazo: React.Dispatch<React.SetStateAction<BigNumber | undefined>>,
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
} as any)

export function SimuladorProvider(props: any) {
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
      }}
      {...props}
    />
  )
}

export const useSimulador = () => React.useContext(SimuladorContext)