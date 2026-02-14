import maplibregl from "maplibre-gl";
import {
  TimeSliderControl,
  buildTiTilerTileUrl,
} from "maplibre-gl-time-slider";
import "maplibre-gl-time-slider/style.css";
import "maplibre-gl/dist/maplibre-gl.css";

import "@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css";
import { addControlGrid, DEFAULT_EXCLUDE_LAYERS, Colorbar } from "maplibre-gl-components";
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

// NASA PACE Chlorophyll-a data source
const RASTER_CSV_URL =
  "https://data.source.coop/giswqs/opengeos/PACE/Chl-a/files.csv";
const RASTER_BASE_URL =
  "https://data.source.coop/giswqs/opengeos/PACE/Chl-a/";

// Parse date from filename: PACE_OCI.20240306T184049.L2.OC_AOP.tif -> 2024-03-06
function extractDateFromFilename(filename: string): string {
  const match = filename.match(/PACE_OCI\.(\d{4})(\d{2})(\d{2})T/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return "";
}

// Fetch and parse the raster file list
async function fetchRasterData(): Promise<{ labels: string[]; urls: string[] }> {
  const response = await fetch(RASTER_CSV_URL);
  const text = await response.text();
  const filenames = text
    .trim()
    .split("\n")
    .filter((line) => line.endsWith(".tif"));

  const rasterData: Record<string, string> = {};

  for (const filename of filenames) {
    const date = extractDateFromFilename(filename);
    if (date) {
      // Use the first file for each date (avoid duplicates)
      if (!rasterData[date]) {
        rasterData[date] = RASTER_BASE_URL + filename;
      }
    }
  }

  // Sort by date
  const sortedDates = Object.keys(rasterData).sort();
  const labels = sortedDates;
  const urls = sortedDates.map((date) => rasterData[date]);

  return { labels, urls };
}

// TiTiler configuration
const TITILER_ENDPOINT = "https://titiler.d2s.org/";

// Create the initial tile URL
function createTileUrl(cogUrl: string): string {
  return buildTiTilerTileUrl({
    url: cogUrl,
    endpoint: TITILER_ENDPOINT,
    colormap: "jet",
    rescale: [0, 30], // Chlorophyll-a concentration
    nodata: -9999,
  });
}

// Create map
const map = new maplibregl.Map({
  container: "map",
  style: BASEMAP_STYLE,
  center: [-89.6735, 24.6463],
  zoom: 5.05,
  maxPitch: 85,
});

// Source ID for the raster layer
const RASTER_SOURCE_ID = "pace-chla-raster";
const RASTER_LAYER_ID = "pace-chla-layer";

// Initialize the map with raster data
async function initializeMap() {
  const { labels, urls } = await fetchRasterData();
  console.log(`Loaded ${labels.length} PACE Chl-a raster files`);

  if (urls.length === 0) {
    console.error("No raster files found");
    return;
  }

  // Function to set up layers and controls
  const setupMap = () => {
  // Add USGS Imagery basemap layer
  map.addSource("usgs-imagery", {
    type: "raster",
    tiles: [
      "https://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WMSServer?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=0&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&STYLES=&BBOX={bbox-epsg-3857}",
    ],
    tileSize: 256,
    attribution: "© USGS",
  });

  map.addLayer({
    id: "USGS-imagery-layer",
    type: "raster",
    source: "usgs-imagery",
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


  // Add a horizontal colorbar with custom colors
  const chlorophyllBar = new Colorbar({
    colormap: "jet",
    vmin: 0,
    vmax: 30,
    label: 'Chlorophyll-a (mg/m^3)',
    orientation: 'horizontal',
  });
  map.addControl(chlorophyllBar, 'bottom-left');


  // Create the time slider control
  const timeSlider = new TimeSliderControl({
    title: "Time Slider",
    labels: labels,
    speed: 1000,
    loop: true,
    collapsed: false,
    panelWidth: 320,
    onChange: (index) => {
      // console.log(`Displaying PACE data for: ${label} (index: ${index})`);

      // Update the raster source with the new tile URL
      try {
        const source = map.getSource(
          RASTER_SOURCE_ID,
        ) as maplibregl.RasterTileSource;
        if (source && urls[index]) {
          const newTileUrl = createTileUrl(urls[index]);
          source.setTiles([newTileUrl]);
        }
      } catch (error) {
        console.warn("Error updating tiles:", error);
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
  };

  // Handle case where map may already be loaded
  if (map.loaded()) {
    setupMap();
  } else {
    map.on("load", setupMap);
  }
}

// Start the application
initializeMap().catch(console.error);
