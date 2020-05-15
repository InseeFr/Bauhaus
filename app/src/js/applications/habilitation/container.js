import { connect } from 'react-redux';
import Habilitations from './component';
import { Auth } from 'bauhaus-utilities';

const mapStateToProps = state => {
	const permission = Auth.getPermission(state);
	return {
		permission,
	};
};

export default connect(mapStateToProps)(Habilitations);
