import React, { Component } from 'react';
import PropTypes from 'prop-types';
import flagFr from 'js/components/shared/flag-fr';
import flagEn from 'js/components/shared/flag-en';

class InputMultiRmes extends Component {
	constructor(props) {
		super(props);
		const { arrayLg1, arrayLg2 } = this.props;

		this.state = {
			nbFieldsLg1: arrayLg1.length,
			nbFieldsLg2: arrayLg2.length,
			arrayLg1: arrayLg1,
			arrayLg2: arrayLg2,
		};

		this.updateCount = (lang, type) => {
			const { nbFieldsLg1, nbFieldsLg2, arrayLg1, arrayLg2 } = this.state;
			if (lang === 'Lg1' && type === 'plus')
				this.setState({
					nbFieldsLg1: nbFieldsLg1 + 1,
					arrayLg1: arrayLg1.concat(['']),
				});
			if (
				lang === 'Lg1' &&
				type === 'minus' &&
				nbFieldsLg1 > 1 &&
				arrayLg1[arrayLg1.length - 1] === ''
			) {
				arrayLg1.pop();
				this.setState({
					nbFieldsLg1: nbFieldsLg1 - 1,
					arrayLg1: arrayLg1,
				});
			}
			if (lang === 'Lg2' && type === 'plus')
				this.setState({
					nbFieldsLg2: nbFieldsLg2 + 1,
					arrayLg2: arrayLg2.concat(['']),
				});
			if (
				lang === 'Lg2' &&
				type === 'minus' &&
				nbFieldsLg2 > 1 &&
				arrayLg2[arrayLg2.length - 1] === ''
			) {
				arrayLg2.pop();
				this.setState({
					nbFieldsLg2: nbFieldsLg2 - 1,
					arrayLg2: arrayLg2,
				});
			}
		};

		this.initInput = (array, arrayName) => {
			return array.map((alt, i) =>
				<input
					key={i}
					type="text"
					value={alt}
					className="form-control form-group"
					onChange={e => this.handleChange(e.target.value, arrayName, i)}
				/>
			);
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
				handleChangeLg1(newArray.join('||'));
				handleChangeLg2(arrayLg2.join('||'));
			} else {
				handleChangeLg1(arrayLg1.join('||'));
				handleChangeLg2(newArray.join('||'));
			}
		};
	}
	render() {
		const { label } = this.props;
		const { arrayLg1, arrayLg2 } = this.state;

		const altLg1 = this.initInput(arrayLg1, 'arrayLg1');
		const altLg2 = this.initInput(arrayLg2, 'arrayLg2');

		const button = (lang, type) =>
			<span
				className={`glyphicon glyphicon-${type}`}
				onClick={() => this.updateCount(`${lang}`, `${type}`)}
			/>;
		return (
			<div className="row">
				<div className={`form-group col-md-6`}>
					<label>
						{label} ( {flagFr} ) {button('Lg1', 'minus')}{' '}
						{button('Lg1', 'plus')}
					</label>
					{altLg1}
				</div>
				<div className={`form-group col-md-6`}>
					<label>
						{label} ( {flagEn} ) {button('Lg2', 'minus')}{' '}
						{button('Lg2', 'plus')}
					</label>
					{altLg2}
				</div>
			</div>
		);
	}
}

InputMultiRmes.propTypes = {
	arrayLg1: PropTypes.array.isRequired,
	arrayLg2: PropTypes.array.isRequired,
	label: PropTypes.string.isRequired,
	handleChangeLg1: PropTypes.func.isRequired,
	handleChangeLg2: PropTypes.func.isRequired,
};

export default InputMultiRmes;
