import BuildResults from './build-results';
import Formatter from './formatters/formatter';

/**
 * Displays build results in various formats.
 */
class BuildReporter {

  /**
   * Build results to be displayed.
   *
   * @type BuildResults
   */
  public results: BuildResults;

  /**
   * Build results formatter.
   *
   * @type Formatter
   */
  public formatter: Formatter;

  /**
   * Constructor.
   *
   * @param {BuildResults} results - Build results.
   * @param {Formatter} formatter - Build results formatter.
   */
  constructor(results: BuildResults, formatter: Formatter) {
    this.results = results;
    this.formatter = formatter;
  }

  public display() {
    this.formatter.display(this.results);
  }
}

export default BuildReporter;
