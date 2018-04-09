import { isOutOfDate } from 'js/utils/moment';
import { stringToDate } from 'js/utils/moment';

export const getModalMessage = array =>
	array.reduce((_, { prefLabelLg1, valid }) => {
		_ += `<p>Le concept " <b>${prefLabelLg1}</b> " ayant une date de fin de validité au <b>${stringToDate(
			valid
		)}</b>, vous ne pourrez plus le modifier`;
		_ += isOutOfDate(valid) ? `.</p>` : ` après cette date.</p>`;
		return _;
	}, '');
