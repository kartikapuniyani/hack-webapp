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

// Pre-generated mock data for major cities
export const cityDataMap: Record<
  string,
  { lat: number; lng: number; zoom: number }
> = {
  "new york": { lat: 40.7128, lng: -74.006, zoom: 12 },
  "los angeles": { lat: 34.0522, lng: -118.2437, zoom: 12 },
  chicago: { lat: 41.8781, lng: -87.6298, zoom: 12 },
  houston: { lat: 29.7604, lng: -95.3698, zoom: 12 },
  phoenix: { lat: 33.4484, lng: -112.074, zoom: 12 },
  philadelphia: { lat: 39.9526, lng: -75.1652, zoom: 12 },
  "san antonio": { lat: 29.4241, lng: -98.4936, zoom: 12 },
  "san diego": { lat: 32.7157, lng: -117.1611, zoom: 12 },
  dallas: { lat: 32.7767, lng: -96.797, zoom: 12 },
  "san jose": { lat: 37.3382, lng: -121.8863, zoom: 12 },
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
