import Dexie, { type EntityTable } from 'dexie';
import { MomPig } from './models/MomPig';

const db = new Dexie('Piggy') as Dexie & {
  mompigs: EntityTable<MomPig, 'id'>;
};

// Schema declaration:
db.version(1).stores({
  mompigs:
    '++id, Name, TheDate, Note, FirstHeat, SecondHeat, Vitamins, Farrowing',
});

export type { MomPig };
export { db };
