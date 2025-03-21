import React from "react";
import styled from "styled-components";

const LegendContainer = styled.div`
  position: absolute;
  bottom: ${(props) => props.theme.spacing.md};
  left: ${(props) => props.theme.spacing.md};
  background-color: white;
  padding: ${(props) => props.theme.spacing.sm};
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    bottom: ${(props) => props.theme.spacing.sm};
    right: ${(props) => props.theme.spacing.sm};
  }
`;

const LegendTitle = styled.div`
  font-weight: 500;
  margin-bottom: ${(props) => props.theme.spacing.xs};
  font-size: 0.9rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.xs};
  font-size: 0.85rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const LegendIcon = styled.span<{ color: string }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: ${(props) => props.theme.spacing.xs};
  background-color: ${(props) => props.color};
  border-radius: 50%;
`;

const MapLegend: React.FC = () => {
  return (
    <LegendContainer>
      <LegendTitle>Legend</LegendTitle>
      <LegendItem>
        <LegendIcon color="#E63946" />
        <span>Pothole</span>
      </LegendItem>
      <LegendItem>
        <LegendIcon color="#FFB703" />
        <span>Speed Breaker</span>
      </LegendItem>
    </LegendContainer>
  );
};

export default MapLegend;
