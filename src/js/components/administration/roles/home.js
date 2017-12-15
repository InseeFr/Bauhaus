import React from 'react';
import PageTitle from 'js/components/shared/page-title';
import Visualisation from './visualisation';
import Edition from './edition';

function Home({ roles, agents, addAgent, deleteAgent, setEdition, edition }) {
	const title = edition ? 'Gestion des habilitations' : 'Habilitations';

	return (
		<div className="container">
			<PageTitle title={title} />
			{!edition && (
				<Visualisation
					roles={roles}
					deleteAgent={deleteAgent}
					setEdition={setEdition}
				/>
			)}
			{edition && (
				<div>
					<Edition
						roles={roles}
						agents={agents}
						addAgent={addAgent}
						deleteAgent={deleteAgent}
						setEdition={setEdition}
					/>
				</div>
			)}
		</div>
	);
}

export default Home;
