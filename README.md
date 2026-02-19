# BQ-PACE

Biogeochemical Water Quality from SPACE

A web application for exploring ocean color data products from NASA's PACE (Plankton, Aerosol, Cloud, ocean Ecosystem) mission. Visualize time-series data for various ocean parameters.

## Live Demo

[https://bq-pace.hypercoast.org](https://bq-pace.hypercoast.org)

## Data Products

The application provides time-series visualization for three ocean color parameters:

- **Chlorophyll-a (Chl-a)**: Chlorophyll-a (Chl-a; mg m⁻³) is a photosynthetic pigment in algae and cyanobacteria and serves as a proxy for phytoplankton biomass in aquatic ecosystems.

- **Colored Dissolved Organic Matter (CDOM)**: Colored Dissolved Organic Matter (CDOM) is the light-absorbing fraction of dissolved organic matter that strongly influences underwater light fields, and CDOM absorption (aCDOM; m⁻¹) serves as a key indicator of blackwater systems rich in humic substances.

- **Total Suspended Solids (TSS)**: Total suspended solids (TSS; mg m⁻³) concentration represents the abundance of non-algal particles. In rivers, estuaries, and coastal waters, TSS is a key indicator of turbidity and is widely used in water quality monitoring and remote sensing applications.

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

## Partners & Sponsors

This work was supported by the NASA PACE program (80NSSC24K1415), the NASA EMIT program (80NSSC24K0865), and the NSF (2425811 and 2425812), which supported algorithm development and validation. Product validation was also strongly supported by the USACE ERDC Freshwater HAB Program and the NOAA NCCOS Hypoxia Program (Grant NA23NOS4780285). We further acknowledge support from NASA's Marine Biodiversity Observation Network (MBON) project for estuarine water quality product validation.

### Supporting Organizations
- NASA
- EMIT
- PACE Mission
- National Science Foundation (NSF)
- US Army Corps of Engineers (USACE)
- National Oceanic and Atmospheric Administration (NOAA)

## Contact

- [Bingqing Liu](https://bingqingliu.com)

## Links

- [Source Code on GitHub](https://github.com/opengeos/BQ-PACE)
- [NASA PACE Mission](https://pace.gsfc.nasa.gov/)
- [Source Cooperative Data](https://source.coop/giswqs/opengeos/PACE)
