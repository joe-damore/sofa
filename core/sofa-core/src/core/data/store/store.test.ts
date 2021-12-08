import Store from './store';

describe('Store', () => {

  /*
   * Store.get()
   */
  describe('get()', () => {
    test('Returns stored data', () => {
      const store = new Store<number>(0);
      store.addAction('set_to_10', (data) => 10);
      expect(store.get()).toStrictEqual(0);
      store.apply('set_to_10');
      expect(store.get()).toStrictEqual(10);
    });
  });

  /*
   * Store.bind()
   */
  describe('bind()', () => {
    test('Returns a function which returns expected data', () => {
      const store = new Store<number>(0);
      const getStoreData = store.bind();
      store.addAction('add_5', (data) => data + 5);
      expect(getStoreData()).toStrictEqual(0);
      store.apply('add_5');
      expect(getStoreData()).toStrictEqual(5);
      store.apply('add_5');
      expect(getStoreData()).toStrictEqual(10);
    });
  });

  /*
   * Store.addAction()
   */
  describe('addAction()', () => {
    test('Action with given ID exists', () => {
      const store = new Store<number>(0);
      store.addAction('add_5', (data) => data + 5);
      expect(store.hasAction('add_5')).toBe(true);
    });

    test('Action with given ID performs expected action', () => {
      const store = new Store<number>(0);
      store.addAction('add_5', (data) => data + 5);
      store.addAction('add_10', (data) => data + 10);
      store.apply('add_5');
      expect(store.get()).toBe(5);
      store.apply('add_10');
      expect(store.get()).toBe(15);
    });

    test('Throws error when given ID already exists', () => {
      const store = new Store<number>(0);
      store.addAction('add_5', (data) => data + 5);
      const addDuplicateAction = () => {
        store.addAction('add_5', (data) => data + 5);
      }
      expect(addDuplicateAction).toThrow(Error);
    });
  });

  /*
   * Store.hasAction()
   */
  describe('hasAction()', () => {
    test('Returns `true` when action exists', () => {
      const store = new Store<number>(0);
      store.addAction('valid_action', (data) => data + 5);
      expect(store.hasAction('valid_action')).toBe(true);
    });

    test('Returns `false` when action does not exist', () => {
      const store = new Store<number>(0);
      expect(store.hasAction('invalid_action')).toBe(false);
    });
  });

  /*
   * Store.apply()
   */
  describe('apply()', () => {
    test('Data is updated to reflect applied actions', () => {
      const store = new Store<number>(0);
      store.addAction('add_5', (data) => data + 5);
      store.addAction('add_10', (data) => data + 10);
      store.addAction('add_custom', (data, payload) => data + payload.custom || 0);
      store.apply('add_5');
      expect(store.get()).toBe(5);
      store.apply('add_10');
      expect(store.get()).toBe(15);
      store.apply('add_custom', { custom: 30 });
      expect(store.get()).toBe(45);
    });

    test('Throws error when given action does not exist', () => {
      const store = new Store<number>(0);
      const applyInvalidAction = () => {
        store.apply('invalid_action');
      };
      expect(applyInvalidAction).toThrow(Error);
    });
  });
});
