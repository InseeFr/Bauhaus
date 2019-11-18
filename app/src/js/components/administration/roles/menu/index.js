import React from 'react';
import { withRouter } from 'react-router-dom';
import { Menu } from 'bauhaus-library';

import { compose } from 'recompose';

const MenuRoles = () => {
	return <Menu paths={[]} />;
};

export default compose(withRouter)(MenuRoles);
