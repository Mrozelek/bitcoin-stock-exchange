import databaseService, { getUserById } from './databaseService';
import { USERS_PROFILES_KEY } from '../utils/constants';

const userProfile = {
  userId: 1,
  funds: {
    USD: 1,
    ETH: 100
  }
};

describe('getUserById function', () => {
  it('should get user sucessfully', async () => {
    await databaseService.setItem(USERS_PROFILES_KEY, [userProfile]);
    expect(await getUserById(1)).toStrictEqual(userProfile);
  });

  it('should return undefined if there is no such user', async () => {
    expect(await getUserById(-1)).toBe(undefined);
  });
});
