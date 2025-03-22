import { RoadIssue } from "../types/mapTypes";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const transformLatLongData = (data: any[]): RoadIssue[] => {
  return data.map((d) => ({
    type: d.anomalyType === "POTHOLE" ? "pothole" : "speedBreaker",
    id: d.id,
    position: d.location,
    reportedAt: new Date(d.reportDate),
    severity: 3,
    verifiedCount: d.accuracy,
  }));
};
