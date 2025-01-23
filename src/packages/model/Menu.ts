export interface UIMenuItem {
	path: string;
	pathKey: string | RegExp;
	className: string | Record<string, string> | null;
	attrs?: Record<string, string> | null;
	label: string;
	order: number;
	alignToRight?: boolean;
}
