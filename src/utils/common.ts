import { RoadIssue } from "../types/mapTypes";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const transformLatLongData = (data: any[]): RoadIssue[] => {
  console.log("datasss", data);
  return data.map((d) => ({
    type: d.anomalyType === "POTHOLE" ? "pothole" : "speedBreaker",
    id: d.id,
    position: d.center,
    reportedAt: new Date(d.lastReportDate),
    severity:
      d.count < 5
        ? 1
        : d.count < 10
        ? 2
        : d.count < 15
        ? 3
        : d.count < 20
        ? 4
        : 5,
    verifiedCount: d.count,
    list: d.points ?? [],
  }));
};

// Types for the data structure
interface Location {
  lat: number;
  lon: number;
}

interface SensorStats {
  accelYRange: number;
  accelYStdDev: number;
  gyroZStdDev: number;
  gyroYStdDev: number;
  accelXMean: number;
  accelZRange: number;
  gyroXMean: number;
  accelZStdDev: number;
  accelZMean: number;
  gyroZMean: number;
  accelXRange: number;
  gyroXStdDev: number;
  accelYMean: number;
  accelXStdDev: number;
  gyroYMean: number;
}

interface RawAnomaly {
  altitude?: number;
  fileName?: string | null;
  reportDate: number;
  city: string;
  anomalyType: string;
  accuracy: number;
  location: Location;
  id: string;
  sensorStats: SensorStats;
  timestamp: number;
  signedUrl?: string;
}

interface ClusteredAnomaly {
  id: string;
  anomalyType: string;
  position: Location;
  city: string;
  count: number;
  points: RawAnomaly[];
  averageSensorStats: SensorStats;
  firstReportDate: number;
  lastReportDate: number;
  timestamp: number;
}

/**
 * Calculates the distance between two geographical points in meters
 * using the Haversine formula
 *
 * @param lat1 - Latitude of the first point in degrees
 * @param lon1 - Longitude of the first point in degrees
 * @param lat2 - Latitude of the second point in degrees
 * @param lon2 - Longitude of the second point in degrees
 * @returns Distance between the points in meters
 */
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in meters
};

/**
 * Calculate the average sensor stats from an array of anomaly points
 *
 * @param points - Array of anomaly data points with sensor stats
 * @returns Averaged sensor statistics
 */
const calculateAverageSensorStats = (points: RawAnomaly[]): SensorStats => {
  const init: SensorStats = {
    accelYRange: 0,
    accelYStdDev: 0,
    gyroZStdDev: 0,
    gyroYStdDev: 0,
    accelXMean: 0,
    accelZRange: 0,
    gyroXMean: 0,
    accelZStdDev: 0,
    accelZMean: 0,
    gyroZMean: 0,
    accelXRange: 0,
    gyroXStdDev: 0,
    accelYMean: 0,
    accelXStdDev: 0,
    gyroYMean: 0,
  };

  // Sum all values
  const sum = points.reduce((acc, point) => {
    Object.keys(point.sensorStats).forEach((key) => {
      acc[key as keyof SensorStats] +=
        point.sensorStats[key as keyof SensorStats];
    });
    return acc;
  }, init);

  // Divide by count to get average
  const count = points.length;
  return Object.keys(sum).reduce((acc, key) => {
    acc[key as keyof SensorStats] = sum[key as keyof SensorStats] / count;
    return acc;
  }, {} as SensorStats);
};

/**
 * Clusters anomalies within a specified radius
 *
 * @param data - Raw anomaly data array
 * @param radius - Clustering radius in meters (default: 5 meters)
 * @returns Array of clustered anomalies
 */
export const clusterAnomalies = (
  data: RawAnomaly[],
  radius = 5
): ClusteredAnomaly[] => {
  const clusters: ClusteredAnomaly[] = [];

  data.forEach((point) => {
    const pointType = point.anomalyType;
    let assigned = false;

    // Try to assign to existing cluster
    for (const cluster of clusters) {
      if (cluster.anomalyType !== pointType) continue;

      const distance = calculateDistance(
        point.location.lat,
        point.location.lon,
        cluster.position.lat,
        cluster.position.lon
      );

      if (distance <= radius) {
        cluster.points.push(point);
        cluster.count += 1;

        // Update report dates
        cluster.firstReportDate = Math.min(
          cluster.firstReportDate,
          point.reportDate
        );
        cluster.lastReportDate = Math.max(
          cluster.lastReportDate,
          point.reportDate
        );

        // Recalculate average sensor stats
        cluster.averageSensorStats = calculateAverageSensorStats(
          cluster.points
        );

        assigned = true;
        break;
      }
    }

    // If not assigned to any cluster, create a new one
    if (!assigned) {
      clusters.push({
        id: `cluster-${clusters.length + 1}`,
        anomalyType: pointType,
        position: { ...point.location },
        city: point.city,
        count: 1,
        points: [point],
        averageSensorStats: { ...point.sensorStats },
        firstReportDate: point.reportDate,
        lastReportDate: point.reportDate,
        timestamp: point.timestamp,
      });
    }
  });

  return clusters;
};

/**
 * Calculates the center point for a cluster of anomalies
 * This is useful to recalculate cluster centers as points are added
 *
 * @param points - Array of anomaly data points
 * @returns Location object with lat/lon of the center
 */
export const calculateClusterCenter = (points: RawAnomaly[]): Location => {
  if (points.length === 0) {
    throw new Error("Cannot calculate center of empty points array");
  }

  // Sum all latitudes and longitudes
  const sum = points.reduce(
    (acc, point) => {
      return {
        lat: acc.lat + point.location.lat,
        lon: acc.lon + point.location.lon,
      };
    },
    { lat: 0, lon: 0 }
  );

  // Divide by count to get average
  return {
    lat: sum.lat / points.length,
    lon: sum.lon / points.length,
  };
};

/**
 * Main utility function to process and cluster anomaly data
 *
 * @param rawData - Raw anomaly data from the API or file
 * @param clusterRadius - Radius in meters to consider anomalies as the same (default: 5)
 * @returns Processed and clustered anomaly data
 */
export const processAnomalyData = (
  rawData: RawAnomaly[],
  clusterRadius = 5
): ClusteredAnomaly[] => {
  // First, clean the data - remove any entries that don't have required fields
  const cleanData = rawData.filter(
    (item) => item.location && item.anomalyType && item.sensorStats
  );

  // Then cluster the anomalies
  const clusteredData = clusterAnomalies(cleanData, clusterRadius);

  // Optionally recalculate centers for more accurate positioning
  return clusteredData.map((cluster) => ({
    ...cluster,
    center: calculateClusterCenter(cluster.points),
  }));
};

/**
 * Get severity level based on sensor data
 *
 * @param anomaly - A clustered anomaly with sensor stats
 * @returns String indicating severity level: 'Low', 'Medium', or 'High'
 */
export const getAnomalySeverity = (
  anomaly: ClusteredAnomaly
): "Low" | "Medium" | "High" => {
  const { accelZMean, accelYStdDev, accelXStdDev } = anomaly.averageSensorStats;

  // Combine multiple factors for severity calculation
  const severityScore =
    Math.abs(accelZMean - 9.8) * 3 + // Deviation from gravity
    accelYStdDev * 2 + // Vertical fluctuation
    accelXStdDev * 1.5; // Horizontal fluctuation

  if (severityScore > 2.5) return "High";
  if (severityScore > 1.2) return "Medium";
  return "Low";
};

// Example usage:
// const rawAnomalyData: RawAnomaly[] = [...]; // Your raw data here
// const processedData = processAnomalyData(rawAnomalyData);
// console.log(`Found ${processedData.length} unique anomalies from ${rawAnomalyData.length} reports`);
