export type Key = any;
export type Ref = any;
export type Props = any;
export type Type = any;
export type ElementType = any;

export interface ReactElementType {
	type: ElementType;
	key: Key | null;
	ref: Ref | null;
	props: Props;
	$$typeof: symbol | number;
	__mark: string;
}
