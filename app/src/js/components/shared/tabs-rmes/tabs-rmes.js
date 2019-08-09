import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';

class TabsRmes extends Component {
	static propTypes = {
		tabs: PropTypes.arrayOf(
			PropTypes.shape({
				title: PropTypes.string.isRequired,
				content: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
					.isRequired,
			})
		),
	};
	
	constructor(props) {
		super();
		this.state = { activeTab: 0 };
		this.selectTab = tabIndex =>
			this.setState({
				activeTab: tabIndex,
			});
	}
	render() {
		const { activeTab } = this.state;
		const { tabs } = this.props;
		return (
			<ul className="nav nav-tabs nav-justified">
				<Tabs
					defaultActiveKey={0}
					id="informationToManage"
					onSelect={this.selectTab}
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
	}
}
 
export default TabsRmes;
