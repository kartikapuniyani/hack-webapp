import React, { useCallback, useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  HeatmapLayer,
} from "@react-google-maps/api";
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
import {
  FiMapPin,
  FiAlertTriangle,
  FiLayers,
  FiEye,
  FiList,
  FiMap,
  FiActivity,
  FiLoader,
  FiInfo,
  FiThermometer,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { TbRoad, TbRoadOff } from "react-icons/tb";
import { MdSpeed } from "react-icons/md";

// Modern styled components with improved visual hierarchy
const MapWrapper = styled.div`
  position: relative;
  margin: 20px 0;
  display: flex;
  gap: 20px;
  padding: 1.5rem;
  background-color: #eee;
  border-radius: 1rem;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
`;

const MapContainer = styled.div`
  width: 80%;
  height: 75vh;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.07);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.12);
  }
`;

const LoadingMessage = styled.div`
  font-size: 1.2rem;
  color: #4a5568;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  font-weight: 500;
`;

// Modern card component for control panel
const Card = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.97);
  border: 1px solid rgba(240, 240, 240, 0.8);
`;

const ControlPanel = styled(Card)`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 20px;
  z-index: 10;
  width: 280px;
  transition: height 0.3s ease-in-out;
`;

const ControlHeader = styled.div`
  font-weight: 700;
  font-size: 1rem;
  color: #1e293b;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    margin-right: 8px;
    color: ${(props) => props.theme.colors.accent};
  }
`;

const ControlHeaderText = styled.div`
  display: flex;
  align-items: center;
`;

const MinimizeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: color 0.2s ease;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    color: #1e293b;
    background-color: #f1f5f9;
  }
`;

const ControlContent = styled.div<{ $isMinimized: boolean }>`
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: ${(props) => (props.$isMinimized ? "0px" : "500px")};
  opacity: ${(props) => (props.$isMinimized ? 0 : 1)};
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 10px 0;
`;

const SectionTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
  display: flex;
  align-items: center;

  svg {
    margin-right: 6px;
    font-size: 1rem;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e2e8f0;
  margin: 12px 0;
`;

// Modern toggle switch with animation
const ToggleContainer = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
  font-size: 0.9rem;
  user-select: none;
  color: #475569;
  padding: 8px 12px;
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8fafc;
  }

  svg {
    margin-right: 8px;
    font-size: 1.1rem;
  }
`;

const ToggleLabel = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleSlider = styled.div`
  display: inline-block;
  width: 42px;
  height: 22px;
  background-color: #e2e8f0;
  border-radius: 12px;
  position: relative;
  transition: background-color 0.3s;

  &::after {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: white;
    top: 2px;
    left: 2px;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const ToggleCheckbox = styled.input`
  height: 0;
  width: 0;
  visibility: hidden;

  &:checked + ${ToggleSlider} {
    background-color: ${(props) => props.theme.colors.accent};
  }

  &:checked + ${ToggleSlider}::after {
    transform: translateX(20px);
  }
`;

// Stats cards with improved visual design
const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
  width: 20%;
  overflow-x: auto;
  height: 100%;
  justify-content: space-between;
`;

const StatsCard = styled(Card)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: transform 0.2s;
  flex: 1;
  min-width: 140px;

  &:hover {
    transform: translateY(-4px);
  }
`;

const StatsIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: ${(props) => `${props.theme.colors.accent}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;

  svg {
    color: ${(props) => props.theme.colors.accent};
    font-size: 1.2rem;
  }
`;

const StatsValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
`;

const StatsLabel = styled.div`
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
`;

// Legend component with improved styling
const Legend = styled(Card)`
  position: absolute;
  bottom: 20px;
  left: 20px;
  padding: 16px;
  z-index: 10;
  max-width: 230px;
`;

const LegendTitle = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  color: #1e293b;

  svg {
    margin-right: 8px;
    color: ${(props) => props.theme.colors.accent};
  }
`;

const LegendGradient = styled.div`
  height: 12px;
  width: 100%;
  background: linear-gradient(
    to right,
    rgba(0, 255, 255, 1),
    rgba(0, 191, 255, 1),
    rgba(0, 127, 255, 1),
    rgba(0, 63, 255, 1),
    rgba(0, 0, 255, 1),
    rgba(63, 0, 91, 1),
    rgba(127, 0, 63, 1),
    rgba(191, 0, 31, 1),
    rgba(255, 0, 0, 1)
  );
  border-radius: 6px;
  margin-bottom: 6px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const LegendLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 12px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #475569;
  padding: 6px 0;
`;

const MarkerDot = styled.div<{ $type: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$type === "pothole"
      ? props.theme.colors.pothole
      : props.theme.colors.speedBreaker};
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
`;

// Custom map component
const RoadIssuesMap: React.FC = () => {
  const [roadIssues] = useAtom(roadIssuesAtom);
  const [selectedIssue, setSelectedIssue] = useAtom(selectedIssueAtom);
  const [mapViewport] = useAtom(mapViewportAtom);
  const [showPotholes, setShowPotholes] = useAtom(showPotholesAtom);
  const [showSpeedBreakers, setShowSpeedBreakers] = useAtom(
    showSpeedBreakersAtom
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [isControlsMinimized, setIsControlsMinimized] = useState(false);
  const [heatmapData, setHeatmapData] = useState<google.maps.LatLng[]>([]);
  const [heatmapPotholes, setHeatmapPotholes] = useState<google.maps.LatLng[]>(
    []
  );
  const [heatmapSpeedBreakers, setHeatmapSpeedBreakers] = useState<
    google.maps.LatLng[]
  >([]);

  // Use the hook to load the Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    id: "google-map-script",
    libraries: ["visualization"],
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Prepare heatmap data when road issues change
  useEffect(() => {
    if (isLoaded && window.google) {
      // Prepare all points
      const allPoints = roadIssues.map(
        (issue) =>
          new window.google.maps.LatLng(issue.position.lat, issue.position.lng)
      );
      setHeatmapData(allPoints);

      // Prepare pothole points
      const potholePoints = roadIssues
        .filter((issue) => issue.type === "pothole")
        .map(
          (issue) =>
            new window.google.maps.LatLng(
              issue.position.lat,
              issue.position.lng
            )
        );
      setHeatmapPotholes(potholePoints);

      // Prepare speed breaker points
      const speedBreakerPoints = roadIssues
        .filter((issue) => issue.type === "speedBreaker")
        .map(
          (issue) =>
            new window.google.maps.LatLng(
              issue.position.lat,
              issue.position.lng
            )
        );
      setHeatmapSpeedBreakers(speedBreakerPoints);
    }
  }, [isLoaded, roadIssues]);

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

  // Toggle controls minimization
  const toggleControlsMinimized = () => {
    setIsControlsMinimized(!isControlsMinimized);
  };

  // Custom map styles
  const mapStyles = [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [{ lightness: 20 }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ visibility: "simplified" }, { lightness: 10 }],
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [{ saturation: 20 }, { lightness: 10 }],
    },
  ];

  // Map options
  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: mapStyles,
    minZoom: 3,
    maxZoom: 19,
    gestureHandling: "greedy",
  };

  // Heatmap options
  const heatmapOptions = {
    radius: 25,
    opacity: 0.8,
    dissipating: true,
    maxIntensity: 10,
    gradient: [
      "rgba(0, 255, 255, 0)",
      "rgba(0, 255, 255, 1)",
      "rgba(0, 191, 255, 1)",
      "rgba(0, 127, 255, 1)",
      "rgba(0, 63, 255, 1)",
      "rgba(0, 0, 255, 1)",
      "rgba(0, 0, 223, 1)",
      "rgba(0, 0, 191, 1)",
      "rgba(0, 0, 159, 1)",
      "rgba(0, 0, 127, 1)",
      "rgba(63, 0, 91, 1)",
      "rgba(127, 0, 63, 1)",
      "rgba(191, 0, 31, 1)",
      "rgba(255, 0, 0, 1)",
    ],
  };

  // Update map center when viewport changes
  useEffect(() => {
    if (map) {
      map.panTo(mapViewport.center);
      map.setZoom(mapViewport.zoom);
    }
  }, [map, mapViewport]);

  // Determine which heatmap data to show based on filters
  const getHeatmapData = () => {
    if (showPotholes && showSpeedBreakers) {
      return heatmapData;
    } else if (showPotholes) {
      return heatmapPotholes;
    } else if (showSpeedBreakers) {
      return heatmapSpeedBreakers;
    }
    return [];
  };

  // Count statistics
  const potholeCount = roadIssues
    .filter((issue) => issue.type === "pothole")
    .reduce((acc, curr) => {
      return acc + (curr.verifiedCount ?? 0);
    }, 0);
  // const speedBreakerCount = roadIssues.filter(
  //   (issue) => issue.type === "speedBreaker"
  // ).length;
  const visibleCount = roadIssues
    .filter((issue) => issue.type === "pothole")
    .reduce((acc, curr) => {
      if ((curr?.verifiedCount ?? 0) < 15) {
        return acc;
      }

      return acc + 1;
    }, 0);

  if (loadError) {
    return (
      <MapContainer>
        <LoadingMessage>
          <FiAlertTriangle size={32} color="#e53e3e" />
          Error loading maps. Please check your internet connection.
        </LoadingMessage>
      </MapContainer>
    );
  }

  if (!isLoaded) {
    return (
      <MapContainer>
        <LoadingMessage>
          <FiLoader size={32} color="#4299e1" />
          Loading map...
        </LoadingMessage>
      </MapContainer>
    );
  }
  console.log("roadIssues", roadIssues);
  return (
    <MapWrapper>
      {/* Stats Cards */}
      <StatsContainer>
        <StatsCard>
          <StatsIconWrapper>
            <FiActivity />
          </StatsIconWrapper>
          <StatsValue>
            {roadIssues.reduce((acc, curr) => {
              return acc + (curr.verifiedCount ?? 0);
            }, 0)}
          </StatsValue>
          <StatsLabel>Total Issues</StatsLabel>
        </StatsCard>

        <StatsCard>
          <StatsIconWrapper>
            <TbRoadOff />
          </StatsIconWrapper>
          <StatsValue>{potholeCount}</StatsValue>
          <StatsLabel>Potholes</StatsLabel>
        </StatsCard>
        {/* 
        <StatsCard>
          <StatsIconWrapper>
            <MdSpeed />
          </StatsIconWrapper>
          <StatsValue>{speedBreakerCount}</StatsValue>
          <StatsLabel>Speed Breakers</StatsLabel>
        </StatsCard> */}

        <StatsCard>
          <StatsIconWrapper>
            <FiEye />
          </StatsIconWrapper>
          <StatsValue>{visibleCount}</StatsValue>
          <StatsLabel>Severe Areas</StatsLabel>
        </StatsCard>
      </StatsContainer>

      <MapContainer>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={mapViewport.center}
          zoom={mapViewport.zoom}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* Control Panel */}
          <ControlPanel>
            <ControlHeader>
              <ControlHeaderText>
                <FiMap />
                Map Controls
              </ControlHeaderText>
              <MinimizeButton onClick={toggleControlsMinimized}>
                {isControlsMinimized ? <FiChevronDown /> : <FiChevronUp />}
              </MinimizeButton>
            </ControlHeader>

            <ControlContent $isMinimized={isControlsMinimized}>
              <Divider />

              <SectionTitle>
                <TbRoad />
                Issue Types
              </SectionTitle>
              <ControlGroup>
                <ToggleContainer>
                  <ToggleLabel>
                    <TbRoadOff />
                    Potholes
                  </ToggleLabel>
                  <div>
                    <ToggleCheckbox
                      type="checkbox"
                      id="potholes-toggle"
                      checked={showPotholes}
                      onChange={() => setShowPotholes(!showPotholes)}
                    />
                    <ToggleSlider />
                  </div>
                </ToggleContainer>

                <ToggleContainer>
                  <ToggleLabel>
                    <MdSpeed />
                    Speed Breakers
                  </ToggleLabel>
                  <div>
                    <ToggleCheckbox
                      type="checkbox"
                      id="speedbreakers-toggle"
                      checked={showSpeedBreakers}
                      onChange={() => setShowSpeedBreakers(!showSpeedBreakers)}
                    />
                    <ToggleSlider />
                  </div>
                </ToggleContainer>
              </ControlGroup>

              <Divider />

              <SectionTitle>
                <FiLayers />
                Display Options
              </SectionTitle>
              <ControlGroup>
                <ToggleContainer>
                  <ToggleLabel>
                    <FiThermometer />
                    Show Heatmap
                  </ToggleLabel>
                  <div>
                    <ToggleCheckbox
                      type="checkbox"
                      id="heatmap-toggle"
                      checked={showHeatmap}
                      onChange={() => setShowHeatmap(!showHeatmap)}
                    />
                    <ToggleSlider />
                  </div>
                </ToggleContainer>

                <ToggleContainer>
                  <ToggleLabel>
                    <FiMapPin />
                    Show Markers
                  </ToggleLabel>
                  <div>
                    <ToggleCheckbox
                      type="checkbox"
                      id="markers-toggle"
                      checked={showMarkers}
                      onChange={() => setShowMarkers(!showMarkers)}
                    />
                    <ToggleSlider />
                  </div>
                </ToggleContainer>

                <ToggleContainer>
                  <ToggleLabel>
                    <FiInfo />
                    Show Legend
                  </ToggleLabel>
                  <div>
                    <ToggleCheckbox
                      type="checkbox"
                      id="legend-toggle"
                      checked={showLegend}
                      onChange={() => setShowLegend(!showLegend)}
                    />
                    <ToggleSlider />
                  </div>
                </ToggleContainer>
              </ControlGroup>
            </ControlContent>
          </ControlPanel>

          {/* Legend */}
          {showLegend && (
            <Legend>
              <LegendTitle>
                <FiList />
                Legend
              </LegendTitle>

              {showHeatmap && (
                <>
                  <SectionTitle>Heatmap Intensity</SectionTitle>
                  <LegendGradient />
                  <LegendLabels>
                    <span>Low</span>
                    <span>High</span>
                  </LegendLabels>
                </>
              )}

              {showMarkers && (
                <>
                  <Divider />
                  <SectionTitle>Issue Types</SectionTitle>
                  <LegendItem>
                    <MarkerDot $type="pothole" />
                    <span>Pothole</span>
                  </LegendItem>
                  {/* <LegendItem>
                    <MarkerDot $type="speedBreaker" />
                    <span>Speed Breaker</span>
                  </LegendItem> */}
                </>
              )}
            </Legend>
          )}

          {/* Heatmap Layer */}
          {showHeatmap && (
            <HeatmapLayer data={getHeatmapData()} options={heatmapOptions} />
          )}

          {/* Markers Layer */}
          {showMarkers &&
            filteredIssues.map((issue) => (
              <CustomMarker
                key={issue.id}
                position={{ lat: issue.position.lat, lng: issue.position.lon }}
                type={issue.type}
                onClick={() => handleMarkerClick(issue)}
              />
            ))}

          {/* Info Window */}
          {selectedIssue && (
            <CustomInfoWindow
              issue={selectedIssue}
              onClose={handleInfoWindowClose}
            />
          )}
        </GoogleMap>
      </MapContainer>
    </MapWrapper>
  );
};

export default RoadIssuesMap;
