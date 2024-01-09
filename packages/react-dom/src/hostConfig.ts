export type Container = Element;
export type Instance = Element;

export const createInstance = (type: string): Instance => {
	// TODO: 处理 props
	const element = document.createElement(type);
	return element;
};

export const createTextInstance = (content: string) => {
	return document.createTextNode(content);
};

export const appendInitialChild = (
	parent: Instance | Container,
	child: Instance
) => {
	// FIXME: 胶水层
	if (!parent || !child) {
		return;
	}
	parent.appendChild(child);
};

export const appendChildToContainer = appendInitialChild;
