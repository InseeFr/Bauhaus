import { useQuery } from '@tanstack/react-query';
import api from '../../../remote-api/datasets-api';
import React from 'react';

export const useThemes = () =>
	useQuery(['themes'], () => {
		return api.getThemes().then((themes) =>
			themes.map((theme) => ({
				value: theme.uri,
				label: (
					<>
						{theme.label} <i>({theme.idConceptScheme})</i>
					</>
				),
			}))
		);
	});
