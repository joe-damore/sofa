import { Registry } from '@src/core/data/registry';
import Action from './action';

/**
 * Stores and facilitates access to data.
 */
class Store<T> {

  /**
   * Data managed by this store.
   *
   * @member {T}
   */
  private data: T;

  /**
   * Registry of actions that can be applied to the store.
   *
   * @member {Registry<Action<T>>}
   */
  private actions: Registry<Action<T>>;

  /**
   * Constructor.
   *
   * @param {T} initialData - Initial data for store.
   */
  constructor(initialData: T) {
    this.data = initialData;
    this.actions = new Registry<Action<T>>();
  }

  /**
   * Returns the data in the store.
   *
   * @returns {T} Store data.
   */
  public get(): T {
    return this.data;
  }

  /**
   * Returns a function which always returns the store's current data.
   *
   * @returns {() => T} Bound getter function.
   */
  public bind(): () => T {
    const boundStore = this;
    return () => {
      return boundStore.get();
    };
  }

  /**
   * Adds an action that can be applied to the store.
   *
   * @param {string} id - ID to assign to action.
   * @param {Action<T>} action - Action to add.
   */
  public addAction(id: string, action: Action<T>) {
    this.actions.add(id, action);
  }

  /**
   * Determines whether an action with the given ID exists for the store.
   *
   * @param {string} id - ID for action for which to check existence.
   *
   * @returns {boolean} `true` if action with given ID exists, `false` otherwise.
   */
  public hasAction(id: string) {
    return this.actions.exists(id);
  }

  /**
   * Applies an action with the given ID.
   *
   * @param {string} id - ID of action to apply.
   * @param {Object} payload - Payload to pass to action. Defaults to `{}`.
   */
  public apply(id: string, payload: object = {}) {
    const action = this.actions.get(id);
    if (!action) {
      // TODO Document thrown error via JSDoc.
      throw new Error(`Failed to apply action. Action '${id}' does not exist for store.`);
    }
    this.data = action(this.data, payload);
  }
}

export default Store;
