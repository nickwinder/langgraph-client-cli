import * as packageJson from '../../package.json';

export function getVersion(): string {
  return packageJson.version;
}