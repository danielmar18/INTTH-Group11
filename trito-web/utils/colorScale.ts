// Type alias for an RGB color array
type RGBColor = [number, number, number];

export const mapValueToColorScale = (value: number): RGBColor => {
  const minColor: RGBColor = [255, 0, 0];
  const maxColor: RGBColor = [0, 255, 0];
  // Ensure that the value is within the 0 to 1 range
  const normalizedValue = Math.max(0, Math.min(1, value));

  // Determine which step the value falls into
  const stepIndex = Math.round(normalizedValue * (10 - 1));

  // Calculate the interpolation factor
  const factor = stepIndex / (10 - 1);

  // Interpolate between the min and max colors
  const interpolatedColor: RGBColor = [
    Math.round(minColor[0] + factor * (maxColor[0] - minColor[0])),
    Math.round(minColor[1] + factor * (maxColor[1] - minColor[1])),
    Math.round(minColor[2] + factor * (maxColor[2] - minColor[2])),
  ];

  return interpolatedColor;
}
