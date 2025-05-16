import { Row } from '@components/layout';
import { MDEditor } from '@components/rich-editor/react-md-editor';

import { Dataset } from '@model/Dataset';

import { D1, D2 } from '../../../../deprecated-locales';

export const Notes = ({
	editingDataset,
	setEditingDataset,
}: Readonly<{
	editingDataset: Dataset;
	setEditingDataset: (dataset: Dataset) => void;
}>) => {
	return (
		<>
			<Row>
				<div className="col-md-6 form-group">
					<label htmlFor="descriptionLg1">{D1.datasetsAbstract}</label>
					<MDEditor
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
					<MDEditor
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
					<MDEditor
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
					<MDEditor
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
					<MDEditor
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
					<label htmlFor="cautionLg2">{D2.datasetsCaution}</label>
					<MDEditor
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
