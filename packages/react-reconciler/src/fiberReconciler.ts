import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate
} from './updateQueue';
import { Container } from 'hostConfig';
import { scheduleUpdateOnFiber } from './workLoop';

export const createContainer = (container: Container) => {
	const hostFiberNode = new FiberNode(HostRoot, {}, null);
	const root = new FiberRootNode(container, hostFiberNode);

	// TODO: 创建 hostFiberNode 的 updateQueue
	hostFiberNode.updateQueue = createUpdateQueue();
	return root;
};

export const updateContainer = (
	element: ReactElementType | null,
	root: FiberRootNode
) => {
	const hostFiberNode = root.current;

	// 1. 创建 update ReactDOM.createRoot(root).render(<App />)
	// 		对于 mount 阶段来时，element 就是 App 组件；
	const update = createUpdate(element);

	// 2. 将 update 添加到 updateQueue
	enqueueUpdate(hostFiberNode.updateQueue as UpdateQueue<any>, update);

	// 3. 调用更新
	scheduleUpdateOnFiber(hostFiberNode);

	return element;
};
