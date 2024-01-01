/**
 * 1. 新建两个类型;
 *   - Update
 *   - UpdateQueue
 *   - Action
 *
 * 2. 构建一些方法
 *   - createUpdate
 *   - createUpdateQueue
 *   - enqueueUpdate
 *   - processUpdate
 */

type Action<State> = State | ((prevState: State) => State);
interface Update<State> {
	action: Action<State>;
}
export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

export const createUpdate = <State>(action: Action<State>) => {
	return {
		action
	};
};

export const createUpdateQueue = <State>(): UpdateQueue<State> => {
	return {
		shared: {
			pending: null
		}
	};
};

export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	updateQueue.shared.pending = update;
};

/**
 * 根据基础 state 然后返回新的 state
 */
export const processUpdate = <State>(
	baseState: State,
	update: Update<State>
): { memoizedState: State } => {
	const res: ReturnType<typeof processUpdate<State>> = {
		memoizedState: baseState
	};

	if (update) {
		const action = update.action;

		if (action instanceof Function) {
			res.memoizedState = action(baseState);
		} else {
			res.memoizedState = action;
		}
	}

	return res;
};
