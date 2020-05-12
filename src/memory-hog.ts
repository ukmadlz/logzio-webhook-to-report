import { v4 as uuid } from 'uuid';
import * as Datastore from 'nedb';

const MemoryHog = async (records: number): Promise<unknown> => {
  const recordsToInsert = await Array.apply(0, Array(Number(records))).map(() => {
    return { uuid: uuid(), date: new Date() };
  });
  const success = new Promise((resolve, reject) => {
    const db = new Datastore();
    return db.insert(recordsToInsert, (error, newDocs) => {
      if(error) return reject(error);
      return resolve(newDocs);
    });
  });
  return await success;
};

export default MemoryHog;