import BigNumber from "bignumber.js";

export class SimuladorUtil {
  public static readonly MESES_ATE_VENDER = BigNumber(26);
  public static readonly MESES_DO_ANO = BigNumber(12);

  public static valorTotal(valor?: BigNumber, itbi?: BigNumber, escrituraERegistro?: BigNumber, iptu?: BigNumber, mesesAteVender?: BigNumber): BigNumber {
    if (!valor || !valor || !itbi || !escrituraERegistro || !iptu || !mesesAteVender)
      return BigNumber(0);

    return valor.plus(valor.times(itbi.plus(escrituraERegistro))).plus(iptu.times(mesesAteVender.div(this.MESES_DO_ANO)));
  }
}