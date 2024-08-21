import { useId, useState } from 'react';
import { Tabs as BootstrapTabs, Tab as BootstrapTab } from 'react-bootstrap';

export const Tabs = ({
	tabs,
}: {
	tabs: { title: string; disabled: boolean; content: unknown }[];
}) => {
	const [activeTab, setActiveTab] = useState(0);
	const id = useId();
	return (
		<ul className="nav nav-tabs nav-justified">
			<BootstrapTabs
				id={id}
				defaultActiveKey={0}
				onSelect={(index: number) => setActiveTab(index)}
				justified
			>
				{tabs.map((t, i) => (
					<BootstrapTab
						key={`tab${i}`}
						eventKey={i}
						title={t.title}
						disabled={t.disabled}
					>
						{activeTab === i && t.content}
					</BootstrapTab>
				))}
			</BootstrapTabs>
		</ul>
	);
};
