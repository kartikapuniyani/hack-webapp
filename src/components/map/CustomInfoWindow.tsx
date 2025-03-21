import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import styled from "styled-components";
import { RoadIssue } from "../../types/mapTypes";

// Styled components for the info window
const InfoWindowContainer = styled.div`
  width: 280px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
`;

const InfoHeader = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
`;

const IssueIcon = styled.div<{ issueType: "pothole" | "speedBreaker" }>`
  width: 24px;
  height: 24px;
  border-radius: ${(props) => (props.issueType === "pothole" ? "50%" : "0")};
  background-color: ${(props) =>
    props.issueType === "pothole" ? "#e74c3c" : "#f39c12"};
  margin-right: 12px;
  transform: ${(props) =>
    props.issueType === "speedBreaker" ? "rotate(45deg)" : "none"};
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const InfoContent = styled.div`
  padding-bottom: 8px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const Badge = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #4a5568;
`;

const VerifiedBadge = styled(Badge)`
  display: flex;
  align-items: center;
  background-color: #ebf8ff;
  border-color: #bee3f8;
  color: #2b6cb0;
`;

const CheckIcon = styled.div`
  width: 12px;
  height: 12px;
  margin-right: 4px;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    width: 8px;
    height: 4px;
    border-left: 2px solid #2b6cb0;
    border-bottom: 2px solid #2b6cb0;
    transform: rotate(-45deg);
    top: 3px;
    left: 2px;
  }
`;

const SeverityContainer = styled.div`
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #eaeaea;
`;

const SeverityTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
`;

const SeverityBar = styled.div`
  display: flex;
  height: 8px;
  background-color: #eaeaea;
  border-radius: 4px;
  overflow: hidden;
`;

const SeverityFill = styled.div<{ severity: number }>`
  height: 100%;
  width: ${(props) => (props.severity / 5) * 100}%;
  background-color: ${(props) => {
    if (props.severity <= 2) return "#4caf50";
    if (props.severity <= 4) return "#ff9800";
    return "#f44336";
  }};
  border-radius: 4px;
`;

const SeverityLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
`;

const SeverityLabel = styled.span`
  font-size: 10px;
  color: #888;
`;

interface CustomInfoWindowProps {
  issue: RoadIssue;
  onClose: () => void;
}

const CustomInfoWindow: React.FC<CustomInfoWindowProps> = ({
  issue,
  onClose,
}) => {
  const issueType = issue.type as "pothole" | "speedBreaker";
  const typeName = issueType === "pothole" ? "Pothole" : "Speed Breaker";

  // Format date in a more readable way
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <InfoWindow
      position={issue.position}
      onCloseClick={onClose}
      options={{
        pixelOffset: new window.google.maps.Size(12, -15),
        maxWidth: 320,
        headerContent: `<strong>${
          issue.type === "pothole" ? "Pothole" : "Speed breaker"
        }</strong>`,
      }}
    >
      <InfoWindowContainer>
        <InfoHeader>
          <IssueIcon issueType={issueType} />
          <HeaderTitle>{typeName}</HeaderTitle>
        </InfoHeader>

        <InfoContent>
          <InfoRow>
            <InfoLabel>Reported:</InfoLabel>
            <InfoValue>{formatDate(issue.reportedAt)}</InfoValue>
          </InfoRow>

          {issue.verifiedCount !== undefined && (
            <InfoRow>
              <InfoLabel>Verification:</InfoLabel>
              <VerifiedBadge>
                <CheckIcon />
                <span>Verified by {issue.verifiedCount} users</span>
              </VerifiedBadge>
            </InfoRow>
          )}

          {issue.severity !== undefined && (
            <SeverityContainer>
              <SeverityTitle>Severity Assessment</SeverityTitle>
              <SeverityBar>
                <SeverityFill severity={issue.severity} />
              </SeverityBar>
              <SeverityLabels>
                <SeverityLabel>Minor</SeverityLabel>
                <SeverityLabel>Moderate</SeverityLabel>
                <SeverityLabel>Severe</SeverityLabel>
              </SeverityLabels>
            </SeverityContainer>
          )}
        </InfoContent>
      </InfoWindowContainer>
    </InfoWindow>
  );
};

export default CustomInfoWindow;
