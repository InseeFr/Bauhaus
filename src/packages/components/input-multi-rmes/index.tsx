import { Component } from 'react';
import D, { D1, D2 } from '../../deprecated-locales';
import { InputMultiModal } from '../../components';

type InputMultiRmesTypes = {
	inputLg1: string[];
	inputLg2: string[];
	label: string;
	handleChangeLg1: (value: string[]) => void;
	handleChangeLg2: (value: string[]) => void;
};
export class InputMultiRmes extends Component<
	InputMultiRmesTypes,
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

		const { inputLg1, inputLg2 } = props;

		this.state = {
			arrayLg1: inputLg1.length === 0 ? [''] : inputLg1,
			arrayLg2: inputLg2.length === 0 ? [''] : inputLg2,
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
		const arrayName = `array${lang}`;
		//@ts-ignore
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
				key={i}
				type="text"
				value={alt}
				className="form-control form-group"
				onChange={(e) => this.handleChange(e.target.value, arrayName, i)}
			/>
		));
	};

	handleChange = (value: any, arrayName: string, i: number) => {
		//@ts-ignore
		const newArray = (this.state[arrayName] as any[]).map(
			(e: string, j: number) => {
				if (j === i) return value;
				return e;
			}
		);
		// @ts-ignore
		this.setState({
			[arrayName]: newArray,
		});
		const { handleChangeLg1, handleChangeLg2 } = this.props;
		const { arrayLg1, arrayLg2 } = this.state;
		if (arrayName === 'arrayLg1') {
			handleChangeLg1(newArray);
			handleChangeLg2(arrayLg2);
		} else {
			handleChangeLg1(arrayLg1);
			handleChangeLg2(newArray);
		}
	};

	render() {
		const { label } = this.props;
		const { arrayLg1, arrayLg2, modalAdd, modalDelete, modalLast } = this.state;

		const altLg1 = this.initInput(arrayLg1, 'arrayLg1');
		const altLg2 = this.initInput(arrayLg2, 'arrayLg2');

		const button = (lang: string, type: string) => (
			<span
				className={`glyphicon glyphicon-${type}`}
				onClick={() => this.update(`${lang}`, `${type}`)}
			/>
		);

		return (
			<div className="row">
				<div className="form-group col-md-6">
					<label>
						{D1[label]} {button('Lg1', 'minus')} {button('Lg1', 'plus')}
					</label>
					{altLg1}
				</div>
				<div className="form-group col-md-6">
					<label>
						{D2[label]} {button('Lg2', 'minus')} {button('Lg2', 'plus')}
					</label>
					{altLg2}
				</div>
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
			</div>
		);
	}
}
