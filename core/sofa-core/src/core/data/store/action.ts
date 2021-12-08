/**
 * A function which can be used as a store action.
 *
 * An action must take input data `inputData` and output new data. It can
 * optionally accept a `payload` object which contains arbitrary data which
 * may be necessary for the action's logic.
 *
 * @param {T} inputData
 */
type Action<T> = (inputData: T, payload: Object) => T;

export default Action;
