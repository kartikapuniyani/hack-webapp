export type RoadIssueType = "pothole" | "speedBreaker";

export interface RoadIssue {
  id: string;
  type: RoadIssueType;
  position: {
    lat: number;
    lng: number;
  };
  severity?: number; // Optional: 1-5 rating
  reportedAt: Date;
  verifiedCount?: number; // Optional: number of users who confirmed this issue
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapViewport {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}
