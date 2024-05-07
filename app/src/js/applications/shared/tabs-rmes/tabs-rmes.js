import React, { useId, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

const TabsRmes = ({ tabs }) => {
	const [activeTab, setActiveTab] = useState(0);
	const id = useId();
	return (
		<ul className="nav nav-tabs nav-justified">
			<Tabs
				id={id}
				defaultActiveKey={0}
				onSelect={(index) => setActiveTab(index)}
				justified
			>
				{tabs.map((t, i) => (
					<Tab
						key={`tab${i}`}
						eventKey={i}
						title={t.title}
						disabled={t.disabled}
					>
						{activeTab === i && t.content}
					</Tab>
				))}
			</Tabs>
		</ul>
	);
};

export default TabsRmes;
