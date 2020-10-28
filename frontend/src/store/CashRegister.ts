// import { Store } from "./index";

import { action, computed, observable } from "mobx";

export class CashRegister {
  price = observable.box(0);

  constructor(readonly root: any) {
    this.root = root;
  }

  @computed
  get priceWithIva() {
    return this.price.get() * 1.17;
  }

  add = action(() => {
    this.price.set(this.price.get() + 1);
  });
}
