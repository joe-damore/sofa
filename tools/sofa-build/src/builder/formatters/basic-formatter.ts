import BuildMessage from '../build-message';
import BuildResults from '../build-results';
import Formatter from './formatter';

/**
 * Displays basic human-readable build results.
 */
class BasicFormatter extends Formatter {

  /**
   * Displays basic human-readable build results.
   *
   * @param {BuildResults} results - Build results.
   */
  public display(results: BuildResults) {
    if (results.isSuccessful()) {
      if (results.warnings.length) {
        console.log('Build succeeded, with warnings.');
      }
      else {
        console.log('Build succeeded.');
      }
    }
    else {
      console.log('Build failed.');
    }
    console.log('----');
    console.log(`${results.errors.length} error(s), ${results.warnings.length} warning(s)`);
    console.log('----');
    const messages = [
      ...(results.errors || []),
      ...(results.warnings || [])
    ];
    messages.forEach((message: BuildMessage) => {
      console.log(`${message.message}\n`);
    });
  }
}

export default BasicFormatter;
