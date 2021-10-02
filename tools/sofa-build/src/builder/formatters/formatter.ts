import BuildResults from '../build-results';

/**
 * Build result formatter.
 */
abstract class Formatter {

  /**
   * Display formatted build messages.
   *
   * @param {BuildResults} results - Build results.
   */
  public abstract display(results: BuildResults): void;

}

export default Formatter;
