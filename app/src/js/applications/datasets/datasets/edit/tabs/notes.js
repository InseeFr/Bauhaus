import { D1, D2 } from 'js/i18n';
import { EditorMarkdown, Row } from 'bauhaus-utilities';

export const Notes = ({ editingDataset, setEditingDataset }) => {
	return (
		<>
			<Row>
				<div className="col-md-6 form-group">
					<label htmlFor="descriptionLg1">{D1.datasetsAbstract}</label>
					<EditorMarkdown
						text={editingDataset.abstractLg1}
						handleChange={(value) => {
							setEditingDataset({
								...editingDataset,
								abstractLg1: value,
							});
						}}
					/>
				</div>
				<div className="col-md-6 form-group">
					<label htmlFor="descriptionLg2">{D2.datasetsAbstract}</label>
					<EditorMarkdown
						text={editingDataset.abstractLg2}
						handleChange={(value) => {
							setEditingDataset({
								...editingDataset,
								abstractLg2: value,
							});
						}}
					/>
				</div>
			</Row>
			<Row>
				<div className="col-md-6 form-group">
					<label htmlFor="descriptionLg1">{D1.descriptionTitle}</label>
					<EditorMarkdown
						text={editingDataset.descriptionLg1}
						handleChange={(value) => {
							setEditingDataset({
								...editingDataset,
								descriptionLg1: value,
							});
						}}
					/>
				</div>
				<div className="col-md-6 form-group">
					<label htmlFor="descriptionLg2">{D2.descriptionTitle}</label>
					<EditorMarkdown
						text={editingDataset.descriptionLg2}
						handleChange={(value) => {
							setEditingDataset({
								...editingDataset,
								descriptionLg2: value,
							});
						}}
					/>
				</div>
			</Row>

			<Row>
				<div className="col-md-6 form-group">
					<label htmlFor="descriptionLg1">{D1.datasetsCaution}</label>
					<EditorMarkdown
						text={editingDataset.cautionLg1}
						handleChange={(value) => {
							setEditingDataset({
								...editingDataset,
								cautionLg1: value,
							});
						}}
					/>
				</div>
				<div className="col-md-6 form-group">
					<label htmlFor="cautionLg2">{D2.datasetsAbstract}</label>
					<EditorMarkdown
						text={editingDataset.cautionLg2}
						handleChange={(value) => {
							setEditingDataset({
								...editingDataset,
								cautionLg2: value,
							});
						}}
					/>
				</div>
			</Row>
		</>
	);
};
