import React from "react";
import styled from "styled-components";
import { useAtom } from "jotai";
import { showPotholesAtom, showSpeedBreakersAtom } from "../../store/atoms";
import { TbRoadOff } from "react-icons/tb";
import { MdSpeed } from "react-icons/md";
import { FiFilter } from "react-icons/fi";

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 12px 16px;
  gap: 16px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const FilterTitle = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 0.95rem;
  color: #1e293b;
  white-space: nowrap;

  svg {
    margin-right: 8px;
    color: #4299e1;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background-color: #e2e8f0;
  margin: 0 4px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 36px;
  height: 20px;
  margin-right: 8px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${(props) => props.color || "#4299e1"};
  }

  &:checked + span:before {
    transform: translateX(16px);
  }
`;

const ToggleSlider = styled.span<{ color?: string }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e0e0e0;
  transition: 0.3s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const FilterOptionText = styled.span`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #475569;

  svg {
    margin-right: 6px;
    font-size: 1rem;
  }
`;

const FilterCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 600;
  height: 18px;
  min-width: 18px;
  padding: 0 5px;
  border-radius: 9px;
  margin-left: 8px;
`;

const MapFilters: React.FC = () => {
  const [showPotholes, setShowPotholes] = useAtom(showPotholesAtom);
  const [showSpeedBreakers, setShowSpeedBreakers] = useAtom(
    showSpeedBreakersAtom
  );

  const potholeCount = 24;
  const speedBreakerCount = 18;

  return (
    <FiltersContainer>
      <FilterTitle>
        <FiFilter />
        Filters
      </FilterTitle>

      <Divider />

      <FilterOption>
        <ToggleSwitch>
          <ToggleInput
            type="checkbox"
            id="show-potholes"
            checked={showPotholes}
            onChange={() => setShowPotholes(!showPotholes)}
            color="#E63946"
          />
          <ToggleSlider color="#E63946" />
        </ToggleSwitch>
        <FilterOptionText>
          <TbRoadOff />
          Potholes
          <FilterCount>{potholeCount}</FilterCount>
        </FilterOptionText>
      </FilterOption>

      <FilterOption>
        <ToggleSwitch>
          <ToggleInput
            type="checkbox"
            id="show-speedbreakers"
            checked={showSpeedBreakers}
            onChange={() => setShowSpeedBreakers(!showSpeedBreakers)}
            color="#FFB703"
          />
          <ToggleSlider color="#FFB703" />
        </ToggleSwitch>
        <FilterOptionText>
          <MdSpeed />
          Speed Breakers
          <FilterCount>{speedBreakerCount}</FilterCount>
        </FilterOptionText>
      </FilterOption>
    </FiltersContainer>
  );
};

export default MapFilters;
