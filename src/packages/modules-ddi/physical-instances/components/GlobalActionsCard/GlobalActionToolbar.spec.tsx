import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GlobalActionToolbar } from "./GlobalActionToolbar";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				"physicalInstance.view.export": "Exporter",
				"physicalInstance.view.publish": "Publier",
				"physicalInstance.view.duplicatePhysicalInstance": "Dupliquer",
			};
			return translations[key] || key;
		},
	}),
}));

vi.mock("primereact/button", () => ({
	Button: ({ label, onClick, icon, ...props }: any) => (
		<button type="button" onClick={onClick} {...props}>
			{icon && <span className={icon} />}
			{label}
		</button>
	),
}));

vi.mock("primereact/splitbutton", () => ({
	SplitButton: ({ label, onClick, model, icon, ...props }: any) => (
		<div data-testid="split-button" {...props}>
			<button type="button" onClick={onClick} aria-label={props["aria-label"]}>
				{icon && <span className={icon} />}
				{label}
			</button>
			{model && (
				<div data-testid="split-button-menu">
					{model.map((item: any, index: number) => (
						<button
							key={index}
							type="button"
							onClick={item.command}
							data-testid={`menu-item-${item.label}`}
						>
							{item.icon && <span className={item.icon} />}
							{item.label}
						</button>
					))}
				</div>
			)}
		</div>
	),
}));

describe("GlobalActionToolbar", () => {
	const mockOnExport = vi.fn();
	const mockOnDuplicate = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render export, duplicate and publish buttons", () => {
		render(<GlobalActionToolbar onExport={mockOnExport} onDuplicate={mockOnDuplicate} />);

		expect(screen.getByText("Exporter")).toBeInTheDocument();
		expect(screen.getByText("Dupliquer")).toBeInTheDocument();
		expect(screen.getByText("Publier")).toBeInTheDocument();
	});

	it("should call onExport with DDI3 when export button is clicked", () => {
		render(<GlobalActionToolbar onExport={mockOnExport} />);

		const exportButton = screen.getByText("Exporter");
		fireEvent.click(exportButton);

		expect(mockOnExport).toHaveBeenCalledTimes(1);
		expect(mockOnExport).toHaveBeenCalledWith("DDI3");
	});

	it("should render export menu with DDI3 and DDI4 options", () => {
		render(<GlobalActionToolbar onExport={mockOnExport} />);

		expect(screen.getByTestId("menu-item-DDI 3.3")).toBeInTheDocument();
		expect(screen.getByTestId("menu-item-DDI 4.0/JSON")).toBeInTheDocument();
	});

	it("should call onExport with DDI3 when DDI3 menu item is clicked", () => {
		render(<GlobalActionToolbar onExport={mockOnExport} />);

		const ddi3MenuItem = screen.getByTestId("menu-item-DDI 3.3");
		fireEvent.click(ddi3MenuItem);

		expect(mockOnExport).toHaveBeenCalledTimes(1);
		expect(mockOnExport).toHaveBeenCalledWith("DDI3");
	});

	it("should call onExport with DDI4 when DDI4 menu item is clicked", () => {
		render(<GlobalActionToolbar onExport={mockOnExport} />);

		const ddi4MenuItem = screen.getByTestId("menu-item-DDI 4.0/JSON");
		fireEvent.click(ddi4MenuItem);

		expect(mockOnExport).toHaveBeenCalledTimes(1);
		expect(mockOnExport).toHaveBeenCalledWith("DDI4");
	});

	it("should have correct aria-labels for accessibility", () => {
		render(<GlobalActionToolbar onExport={mockOnExport} />);

		// SplitButton creates multiple elements with the same aria-label
		const exportElements = screen.getAllByLabelText("Exporter");
		expect(exportElements.length).toBeGreaterThan(0);
		expect(screen.getByLabelText("Publier")).toBeInTheDocument();
	});

	it("should render buttons with correct icons", () => {
		const { container } = render(<GlobalActionToolbar onExport={mockOnExport} onDuplicate={mockOnDuplicate} />);

		const downloadIcon = container.querySelector(".pi-download");
		const copyIcon = container.querySelector(".pi-copy");
		const sendIcon = container.querySelector(".pi-send");

		expect(downloadIcon).toBeInTheDocument();
		expect(copyIcon).toBeInTheDocument();
		expect(sendIcon).toBeInTheDocument();
	});

	it("should render buttons with secondary severity", () => {
		render(<GlobalActionToolbar onExport={mockOnExport} onDuplicate={mockOnDuplicate} />);

		const splitButton = screen.getByTestId("split-button");
		const duplicateButton = screen.getByLabelText("Dupliquer");
		const publishButton = screen.getByLabelText("Publier");

		expect(splitButton).toHaveAttribute("severity", "secondary");
		expect(duplicateButton).toHaveAttribute("severity", "secondary");
		expect(publishButton).toHaveAttribute("severity", "secondary");
	});

	it("should call onDuplicate when duplicate button is clicked", () => {
		render(<GlobalActionToolbar onExport={mockOnExport} onDuplicate={mockOnDuplicate} />);

		const duplicateButton = screen.getByText("Dupliquer");
		fireEvent.click(duplicateButton);

		expect(mockOnDuplicate).toHaveBeenCalledTimes(1);
	});

	it("should render without onDuplicate callback", () => {
		expect(() => render(<GlobalActionToolbar onExport={mockOnExport} />)).not.toThrow();
		expect(screen.getByText("Dupliquer")).toBeInTheDocument();
	});

	it("should have publish button disabled", () => {
		render(<GlobalActionToolbar onExport={mockOnExport} onDuplicate={mockOnDuplicate} />);

		const publishButton = screen.getByLabelText("Publier");
		expect(publishButton).toBeDisabled();
	});
});
