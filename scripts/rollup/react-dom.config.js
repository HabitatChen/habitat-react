// 1. 获取对应的包中的 package.json 中的 name 字段;
// 2. 根据 name 字段，生成包所在的目录地址;
// 3. 将 react 和 jsx 打包到不同的文件地址;

import {
	getPackageJSON,
	resolvePkgPath,
	getBaseRollupPlugins
} from './utils.js';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import alias from '@rollup/plugin-alias';

// 获取 react/package.json 中的 name module 字段
const { name, module } = getPackageJSON('react-dom');

// 获取包所在的位置
const pkgPath = resolvePkgPath(name);

// react 产物地址
const pkgDistPath = resolvePkgPath('react-dom', true);

export default [
	// 1. react-dom 包
	{
		input: `${pkgPath}/${module}`,
		output: [
			{
				file: `${pkgDistPath}/index.js`,
				name: 'index.js',
				format: 'umd'
			},
			{
				file: `${pkgDistPath}/client.js`,
				name: 'client.js',
				format: 'umd'
			}
		],
		plugins: [
			...getBaseRollupPlugins(),
			alias({
				entries: {
					hostConfig: `${pkgPath}/src/hostConfig.ts`
				}
			}),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					peerDependencies: {
						react: version
					},
					version,
					main: 'index.js'
				})
			})
		]
	}
];
