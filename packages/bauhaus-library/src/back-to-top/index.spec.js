import React from "react";
import { shallow } from "enzyme";
import BackToTop from "./";

describe("BackToTop", () => {
  it("renders without crashing", () => {
    shallow(<BackToTop />);
  });
  it("should contain a href=# link", () => {
    const wrapper = shallow(<BackToTop label="Back to Top" />);
    expect(wrapper.prop("href")).toBe("#");
  });
  it("should contain the right text", () => {
    const wrapper = shallow(<BackToTop label="Back to Top" />);
    expect(wrapper.text()).toBe("Back to Top");
  });
});
