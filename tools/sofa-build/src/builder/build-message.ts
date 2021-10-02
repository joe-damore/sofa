/**
 * Build result message.
 *
 * Typically represents a warning or an error.
 */
interface BuildMessage {
  filepath: string;
  loc: string;
  message: string;
}

export default BuildMessage;
