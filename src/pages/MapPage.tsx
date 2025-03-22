/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import styled from "styled-components";
import RoadIssuesMap from "../components/map/GoogleMap";
import CitySearch from "../components/search/CitySearch";
import MapFilters from "../components/map/MapFilters";
import { useSetRoad } from "../hooks/useSetRoad";

const MapContainer = styled.div`
  position: relative;
`;

const UserWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
`;
const MapPage: React.FC = () => {
  useSetRoad();

  return (
    <div>
      <UserWrapper>
        <CitySearch />
        <MapFilters />
      </UserWrapper>
      <MapContainer>
        <RoadIssuesMap />
      </MapContainer>
    </div>
  );
};

export default MapPage;
