"use client";

import "./page.scss";
// import { add, multiply, divide, format } from "mathjs";

import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { Layout } from "./shared/layout";
import { useStorage } from "./contexts/storage";
import { Simulacao } from "./utils/db-repository";
import Link from "next/link";
import { SimuladorUtil } from "./utils/simulador";
import { Loader } from "./components/loader";

function Home() {
  const { isDbOk, repository } = useStorage();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [simulacoes, setSimulacoes] = useState<Simulacao[]>([]);

  useEffect(() => {
    isDbOk && load();
  }, [isDbOk]);

  async function load() {
    const result = await repository.list();

    result.forEach(x => {
      x.valorTotal = SimuladorUtil.valorTotal(x.valor, x.itbi, x.escrituraERegistro, x.iptu, SimuladorUtil.MESES_ATE_VENDER)
    })

    console.log(result);

    setSimulacoes(result);
    setIsLoading(false);
  }

  return (
    <main className="main container">
      <section className="home m-5">
        {isLoading
          ? (<section className="cards"><Loader /></section>)
          : (
            simulacoes.length === 0
              ? (<div className="alert alert-info" role="alert">Nenhuma simulação encontrada</div>)
              : (
                <section className="cards">
                  {simulacoes.map(x => (
                    <div key={x.id.toNumber()} className="card m-3">
                      <div className="card-body">
                        <h5 className="card-title">{x.titulo}</h5>
                        <h6 className="card-subtitle mb-2 text-body-secondary">Custo Total Terreno: R$ {x.valorTotal?.toFormat(2)}</h6>
                        <p className="card-text">Area terreno: {x.area?.toNumber()} m²</p>
                        <Link href={`/simular?sim=${x.id}`} className="btn btn-secondary">Ver simulação</Link>
                      </div>
                    </div>
                  ))}
                </section>
              )
          )}
      </section>
      <section className="qea my-4">
        <h3 className="my-4">Perguntas e respostas</h3>
        <ul className="list-group">
          <li className="list-group-item">
            <h5>Como faço para criar um orçamento detalhado?</h5>
            Para criar um orçamento detalhado, acesse a seção de orçamentos no sistema. Insira os itens necessários, como materiais, mão de obra e outros recursos. O sistema calculará automaticamente os custos com base nas quantidades e preços definidos.
          </li>
          <li className="list-group-item">
            <h5>Posso controlar os gastos por centro de custo?</h5>
            Sim! O sistema permite que você associe cada despesa a um centro de custo específico. Dessa forma, você pode acompanhar os gastos de acordo com as diferentes áreas do projeto.
          </li>
          <li className="list-group-item">
            <h5>Como faço para solicitar cotações de fornecedores?</h5>
            Na seção de compras, você pode criar solicitações de cotação para os materiais necessários. O sistema enviará essas solicitações aos fornecedores cadastrados, facilitando o processo de comparação e escolha.
          </li>
          <li className="list-group-item">
            <h5>Como acompanho o progresso da obra?</h5>
            O sistema possui um módulo de acompanhamento de obra. Nele, você pode inserir informações sobre o avanço físico, marcos importantes e atualizações do cronograma. Isso ajuda a manter todos os envolvidos informados.
          </li>
          <li className="list-group-item">
            <h5>Existe um portal do cliente para compartilhar informações?</h5>
            Sim! O portal do cliente permite que os clientes acessem informações relevantes sobre a obra, como fotos, relatórios de progresso e documentos. É uma maneira eficiente de manter a transparência e a comunicação.
          </li>
          <li className="list-group-item">
            <h5>Como registro informações sobre os funcionários?</h5>
            No módulo de gestão de funcionários, você pode adicionar detalhes sobre cada membro da equipe, incluindo dados pessoais, documentos e alocação em projetos específicos.
          </li>
          <li className="list-group-item">
            <h5>O sistema se integra com outras ferramentas?</h5>
            Sim! Ele pode ser integrado com outros módulos, como recursos humanos, suprimentos e financeiro. Isso garante uma visão completa e centralizada de todas as operações.
          </li>
        </ul>
      </section>
    </main>
  );
}



export default function Page() {

  return (
    <Layout>
      <Home />
    </Layout>
  );
}
