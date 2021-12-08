/**
 * Stores data with an assigned ID string for later retrieval.
 *
 * Once data is added to the registry, it cannot be removed or re-assigned.
 * See `MutableRegistry` if you need to be able to modify and re-assign
 * registry data.
 */
class Registry<T> {

  /**
   * Map of data stored by this registry.
   *
   * @member {Map<T>}
   */
  protected data: Map<string, T>;

  /**
   * Constructor.
   */
  constructor() {
    this.data = new Map<string, T>();
  }

  /**
   * Returns the data assigned to the given ID.
   *
   * If no data exists in the registry with ID `id`, this function returns
   * `undefined`.
   *
   * @param {string} id - Unique ID for data being retrieved.
   *
   * @returns {T|undefined} Data assigned to ID `id`, or `undefined`.
   */
  public get(id: string): T | undefined {
    if (this.data.has(id)) {
      return this.data.get(id);
    }
    return undefined;
  }

  /**
   * Determines whether data with ID `id` exists in this registry.
   *
   * @param {string} id - Unique ID for data.
   *
   * @returns {boolean} `true` if data exists for ID, `false` otherwise.
   */
  public exists(id: string): boolean {
    return this.get(id) !== undefined;
  }

  /**
   * Adds data to the registry with a given ID.
   *
   * @param {string} id - Unique ID to assign for data.
   * @param {T} data - Data to store in registry.
   */
  public add(id: string, data: T) {
    if (this.exists(id)) {
      // TODO Document thrown error via JSDoc.
      throw new Error(`Failed to add to registry. ID '${id}' already exists.`);
    }
    this.data.set(id, data);
  }
}

export default Registry;
