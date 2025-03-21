import { DefaultTheme } from "styled-components";

// Extract RGB values for rgba usage in animations and transitions
const primaryHex = "#4361EE";
const primaryRgb = "67, 97, 238";

export const theme: DefaultTheme = {
  colors: {
    primary: primaryHex,
    primaryRgb: primaryRgb, // Added for RGBA usage
    secondary: "#3A0CA3",
    background: "#F8F9FA",
    text: "#212529",
    accent: "#F72585",
    pothole: "#E63946",
    speedBreaker: "#FFB703",
    warning: "#FFA500",
  },

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem",
    xl: "3rem",
  },

  breakpoints: {
    mobile: "576px",
    tablet: "768px",
    desktop: "1024px",
  },
};
