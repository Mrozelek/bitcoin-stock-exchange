import localforage from 'localforage';

const database = {
  async getItem(key) {
    return localforage.getItem(key);
  },
  async setItem(key, value) {
    return localforage.setItem(key, value);
  }
};

export default database;
