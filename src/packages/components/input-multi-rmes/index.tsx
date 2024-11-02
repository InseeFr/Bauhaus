import { Component } from 'react';
import D, { D1, D2 } from '../../deprecated-locales';
import { Row } from '../../components';
import { InputMultiModal } from '../../components/input-multi-modal-rmes/input-multi-modal-rmes';

type InputMultiRmesTypes = {
	inputLg1: string[];
	inputLg2?: string[];
	label: string;
	handleChangeLg1: (value: string[]) => void;
	handleChangeLg2?: (value: string[]) => void;
	type?: 'text' | 'url';
};

export class InputMultiRmes extends Component<
	Readonly<InputMultiRmesTypes>,
	{
		arrayLg1: string[];
		arrayLg2: string[];
		modalAdd: boolean;
		modalDelete: boolean;
		modalLast: boolean;
	}
> {
	constructor(props: InputMultiRmesTypes) {
		super(props);
		const { inputLg1 = [], inputLg2 = [] } = props;

		this.state = {
			arrayLg1: inputLg1.length === 0 ? [''] : inputLg1,
			arrayLg2: inputLg2?.length === 0 ? [''] : inputLg2!,
			modalAdd: false,
			modalDelete: false,
			modalLast: false,
		};
	}

	close = () => {
		this.setState({
			modalAdd: false,
			modalDelete: false,
			modalLast: false,
		});
	};

	update = (lang: string, type: string) => {
		const arrayName = `array${lang}` as keyof Pick<
			typeof this.state,
			'arrayLg1' | 'arrayLg2'
		>;
		const array = this.state[arrayName];
		const arrayLength = array.length;
		if (array[arrayLength - 1] === '' && type === 'plus')
			this.setState({
				modalAdd: true,
			});
		else if (array[arrayLength - 1] !== '' && type === 'minus')
			this.setState({
				modalDelete: true,
			});
		else if (type === 'plus')
			this.setState({
				[arrayName]: array.concat(['']),
			} as any);
		else if (type === 'minus' && arrayLength > 1) {
			array.pop();
			this.setState({
				[arrayName]: array,
			} as any);
		} else if (type === 'minus' && arrayLength === 1) {
			this.setState({
				modalLast: true,
			});
		}
	};

	initInput = (array: string[], arrayName: string) => {
		return array.map((alt: string, i: number) => (
			<input
				type={this.props.type ?? 'text'}
				key={i}
				value={alt}
				className="form-control form-group"
				onChange={(e) => this.handleChange(e.target.value, arrayName, i)}
			/>
		));
	};

	handleChange = (
		value: string,
		arrayName: keyof Pick<typeof this.state, 'arrayLg1' | 'arrayLg2'>,
		i: number,
	) => {
		const newArray: string[] = (this.state[arrayName] as any[]).map(
			(e: string, j: number) => {
				if (j === i) return value;
				return e;
			},
		);

		//@ts-ignore
		this.setState({
			[arrayName]: newArray,
		});

		const { handleChangeLg1, handleChangeLg2 } = this.props;
		if (arrayName === 'arrayLg1') {
			handleChangeLg1(newArray);
		} else {
			if (handleChangeLg2) {
				handleChangeLg2(newArray);
			}
		}
	};

	render() {
		const { label, handleChangeLg2 } = this.props;
		const { arrayLg1, arrayLg2, modalAdd, modalDelete, modalLast } = this.state;

		const altLg1 = this.initInput(arrayLg1, 'arrayLg1');
		const altLg2 = handleChangeLg2 ? this.initInput(arrayLg2, 'arrayLg2') : [];

		const button = (lang: string, type: string) => (
			<span
				className={`glyphicon glyphicon-${type}`}
				onClick={() => this.update(`${lang}`, `${type}`)}
			/>
		);

		return (
			<Row>
				<div className={`form-group col-md-${handleChangeLg2 ? 6 : 12}`}>
					<label>
						{D1[label] ?? label} {button('Lg1', 'minus')}{' '}
						{button('Lg1', 'plus')}
					</label>
					{altLg1}
				</div>
				{!!handleChangeLg2 && (
					<div className="form-group col-md-6">
						<label>
							{D2[label] ?? label} {button('Lg2', 'minus')}{' '}
							{button('Lg2', 'plus')}
						</label>
						{altLg2}
					</div>
				)}
				{modalAdd && (
					<InputMultiModal body={D.multiModalNoNewBody} close={this.close} />
				)}
				{modalDelete && (
					<InputMultiModal
						body={D.multiModalRemoveCompleteBody}
						close={this.close}
					/>
				)}
				{modalLast && (
					<InputMultiModal
						body={D.multiModalRemoveLastBody}
						close={this.close}
					/>
				)}
			</Row>
		);
	}
}
