/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import styled from "styled-components";
import { useAtom } from "jotai";
import { roadIssuesAtom, mapViewportAtom } from "../store/atoms";
import RoadIssuesMap from "../components/map/GoogleMap";
import CitySearch from "../components/search/CitySearch";
import MapFilters from "../components/map/MapFilters";
import MapLegend from "../components/map/MapLegend";
import { fetchMockDataForCity } from "../utils/mockData";

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
  const [, setRoadIssues] = useAtom(roadIssuesAtom);
  const [, setMapViewport] = useAtom(mapViewportAtom);

  useEffect(() => {
    // Initialize with mock data for a default city
    const { issues, viewport } = fetchMockDataForCity("new york");
    setRoadIssues(issues);
    setMapViewport(viewport);
  }, [setRoadIssues, setMapViewport]);

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
