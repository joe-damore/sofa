import Action from './action';
import StoreContent from './store-content';

/**
 * State store.
 *
 * Stores and facilitates access to state data.
 */
class Store {

  /**
   * Unique ID for store.
   *
   * @member {string}
   */
  private id: string;

  /**
   * Store content.
   *
   * @member {StoreContent}
   */
  private content: StoreContent;

  /**
   * Array of action tuples for this store.
   *
   * The first element represents the unique ID for the action, and the second
   * element represents the action itself.
   *
   * @member {[string, Action][]}
   */
  private actions: [string, Action][];

  /**
   * Constructor.
   *
   * @param {string} id - Unique ID for store.
   * @param {StoreContent} initialState - Initial content for store. Optional, default `{}`.
   */
  constructor(id: string, initialState?: StoreContent = {}) {
    this.id = id;
    this.content = initialState;
    this.actions = [];
  }

  /**
   * Returns the store's content.
   *
   * @return {Object} Store content.
   */
  public get() : StoreContent {
    return this.content;
  }

  /**
   * Returns the store's ID.
   *
   * @return {string} Store ID.
   */
  public getId() : string {
    return this.id;
  }

  /**
   * Applies an action.
   *
   * @param {string} actionId - ID of action to apply.
   * @param {Object} payload - Payload to apply for action. Defaults to `{}`.
   */
  public apply(actionId: string, payload?: Object = {}) {
    const action = this.getActionById(actionId);

    if (action === undefined) {
      throw new Error(`Unable to apply action '${actionId}'. Action '${actionId}' does not exist.`);
    }

    this.content = action(this.content, payload);
  }

  /**
   * Registers an action.
   *
   * @param {string} actionId - Unique ID with which to address action.
   * @param {Action} action - Action to register.
   */
  public registerAction(actionId: string, action: Action) {
    if (this.actionExists(actionId)) {
      throw new Error(`Unable to register action '${actionId}' for store '${this.id}'. Action '${actionId}' already exists.`);
    }

    this.actions.push([actionId, action]);
  }

  /**
   * Returns the action that is registered with the given ID.
   *
   * If no such action exists, `undefined` is returned.
   *
   * @param {string} actionId - ID of action to retrieve.
   *
   * @returns {Action|undefined} Action with ID `actionId`, or `undefined`.
   */
  private getActionById(actionId: string) : Action | undefined {
    /*
     * Determines whether the given action tuple has `actionId` ID.
     */
    const matchActionId = (actionTuple) : boolean => {
      return (actionTuple[0] === actionId);
    }

    return this.actions.find(matchActionId)?.[1];
  }

  /**
   * Determines whether or not an action with the given ID exists.
   *
   * @param {string} actionId - ID of action for which to check existence.
   *
   * @returns {boolean} `true` if action with given ID exists; `false` otherwise.
   */
  public actionExists(actionId: string) : boolean {
    return (this.getActionById(actionId) !== undefined);
  }
}

export default Store;
