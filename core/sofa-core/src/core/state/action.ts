import StoreContent from './store-content';

/**
 * State action.
 *
 * Describes a function which takes input state content, with an optional
 * payload, and outputs new state.
 *
 * @param {StoreContent} inputState - Input state for action.
 * @param {Object} payload - Optional payload for action.
 *
 * @returns {StoreContent} New state.
 */
type Action = (inputState: StoreContent, payload: Object = {}) => StoreContent;

export default Action;
