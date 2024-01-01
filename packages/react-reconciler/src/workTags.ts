export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;

export const FunctionComponent = 0; // 函数组件
export const HostRoot = 3; // 挂载的根节点

// 普通的 非根节点的 <div>
export const HostComponent = 5; // 挂载的普通节点

// <div>123</div> 里面的123
export const HostText = 6; // 挂载的文本节点
