# BQ-PACE

Biogeochemical Water Quality from PACE

A web application for visualizing ocean color data products from NASA's PACE (Plankton, Aerosol, Cloud, ocean Ecosystem) mission.

## Live Demo

[https://bq-pace.hypercoast.org](https://bq-pace.hypercoast.org)

## Data Products

The application provides time-series visualization for three ocean color parameters:

- **Chlorophyll-a (Chl-a)**: Indicates phytoplankton abundance, a key indicator of ocean productivity and ecosystem health
- **aCDOM440**: Absorption coefficient of Colored Dissolved Organic Matter at 440nm, indicating dissolved organic material from terrestrial and marine sources
- **Total Suspended Solids (TSS)**: Important for water quality assessment and sediment transport studies

## Features

- Interactive time slider for exploring temporal changes
- Multiple basemap options
- Layer controls for customizing visualization
- Colorbar legends with data units
- Support for adding custom COG, Zarr, and PMTiles layers

## Data Source

Data is sourced from [Source Cooperative](https://source.coop/giswqs/opengeos/PACE) and rendered using [TiTiler](https://titiler.d2s.org/).

## Development

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Contact

- [Bingqing Liu](https://bingqingliu.com)

## Links

- [NASA PACE Mission](https://pace.gsfc.nasa.gov/)
- [Source Cooperative Data](https://source.coop/giswqs/opengeos/PACE)
