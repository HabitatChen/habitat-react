import path from 'path';
import fs from 'fs';

import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';

// packages 路径
const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

// 根据包名 返回包的路径 resolvePkgPath('react') => packages/react
export function resolvePkgPath(pkgName, isDist) {
	if (isDist) {
		return `${distPath}/${pkgName}`;
	}
	return `${pkgPath}/${pkgName}`;
}

// 根据包的路径 获取其 package.json 对象
export const getPackageJSON = (pkgName) => {
	const path = `${resolvePkgPath(pkgName, false)}/package.json`;
	const str = fs.readFileSync(path, { encoding: 'utf-8' });

	return JSON.parse(str);
};

// 输出通用的 plugins
export function getBaseRollupPlugins({ typescript = {} } = {}) {
	// 1. 解析 commonjs  的 plugin;
	// 2. ts代码转移成js代码的 plugin;
	return [cjs(), ts(typescript)];
}
