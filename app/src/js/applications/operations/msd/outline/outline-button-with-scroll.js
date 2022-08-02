import { useHistory } from 'react-router-dom';
import React from 'react';

export const OutlineButtonWithScroll = ({ id, baseUrl, children }) => {
	const history = useHistory()

	const scrollTo = () => {
		const url = `${baseUrl}#${id}`;
		history.replace(url);
		document.getElementById(id).scrollIntoView({
			behavior: 'smooth', block: 'center'
		})
	}

	return (
		<button className="btn-link btn"
						onClick={scrollTo}>
			{ children }
		</button>
	)
}
