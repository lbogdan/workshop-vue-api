const fs = require('fs-extra');

const dataFile = 'data/transactions.json';

function getAll() {
  return fs.readJson(dataFile);
}

function save(transactions) {
  return fs.writeJson(dataFile, transactions);
}

async function create(data) {
  const transactions = await getAll();
  const lastId = transactions.reduce(
    (id, transaction) => Math.max(id, transaction.id),
    0,
  );
  const dataWithId = {
    id: lastId + 1,
    ...data,
  };
  transactions.push(dataWithId);
  await save(transactions);
  return dataWithId;
}

async function get(id) {
  const transactions = await getAll();
  return transactions.find((transaction) => transaction.id === id);
}

async function update({ id, ...data }) {
  let transactions = await getAll();
  let result;
  transactions = transactions.map((transaction) => {
    if (transaction.id === id) {
      result = { ...transaction, ...data };
      return result;
    }
    return transaction;
  });
  await save(transactions);
  return result;
}

async function remove(id) {
  let transactions = await getAll();
  let found = false;
  transactions = transactions.filter((transaction) => {
    if (transaction.id === id) {
      found = true;
      return false;
    }
    return true;
  });
  await save(transactions);
  return found;
}

/* eslint-disable */
module.exports = {
  getAll,
  // C
  create,
  // R
  get,
  // U
  update,
  // D
  remove,
};
