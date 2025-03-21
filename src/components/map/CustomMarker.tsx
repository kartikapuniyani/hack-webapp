import React from "react";
import { OverlayView } from "@react-google-maps/api";
import styled from "styled-components";
import { TbRoadOff } from "react-icons/tb";
import { MdWarning } from "react-icons/md";

// Marker container with shared styles
const MarkerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid currentColor;
    z-index: -1;
  }
`;

// Pothole marker with specific styling
const PotholeMarkerContainer = styled(MarkerContainer)`
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: #c53030;
  border: 2px solid #c53030;
`;

// Speed breaker marker with specific styling
const SpeedBreakerMarkerContainer = styled(MarkerContainer)`
  background: linear-gradient(135deg, #ed8936, #dd6b20);
  color: #dd6b20;
  border: 2px solid #dd6b20;
`;

// Icon styling
const IconWrapper = styled.div`
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
`;

/**
 * Interface for CustomMarker props
 */
interface CustomMarkerProps {
  position: google.maps.LatLngLiteral;
  type: "pothole" | "speedBreaker";
  onClick: () => void;
}

/**
 * CustomMarker Component with professional styling using React Icons
 * @param props - Component props
 * @returns React component with appropriate marker style
 */
export const CustomMarker: React.FC<CustomMarkerProps> = ({
  position,
  type,
  onClick,
}) => {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(width: number, height: number) => ({
        x: -(width / 2),
        y: -height,
      })}
    >
      {type === "pothole" ? (
        <PotholeMarkerContainer onClick={onClick}>
          <IconWrapper>
            <TbRoadOff />
          </IconWrapper>
        </PotholeMarkerContainer>
      ) : (
        <SpeedBreakerMarkerContainer onClick={onClick}>
          <IconWrapper>
            <MdWarning />
          </IconWrapper>
        </SpeedBreakerMarkerContainer>
      )}
    </OverlayView>
  );
};

/**
 * Alternative marker designs - uncomment below and change the JSX above
 * to use these alternative marker designs if preferred
 */

// Premium design with uniform shape but different icons
const PremiumMarkerContainer = styled(MarkerContainer)`
  background: ${(props) => props.color || "#3182ce"};
  color: ${(props) => props.color || "#3182ce"};
  border: 2px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/**
 * Alternative premium marker with uniform style but different colors/icons
 */
export const PremiumMarker: React.FC<CustomMarkerProps> = ({
  position,
  type,
  onClick,
}) => {
  // Configuration for different marker types
  const markerConfig = {
    pothole: {
      color: "#e53e3e",
      icon: <TbRoadOff />,
    },
    speedBreaker: {
      color: "#dd6b20",
      icon: <MdWarning />,
    },
  };

  const config = markerConfig[type];

  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(width: number, height: number) => ({
        x: -(width / 2),
        y: -height,
      })}
    >
      <PremiumMarkerContainer onClick={onClick} color={config.color}>
        <IconWrapper>{config.icon}</IconWrapper>
      </PremiumMarkerContainer>
    </OverlayView>
  );
};

export default CustomMarker;
