import { useCallback, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { useTranslation } from 'react-i18next';
import type {
	NumericRepresentation,
	DateTimeRepresentation,
	TextRepresentation,
	CodeRepresentation,
	CodeList,
	Category,
} from '../../types/api';
import { DDIApi } from '../../../../sdk';

interface DdiXmlPreviewProps {
	variableId: string;
	variableName: string;
	variableLabel: string;
	variableDescription?: string;
	variableType: string;
	isGeographic: boolean;
	numericRepresentation?: NumericRepresentation;
	dateRepresentation?: DateTimeRepresentation;
	textRepresentation?: TextRepresentation;
	codeRepresentation?: CodeRepresentation;
	codeList?: CodeList;
	categories?: Category[];
}

export const DdiXmlPreview = ({
	variableId,
	variableName,
	variableLabel,
	variableDescription,
	variableType,
	isGeographic,
	numericRepresentation,
	dateRepresentation,
	textRepresentation,
	codeRepresentation,
	codeList,
	categories,
}: Readonly<DdiXmlPreviewProps>) => {
	const { t } = useTranslation();
	const [ddiXml, setDdiXml] = useState<string | null>(null);
	const [isLoadingDdi, setIsLoadingDdi] = useState(false);

	const formatXml = useCallback((xml: string): string => {
		const PADDING = '  ';
		const reg = /(>)(<)(\/*)/g;
		let pad = 0;

		xml = xml.replace(reg, '$1\n$2$3');

		return xml
			.split('\n')
			.map((node) => {
				let indent = 0;
				if (node.match(/.+<\/\w[^>]*>$/)) {
					indent = 0;
				} else if (node.match(/^<\/\w/) && pad > 0) {
					pad -= 1;
				} else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
					indent = 1;
				} else {
					indent = 0;
				}

				const padding = PADDING.repeat(pad);
				pad += indent;

				return padding + node;
			})
			.join('\n');
	}, []);

	const generateVariableDDI = useCallback(() => {
		const currentDate = new Date().toISOString();

		const variableDDI: any = {
			'@isUniversallyUnique': 'true',
			'@versionDate': currentDate,
			URN: `urn:ddi:fr.insee:${variableId}:1`,
			Agency: 'fr.insee',
			ID: variableId,
			Version: '1',
			VariableName: {
				String: {
					'@xml:lang': 'fr-FR',
					'#text': variableName,
				},
			},
			Label: {
				Content: {
					'@xml:lang': 'fr-FR',
					'#text': variableLabel,
				},
			},
		};

		if (variableDescription) {
			variableDDI.Description = {
				Content: {
					'@xml:lang': 'fr-FR',
					'#text': variableDescription,
				},
			};
		}

		if (isGeographic) {
			variableDDI['@isGeographic'] = 'true';
		}

		if (variableType === 'numeric' && numericRepresentation) {
			variableDDI.VariableRepresentation = {
				VariableRole: 'Mesure',
				NumericRepresentation: numericRepresentation,
			};
		} else if (variableType === 'date' && dateRepresentation) {
			variableDDI.VariableRepresentation = {
				VariableRole: 'Mesure',
				DateTimeRepresentation: dateRepresentation,
			};
		} else if (variableType === 'text' && textRepresentation) {
			variableDDI.VariableRepresentation = {
				VariableRole: 'Mesure',
				TextRepresentation: textRepresentation,
			};
		} else if (variableType === 'code' && codeRepresentation) {
			variableDDI.VariableRepresentation = {
				VariableRole: 'Mesure',
				CodeRepresentation: codeRepresentation,
			};
		}

		const ddi4Data: any = {
			Variable: [variableDDI],
		};

		if (variableType === 'code' && codeList) {
			ddi4Data.CodeList = [codeList];
		}

		if (variableType === 'code' && categories) {
			ddi4Data.Category = categories;
		}

		return ddi4Data;
	}, [
		variableId,
		variableName,
		variableLabel,
		variableDescription,
		variableType,
		isGeographic,
		numericRepresentation,
		dateRepresentation,
		textRepresentation,
		codeRepresentation,
		codeList,
		categories,
	]);

	const loadDdiXml = useCallback(async () => {
		setIsLoadingDdi(true);
		try {
			const ddi4Data = generateVariableDDI();
			const xml = await DDIApi.convertToDDI3(ddi4Data);
			const formattedXml = formatXml(xml);
			setDdiXml(formattedXml);
		} catch (error) {
			console.error('Error loading DDI XML:', error);
			setDdiXml(null);
		} finally {
			setIsLoadingDdi(false);
		}
	}, [generateVariableDDI, formatXml]);

	useEffect(() => {
		loadDdiXml();
	}, [loadDdiXml]);

	return (
		<div className="flex flex-column gap-3">
			{isLoadingDdi && (
				<div className="flex align-items-center gap-2">
					<i className="pi pi-spin pi-spinner" />
					<span>{t('physicalInstance.view.loadingDdi')}</span>
				</div>
			)}
			{!isLoadingDdi && ddiXml && (
				<>
					<div className="flex justify-content-end">
						<Button
							icon="pi pi-copy"
							label={t('physicalInstance.view.copyXml')}
							outlined
							onClick={() => {
								navigator.clipboard.writeText(ddiXml);
							}}
						/>
					</div>
					<InputTextarea
						value={ddiXml}
						readOnly
						rows={20}
						className="font-mono text-sm"
						style={{
							fontFamily: 'monospace',
							whiteSpace: 'pre-wrap',
							wordBreak: 'break-all',
						}}
					/>
				</>
			)}
			{!isLoadingDdi && !ddiXml && (
				<div className="text-center text-gray-500">
					{t('physicalInstance.view.noDdiXml')}
				</div>
			)}
		</div>
	);
};
