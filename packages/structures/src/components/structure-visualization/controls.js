import React from 'react';
import { useParams } from 'react-router-dom';
import {
	ActionToolbar,
	ReturnButton,
	ExportButton,
	UpdateButton,
	DeleteButton,
} from '@inseefr/wilco';

const Controls = () => {
	const { dsdId } = useParams();
	const isLocal = process.env.REACT_APP_API === 'local';

	return (
		<ActionToolbar>
			<ReturnButton action="/structures" />
			{isLocal && <ExportButton action={console.log} />}
			<UpdateButton action={`/structures/${dsdId}/update`} />
			{isLocal && <DeleteButton action={console.log} />}
		</ActionToolbar>
	);
};

export default Controls;
