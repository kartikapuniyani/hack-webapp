import React from "react";
import styled from "styled-components";
import { useAtom } from "jotai";
import { showPotholesAtom, showSpeedBreakersAtom } from "../../store/atoms";

const FiltersContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.sm};
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${(props) => props.theme.spacing.sm};
  }
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.95rem;

  input {
    margin-right: ${(props) => props.theme.spacing.xs};
  }
`;

const FilterIcon = styled.span<{ color: string }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: ${(props) => props.theme.spacing.xs};
  background-color: ${(props) => props.color};
  border-radius: 50%;
`;

const FilterTitle = styled.div`
  font-weight: 500;
  margin-right: ${(props) => props.theme.spacing.md};
`;

const MapFilters: React.FC = () => {
  const [showPotholes, setShowPotholes] = useAtom(showPotholesAtom);
  const [showSpeedBreakers, setShowSpeedBreakers] = useAtom(
    showSpeedBreakersAtom
  );

  return (
    <FiltersContainer>
      <FilterTitle>Show on map:</FilterTitle>

      <FilterOption>
        <input
          type="checkbox"
          id="show-potholes"
          checked={showPotholes}
          onChange={(e) => setShowPotholes(e.target.checked)}
        />
        <FilterIcon color="#E63946" />
        <span>Potholes</span>
      </FilterOption>

      <FilterOption>
        <input
          type="checkbox"
          id="show-speedbreakers"
          checked={showSpeedBreakers}
          onChange={(e) => setShowSpeedBreakers(e.target.checked)}
        />
        <FilterIcon color="#FFB703" />
        <span>Speed Breakers</span>
      </FilterOption>
    </FiltersContainer>
  );
};

export default MapFilters;
