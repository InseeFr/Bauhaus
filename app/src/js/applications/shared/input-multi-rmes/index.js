import { Component } from 'react';
import Modal from 'js/applications/shared/input-multi-modal-rmes/input-multi-modal-rmes';
import D, { D1, D2 } from 'js/i18n';

class InputMultiRmes extends Component {
	constructor(props) {
		super(props);

		const { inputLg1, inputLg2 } = this.props;

		this.state = {
			arrayLg1: inputLg1.length === 0 ? [''] : inputLg1,
			arrayLg2: inputLg2.length === 0 ? [''] : inputLg2,
			modalAdd: false,
			modalDelete: false,
			modalLast: false,
		};

		this.close = () => {
			this.setState({
				modalAdd: false,
				modalDelete: false,
				modalLast: false,
			});
		};

		this.update = (lang, type) => {
			const arrayName = `array${lang}`;
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
				});
			else if (type === 'minus' && arrayLength > 1) {
				array.pop();
				this.setState({
					[arrayName]: array,
				});
			} else if (type === 'minus' && arrayLength === 1) {
				this.setState({
					modalLast: true,
				});
			}
		};

		this.initInput = (array, arrayName) => {
			return array.map((alt, i) => (
				<input
					key={i}
					type="text"
					value={alt}
					className="form-control form-group"
					onChange={(e) => this.handleChange(e.target.value, arrayName, i)}
				/>
			));
		};

		this.handleChange = (value, arrayName, i) => {
			const newArray = this.state[arrayName].map((e, j) => {
				if (j === i) return value;
				return e;
			});
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
	}
	render() {
		const { label } = this.props;
		const { arrayLg1, arrayLg2, modalAdd, modalDelete, modalLast } = this.state;

		const altLg1 = this.initInput(arrayLg1, 'arrayLg1');
		const altLg2 = this.initInput(arrayLg2, 'arrayLg2');

		const button = (lang, type) => (
			<span
				className={`glyphicon glyphicon-${type}`}
				onClick={() => this.update(`${lang}`, `${type}`)}
			/>
		);

		return (
			<div className="row">
				<div className={`form-group col-md-6`}>
					<label>
						{D1[label]} {button('Lg1', 'minus')} {button('Lg1', 'plus')}
					</label>
					{altLg1}
				</div>
				<div className={`form-group col-md-6`}>
					<label>
						{D2[label]} {button('Lg2', 'minus')} {button('Lg2', 'plus')}
					</label>
					{altLg2}
				</div>
				{modalAdd && <Modal body={D.multiModalNoNewBody} close={this.close} />}
				{modalDelete && (
					<Modal body={D.multiModalRemoveCompleteBody} close={this.close} />
				)}
				{modalLast && (
					<Modal body={D.multiModalRemoveLastBody} close={this.close} />
				)}
			</div>
		);
	}
}

export default InputMultiRmes;
