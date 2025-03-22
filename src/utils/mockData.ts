// src/utils/mockData.ts
import { RoadIssue, RoadIssueType } from "../types/mapTypes";

// Function to generate a random ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Generate random issues around a specific location
export const generateMockIssues = (
  centerLat: number,
  centerLng: number,
  radius: number = 0.02,
  count: number = 20
): RoadIssue[] => {
  const issues: RoadIssue[] = [];

  for (let i = 0; i < count; i++) {
    // Generate random coordinates within the radius
    const lat = centerLat + (Math.random() - 0.5) * radius * 2;
    const lng = centerLng + (Math.random() - 0.5) * radius * 2;

    // Random type
    const type: RoadIssueType =
      Math.random() > 0.5 ? "pothole" : "speedBreaker";

    issues.push({
      id: generateId(),
      type,
      position: { lat, lng },
      severity: Math.floor(Math.random() * 5) + 1,
      reportedAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ), // Random date within last 30 days
      verifiedCount: Math.floor(Math.random() * 10),
    });
  }

  return issues;
};

export const cityDataMap: Record<
  string,
  { lat: number; lng: number; zoom: number }
> = {
  "new york": { lat: 40.7128, lng: -74.006, zoom: 12 },
  gurgaon: { lat: 28.4595, lng: 77.0266, zoom: 12 },
};

// Fetch mock data for a given city
export const fetchMockDataForCity = (
  cityName: string
): {
  issues: RoadIssue[];
  viewport: { center: { lat: number; lng: number }; zoom: number };
} => {
  const normalizedCityName = cityName.toLowerCase().trim();
  const cityData = cityDataMap[normalizedCityName] || cityDataMap["new york"]; // Default to NYC

  return {
    issues: generateMockIssues(cityData.lat, cityData.lng, 0.05, 30),
    viewport: {
      center: { lat: cityData.lat, lng: cityData.lng },
      zoom: cityData.zoom,
    },
  };
};
