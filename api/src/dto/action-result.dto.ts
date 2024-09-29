export interface ActionResultDto<T = any>
{
	data: T;
	isSuccess?: boolean;
	message?: string;
	details?: string;
}

export type ActionResultPromise<T> = Promise<ActionResultDto<T>>;
