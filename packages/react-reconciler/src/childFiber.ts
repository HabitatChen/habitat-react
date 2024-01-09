import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode, createFiberFromElement } from './fiber';
import { HostText } from './workTags';
import { Placement } from './fiberFlags';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbol';

function ChildReconciler(shouldTrackEffects: boolean) {
	function reconcileSingElement(
		parentFiber: FiberNode,
		currentFiber: FiberNode | null, // TODO: 放在这里的作用是什么?
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
		currentFiber: FiberNode | null, // TODO: 放在这里的作用是什么?
		content: string | number
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
			// FIXME: |= 需要理解
			wip.flags |= Placement;
		}

		return wip;
	}

	/**
	 * 根据 子节点的current fiberNode + ReactElement => wip fiberNode
	 */
	return function reconcilerChildFibers(
		parentFiber: FiberNode,
		childFiber: FiberNode | null, // mount => null
		childReactElement?: ReactElementType
	) {
		const typeofChildReactElement = typeof childReactElement;
		// 说明子节点是 ReactElement
		if (typeofChildReactElement === 'object' && childReactElement !== null) {
			switch (childReactElement?.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingElement(parentFiber, childFiber, childReactElement)
					);
				default:
					if (__DEV__) {
						console.warn('未实现的reconcile类型', childReactElement);
					}
					break;
			}
		}

		// TODO: 缺少多节点处理

		// 说明子节点是 文本叶子节点 HostText
		if (
			typeofChildReactElement === 'string' ||
			typeofChildReactElement === 'number'
		) {
			// 处理 子节点是 文本叶子节点 的情况
			return placeSingleChild(
				reconcileSingTextNode(parentFiber, childFiber, childReactElement as any)
			);
		}

		return null;
	};
}

// mount 时，不需要追踪副作用
export const mountChildFiber = ChildReconciler(false);

// update 时，需要追踪副作用
export const reconcileChildFiber = ChildReconciler(true);
