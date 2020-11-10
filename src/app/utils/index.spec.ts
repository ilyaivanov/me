import { interpolate } from "./index";

describe("Having a domain [240, 500] and a output range of [12, 16]", () => {
  it("interpolating 240 gives 12", function () {
    const domain = [240, 500];
    const range = [12, 16];
    expect(interpolate(domain, range, 240)).toBe(12);
  });
  it("interpolating 370 (middle point of the domain) gives 14", function () {
    const domain = [240, 500];
    const middlePoint = 370;
    const range = [12, 16];
    expect(interpolate(domain, range, middlePoint)).toBe(14);
  });

  it("interpolating 500 gives 16", function () {
    const domain = [240, 500];
    const range = [12, 16];
    expect(interpolate(domain, range, 500)).toBe(16);
  });
  it("interpolating 1000 clamps to 16", function () {
    const domain = [240, 500];
    const range = [12, 16];
    expect(interpolate(domain, range, 1000)).toBe(16);
  });

  it("interpolating 10 clamps to 12", function () {
    const domain = [240, 500];
    const range = [12, 16];
    expect(interpolate(domain, range, 10)).toBe(12);
  });
});
