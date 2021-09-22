import localforage from 'localforage';
import { USERS_PROFILES_KEY } from '../utils/constants';

const database = {
  async getItem(key) {
    return localforage.getItem(key);
  },
  async setItem(key, value) {
    return localforage.setItem(key, value);
  }
};

export const getUserById = async (userId) => (
  await database.getItem(USERS_PROFILES_KEY)).find((user) => user.userId === userId);

export const setUser = async (profile) => {
  const usersProfiles = await database.getItem(USERS_PROFILES_KEY);
  const userIndex = usersProfiles.findIndex((user) => user.userId === profile.userId);

  if (userIndex === -1) {
    usersProfiles.push(profile);
  } else {
    usersProfiles[userIndex] = profile;
  }

  await database.setItem(USERS_PROFILES_KEY, usersProfiles);
};

export default database;
