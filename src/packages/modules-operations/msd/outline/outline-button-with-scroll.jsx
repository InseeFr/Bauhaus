import { useNavigate } from 'react-router-dom';

export const OutlineButtonWithScroll = ({ id, baseUrl, children }) => {
	const navigate = useNavigate();

	const scrollTo = () => {
		const url = `${baseUrl}#${id}`;
		navigate(url, { replace: true });
		document.getElementById(id).scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
	};

	return (
		<button type="button" className="btn-link btn" onClick={scrollTo}>
			{children}
		</button>
	);
};
