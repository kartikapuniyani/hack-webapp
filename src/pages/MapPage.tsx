/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import styled from "styled-components";
import { useAtom } from "jotai";
import { roadIssuesAtom, mapViewportAtom } from "../store/atoms";
import RoadIssuesMap from "../components/map/GoogleMap";
import CitySearch from "../components/search/CitySearch";
import MapFilters from "../components/map/MapFilters";
import { fetchMockDataForCity } from "../utils/mockData";
import { getData } from "../api/common";
import {
  getAnomalySeverity,
  processAnomalyData,
  transformLatLongData,
} from "../utils/common";

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
    const { viewport } = fetchMockDataForCity("gurgaon");

    const getDatappp = async () => {
      try {
        const rest = await getData("gurgaon");

        // Process and cluster the data using our utility
        const clusteredData = processAnomalyData(rest, 10); // 5 meter radius

        // Add severity scores to each cluster
        const enhancedData = clusteredData.map((cluster) => ({
          ...cluster,
          severity: getAnomalySeverity(cluster),
        }));

        const tOutput = transformLatLongData(enhancedData ?? []);
        console.log("tOutput", tOutput);
        setRoadIssues(tOutput);
        setMapViewport(viewport);
      } catch {
        console.log("Error");
      }
    };

    getDatappp();
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
