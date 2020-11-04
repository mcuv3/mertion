import { Mert } from "../generated/graphql";
import { action, computed, observable } from "mobx";

export class MertStore {
  @observable
  _mert?: Partial<Mert>;

  constructor(readonly root: any) {
    this.root = root;
  }
  @computed
  get mert() {
    return this._mert;
  }

  setMert = action((mert: Partial<Mert>) => {
    this._mert = mert;
    //this.price.set(this.price.get() + 1);
  });
}
