import SlidingPanelImport, { SliderProps } from "react-sliding-side-panel";

const SlidingPanel: React.ComponentType<SliderProps> =
  (SlidingPanelImport as unknown as { default: React.ComponentType<SliderProps> }).default ??
  (SlidingPanelImport as unknown as React.ComponentType<SliderProps>);

type RightSlidingPanelTypes = Omit<SliderProps, "type" | "size"> &
  Partial<Pick<SliderProps, "size">>;

export const RightSlidingPanel = ({ size = 60, ...props }: Readonly<RightSlidingPanelTypes>) => {
  return <SlidingPanel type="right" size={size} {...props} />;
};
