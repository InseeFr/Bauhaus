import React from 'react';
import RelationsView, {
	RelationsViewPerLg,
	RelationsViewPerLgContent,
} from './index';
import { shallow } from 'enzyme';
import { Note } from 'js/components/shared/note/note';
import { Link } from 'react-router-dom';

describe('RelationsView', () => {
	it('should display only the first lang', () => {
		const component = shallow(
			<RelationsView secondLang={false} langs={{ lg1: 'Lg1' }} />
		);
		const relationsViewPerLg = component.find(RelationsViewPerLg);
		expect(relationsViewPerLg.length).toBe(1);
		expect(relationsViewPerLg.props().langSuffix).toBe('Lg1');
		expect(relationsViewPerLg.props().currentLang).toBe('Lg1');
	});

	it('should display the first and second langs', () => {
		const component = shallow(
			<RelationsView secondLang={true} langs={{ lg1: 'Lg1', lg2: 'Lg2' }} />
		);
		const relationsViewPerLg = component.find(RelationsViewPerLg);
		expect(relationsViewPerLg.length).toBe(2);
		expect(relationsViewPerLg.get(0).props.langSuffix).toBe('Lg1');
		expect(relationsViewPerLg.get(0).props.currentLang).toBe('Lg1');

		expect(relationsViewPerLg.get(1).props.langSuffix).toBe('Lg2');
		expect(relationsViewPerLg.get(1).props.currentLang).toBe('Lg2');
	});
});

describe('RelationsViewPerLgContent', () => {
	describe('parent', () => {
		it('should not display the title if the parent is not defined', () => {
			const component = shallow(
				<RelationsViewPerLgContent title="title" alone="alone" />
			);

			expect(component.find('.linksTitle').length).toBe(0);
		});
		it('should display the title if the parent is defined', () => {
			const component = shallow(
				<RelationsViewPerLgContent
					title="title"
					alone="alone"
					parent={{ id: 1 }}
					parentTitle="parentTitle"
				/>
			);

			expect(
				component
					.find('.linksTitle')
					.html()
					.includes('parentTitle')
			).toBeTruthy();
		});
		it('should display a link to the parent', () => {
			const component = shallow(
				<RelationsViewPerLgContent
					title="title"
					alone="alone"
					parent={{ id: 1, labelLg1: 'labelLg1' }}
					parentTitle="parentTitle"
					parentPath="parentPath"
					langSuffix="Lg1"
				/>
			);

			const link = component.find(Link).get(0);
			expect(link.props.to).toBe('/operations/parentPath/1');
			expect(link.props.children).toBe('labelLg1');
		});
	});

	describe('children', () => {
		it('should not display the title if the children are not defined', () => {
			const component = shallow(
				<RelationsViewPerLgContent
					title="title"
					alone="alone"
					parent={{ id: 1 }}
					parentTitle="parentTitle"
				/>
			);

			expect(component.find('.linksTitle').length).toBe(1);
		});
		it('should display the title if the children are defined', () => {
			const component = shallow(
				<RelationsViewPerLgContent
					title="title"
					alone="alone"
					childrenTitle="childrenTitle"
					children={[]}
				/>
			);

			expect(component.find('.linksTitle').length).toBe(1);
			expect(
				component
					.find('.linksTitle')
					.html()
					.includes('childrenTitle')
			).toBeTruthy();
		});

		it('should display a link per child', () => {
			const component = shallow(
				<RelationsViewPerLgContent
					title="title"
					langSuffix="Lg1"
					alone="alone"
					childrenTitle="childrenTitle"
					childrenPath="childrenPath"
					children={[
						{ id: 0, labelLg1: 'label1' },
						{ id: 1, labelLg1: 'label2' },
						{ id: 2, labelLg1: 'label3' },
					]}
				/>
			);

			expect(component.find('li').length).toBe(3);

			const links = component.find(Link);
			expect(links.length).toBe(3);

			expect(links.get(0).props.to).toBe('/operations/childrenPath/0');
			expect(links.get(0).props.children).toBe('label1');

			expect(links.get(1).props.to).toBe('/operations/childrenPath/1');
			expect(links.get(1).props.children).toBe('label2');

			expect(links.get(2).props.to).toBe('/operations/childrenPath/2');
			expect(links.get(2).props.children).toBe('label3');
		});

		it('should sort children alphabetically', () => {
			const component = shallow(
				<RelationsViewPerLgContent
					title="title"
					langSuffix="Lg1"
					alone="alone"
					childrenTitle="childrenTitle"
					childrenPath="childrenPath"
					children={[
						{ id: 1, labelLg1: 'label2' },
						{ id: 0, labelLg1: 'label1' },
						{ id: 2, labelLg1: 'label3' },
					]}
				/>
			);

			expect(component.find('li').length).toBe(3);

			const links = component.find(Link);
			expect(links.length).toBe(3);

			expect(links.get(0).props.to).toBe('/operations/childrenPath/0');
			expect(links.get(0).props.children).toBe('label1');

			expect(links.get(1).props.to).toBe('/operations/childrenPath/1');
			expect(links.get(1).props.children).toBe('label2');

			expect(links.get(2).props.to).toBe('/operations/childrenPath/2');
			expect(links.get(2).props.children).toBe('label3');
		});
	});
});
describe('RelationsViewPerLg', () => {
	it('should display one Note', () => {
		const component = shallow(
			<RelationsViewPerLg title="title" currentLang="lg1" alone="alone" />
		);

		const note = component.find(Note);
		expect(note.length).toBe(1);

		const props = note.props();
		expect(props.allowEmpty).toBeTruthy();
		expect(props.title).toBe('title');
		expect(props.lang).toBe('lg1');
		expect(props.alone).toBeTruthy();
	});
});
