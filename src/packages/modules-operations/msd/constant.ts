export const HELP = "HELP";
export const CREATE = "CREATE";
export const VIEW = "VIEW";
export const UPDATE = "UPDATE";
export const DUPLICATE = "DUPLICATE";

export type Mode = typeof HELP | typeof CREATE | typeof VIEW | typeof UPDATE | typeof DUPLICATE;
