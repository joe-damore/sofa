import Registry from './registry';

/**
 * Stores data with an assigned ID for later retrieval or modification.
 *
 * Unlike `Registry`, data in mutable registries can be re-assigned and removed.
 *
 * @extends {Registry}
 */
class MutableRegistry<T> extends Registry<T> {

  /**
   * Removes data from the registry with the given ID.
   *
   * @param {string} id - ID for data to remove.
   */
  public remove(id: string) {
    if (!this.exists(id)) {
      // TODO Document thrown error via JSDoc.
      throw new Error(`Failed to delete from registry. ID '${id}' does not exist.`);
    }
    this.data.delete(id);
  }

  /**
   * Sets registry data for the given ID.
   *
   * Like `Registry::add()`, this method can be used to add new data to the
   * registry. Unlike `Registry::add()`, however, this method can also be used
   * to assign new data to an ID that already exists in the registry.
   *
   * @param {string} id - Unique ID to assign for data.
   * @param {T} data - Data to store in registry.
   */
  public set(id: string, data: T) {
    if (this.exists(id)) {
      this.remove(id);
    }
    this.add(id, data);
  }
}

export default MutableRegistry;
