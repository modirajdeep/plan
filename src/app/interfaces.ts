export interface TreeNode<T> {
    data: T;
    children?: TreeNode<T>[];
    expanded?: boolean;
}

export interface FSEntry {
    name: string;
    value: any;
    type: string;
}

export interface JsonActions {
    action?: string;
    target: string;
    type: string;
    index: string;
}