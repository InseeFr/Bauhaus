import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../../remote-api/classifications-api';
import { ActionToolbar, ErrorBloc, goBack, LabelRequired, Loading } from '@inseefr/wilco';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { PageTitleBlock, Row } from 'bauhaus-utilities';
import { useForm } from 'react-hook-form';
import D, { D1, D2 } from '../../../../i18n/build-dictionary';

const ClassificationItemEdition = () => {
	const history = useHistory();
	const queryClient = useQueryClient()
	const { classificationId, itemId } = useParams();

	const { register, handleSubmit, formState: { errors } } = useForm({
		criteriaMode: 'firstError',
		mode: 'all',
	});

	const { isLoading: isSaving, mutate: save, isSuccess: isSavingSuccess } = useMutation((general) => {
		return api
			.putClassificationItemGeneral(classificationId, itemId, general)
	}, {
		onSuccess: () => {
			queryClient.invalidateQueries(['classifications-item-general', classificationId, itemId]);
		}
	})

	const { isLoading, data: general } = useQuery(['classifications-item-general', classificationId, itemId], () => {
		return api.getClassificationItemGeneral(classificationId, itemId);
	});

	if (isLoading) return <Loading />;

	if(isSaving) return <Loading textType="saving" />;

	if(isSavingSuccess){
		return <Redirect to={'/classifications/classification/' + classificationId + '/item/' + itemId}/>
	}

	const errorMessage = Object.values(errors)?.[0]?.message;

	return (
		<div className='container editor-container'>
			<PageTitleBlock
				titleLg1={general?.prefLabelLg1}
				titleLg2={general?.prefLabelLg2}
				secondLang={true}
			/>

			<form onSubmit={handleSubmit(value => save({ ...general, ...value}))}>
				<ActionToolbar>
					<div className='col-md-2'>
						<button onClick={goBack({ history }, '/classifications')} className='btn wilco-btn btn-lg col-md-12'
										type='button'>
					<span
						className={`glyphicon glyphicon-floppy-remove`}
						aria-hidden='true'
					/>
							<span>{D.btnCancel}</span>
						</button>
					</div>
					<div className='col-md-2'>
						<button
							className='btn wilco-btn btn-lg col-md-12' type='submit'>
					<span
						className={`glyphicon glyphicon-floppy-disk`}
						aria-hidden='true'
					/>
							<span>{D.btnSave}</span>
						</button>
					</div>
				</ActionToolbar>

				<ErrorBloc error={errorMessage} />

				<Row>
					<div className='col-md-6 form-group'>
						<LabelRequired htmlFor='prefLabelLg1'>{D1.title}</LabelRequired>
						<input
							type='text'
							className='form-control'
							id="prefLabelLg1"
							{...register('prefLabelLg1', { required: D.requiredPrefLabel })}
							defaultValue={general.prefLabelLg1}
						/>
					</div>
					<div className='col-md-6 form-group'>
						<LabelRequired htmlFor='prefLabelLg2'>{D2.title}</LabelRequired>
						<input
							type='text'
							className='form-control'
							id="prefLabelLg2"
							{...register('prefLabelLg2', { required: D.requiredPrefLabel })}
							defaultValue={general.prefLabelLg2}
						/>
					</div>
				</Row>
				<Row>
					<div className="form-group col-md-6">
						<label htmlFor="altLabelLg1">{D1.altLabel}</label>
						<input
							type="text"
							className="form-control"
							id="altLabelLg1"
							{...register('altLabelLg1')}
							defaultValue={general.altLabelLg1}
						/>
					</div>
					<div className="form-group col-md-6">
						<label htmlFor="altLabelLg2">{D2.altLabel}</label>
						<input
							type="text"
							className="form-control"
							id="altLabelLg2"
							{...register('altLabelLg2')}
							defaultValue={general.altLabelLg2}
						/>
					</div>
				</Row>
			</form>
		</div>
	)
}
export default ClassificationItemEdition;
