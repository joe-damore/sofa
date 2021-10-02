const packages = require('./packages.js');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// BOOTSTRAP SETTINGS
//
// Tweaking these constants can alter the behavior of the bootstrap process.
//
// This can be useful for troubleshooting purposes, but otherwise these values
// should probably be left as-is.
//
// Install timeout, in seconds.
// The amount of time an individual package's module installation can run before
// giving up.
const installTimeout = 90;
//
// Build timeout, in seconds.
// The amount of time an individual package build can run before giving up.
const buildTimeout = 90;
// END OF BOOTSTRAP SETTINGS

const numPackages = packages.reduce((acc, cur) => {
  return (acc + cur.packages.length);
}, 0);

console.info(`Sofa Bootstrap\n`);
console.info(`Thank you for your interest in Sofa!\n`);
console.info(`Building ${numPackages} package(s)...`);

let packageCount = 0;
let failures = [];
let successes = 0;

packages.forEach((packageCategory) => {
  console.info(`\n${packageCategory.name}:`);

  packageCategory.packages.forEach((package, index) => {
    packageCount += 1;
    const packageNumber = (index + packageCount);
    const packageName = package.name;
    const packagePath = path.resolve(process.cwd(), package.path);
    console.info(`  ${packageNumber}/${numPackages} - Bootstrapping '${packageName}':`);

    let statusString = `Validating package scripts for '${packageName}'`;
    try {
      process.stdout.write(`      [ ] ${statusString}...`);
      const packageJsonPath = path.resolve(packagePath, 'package.json');
      const packageJsonData = fs.readFileSync(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageJsonData);

      if (!packageJson?.scripts?.build) {
        throw new Error(`No 'build' script exists for '${packageName}'.`);
      }
    }
    catch (e) {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`      [X] ${statusString}\n`);

      failures.push({
        name: packageName,
        stage: 'validating package',
        message: e.message,
      });

      // Do not proceed with package build process.
      return;
    }
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`      [✓] ${statusString}\n`);

    statusString = `Installing modules for '${packageName}'`;
    try {
      process.stdout.write(`      [ ] ${statusString}...`);
      execSync('yarn install', {
        cwd: packagePath,
        windowsHide: true,
        timeout: (buildTimeout * 1000),
        stdio: 'ignore',
      });
    }
    catch (e) {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`      [X] ${statusString}\n`);

      failures.push({
        name: packageName,
        stage: 'installing modules',
        message: e.message,
      });

      // Do not proceed with package build process.
      return;
    }
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`      [✓] ${statusString}\n`);

    statusString = `Building '${packageName}'`;
    try {
      process.stdout.write(`      [ ] ${statusString}...`);
      execSync('yarn build', {
        cwd: packagePath,
        windowsHide: true,
        timeout: (buildTimeout * 1000),
        stdio: 'ignore',
      });
    }
    catch (e) {
      // Do not proceed with package build process.
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`      [X] ${statusString}\n`);

      failures.push({
        name: packageName,
        stage: 'building package',
        message: e.message,
      });

      // Do not proceed with package build process.
      return;
    }

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`      [✓] ${statusString}\n`);

    successes += 1;
  });
});

const finishedMessage = `Bootstrapped ${numPackages} package(s).`;
const failureMessage = `${failures.length} packages failed to be bootstrapped.`;

const resultMessage = (() => {
  if (failures.length > 0) {
    return `${finishedMessage} ${failureMessage}`;
  }
  return `${finishedMessage}`;
})();

console.log('');
if (!failures.length) {
  console.info(resultMessage);
  console.info('');
  console.info('You are now ready to run and develop Sofa projects!');
}
else {
  console.error(resultMessage);
  const failureInfo = failures
    .map((failure) => {
      return `- ${failure.name}, while ${failure.stage}: ${failure.message}`;
    })
    .join('\n');

  console.info('\nErrors:')
  console.info(failureInfo);
}

if (failures.length) {
  process.exit(1);
}
