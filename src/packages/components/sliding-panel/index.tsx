import SlidingPanel, { SliderProps } from "react-sliding-side-panel";

type RightSlidingPanelTypes = Omit<SliderProps, "type" | "size"> &
  Partial<Pick<SliderProps, "size">>;

export const RightSlidingPanel = ({ size = 60, ...props }: Readonly<RightSlidingPanelTypes>) => {
  return <SlidingPanel type="right" size={size} {...props} />;
};
