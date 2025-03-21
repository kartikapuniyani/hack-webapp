import React, { useEffect } from "react";
import styled from "styled-components";
import { useAtom } from "jotai";
import { roadIssuesAtom } from "../store/atoms";
import { fetchMockDataForCity } from "../utils/mockData";

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: ${(props) => props.theme.colors.background};

  th {
    text-align: left;
    padding: ${(props) => props.theme.spacing.md};
    font-weight: 600;
    color: ${(props) => props.theme.colors.text};
    border-bottom: 1px solid #eee;
  }
`;

const TableBody = styled.tbody`
  tr {
    &:hover {
      background-color: #f9f9f9;
    }

    td {
      padding: ${(props) => props.theme.spacing.md};
      border-bottom: 1px solid #eee;
    }
  }
`;

const TypeBadge = styled.span<{ $type: "pothole" | "speedBreaker" }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: ${(props) =>
    props.$type === "pothole"
      ? props.theme.colors.pothole
      : props.theme.colors.speedBreaker};
  color: white;
`;

const SeverityIndicator = styled.div`
  display: flex;
  align-items: center;

  .dots {
    display: flex;
    margin-left: ${(props) => props.theme.spacing.xs};
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 2px;
    background-color: ${(props) => props.theme.colors.accent};
  }

  .dot.empty {
    background-color: #ddd;
  }
`;

const RenderSeverity = ({ severity }: { severity?: number }) => {
  if (severity === undefined) return <span>N/A</span>;

  return (
    <SeverityIndicator>
      <div className="dots">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div key={dot} className={`dot ${dot <= severity ? "" : "empty"}`} />
        ))}
      </div>
    </SeverityIndicator>
  );
};

const TablePage: React.FC = () => {
  const [roadIssues, setRoadIssues] = useAtom(roadIssuesAtom);

  useEffect(() => {
    if (roadIssues.length === 0) {
      const { issues } = fetchMockDataForCity("new york");
      setRoadIssues(issues);
    }
  }, [roadIssues.length, setRoadIssues]);

  return (
    <div>
      <TableContainer>
        <StyledTable>
          <TableHeader>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Location</th>
              <th>Severity</th>
              <th>Reported At</th>
              <th>Verified Count</th>
            </tr>
          </TableHeader>
          <TableBody>
            {roadIssues.map((issue) => (
              <tr key={issue.id}>
                <td>{issue.id.slice(0, 6)}</td>
                <td>
                  <TypeBadge $type={issue.type}>
                    {issue.type === "pothole" ? "Pothole" : "Speed Breaker"}
                  </TypeBadge>
                </td>
                <td>
                  {issue.position.lat.toFixed(4)},{" "}
                  {issue.position.lng.toFixed(4)}
                </td>
                <td>
                  <RenderSeverity severity={issue.severity} />
                </td>
                <td>{new Date(issue.reportedAt).toLocaleDateString()}</td>
                <td>{issue.verifiedCount || 0}</td>
              </tr>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </div>
  );
};

export default TablePage;
