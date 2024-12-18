import './errors-bloc.css';

export const ClientSideError = ({
	error,
	id,
}: Readonly<{
	error?: string;
	id: string;
}>) => {
	return error ? (
		<div
			id={id}
			className="text-danger"
			dangerouslySetInnerHTML={{ __html: error }}
		></div>
	) : null;
};
export const GlobalClientSideErrorBloc = ({
	clientSideErrors,
	D,
}: Readonly<{
	clientSideErrors?: string[];
	D: any;
}>) => {
	if (!clientSideErrors) {
		return null;
	}
	return clientSideErrors.length > 0 ? (
		<div className="bauhaus-error-bloc alert alert-danger" role="alert">
			{(
				<div
					dangerouslySetInnerHTML={{
						__html: D.errors.GlobalClientSideErrorBloc,
					}}
				/>
			) || <span style={{ whiteSpace: 'pre-wrap' }}> </span>}
		</div>
	) : null;
};
export const ErrorBloc = ({
	error,
	D,
}: {
	error: string[] | string;
	D?: any;
}) => {
	const errors = Array.isArray(error) ? error : [error];

	const formattedErrors = errors.map((e) => {
		let errorMsg;
		try {
			const parsedError = JSON.parse(e);

			if (parsedError.code && D.errors[parsedError.code]) {
				errorMsg = D.errors[parsedError.code](parsedError);
			} else if (parsedError.message && D.errors[parsedError.message]) {
				errorMsg = D.errors[parsedError.message](parsedError);
			} else {
				errorMsg = parsedError.message;
			}
		} catch {
			errorMsg = e;
		}
		return errorMsg;
	});

	return (
		<>
			{formattedErrors.map((e, index) => (
				<div
					key={index}
					className="bauhaus-error-bloc alert alert-danger"
					role="alert"
				>
					{<div dangerouslySetInnerHTML={{ __html: e }} /> || (
						<span style={{ whiteSpace: 'pre-wrap' }}> </span>
					)}
				</div>
			))}
		</>
	);
};
