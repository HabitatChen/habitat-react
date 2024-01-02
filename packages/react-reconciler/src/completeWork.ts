import {
	appendInitialChild,
	createInstance,
	createTextInstance
} from 'hostConfig';
import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';
import { NoFlags } from './fiberFlags';

/**
 * 递归中的归部分
 * @returns null
 */
// 1. 构建一颗离屏 dom tree => TODO: 理解为什么要构建
// 2. 将所有子节点的 flags 冒泡到父节点，直至 hostFiberNode
export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps;
	const current = wip.alternate;

	const isUpdate = current !== null;

	switch (wip.tag) {
		// 先判断是否是更新阶段 因为 update 阶段 和 mount 不同

		case HostComponent: // <App />
			if (isUpdate && wip.stateNode) {
				// TODO: 更新阶段
			} else {
				// mount
				// 1. 创建 dom 实例
				const instance = createInstance(wip.type, newProps);

				// 2. DOM 插入到 DOM tree 中
				appendAllChildren(instance, wip);

				// 3. 将 instance 赋值给 wip.stateNode
				wip.stateNode = instance;

				// 4. 冒泡内部 flags
				bubbleProperties(wip);
				return;
			}
			return null;
		case HostText: // 叶子节点
			if (isUpdate && wip.stateNode) {
				// TODO: 更新阶段
			} else {
				// mount
				// 1. 创建 dom 实例
				const instance = createTextInstance(wip.type, newProps);

				// 2. 将 instance 赋值给 wip.stateNode
				wip.stateNode = instance;

				// 3. 冒泡内部 flags
				bubbleProperties(wip);
				return;
			}
			return null;
		case HostRoot: // <div> 挂载的 div
			bubbleProperties(wip);
			return null;
		default:
			if (__DEV__) {
				console.error('Invalid type of fiber.');
			}
			return;
	}
};

/**
 * 递归将所有子节点插入到 DOM tree 中
 */
function appendAllChildren(parent: FiberNode, wip: FiberNode) {
	let node = wip.child; // 一开始 child 肯定是个叶子节点 <div>hello</div>

	// 向下递的过程
	while (node !== null) {
		if (node.tag === HostComponent || node.tag === HostText) {
			// 将子节点插入到当前节点中 => hostConfig
			// TODO: 这块逻辑为什么是这样
			appendInitialChild(parent, node.stateNode);
		} else if (node.child !== null) {
			node.child.return = node;
			// 继续向下递归
			node = node.child;
			continue;
		}

		if (node === wip) {
			return;
		}

		// 如果还有 sibling 的话 则处理 sibling
		while (node.sibling === null) {
			if (node.return === null || node.return === wip) {
				return;
			}
			node = node.return;
		}

		node.sibling.return = node.return;
		node = node.sibling;
	}
}

/**
 * 将所有的副作用冒泡到父组件
 */
function bubbleProperties(wip: FiberNode) {
	let subtreeFlags = NoFlags;
	let child = wip.child;

	while (child !== null) {
		// 让当前组件的 subtreeFlags 不仅包含子组件的 subtreeFlags，还包含子组件的 flags
		subtreeFlags |= child.subtreeFlags;
		subtreeFlags |= child.flags;

		child.return = wip;
		child = child.sibling;
	}

	wip.subtreeFlags = subtreeFlags;
}
