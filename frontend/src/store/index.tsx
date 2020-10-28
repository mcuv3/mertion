import { createContext } from "react";
import { action, observable, computed, runInAction } from "mobx";
import { CashRegister } from "./CashRegister";
export class Store {
  cashRegister: CashRegister;
  constructor() {
    this.cashRegister = new CashRegister(this);
  }

  _num = observable.object({
    num: 0,
  });

  // this is computed

  get num() {
    return this._num.num;
  }

  add = action((v: any) => {
    this._num.num += v;
  });

  reset = action(() => {
    this._num = { num: 0 };
  });
}

export default createContext(new Store());
