import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GlobalActionToolbar } from "./GlobalActionToolbar";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				"physicalInstance.view.export": "Exporter",
				"physicalInstance.view.publish": "Publier",
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

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render export and publish buttons", () => {
		render(<GlobalActionToolbar onExport={mockOnExport} />);

		expect(screen.getByText("Exporter")).toBeInTheDocument();
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
		const { container } = render(<GlobalActionToolbar onExport={mockOnExport} />);

		const downloadIcon = container.querySelector(".pi-download");
		const sendIcon = container.querySelector(".pi-send");

		expect(downloadIcon).toBeInTheDocument();
		expect(sendIcon).toBeInTheDocument();
	});

	it("should render buttons with secondary severity", () => {
		render(<GlobalActionToolbar onExport={mockOnExport} />);

		const splitButton = screen.getByTestId("split-button");
		const publishButton = screen.getByLabelText("Publier");

		expect(splitButton).toHaveAttribute("severity", "secondary");
		expect(publishButton).toHaveAttribute("severity", "secondary");
	});
});
