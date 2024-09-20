import SlidingPanel, { SliderProps } from "react-sliding-side-panel"

type RightSlidingPanelTypes = Omit<SliderProps, 'type' | 'size'>

export const RightSlidingPanel = ({ ...props}: Readonly<RightSlidingPanelTypes>) => {
    return <SlidingPanel type="right" size={60} {...props} />
}