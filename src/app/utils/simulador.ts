import BigNumber from "bignumber.js";
import extenso from "extenso";
import { Options, TipoCustoConstrucao } from "./types.d";

export class SimuladorUtil {
  public static readonly MESES_ATE_VENDER = BigNumber(26);
  public static readonly MESES_DO_ANO = BigNumber(12);

  public static valorTotal(valor?: BigNumber, itbi?: BigNumber, escrituraERegistro?: BigNumber, iptu?: BigNumber, mesesAteVender?: BigNumber): BigNumber {
    if (!valor || !valor || !itbi || !escrituraERegistro || !iptu || !mesesAteVender)
      return BigNumber(0);

    return valor.plus(valor.times(itbi.plus(escrituraERegistro))).plus(iptu.times(mesesAteVender.div(this.MESES_DO_ANO)));
  }

  public static custoObra(areaConstruidaEquivalente?: BigNumber, custoCUB?: BigNumber, custoHistoricoInterno?: BigNumber, custoOrcamento?: BigNumber, tipoDeCustoEscolhido?: TipoCustoConstrucao): BigNumber {
    let custo = custoCUB;

    if (tipoDeCustoEscolhido === TipoCustoConstrucao.HISTORICO_INTERNO)
      custo = custoHistoricoInterno
    else if (tipoDeCustoEscolhido === TipoCustoConstrucao.ORCAMENTO)
      custo = custoOrcamento

    if (custo && areaConstruidaEquivalente)
      return custo.times(areaConstruidaEquivalente);
    else
      return new BigNumber(0);
  }

  public static extenso(number?: number | string | BigNumber | null, options?: Options): string {
    if (number instanceof BigNumber)
      number = number?.integerValue()?.toNumber();

    if (number == null || isNaN(number as any) || !isFinite(number as any)) return '';

    return extenso(number, options);
  }
}