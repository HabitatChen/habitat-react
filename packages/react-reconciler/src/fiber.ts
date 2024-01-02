import { Key, Props, ReactElementType, Ref } from 'shared/ReactTypes';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
import { UpdateQueue } from './updateQueue';

/**
 * reconciler 的工作方式
 * 对于任何一个节点，我们需要做：
 * 1. 比较其 ReactElement 和 FiberNode 节点
 * 2. 根据比较的结果，生成 子fiberNode 和 对应的标记
 * 3. 深度优先开始递归，知道最后一个节点工作完成
 */

export class FiberNode {
	// 实例属性
	key: Key;
	type: any;
	tag: WorkTag;
	stateNode: any; // 对应的 dom 节点 TODO: 理解一下用在哪里

	// 构成 fiberNode tree 的属性
	return: FiberNode | null; // 父节点
	sibling: FiberNode | null; // 兄弟节点
	child: FiberNode | null; // 子节点
	index: number; // 在父节点中的位置 TODO: 理解一下用在哪里
	ref: Ref;

	// 工作单元
	pendingProps: Props; // 更新前的 props
	memoizedProps: Props; // 更新后的 props
	memoizedState: any; // 更新后的 state
	alternate: FiberNode | null; // 用于双缓存策略
	flags: number; // 用于标记 fiberNode 的状态
	updateQueue: UpdateQueue<any> | null; // 更新队列

	constructor(tag: any, pendingProps: Props, key: Key) {
		this.key = key;
		this.type = null;
		this.tag = tag;
		this.stateNode = null;

		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;
		this.ref = null;

		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.memoizedState = null;
		this.alternate = null;
		this.updateQueue = null;

		// 副作用
		this.flags = NoFlags;
	}
}

export class FiberRootNode {
	container: Container; // 挂载的 rootElement 这个是对象还是 dom 元素
	current: FiberNode; // 当前的 hostFiberNode
	finishedWork: FiberNode | null; // 当前的更新完成之后的 hostFiberNode

	constructor(container: Container, hostFiberNode: FiberNode) {
		this.container = container;
		this.current = hostFiberNode;
		hostFiberNode.stateNode = this;
		this.finishedWork = null;
	}
}

export function createWorkInProgress(
	current: FiberNode,
	pendingProps: Props
): FiberNode {
	// root => hostFiberNode => alternate 指向 workInProgress
	// mount 时为 null
	let wip = current.alternate;
	const { tag, key, type, updateQueue } = current;

	if (wip === null) {
		// mount
		wip = new FiberNode(tag, pendingProps, key);
		wip.stateNode = current.stateNode;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;

		// 清除副作用
		wip.flags = NoFlags;
	}

	wip.type = type;
	wip.updateQueue = updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;

	return wip;
}

/**
 * 根据 ReactElement 创建 fiberNode
 */
export function createFiberFromElement(element: ReactElementType): FiberNode {
	const { type, key, props } = element;

	let fiberTag: WorkTag = FunctionComponent;

	// <div /> => type: 'div'
	if (typeof type === 'string') {
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('createFiberFromElement: 未知的 type 类型');
	}

	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;

	return fiber;
}
