import Registry from './registry';

describe('Registry', () => {

  /*
   * Registry.get()
   */
  describe('get()', () => {

    test('Returns data when given ID exists', () => {
      const registry = new Registry<string>();
      registry.add('test-key', 'Test value');
      expect(registry.get('test-key')).toBe('Test value');
    });

    test('Returns `undefined` when given ID does not exist', () => {
      const registry = new Registry<string>();
      expect(registry.get('bad-test-key')).toBe(undefined);
    });
  });

  /*
   * Registry.exists()
   */
  describe('exists()', () => {

    test('Returns `true` when given ID does exist', () => {
      const registry = new Registry<string>();
      registry.add('test-key', 'Test value');
      expect(registry.exists('test-key')).toBe(true);
    });

    test('Returns `false` when given ID does not exist', () => {
      const registry = new Registry<string>();
      expect(registry.exists('bad-test-key')).toBe(false);
    });
  });

  /*
   * Registry.add()
   */
  describe('add()', () => {
    test('Stores data with the given ID', () => {
      const registry = new Registry<string>();
      registry.add('test-key', 'Test value');
      expect(registry.exists('test-key')).toBe(true);
      expect(registry.get('test-key')).toBe('Test value');
    });

    test('Throws error when given ID already exists', () => {
      const registry = new Registry<string>();
      registry.add('test-key', 'Test value');
      const addDuplicateId = () => {
        registry.add('test-key', 'Duplicate test value');
      };
      expect(addDuplicateId).toThrow(Error);
    });
  });
});
