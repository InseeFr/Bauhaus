import { connect } from 'react-redux';
import Habilitations from './component';
import * as select from 'js/reducers';

const mapStateToProps = state => {
	const permission = select.getPermission(state);
	return {
		permission,
	};
};

export default connect(mapStateToProps)(Habilitations);
