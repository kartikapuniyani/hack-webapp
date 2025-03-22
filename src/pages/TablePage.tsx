/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import styled from "styled-components";
import { useAtom } from "jotai";
import { roadIssuesAtom } from "../store/atoms";
import { useSetRoad } from "../hooks/useSetRoad";

// Custom cell components
const IdCell = ({ id }: { id: string }) => {
  return (
    <IdContainer>
      <IdBadge>{id.slice(0, 6)}</IdBadge>
    </IdContainer>
  );
};

const TypeCell = ({ type }: { type: "pothole" | "speedBreaker" }) => {
  return (
    <TypeContainer>
      <TypeBadge $type={type.toLowerCase()}>
        {type.toLowerCase() === "pothole" ? "Pothole" : "Speed Breaker"}
      </TypeBadge>
    </TypeContainer>
  );
};

const LocationCell = ({ lat, lng }: { lat: number; lng: number }) => {
  return (
    <LocationContainer>
      <CoordinateValue>{lat?.toFixed(4)}</CoordinateValue>,{" "}
      <CoordinateValue>{lng?.toFixed(4)}</CoordinateValue>
      <LocationTooltip>
        <i className="fas fa-map-marker-alt"></i>
        View on map
      </LocationTooltip>
    </LocationContainer>
  );
};

// @ts-ignore
const SeverityCell = ({ severity }: { severity?: number }) => {
  if (severity === undefined) return <span>N/A</span>;

  return (
    <SeverityContainer>
      <SeverityBar>
        {[1, 2, 3, 4, 5].map((dot) => (
          <SeverityDot key={dot} $active={dot <= severity} $level={severity} />
        ))}
      </SeverityBar>
      <SeverityText>{severity}/5</SeverityText>
    </SeverityContainer>
  );
};

const DateTimeCell = ({ timestamp }: { timestamp: any }) => {
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const date = new Date(timestamp);

  return (
    <DateTimeContainer>
      <DateValue>{formatDate(date)}</DateValue>
      <TimeValue>{formatTime(date)}</TimeValue>
    </DateTimeContainer>
  );
};

const VerifiedCountCell = ({ count }: { count: number }) => {
  return (
    <VerifiedContainer>
      <VerifiedCount>{count || 0}</VerifiedCount>
      <VerifiedIcon className={count > 0 ? "active" : ""}>
        <i className="fas fa-check-circle"></i>
      </VerifiedIcon>
    </VerifiedContainer>
  );
};

const StatusCell = ({ status = "Pending" }: { status?: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FFC107";
      case "in progress":
        return "#3498db";
      case "resolved":
        return "#2ecc71";
      case "rejected":
        return "#e74c3c";
      default:
        return "#FFC107";
    }
  };

  const getBgColor = (status: string) => {
    const color = getStatusColor(status);
    return `${color}20`; // 20% opacity version of the color
  };

  return (
    <StatusContainer>
      <StatusBadge
        $color={getStatusColor(status)}
        $bgColor={getBgColor(status)}
      >
        {status}
      </StatusBadge>
    </StatusContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const TableHeader = styled.thead`
  background-color: ${(props) => props.theme.colors.background};

  th {
    text-align: left;
    padding: ${(props) => props.theme.spacing.md};
    font-weight: 600;
    color: ${(props) => props.theme.colors.text};
    border-bottom: 1px solid #f0f0f0;
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.7px;
  }
`;

const TableBody = styled.tbody`
  tr {
    transition: all 0.2s ease;

    &:hover {
      background-color: #f5f8ff;
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }

    td {
      padding: ${(props) => props.theme.spacing.md};
      border-bottom: 1px solid #f0f0f0;
      font-size: 0.9rem;
    }

    &:last-child td {
      border-bottom: none;
    }
  }
`;

// Styled components for each cell type
const IdContainer = styled.div`
  display: flex;
  align-items: center;
`;

const IdBadge = styled.span`
  font-family: "Roboto Mono", monospace;
  background-color: #f7f9fc;
  color: ${(props) => props.theme.colors.accent};
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
`;

const TypeContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TypeBadge = styled.span<{ $type: string }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${(props) =>
    props.$type === "pothole"
      ? props.theme.colors.pothole
      : props.theme.colors.speedBreaker};
  color: white;
  box-shadow: 0 2px 4px
    ${(props) =>
      props.$type === "pothole"
        ? `${props.theme.colors.pothole}30`
        : `${props.theme.colors.speedBreaker}30`};
`;

const LocationContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex-wrap: wrap;
  max-width: 150px;

  &:hover {
    .location-tooltip {
      visibility: visible;
      opacity: 1;
    }
  }
`;

const CoordinateValue = styled.span`
  font-family: "Roboto Mono", monospace;
  font-size: 0.85rem;
`;

const LocationTooltip = styled.div`
  background: ${(props) => props.theme.colors.accent};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  position: absolute;
  font-size: 0.7rem;
  bottom: -30px;
  left: 0;
  visibility: hidden;
  opacity: 0;
  transition: all 0.2s ease;
  white-space: nowrap;
  z-index: 10;
  cursor: pointer;

  i {
    margin-right: 4px;
  }

  &:before {
    content: "";
    position: absolute;
    top: -5px;
    left: 10px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid ${(props) => props.theme.colors.accent};
  }
`;

const SeverityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SeverityBar = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const SeverityDot = styled.div<{ $active: boolean; $level: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => {
    if (!props.$active) return "#ddd";
    if (props.$level <= 2) return "#2ecc71";
    if (props.$level <= 4) return "#f39c12";
    return "#e74c3c";
  }};
  transition: all 0.2s ease;
`;

const SeverityText = styled.span`
  font-size: 0.75rem;
  color: #666;
`;

const DateTimeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const DateValue = styled.div`
  font-weight: 500;
  font-size: 0.85rem;
`;

const TimeValue = styled.div`
  color: #666;
  font-size: 0.75rem;
  margin-top: 2px;
`;

const VerifiedContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VerifiedCount = styled.span`
  font-weight: 500;
`;

const VerifiedIcon = styled.div`
  color: #ddd;
  font-size: 0.85rem;

  &.active {
    color: #2ecc71;
  }
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StatusBadge = styled.span<{ $color: string; $bgColor: string }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${(props) => props.$bgColor};
  color: ${(props) => props.$color};
  border: 1px solid ${(props) => `${props.$color}30`};
`;

// Pagination components
const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`;

const PageInfo = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 8px;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  border: none;
  background-color: ${(props) =>
    props.$active ? props.theme.colors.accent : "white"};
  color: ${(props) => (props.$active ? "white" : "#666")};
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${(props) => (props.$active ? "transparent" : "#eee")};

  &:hover {
    background-color: ${(props) =>
      props.$active ? props.theme.colors.accent : "#f5f5f5"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ITEMS_PER_PAGE = 5;

const TablePage: React.FC = () => {
  const [roadIssues] = useAtom(roadIssuesAtom);
  const [currentPage, setCurrentPage] = useState(1);

  const indRoadIssues = roadIssues.reduce<any>((acc, curr) => {
    return [...acc, ...(curr?.list ?? [])];
  }, []);

  useSetRoad();

  // Pagination calculations
  const totalPages = Math.ceil(indRoadIssues.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = indRoadIssues.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const MAX_VISIBLE = 5;

    if (totalPages <= MAX_VISIBLE) {
      // If total pages is less than max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);

      // Calculate start and end of page numbers to show
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the beginning
      if (currentPage <= 2) {
        end = 4;
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      // Add ellipsis if needed at the beginning
      if (start > 2) {
        pageNumbers.push("...");
      }

      // Add page numbers
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed at the end
      if (end < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always include last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  console.log("currentItems", indRoadIssues);

  return (
    <PageContainer>
      <TableContainer>
        <StyledTable>
          <TableHeader>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Location</th>
              {/* <th>Severity</th> */}
              <th>Reported At</th>
              <th>Verified Count</th>
              <th>Status</th>
            </tr>
          </TableHeader>
          <TableBody>
            {currentItems.map((issue: any) => (
              <tr key={issue.id}>
                <td>
                  <IdCell id={issue.id} />
                </td>
                <td>
                  <TypeCell type={issue.anomalyType} />
                </td>
                <td>
                  <LocationCell
                    lat={issue.location?.lat}
                    lng={issue.location?.lon as any}
                  />
                </td>
                {/* <td>
                  <SeverityCell severity={issue.severity} />
                </td> */}
                <td>
                  <DateTimeCell timestamp={issue.reportDate} />
                </td>
                <td>
                  <VerifiedCountCell count={issue.verifiedCount || 1} />
                </td>
                <td>
                  <StatusCell status="Pending" />
                </td>
              </tr>
            ))}
          </TableBody>
        </StyledTable>

        {totalPages > 1 && (
          <PaginationContainer>
            <PageInfo>
              Showing {startIndex + 1}-{Math.min(endIndex, roadIssues.length)}{" "}
              of {roadIssues.length} issues
            </PageInfo>
            <PaginationControls>
              <PageButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </PageButton>

              {getPageNumbers().map((page, index) =>
                typeof page === "number" ? (
                  <PageButton
                    key={index}
                    $active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PageButton>
                ) : (
                  <span key={index} style={{ alignSelf: "center" }}>
                    {page}
                  </span>
                )
              )}

              <PageButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </PageButton>
            </PaginationControls>
          </PaginationContainer>
        )}
      </TableContainer>
    </PageContainer>
  );
};

export default TablePage;
