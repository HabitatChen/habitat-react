// /**
//  * mutation 的具体实现
//  */

// import { Container, appendChildToContainer } from 'hostConfig';
// import { FiberNode } from './fiber';
// import { MutationMask, NoFlags, Placement } from './fiberFlags';
// import { HostComponent, HostRoot, HostText } from './workTags';

// let nextEffect: FiberNode | null = null;

// export const commitMutationEffects = (finishedWork: FiberNode) => {
// 	nextEffect = finishedWork;

// 	while (nextEffect !== null) {
// 		// 向下遍历
// 		const child: FiberNode | null = nextEffect.child;

// 		if ((child?.subtreeFlags! & MutationMask) !== NoFlags && child !== null) {
// 			// 当 subtreeFlags 存在 mutation 操作时，其子节点可能存在操作
// 			nextEffect = child;
// 		} else {
// 			// 已经找到底 或者 不存在 subtreeFlags => 返回向上遍历
// 			up: while (nextEffect !== null) {
// 				commitMutationEffectsOnFiber(nextEffect);

// 				const sibling: FiberNode | null = nextEffect.sibling;
// 				if (sibling !== null) {
// 					nextEffect = sibling;
// 					break up;
// 				}

// 				nextEffect = nextEffect.return;
// 			}
// 		}
// 	}
// };

// const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
// 	const flags = finishedWork.flags;

// 	// 说明有操作
// 	if ((flags & Placement) !== NoFlags) {
// 		// 处理 placement 操作
// 		commitPlacement(finishedWork);

// 		// 将 placement 标记移出
// 		finishedWork.flags &= ~Placement;
// 	}
// 	// TODO: update childDeletion
// };

// const commitPlacement = (finishedWork: FiberNode) => {
// 	// 向下找到 host
// 	const hostParent = getHostParent(finishedWork);
// 	// 找到 finishedWork 对应的 dom，然后插入到页面中
// 	appendPlacementNodeIntoContainer(finishedWork, hostParent);
// };

// const getHostParent = (fiber: FiberNode) => {
// 	let parent = fiber.return;

// 	while (parent) {
// 		const parentTag = parent.tag;

// 		if (parentTag === HostComponent) {
// 			return parent.stateNode as Container;
// 		}

// 		if (parentTag === HostRoot) {
// 			return parent.stateNode.container;
// 		}

// 		parent = parent.return;
// 	}
// };

// function appendPlacementNodeIntoContainer(
// 	finishedWork: FiberNode,
// 	hostParent: Container
// ) {
// 	// 从 finishedWork 向下遍历到 hostComponent
// 	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
// 		appendChildToContainer(hostParent, finishedWork.stateNode);
// 		return;
// 	}

// 	const child = finishedWork.child;
// 	if (child !== null) {
// 		// FIXME: 这里的 child 类型有问题
// 		appendChildToContainer(child as any, hostParent);
// 		let sibling = child.sibling;

// 		while (sibling !== null) {
// 			appendChildToContainer(sibling as any, hostParent);
// 			sibling = sibling.sibling;
// 		}
// 	}
// }

import { appendChildToContainer, Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags, Placement } from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';

let nextEffect: FiberNode | null = null;

export const commitMutationEffects = (finishedWork: FiberNode) => {
	nextEffect = finishedWork;

	while (nextEffect !== null) {
		// 向下遍历
		const child: FiberNode | null = nextEffect.child;

		if (
			(nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
			child !== null
		) {
			nextEffect = child;
		} else {
			// 向上遍历 DFS
			up: while (nextEffect !== null) {
				commitMutationEffectsOnFiber(nextEffect);
				const sibling: FiberNode | null = nextEffect.sibling;

				if (sibling !== null) {
					nextEffect = sibling;
					break up;
				}
				nextEffect = nextEffect.return;
			}
		}
	}
};

const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
	const flags = finishedWork.flags;

	if ((flags & Placement) !== NoFlags) {
		commitPlacement(finishedWork);
		finishedWork.flags &= ~Placement;
	}
	// flags Update
	// flags ChildDeletion
};

const commitPlacement = (finishedWork: FiberNode) => {
	if (__DEV__) {
		console.warn('执行Placement操作', finishedWork);
	}
	// parent DOM
	const hostParent = getHostParent(finishedWork);
	console.log(
		'%c [ hostParent ]-153',
		'font-size:13px; background:pink; color:#bf2c9f;',
		hostParent
	);
	// finishedWork ~~ DOM append parent DOM
	if (hostParent !== null) {
		appendPlacementNodeIntoContainer(finishedWork, hostParent);
	}
};

function getHostParent(fiber: FiberNode): Container | null {
	console.log(
		'%c [ fiber ]-165',
		'font-size:13px; background:pink; color:#bf2c9f;',
		fiber
	);
	let parent = fiber.return;

	while (parent) {
		const parentTag = parent.tag;
		// HostComponent HostRoot
		if (parentTag === HostComponent) {
			return parent.stateNode as Container;
		}
		if (parentTag === HostRoot) {
			return (parent.stateNode as FiberRootNode).container;
		}
		parent = parent.return;
	}

	if (__DEV__) {
		console.warn('未找到host parent');
	}

	return null;
}

function appendPlacementNodeIntoContainer(
	finishedWork: FiberNode,
	hostParent: Container
) {
	// fiber host
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		appendChildToContainer(hostParent, finishedWork.stateNode);
		return;
	}
	const child = finishedWork.child;
	if (child !== null) {
		appendPlacementNodeIntoContainer(child, hostParent);
		let sibling = child.sibling;

		while (sibling !== null) {
			appendPlacementNodeIntoContainer(sibling, hostParent);
			sibling = sibling.sibling;
		}
	}
}
