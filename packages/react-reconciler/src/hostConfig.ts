export type Container = any;

export const createInstance = (...args: any) => {
	console.log(
		'%c [ args ]-4',
		'font-size:13px; background:pink; color:#bf2c9f;',
		args
	);
	return {} as any;
};

export const createTextInstance = (...args: any) => {
	console.log(
		'%c [ args ]-13',
		'font-size:13px; background:pink; color:#bf2c9f;',
		args
	);
	return {} as any;
};

export const appendInitialChild = (...args: any) => {
	console.log(
		'%c [ args ]-22',
		'font-size:13px; background:pink; color:#bf2c9f;',
		args
	);
	return {} as any;
};
