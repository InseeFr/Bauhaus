import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import './tabs.scss';

class TabsRmes extends Component {
	constructor(props) {
		super(props);
		this.state = { activeTab: 1 };
		this.selectTab = tabIndex =>
			this.setState({
				activeTab: tabIndex,
			});
	}

	render() {
		const { tabs } = this.props;
		return (
			<Tabs
				defaultActiveKey={1}
				id="informationToManage"
				onSelect={this.selectTab}
				justified
			>
				{tabs.map(({ id, title, content }) => (
					<Tab eventKey={id} key={id} title={title} className="tabs-items">
						{content}
					</Tab>
				))}
			</Tabs>
		);
	}
}

export default TabsRmes;
