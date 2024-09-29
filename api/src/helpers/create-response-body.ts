import { type ActionResultDto } from "../dto/action-result.dto";

export function createResponseBody<T>({
	data,
	isSuccess = true,
	message = 'Операция прошла успешно',
	details
}: ActionResultDto<T>)
{
	return {
		data,
		isSuccess,
		message,
		...(details && { details })
	};
}
