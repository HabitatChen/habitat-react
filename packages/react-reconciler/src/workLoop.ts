import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';

// 构建一个全局指针，来记录当前正在工作的 fiberNode
let workInProgress: FiberNode | null = null;

// 开始工作
function prepareFreshStack(fiber: FiberRootNode) {
	// 因为 fiberRootNode 不是普通的 fiberNode 所以需要转化
	workInProgress = createWorkInProgress(fiber.current, {});
}

// 因为更新时的 fiberNode 不一定都是 hostFiberNode
// 但是每次更新都是从上到下开始；
// 所以需要每次获取到 fiberRootNode，然后从他的current开始
export function scheduleUpdateOnFiber(fiberNode: FiberNode) {
	// 1. 获取到 fiberRootNode
	const root = markUpdateFromFiberToRoot(fiberNode) as FiberRootNode;
	// 2. 调用 renderRoot
	renderRoot(root);
}

function renderRoot(root: FiberRootNode) {
	// 初始化 让 workInProgress 指向第一个 fiberNode 就是传入的 root
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (error) {
			console.log(error);
			workInProgress = null;
		}
	} while (true);
}

function workLoop() {
	// 如果 workInProgress 不为空，就一直循环
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

/**
 * => 如果有子节点，则遍历子节点 (next 表示子节点) 继续 beginWork 向下走
 * => 如果没有子节点，则遍历兄弟节点 => 走到 completeWork 向兄弟节点走
 * => 如果没有兄弟节点，则返回父节点 => 走到 completeWork 向父节点走
 * @param fiber
 */
function performUnitOfWork(fiber: FiberNode) {
	// beginWork 是向下递的过程
	// 返回的值是 子节点 或者 null
	const next = beginWork(fiber);
	// 在当前节点完成 beginWork 之后，将其 pendingProps 的值 赋值给 memoizedProps
	fiber.memoizedProps = fiber.pendingProps;

	// 如果有子节点，则遍历子节点 (next 表示子节点，将workInProgress 指向 next)
	// 如果没有子节点，则走 completeWork，遍历兄弟节点或者父节点
	if (next === null) {
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

/**
 * 完成工作单元
 */
function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;

	do {
		completeWork(node);
		const sibling = node.sibling;

		// 有兄弟节点，就再开始兄弟节点的工作
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		// 没有兄弟节点，开始父节点的工作
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}

export function markUpdateFromFiberToRoot(fiberNode: FiberNode): FiberRootNode {
	let node = fiberNode;
	let parent = node.return;

	// 说明都是普通的 fiberNode
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}

	// 说明到了 hostFiberNode
	return node.stateNode;
}
