import BuildMessage from './build-message';

class BuildResults {
  public errors: BuildMessage[] = [];
  public warnings: BuildMessage[] = [];

  public constructor(errors: BuildMessage[], warnings: BuildMessage[]) {
    this.errors = errors;
    this.warnings = warnings;
  }

  public hasErrors(): boolean {
    return (this.errors.length > 0);
  }

  public hasWarnings(): boolean {
    return (this.warnings.length > 0);
  }

  public isSuccessful(): boolean {
    return !(this.hasErrors());
  }
}

export default BuildResults;
