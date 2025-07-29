import { Row } from '@components/layout';
import { MDEditor } from '@components/rich-editor/react-md-editor';
import { D1, D2 } from '../../../deprecated-locales/build-dictionary';

type Key = `${string}Lg1` | `${string}Lg2`;
const titleMapping: Record<string, string> = {
	definition: 'classificationsDefinition',
	scopeNote: 'classificationsScopeNote',
	coreContentNote: 'classificationsCoreContentNote',
	additionalContentNote: 'classificationsAdditionalContentNote',
	exclusionNote: 'classificationsExclusionNote',
	changeNote: 'classificationsChangeNote',
};

const NoteLangInput = ({
	label,
	value,
	id,
	onChange,
}: Readonly<{
	label: string;
	value?: string;
	id: Key;
	onChange: (value?: string) => void;
}>) => {
	return (
		<div className="form-group col-md-6">
			{value && (
				<>
					<label htmlFor={id}>{label}</label>
					<MDEditor id={id} text={value} handleChange={onChange} />
				</>
			)}
		</div>
	);
};

const NoteInput = ({
	dictionaryKey,
	values,
	onChange,
}: Readonly<{
	dictionaryKey: string;
	values: [Key, string?][];
	onChange: (values: [Key, string?][]) => void;
}>) => {
	const [[firstNoteKey, firstNodeValue], [secondNoteKey, secondNoteValue]] =
		values;

	return (
		<Row>
			<NoteLangInput
				label={D1[titleMapping[dictionaryKey]]}
				id={firstNoteKey}
				value={firstNodeValue}
				onChange={(value) =>
					onChange([
						[firstNoteKey, value],
						[secondNoteKey, secondNoteValue],
					])
				}
			/>
			<NoteLangInput
				label={D2[titleMapping[dictionaryKey]]}
				id={secondNoteKey}
				value={secondNoteValue}
				onChange={(value) =>
					onChange([
						[firstNoteKey, firstNodeValue],
						[secondNoteKey, value],
					])
				}
			/>
		</Row>
	);
};

export const NotesInputs = ({
	value,
	onChange,
}: Readonly<{
	value: Record<string, string>;
	onChange: (value: Record<string, string | undefined>) => void;
}>) => {
	const notesGroupByKey = Object.keys(value)
		.filter((noteKey) => noteKey !== 'version')
		.reduce((acc: Record<string, Record<string, string>>, noteKey) => {
			const prefixNoteKey: string = noteKey
				.replace('Lg1', '')
				.replace('Lg2', '')
				.replace('Uri', '')
				.replace('Date', '');
			return {
				...acc,
				[prefixNoteKey]: {
					...(acc[prefixNoteKey] ?? {}),
					[noteKey]: value[noteKey],
				},
			};
		}, {});

	return Object.entries(notesGroupByKey).map(([key, values]) => {
		const keyLg1: Key = `${key}Lg1`;
		const keyLg2: Key = `${key}Lg2`;
		const keyLg1Uri = `${keyLg1}Uri`;
		const keyLg2Uri = `${keyLg2}Uri`;

		if (!values[keyLg1Uri] && !values[keyLg2Uri]) {
			return null;
		}

		return (
			<NoteInput
				key={key}
				dictionaryKey={key}
				values={[
					[keyLg1, values[keyLg1]],
					[keyLg2, values[keyLg2]],
				]}
				onChange={(v) => {
					const [
						[firstNoteKey, firstNodeValue],
						[secondNoteKey, secondNoteValue],
					] = v;
					onChange({
						[firstNoteKey]: firstNodeValue,
						[secondNoteKey]: secondNoteValue,
					});
				}}
			/>
		);
	});
};
