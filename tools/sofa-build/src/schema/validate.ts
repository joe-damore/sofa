import Ajv, { ErrorObject } from 'ajv';
import schema from './schema';

/**
 * Validates the given data against a Sofa build file schema.
 *
 * @param {Object} data - Data to validate.
 *
 * @return {ErrorObject[] | null} Array of ErrorObjects, or null if there are no errors.
 */
const validate = (data: object): ErrorObject[] | null => {
  const ajv = new Ajv();
  const validation = ajv.compile(schema);

  validation(data);

  let errors = ajv.errors;
  if (errors === undefined) {
    return null;
  }
  return errors;
};

export default validate;
