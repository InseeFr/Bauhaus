import { Card } from 'primereact/card';
import './GlobalErrorBloc.css';

interface GlobalErrorBlocProps {
	title: string;
	message: string;
}

export const GlobalErrorBloc = ({
	title,
	message,
}: Readonly<GlobalErrorBlocProps>) => {
	return (
		<div className="global-error-bloc">
			<Card title={title}>
				<p>{message}</p>
			</Card>
		</div>
	);
};
