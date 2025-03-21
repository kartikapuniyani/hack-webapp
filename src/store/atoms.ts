import { atom } from "jotai";
import { RoadIssue, MapViewport } from "../types/mapTypes";

// Atoms for road issues data
export const roadIssuesAtom = atom<RoadIssue[]>([]);
export const filteredIssuesAtom = atom<RoadIssue[]>([]);
export const selectedIssueAtom = atom<RoadIssue | null>(null);

// Map view settings
export const mapViewportAtom = atom<MapViewport>({
  center: { lat: 40.7128, lng: -74.006 }, // Default to New York City
  zoom: 12,
});

// Filter settings
export const showPotholesAtom = atom<boolean>(true);
export const showSpeedBreakersAtom = atom<boolean>(false);
export const searchQueryAtom = atom<string>("");
export const isLoadingAtom = atom<boolean>(false);
