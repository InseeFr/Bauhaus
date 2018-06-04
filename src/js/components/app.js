import React from 'react';
import { Link } from 'react-router-dom';
import conceptsLogo from 'img/concepts.jpg';
import classificationsLogo from 'img/classifications.jpg';
import operationsLogo from 'img/operations.jpg';
import D from 'js/i18n';

function App() {
	return (
		<div>
			<div className="centered page-title">
				<h1>{D.welcome}</h1>
			</div>
			<div className="img-block">
				<Link to="/concepts">
					<h2 className="items page-title page-title-link">
						{D.conceptsTitle}
					</h2>
				</Link>
				<Link to="/classifications">
					<h2 className="items page-title page-title-link" disabled>
						{D.classificationsTitle}
					</h2>
				</Link>
				<Link to="/operations/series">
					<h2 className="items page-title page-title-link">
						{D.operationsTitle}
					</h2>
				</Link>
			</div>
			<div className="img-block">
				<Link to="/concepts">
					<img src={conceptsLogo} alt="Concepts" className="img" />
				</Link>
				<Link to="/classifications">
					<img
						src={classificationsLogo}
						alt="Classifications"
						className="img"
					/>
				</Link>
				<Link to="/operations/series">
					<img src={operationsLogo} alt="Operations" className="img" />
				</Link>
			</div>
		</div>
	);
}

export default App;
