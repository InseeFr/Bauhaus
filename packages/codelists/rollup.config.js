import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';

const { dependencies } = require('./package.json');
const { dependencies: rootDependencies } = require('../../package.json');

export default {
	input: 'src/index.js',
	output: {
		name: 'bauhaus-codelists',
		file: 'dist/index.js',
		format: 'cjs',
		strict: false,

		globals: {
			react: 'React',
		},
		sourcemap: true,
	},
	plugins: [
		builtins(),
		postcss({ extract: true }),
		resolve(),
		babel({
			exclude: 'node_modules/**',
		}),
		commonjs({
			namedExports: {
				'react-dom': ['createPortal', 'findDOMNode'],
				'node_modules/react-is/index.js': ['isValidElementType'],
			},
		}),
		replace({
			exclude: 'node_modules/**',
			ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
		}),
	],
	external: [
		'@inseefr/wilco',
		'react',
		...Object.keys(dependencies),
		...Object.keys(rootDependencies),
	],
};
