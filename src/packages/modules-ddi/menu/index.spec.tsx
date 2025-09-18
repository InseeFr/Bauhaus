import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { Menu } from './index';

vi.mock('@components/menu', () => ({
    MainMenu: ({ paths }: { paths: any[] }) => (
        <nav data-testid="main-menu">
            {paths.map((path, index) => (
                <a
                    key={index}
                    href={path.path}
                    className={path.className}
                    data-testid={`menu-item-${index}`}
                    {...path.attrs}
                >
                    {path.label}
                </a>
            ))}
        </nav>
    ),
}));

const renderWithRouter = (initialEntries: string[] = ['/']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <Menu />
        </MemoryRouter>
    );
};

describe('Menu Component', () => {
    it('should render menu with Physical Instances item', () => {
        renderWithRouter();

        expect(screen.getByTestId('main-menu')).toBeInTheDocument();
        expect(screen.getByText('Physical Instances')).toBeInTheDocument();
    });

    it('should mark Physical Instances as active when on physical-instances path', () => {
        renderWithRouter(['/ddi/physical-instances']);

        const menuItem = screen.getByTestId('menu-item-0');
        expect(menuItem).toHaveClass('active');
        expect(menuItem).toHaveAttribute('aria-current', 'page');
    });

    it('should not mark Physical Instances as active when on different path', () => {
        renderWithRouter(['/other-path']);

        const menuItem = screen.getByTestId('menu-item-0');
        expect(menuItem).not.toHaveClass('active');
        expect(menuItem).not.toHaveAttribute('aria-current');
    });

    it('should have correct path for Physical Instances', () => {
        renderWithRouter();

        const physicalInstancesLink = screen.getByText('Physical Instances');
        expect(physicalInstancesLink).toHaveAttribute('href', '/ddi/physical-instances');
    });

    it('should render menu item with correct order', () => {
        renderWithRouter();

        const menuItems = screen.getAllByTestId(/menu-item-/);
        expect(menuItems).toHaveLength(1);
        expect(menuItems[0]).toHaveTextContent('Physical Instances');
    });

    it('should handle nested physical-instances paths', () => {
        renderWithRouter(['/ddi/physical-instances/details/123']);

        const menuItem = screen.getByTestId('menu-item-0');
        expect(menuItem).toHaveClass('active');
        expect(menuItem).toHaveAttribute('aria-current', 'page');
    });
});