import { ProductStore } from '../product';

const store = new ProductStore();

let productId: string;

describe('Product Model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('create method should add a product', async () => {
    const result = await store.create({
      name: 'Jo Nesbo: Macbeth',
      price: 15,
      url: 'http:test.com/img.png',
      description: 'Great book'
    });
    expect(result.name).toEqual('Jo Nesbo: Macbeth');
    expect(result.price).toEqual(15);
    productId = String(result.id);
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThan(0);
    //expect(result[0].name).toEqual('Jo Nesbo: Macbeth');
    //expect(result[0].price).toEqual(15);
  });

  it('show method should return the correct product', async () => {
    const result = await store.show(productId);
    expect(result.name).toEqual('Jo Nesbo: Macbeth');
    expect(result.price).toEqual(15);
  });

  it('delete method should remove the product', async () => {
    await store.delete(productId);
    const result = await store.show(productId);
    expect(result).not.toBeDefined();
  });
});
