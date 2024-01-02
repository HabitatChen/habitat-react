import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode, createFiberFromElement } from './fiber';
import { HostText } from './workTags';
import { Placement } from './fiberFlags';

type ReconcilerChildFibersFn = (
	parentFiber: FiberNode,
	childFiber: FiberNode | null,
	childReactElement?: ReactElementType | null
) => FiberNode | null; // 如果是 null 则说明没有子节点

function ChildReconciler(shouldTrackEffects: boolean): ReconcilerChildFibersFn {
	function reconcileSingElement(
		parentFiber: FiberNode,
		currnetFiber: FiberNode | null, // TODO: 放在这里的作用是什么?
		childReactElement: ReactElementType
	): FiberNode {
		// 1. 创建 子节点的 fiberNode
		// 2. 将子节点的return 指向父节点
		// 3. 返回子节点
		const newFiber = createFiberFromElement(childReactElement);
		newFiber.return = parentFiber;

		return newFiber;
	}

	function reconcileSingTextNode(
		parentFiber: FiberNode,
		currnetFiber: FiberNode | null, // TODO: 放在这里的作用是什么?
		content: string | null
	): FiberNode {
		// 1. 创建 子节点的 fiberNode
		// 2. 将子节点的return 指向父节点
		// 3. 返回子节点
		const newFiber = new FiberNode(HostText, { content }, null);
		newFiber.return = parentFiber;

		return newFiber;
	}

	function placeSingleChild(wip: FiberNode) {
		// wip.alternate === null 表示current为null 仅在 mount 时成立
		if (shouldTrackEffects && wip.alternate === null) {
			wip.flags = Placement;
		}

		return wip;
	}

	/**
	 * 根据 子节点的current fiberNode + ReactElement => wip fiberNode
	 */
	return function reconcilerChildFibers(
		parentFiber: FiberNode,
		childFiber: FiberNode | null,
		childReactElement?: ReactElementType | null
	) {
		const typeofChildReactElement = typeof childReactElement;
		// 说明子节点是 ReactElement
		if (typeofChildReactElement === 'object' || childReactElement !== null) {
			// 处理 子节点是 ReactElement 的情况
			return placeSingleChild(
				reconcileSingElement(
					parentFiber,
					childFiber,
					childReactElement as ReactElementType
				)
			);
		}

		// 说明子节点是 文本叶子节点
		if (
			typeofChildReactElement === 'string' ||
			typeofChildReactElement === 'number'
		) {
			// 处理 子节点是 文本叶子节点 的情况
			return placeSingleChild(
				reconcileSingTextNode(parentFiber, childFiber, childReactElement)
			);
		}

		return null;
	};
}

// mount 时，不需要追踪副作用
export const mountChildFiber = ChildReconciler(false);

// update 时，需要追踪副作用
export const reconcileChildFiber = ChildReconciler(true);
