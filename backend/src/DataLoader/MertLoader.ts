import DataLoader from "dataloader";
import { Mert } from "../entities";

export const mertLoader = () =>
  new DataLoader<string, Mert>(async (mertsIds) => {
    const merts = await Mert.findByIds(mertsIds as string[]);
    const formatMerts: Record<string, Mert> = {};
    merts.map((m) => {
      formatMerts[m.id] = m;
    });
    return mertsIds.map((i) => formatMerts[i]);
  });
