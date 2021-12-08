import MutableRegistry from './mutable-registry';

describe('MutableRegistry', () => {

  /*
   * MutableRegistry.remove()
   */
  describe('remove()', () => {
    test('Removes registry data with given ID', () => {
      const mutableRegistry = new MutableRegistry<string>();
      mutableRegistry.add('test-key', 'Test value');
      expect(mutableRegistry.exists('test-key')).toBe(true);
      mutableRegistry.remove('test-key');
      expect(mutableRegistry.exists('test-key')).toBe(false);
    });

    test('Throws error when given ID does not exist', () => {
      const registry = new MutableRegistry<string>();
      const removeNonExistentId = () => {
        registry.remove('bad-test-key');
      };
      expect(removeNonExistentId).toThrow(Error);
    });
  });

  /*
   * MutableRegistry.set()
   */
  describe('set()', () => {
    test('Sets data when given ID does not already exist', () => {
      const registry = new MutableRegistry<string>();
      registry.set('test-key', 'Test value');
      expect(registry.get('test-key')).toBe('Test value');
    });

    test('Sets data when given ID does already exist', () => {
      const registry = new MutableRegistry<string>();
      registry.add('test-key', 'First test value');
      registry.set('test-key', 'Second test value');
      expect(registry.get('test-key')).toBe('Second test value');
    });
  });
});
