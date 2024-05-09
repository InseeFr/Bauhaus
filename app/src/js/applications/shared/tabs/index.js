import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import './tabs.scss';

export const TabsRmes = ({ tabs }) => {
	return (
		<Tabs defaultActiveKey={1} id="informationToManage" justified>
			{tabs.map(({ id, title, content }) => (
				<Tab eventKey={id} key={id} title={title} className="tabs-items">
					{content}
				</Tab>
			))}
		</Tabs>
	);
};

export default TabsRmes;
