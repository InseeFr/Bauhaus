import * as fs from 'node:fs';
import path from 'node:path';

const packageJson = JSON.parse(
	fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8'),
);
console.log(packageJson.version);
