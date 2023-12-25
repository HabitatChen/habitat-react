import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbol';
import { Type, Key, Ref, Props, ReactElementType } from 'shared/ReactTypes';

const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'ck'
	};

	return element;
};

export const jsx = (type: Type, config: Props, ...maybeChildren: any) => {
	let key = null;
	let ref = null;
	const props: any = {};

	for (const prop in config) {
		const val = config[prop];

		// 处理 key
		if (prop === 'key' && val !== undefined) {
			key = '' + val;
			continue;
		}

		// 处理 ref
		if (prop === 'ref' && val !== undefined) {
			ref = val;
			continue;
		}

		// 处理其他属性
		if (Object.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}

		// 处理 children
		const childrenLength = maybeChildren.length;
		props.children = childrenLength === 1 ? maybeChildren[0] : maybeChildren;
	}

	return ReactElement(type, key, ref, props);
};

export const jsxDEV = (type: Type, config: Props, ...maybeChildren: any) => {
	let key = null;
	let ref = null;
	const props: any = {};

	for (const prop in config) {
		const val = config[prop];

		// 处理 key
		if (prop === 'key' && val !== undefined) {
			key = '' + val;
			continue;
		}

		// 处理 ref
		if (prop === 'ref' && val !== undefined) {
			ref = val;
			continue;
		}

		// 处理其他属性
		if (Object.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}

		// 处理 children
		const childrenLength = maybeChildren.length;
		props.children = childrenLength === 1 ? maybeChildren[0] : maybeChildren;
	}

	return ReactElement(type, key, ref, props);
};
