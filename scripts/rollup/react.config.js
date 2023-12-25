// 1. 获取对应的包中的 package.json 中的 name 字段;
// 2. 根据 name 字段，生成包所在的目录地址;
// 3. 将 react 和 jsx 打包到不同的文件地址;

import {
	getPackageJSON,
	resolvePkgPath,
	getBaseRollupPlugins
} from './utils.ts';
import generatePackageJson from 'rollup-plugin-generate-package-json';

// 获取 react/package.json 中的 name module 字段
const { name, module } = getPackageJSON('react');

// 获取包所在的位置
const pkgPath = resolvePkgPath(name);

// react 产物地址
const pkgDistPath = resolvePkgPath('react', true);

export default [
	// 1. react 包
	{
		input: `${pkgPath}/${module}`,
		output: {
			file: `${pkgDistPath}/index.js`,
			name: 'index.js',
			format: 'umd'
		},
		plugins: [
			...getBaseRollupPlugins(),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					main: 'index.js'
				})
			})
		]
	},
	// 2. jsx-runtime & jsx-dev-runtime
	{
		input: `${pkgPath}/src/jsx.ts`,
		output: [
			// jsx-runtime
			{
				file: `${pkgDistPath}/jsx-runtime.js`,
				name: 'jsx-runtime.js',
				format: 'umd'
			},
			// jsx-dev-runtime
			{
				file: `${pkgDistPath}/jsx-dev-runtime.js`,
				name: 'jsx-dev-runtime.js',
				format: 'umd'
			}
		],
		plugins: getBaseRollupPlugins()
	}
];
