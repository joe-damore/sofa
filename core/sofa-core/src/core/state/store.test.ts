import Store from './store';

describe('Store', () => {

  let storeDefaultContent = null;
  let storeNumericContent = null;

  // Create some Store instances for tests.
  beforeEach(() => {
    storeDefaultContent = new Store('test-store-a');
    storeNumericContent = new Store('test-store-b', 5);
  });

  describe('getId()', () => {
    test('Returns expected store ID', () => {
      expect(storeDefaultContent.getId()).toBe('test-store-a');
      expect(storeNumericContent.getId()).toBe('test-store-b');
    });
  });

  describe('get()', () => {
    test('Returns expected store data', () => {
      expect(storeDefaultContent.get()).toStrictEqual({});
      expect(storeNumericContent.get()).toStrictEqual(5);
    });
  });

  describe('apply()', () => {
    beforeEach(() => {
      storeDefaultContent.registerAction('new-action-a', (input) => 5);
    })

    test('Applies action when action is registered', () => {
      storeDefaultContent.apply('new-action-a');
      expect(storeDefaultContent.get()).toStrictEqual(5);
    });

    test('Throws `Error` when action is not registered', () => {
      expect(() => storeDefaultContent.apply('new-action-b')).toThrow(Error);
    });
  });

  describe('registerAction()', () => {
    beforeEach(() => {
      storeDefaultContent.registerAction('new-action-a', (input) => 5);
    });

    test('Registers action when ID is unique', () => {
      storeDefaultContent.registerAction('new-action-b', (input) => 6);
      expect(storeDefaultContent.actionExists('new-action-b')).toBe(true);
    });

    test('Throws `Error` when action is already registered', () => {
      expect(() => storeDefaultContent.registerAction('new-action-a', (input) => 7)).toThrow(Error);
    })
  });

  describe('actionExists()', () => {
    beforeEach(() => {
      storeDefaultContent.registerAction('new-action', (input) => 5);
    });

    test('Returns `true` when action exists', () => {
      expect(storeDefaultContent.actionExists('new-action')).toBe(true);
    });

    test('Returns `false` when action does not exist', () => {
      expect(storeDefaultContent.actionExists('nonexistent-action')).toBe(false);
    });
  });
});
