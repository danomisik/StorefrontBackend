import { UserStore } from '../user';

const store = new UserStore();

let userId: string;

describe('User Model', () => {
  it('should have an create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('create method should add a user', async () => {
    const result = await store.create({
      username: 'johnny',
      firstname: 'Johnny',
      lastname: 'English',
      password: 'Password123'
    });
    expect(result.username).toEqual('johnny');
    expect(result.firstname).toEqual('Johnny');
    expect(result.lastname).toEqual('English');
    userId = String(result.id);
  });

  it('authneticate method should authenticate user', async () => {
    const result = await store.authenticate('johnny', 'Password123');
    if (result != null) {
      expect(result.id).toEqual(Number(userId));
      expect(result.username).toEqual('johnny');
      expect(result.firstname).toEqual('Johnny');
      expect(result.lastname).toEqual('English');
    } else {
      fail('Authentication failed');
    }
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result[0].username).toEqual('johnny');
    expect(result[0].firstname).toEqual('Johnny');
    expect(result[0].lastname).toEqual('English');
  });

  it('show method should return the correct user', async () => {
    const result = await store.show(userId as string);
    expect(result.username).toEqual('johnny');
    expect(result.firstname).toEqual('Johnny');
    expect(result.lastname).toEqual('English');
  });

  it('delete method should delete user', async () => {
    await store.delete(String(userId));
    const result = await store.index();
    expect(result).toEqual([]);
  });
});
