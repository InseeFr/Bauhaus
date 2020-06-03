import React from 'react';
import { render } from '@testing-library/react';
import Controls from './controls';
import { MemoryRouter } from 'react-router-dom';

const sendMessage = () => console.log('send');
describe('concept-send-controls', () => {
	it('renders without crashing', () => {
		render(<Controls isRecipientValid={true} sendMessage={sendMessage} />, {
			wrapper: MemoryRouter,
		});
	});

	it('should display two enabled buttons', () => {
		const { container } = render(
			<Controls
				isRecipientValid={true}
				sendMessage={sendMessage}
				subject="subject"
				message="body"
			/>,
			{
				wrapper: MemoryRouter,
			}
		);
		expect(container.querySelectorAll('button[disabled')).toHaveLength(0);
	});

	it('should display the SendButton if the message is not valid', () => {
		const { container } = render(
			<Controls isRecipientValid={false} sendMessage={sendMessage} />,
			{
				wrapper: MemoryRouter,
			}
		);
		expect(container.querySelectorAll('button[disabled')).toHaveLength(1);
	});

	it('should display an error if the destinataire n`est valide', () => {
		const { container } = render(
			<Controls isRecipientValid={false} sendMessage={sendMessage} />,
			{
				wrapper: MemoryRouter,
			}
		);
		expect(container.querySelector('.alert-danger').innerHTML).toBe(
			'<strong>Insert a valid e-mail address for the recipient</strong>'
		);
	});

	it('should display an error if the subject n`est valide', () => {
		const { container } = render(
			<Controls isRecipientValid={true} sendMessage={sendMessage} />,
			{
				wrapper: MemoryRouter,
			}
		);
		expect(container.querySelector('.alert-danger').innerHTML).toBe(
			'<strong>The mail subject is empty</strong>'
		);
	});

	it('should display an error if the body n`est valide', () => {
		const { container } = render(
			<Controls
				isRecipientValid={true}
				sendMessage={sendMessage}
				subject="subject"
			/>,
			{
				wrapper: MemoryRouter,
			}
		);
		expect(container.querySelector('.alert-danger').innerHTML).toBe(
			'<strong>The mail body is empty</strong>'
		);
	});
});
