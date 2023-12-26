const cartsDAOMongo = require("../dao/cart.manager.mongo");

const storageMapper = {
  mongo: () => new cartsDAOMongo(),
  default: () => new cartsDAOMongo(),
};

const getCartsDAO = (storage) => {
  const storageFn = storageMapper[storage] || storageMapper.default;

  const dao = storageFn();

  return dao;
};

module.exports = { getCartsDAO };