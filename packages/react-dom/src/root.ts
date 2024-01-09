import {
	createContainer,
	updateContainer
} from 'react-reconciler/src/fiberReconciler';
import { Container } from './hostConfig';
import { ReactElementType } from 'shared/ReactTypes';

export function createRoot(container: Container) {
	console.log(
		'%c [ document.getElement ]-9',
		'font-size:13px; background:pink; color:#bf2c9f;',
		container
	);

	const root = createContainer(container);

	return {
		render(element: ReactElementType) {
			console.log(
				'%c [ 观察 <App /> element ]-19',
				'font-size:13px; background:pink; color:#bf2c9f;',
				element
			);
			updateContainer(element, root);
		}
	};
}
