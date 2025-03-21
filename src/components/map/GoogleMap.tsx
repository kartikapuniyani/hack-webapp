import React, { useCallback, useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useAtom } from "jotai";
import {
  roadIssuesAtom,
  selectedIssueAtom,
  mapViewportAtom,
  showPotholesAtom,
  showSpeedBreakersAtom,
} from "../../store/atoms";
import styled from "styled-components";
import { RoadIssue } from "../../types/mapTypes";
import { GOOGLE_MAPS_API_KEY } from "../../constants/apiKeys";
import CustomMarker from "./CustomMarker";
import CustomInfoWindow from "./CustomInfoWindow";

const MapContainer = styled.div`
  width: 100%;
  height: 70vh;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

const LoadingMessage = styled.div`
  font-size: 1.2rem;
  color: #666;
`;

// Define the Google Maps API key - you would normally store this in an environment variable
// In production, you should restrict this key to your domain

const RoadIssuesMap: React.FC = () => {
  const [roadIssues] = useAtom(roadIssuesAtom);
  const [selectedIssue, setSelectedIssue] = useAtom(selectedIssueAtom);
  const [mapViewport] = useAtom(mapViewportAtom);
  const [showPotholes] = useAtom(showPotholesAtom);
  const [showSpeedBreakers] = useAtom(showSpeedBreakersAtom);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Use the hook to load the Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    // Prevent Google Maps from loading multiple times
    id: "google-map-script",
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Filter issues based on current settings
  const filteredIssues = roadIssues.filter((issue) => {
    if (issue.type === "pothole" && !showPotholes) return false;
    if (issue.type === "speedBreaker" && !showSpeedBreakers) return false;
    return true;
  });

  // Handle marker click
  const handleMarkerClick = useCallback(
    (issue: RoadIssue) => {
      setSelectedIssue(issue);
    },
    [setSelectedIssue]
  );

  // Handle closing the info window
  const handleInfoWindowClose = useCallback(() => {
    setSelectedIssue(null);
  }, [setSelectedIssue]);

  // Map options
  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: true,
    fullscreenControl: false,
  };

  // Update map center when viewport changes
  useEffect(() => {
    if (map) {
      map.panTo(mapViewport.center);
      map.setZoom(mapViewport.zoom);
    }
  }, [map, mapViewport]);

  if (loadError) {
    return (
      <MapContainer>
        Error loading maps. Please check your internet connection.
      </MapContainer>
    );
  }

  if (!isLoaded) {
    return (
      <MapContainer>
        <LoadingMessage>Loading map...</LoadingMessage>
      </MapContainer>
    );
  }

  return (
    <MapContainer>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={mapViewport.center}
        zoom={mapViewport.zoom}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {filteredIssues.map((issue: RoadIssue) => (
          <CustomMarker
            key={issue.id}
            position={issue.position}
            type={issue.type as "pothole" | "speedBreaker"}
            onClick={() => handleMarkerClick(issue)}
          />
        ))}

        {selectedIssue && (
          <CustomInfoWindow
            issue={selectedIssue}
            onClose={handleInfoWindowClose}
          />
        )}
      </GoogleMap>
    </MapContainer>
  );
};

export default RoadIssuesMap;
