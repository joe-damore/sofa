import Project from './project';

/**
 * Displays a summary of a project.
 */
class ProjectSummary {

  /**
   * Project to summarize.
   *
   * @type Project
   */
  public project: Project;

  /**
   * Constructor.
   *
   * @param {Project} project - Project to summarize.
   */
  constructor(project: Project) {
    this.project = project;
  }

  /**
   * Displays project summary.
   */
  public display() {
    console.log(this.project.name);
    console.log(this.project.path);
    console.log('-------------');
    console.log(`Type          : ${this.project.getType()}`);
    if (this.project.lib) {
      console.log(`Lib Name      : ${this.project.lib.objectName}`);
    }
    if (this.project.app) {
      console.log(`Friendly Name : ${this.project.app.friendlyName}`);
    }
    console.log(`Build Backend : ${this.project.build.backend}`);
    console.log(`Build Mode    : `);
  }
}

export default ProjectSummary;
