import * as NoAuthUtils from './no-auth/utils';
import * as FakeAuthUtils from './fake-auth/utils';
import * as BasicAuthUtils from './basic-auth/utils';
import * as OpenIDConnectAuthUtils from './open-id-connect-auth/utils';
import * as Impl from 'js/utils/auth/auth-impl';

export default authType => {
	switch (authType) {
		case Impl.FAKE_AUTH:
			return FakeAuthUtils;
		case Impl.BASIC_AUTH:
		return BasicAuthUtils;
		case Impl.OPEN_ID_CONNECT_AUTH:
		return OpenIDConnectAuthUtils;
		case Impl.NO_AUTH:
		default:
			return NoAuthUtils;
	}
};
