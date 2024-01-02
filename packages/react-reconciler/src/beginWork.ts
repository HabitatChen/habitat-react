import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { Update, processUpdate } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { mountChildFiber, reconcileChildFiber } from './childFiber';

/**
 * 向下递归，返回子节点，没有子节点时，返回null
 * 根据传入的 父fiberNode 的tag类型去处理不同的节点类型
 * @returns	FiberNode | null
 */
export const beginWork = (wip: FiberNode): FiberNode | null => {
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.warn('beginWork: 未知的 tag 类型');
			}
			return null;
	}
};

/**
 * 对于 HostRoot 节点来说 => 对应的 ReactElement 是挂载的节点
 * 1. 需要计算最新的状态 => processUpdate
 * 2. 返回子节点 => reconcilerChildren => current fiberNode + ReactElement = wip fiberNode
 * @param wip
 * @returns
 */
function updateHostRoot(wip: FiberNode): FiberNode | null {
	const baseState = wip.memoizedProps; // mount 时 为 null
	const updateQueue = wip.updateQueue;
	const pending = updateQueue?.shared.pending as Update<Element>; // mount 时 update 为更新的 element  => <App />
	updateQueue!.shared.pending = null; // 清空 pending

	// 此时 memoizedState 为 <App />
	const { memoizedState } = processUpdate(baseState, pending);
	wip.memoizedState = memoizedState;

	// nextChildren 即为 子节点ReactElement
	const nextChildren = wip.memoizedState; // <App />

	reconcilerChildren(wip, nextChildren);

	return wip.child;
}

/**
 * 对于 HostComponent 节点 只需要返回子节点，因为 mount 的时候，值针对 HostRoot 生成了 update
 * @param wip
 * @returns
 */
function updateHostComponent(wip: FiberNode): FiberNode | null {
	// 获取 子节点ReactElement
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcilerChildren(wip, nextChildren);

	return null;
}

/**
 * 1. 根据子节点 current fiberNode + ReactElement 生成子节点 wip fiberNode
 * 		- mountChildFiber
 * 		- reconcileChildFiber
 * 2. 将处理好的子节点挂载到 wip.child 上
 */
function reconcilerChildren(wip: FiberNode, children?: ReactElementType) {
	const currentFiberNode = wip.alternate;

	// 如果说当前的 fiberNode 是null时，说明是 mount 阶段
	if (currentFiberNode === null) {
		// mount 阶段
		wip.child = mountChildFiber(wip, null, children);
	} else {
		// update 阶段
		wip.child = reconcileChildFiber(wip, currentFiberNode.child, children);
	}
}
