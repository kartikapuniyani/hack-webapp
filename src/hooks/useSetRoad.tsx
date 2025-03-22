import { useAtom } from "jotai";
import { getData } from "../api/common";
import { mapViewportAtom, roadIssuesAtom } from "../store/atoms";
import {
  getAnomalySeverity,
  processAnomalyData,
  transformLatLongData,
} from "../utils/common";
import { fetchMockDataForCity } from "../utils/mockData";
import { useEffect } from "react";

export function useSetRoad() {
  const [, setRoadIssues] = useAtom(roadIssuesAtom);
  const [, setMapViewport] = useAtom(mapViewportAtom);

  useEffect(() => {
    // Initialize with mock data for a default city
    const { viewport } = fetchMockDataForCity("gurgaon");

    const getDatappp = async () => {
      try {
        const rest = await getData("gurgaon");

        // Process and cluster the data using our utility
        const clusteredData = processAnomalyData(rest, 10); // 5 meter radius

        // Add severity scores to each cluster
        const enhancedData = clusteredData.map((cluster) => ({
          ...cluster,
          severity: getAnomalySeverity(cluster),
        }));

        const tOutput = transformLatLongData(enhancedData ?? []);
        setRoadIssues(tOutput);
        setMapViewport(viewport);
      } catch {
        console.log("Error");
      }
    };

    getDatappp();
  }, [setRoadIssues, setMapViewport]);
}
