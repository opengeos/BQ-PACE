import maplibregl from "maplibre-gl";
import {
  TimeSliderControl,
  buildTiTilerTileUrl,
} from "maplibre-gl-time-slider";
import "maplibre-gl-time-slider/style.css";
import "maplibre-gl/dist/maplibre-gl.css";

import "@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css";
import { addControlGrid, DEFAULT_EXCLUDE_LAYERS } from "maplibre-gl-components";
import { LayerControl } from "maplibre-gl-layer-control";
import "maplibre-gl-layer-control/style.css";

// Plugin CSS imports
import "maplibre-gl-geo-editor/style.css";
import "maplibre-gl-lidar/style.css";
import "maplibre-gl-planetary-computer/style.css";
import "maplibre-gl-splat/style.css";
import "maplibre-gl-streetview/style.css";
import "maplibre-gl-swipe/style.css";
import "maplibre-gl-usgs-lidar/style.css";
import "maplibre-gl-components/style.css";

const BASEMAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

// NASA PACE Chlorophyll-a data
const rasterData: Record<string, string> = {
  "2024-04-18":
    "https://github.com/opengeos/pace-data/releases/download/chla/chla_2024-04-18.tif",
  "2024-04-19":
    "https://github.com/opengeos/pace-data/releases/download/chla/chla_2024-04-19.tif",
  "2024-04-20":
    "https://github.com/opengeos/pace-data/releases/download/chla/chla_2024-04-20.tif",
  "2024-04-21":
    "https://github.com/opengeos/pace-data/releases/download/chla/chla_2024-04-21.tif",
  "2024-04-22":
    "https://github.com/opengeos/pace-data/releases/download/chla/chla_2024-04-22.tif",
};

const labels = Object.keys(rasterData);
const urls = Object.values(rasterData);

// TiTiler configuration
const TITILER_ENDPOINT = "https://giswqs-titiler-endpoint.hf.space";

// Create the initial tile URL
function createTileUrl(cogUrl: string): string {
  return buildTiTilerTileUrl({
    url: cogUrl,
    endpoint: TITILER_ENDPOINT,
    colormap: "jet",
    rescale: [0, 1], // Chlorophyll-a concentration
    nodata: "nan",
  });
}

// Create map
const map = new maplibregl.Map({
  container: "map",
  style: BASEMAP_STYLE,
  center: [-98, 38.5],
  zoom: 4,
  maxPitch: 85,
});

// Source ID for the raster layer
const RASTER_SOURCE_ID = "pace-chla-raster";
const RASTER_LAYER_ID = "pace-chla-layer";

// Add raster layer and time slider when map loads
map.on("load", () => {
  // Add Google Satellite layer
  map.addSource("google-satellite", {
    type: "raster",
    tiles: ["https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"],
    tileSize: 256,
    attribution: "© Google",
  });

  map.addLayer({
    id: "google-satellite-layer",
    type: "raster",
    source: "google-satellite",
    paint: {
      "raster-opacity": 1,
    },
  });

  // Add the raster source with initial tile URL
  map.addSource(RASTER_SOURCE_ID, {
    type: "raster",
    tiles: [createTileUrl(urls[0])],
    tileSize: 256,
  });

  // Add the raster layer
  map.addLayer({
    id: RASTER_LAYER_ID,
    type: "raster",
    source: RASTER_SOURCE_ID,
    paint: {
      "raster-opacity": 0.8,
    },
  });

  // Add layer control
  const layerControl = new LayerControl({
    collapsed: true,
    layers: [],
    panelWidth: 340,
    panelMinWidth: 240,
    panelMaxWidth: 450,
    basemapStyleUrl: BASEMAP_STYLE,
    excludeLayers: [...DEFAULT_EXCLUDE_LAYERS],
  });

  map.addControl(layerControl, "top-right");

  // Add a ControlGrid with all default controls in one call
  const controlGrid = addControlGrid(map, { basemapStyleUrl: BASEMAP_STYLE });

  // Register data-layer adapters so COG, Zarr, PMTiles layers appear in the LayerControl
  for (const adapter of controlGrid.getAdapters()) {
    layerControl.registerCustomAdapter(adapter);
  }

  // Create the time slider control
  const timeSlider = new TimeSliderControl({
    title: "Time Slider",
    labels: labels,
    speed: 1000,
    loop: true,
    collapsed: false,
    panelWidth: 320,
    onChange: (index, label) => {
      console.log(`Displaying PACE data for: ${label} (index: ${index})`);

      // Update the raster source with the new tile URL
      const source = map.getSource(
        RASTER_SOURCE_ID,
      ) as maplibregl.RasterTileSource;
      if (source) {
        const newTileUrl = createTileUrl(urls[index]);
        source.setTiles([newTileUrl]);
      }
    },
  });

  // Add the time slider control to the map
  map.addControl(timeSlider, "top-right");

  // Listen for events
  timeSlider.on("play", () => {
    console.log("Playback started");
  });

  timeSlider.on("pause", () => {
    console.log("Playback paused");
  });

  timeSlider.on("change", (event) => {
    console.log("Time changed:", event.state.currentIndex);
  });

  console.log("PACE chlorophyll-a time slider control added to map");
});
