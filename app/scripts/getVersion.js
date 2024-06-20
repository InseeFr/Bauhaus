const fs = require('fs');
const path = require('path');

const packageJson = JSON.parse(
	fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8')
);
console.log(packageJson.version);
