import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryRgb: string; // Added for RGBA usage
      secondary: string;
      background: string;
      text: string;
      accent: string;
      pothole: string;
      speedBreaker: string;
      warning: string;
    };

    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };

    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
  }
}
