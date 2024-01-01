export type FiberFlags = number;

export const NoFlags = 0b0000001; // 无操作
export const Placement = 0b0000010; // 插入操作
export const Update = 0b0000100; // 更新操作
export const ChildDeletion = 0b0001000; // 删除操作
