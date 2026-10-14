
import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  HardHat,
  Building2,
  Route,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Search,
  LayoutGrid,
  Map as MapIcon,
  MapPin,
  Calendar,
  X,
  Plus,
  Minus,
  Crosshair,
  Layers,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { normalizeStatus } from "../../features/projects/projectsData";
import { usePublishedProjects } from "../../features/marketing/MarketingProvider";
import PhaseFilter, { PHASES, getProjectPhaseIds } from "./PhaseFilter";

const categories = [
  { label: "All", icon: Boxes },
  { label: "Infrastructure", icon: HardHat },
  { label: "Commercial Buildings", icon: Building2 },
  { label: "Road And Generalist", icon: Route },
];

const statusFilters = ["All", "Ongoing", "Delivered"];

const ITEMS_PER_PAGE = 6;

const MAP_DEFAULT_CENTER = [26.8206, 30.8025];
const MAP_DEFAULT_ZOOM = 6;

const BASEMAPS = {
  streets: {
    label: "Streets",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
  },

  light: {
    label: "Light",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
    className: "light-basemap",
  },

  satellite: {
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Imagery &copy; Esri, Maxar, Earthstar Geographics",
    maxZoom: 19,
  },
};

/* =========================================================
   STATUS HELPERS
   ========================================================= */

function getDisplayStatus(status) {
  return normalizeStatus(status) === "Finished"
    ? "Delivered"
    : "Ongoing";
}

function isDelivered(status) {
  return normalizeStatus(status) === "Finished";
}

/* =========================================================
   PROJECT CARD
   ========================================================= */

function ProjectCard({ project , activePhase}) {
  const status = getDisplayStatus(project.status);
  const delivered = isDelivered(project.status);

  return (
    <Link to={`/projects/${project.id}`} className="block h-full">
      <motion.div
        layout
        initial={{ opacity: 0, y: 40, rotate: -1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        exit={{ opacity: 0, y: -20, rotate: 1.5 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 24,
        }}
        className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[#3C3C3B]/15 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
      >
        {/* Corner markers */}
        {[
          "top-2 left-2",
          "top-2 right-2",
          "bottom-2 left-2",
          "bottom-2 right-2",
        ].map((pos) => (
          <span
            key={pos}
            className={`absolute ${pos} z-20 h-1.5 w-1.5 rounded-full bg-[#3C3C3B]/25`}
          />
        ))}

        {/* Image */}
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden lg:aspect-[16/9]"> 
          <img
            src={project.src}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Grid overlay */}
          {/* <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              backgroundImage:
                "linear-gradient(rgba(42,49,122,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(42,49,122,0.22) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          /> */}

          {/* Status */}
          <span
            className={`absolute right-3 top-3 z-20 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
              delivered
                ? "bg-green-600 text-white"
                : "bg-yellow-400 text-black"
            }`}
          >
            {status}
          </span>

          {/* Year */}
          {project.year && (
            <span className="absolute left-3 top-3 z-20 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#3C3C3B] backdrop-blur-sm">
              <Calendar className="h-3 w-3" />
              {project.year}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-3.5">
          {/* Category */}
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#2A317A]">
            {project.category}
          </span>

          {/* Title */}
          <h3 className="mt-1 text-sm font-bold uppercase leading-snug text-[#3C3C3B]">
            {project.title}
          </h3>
          {activePhase !== "all" && (
  <div aria-hidden="true" className="relative mt-3 flex items-center justify-between px-1">
    <span className="absolute inset-x-1 top-1/2 h-0.5 -translate-y-1/2 bg-[#3C3C3B]/15" />
    {PHASES.map((ph) => {
      const on = getProjectPhaseIds(project).includes(ph.id);
      return (
        <i
          key={ph.id}
          className={`relative h-2.5 w-2.5 rounded-full border-2 ${
            on ? "border-[#2A317A] bg-[#2A317A]" : "border-[#3C3C3B]/25 bg-white"
          } ${ph.id === activePhase ? "scale-150 ring-4 ring-[#2A317A]/20" : ""}`}
        />
      );
    })}
  </div>
)}

          {/* Location + Year */}
          {(project.location || project.year) && (
            <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#3C3C3B]/15 pt-3 text-xs text-[#3C3C3B]">
              {project.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#2A317A]" />
                  {project.location}
                </span>
              )}

              {project.year && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#2A317A]" />
                  {project.year}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

/* =========================================================
   PAGINATION
   ========================================================= */

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const windowSize = 5;

  let start = Math.max(
    1,
    currentPage - Math.floor(windowSize / 2)
  );

  const end = Math.min(
    totalPages,
    start + windowSize - 1
  );

  start = Math.max(
    1,
    end - windowSize + 1
  );

  const pageNumbers = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  );

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:mt-7 sm:gap-2">   {/* كانت mt-10 / mt-12 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#3C3C3B]/20 text-[#3C3C3B] transition-colors hover:border-[#2A317A] hover:bg-[#2A317A] hover:text-white disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {start > 1 && (
        <span className="px-1 text-[#3C3C3B]">…</span>
      )}

      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          aria-label={`Go to page ${num}`}
          aria-current={num === currentPage}
          className={`h-9 w-9 rounded-lg text-sm font-semibold transition-colors ${
            num === currentPage
              ? "bg-[#2A317A] text-white"
              : "border border-[#3C3C3B]/20 bg-white text-[#3C3C3B] hover:border-[#2A317A] hover:text-[#2A317A]"
          }`}
        >
          {num}
        </button>
      ))}

      {end < totalPages && (
        <span className="px-1 text-[#3C3C3B]">…</span>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#3C3C3B]/20 text-[#3C3C3B] transition-colors hover:border-[#2A317A] hover:bg-[#2A317A] hover:text-white disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* =========================================================
   MAP STYLES
   IMPORTANT:
   الخريطة متسابّة زي ما هي بدون تغيير
   ========================================================= */

const mapStyles = `
.sector-map .leaflet-container {
  background: #eef1f7;
  font-family: inherit;
}

.sector-map .leaflet-tile.light-basemap {
  filter: grayscale(0.8) brightness(1.08) contrast(0.92);
}

.sector-map .leaflet-control-attribution {
  background: rgba(255, 255, 255, 0.88);
  color: #6C757D;
  font-size: 10px;
  border-radius: 6px 0 0 0;
}

.sector-map .leaflet-control-attribution a {
  color: #1F3888;
}

.sector-map .leaflet-tooltip.sector-tooltip {
  background: #1E2432;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(30, 36, 50, 0.25);
  white-space: normal;
  max-width: 180px;
}

.sector-map .leaflet-tooltip.sector-tooltip::before {
  border-top-color: #1E2432;
}

.sector-marker {
  position: relative;
  width: 34px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.sector-marker__pin {
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50% 50% 50% 0;
  background: var(--marker-color);
  border: 3px solid #ffffff;
  box-shadow:
    0 2px 6px rgba(30, 36, 50, 0.35),
    0 5px 14px rgba(30, 36, 50, 0.25);
  transform: rotate(-45deg);
  transition: all 0.2s ease;
}

.sector-marker__pin-inner {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ffffff;
  z-index: 2;
  transition: transform 0.2s ease;
}

.sector-marker:hover .sector-marker__pin {
  transform: rotate(-45deg) scale(1.12);
}

.sector-marker.is-selected .sector-marker__pin {
  transform: rotate(-45deg) scale(1.18);
  box-shadow:
    0 3px 8px rgba(30, 36, 50, 0.4),
    0 0 0 4px rgba(31, 56, 136, 0.18);
}

.sector-cluster {
  position: relative;
  width: 54px;
  height: 64px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  cursor: pointer;
}

.sector-cluster__pin {
  position: absolute;
  top: 0;
  left: 50%;
  width: 48px;
  height: 48px;
  transform: translateX(-50%) rotate(-45deg);
  border-radius: 50% 50% 50% 0;
  background: #1F3888;
  border: 4px solid #ffffff;
  box-shadow:
    0 4px 10px rgba(30, 36, 50, 0.35),
    0 6px 16px rgba(30, 36, 50, 0.22);
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.sector-cluster__content {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ffffff;
  color: #1F3888;
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
  box-shadow: 0 1px 4px rgba(30, 36, 50, 0.2);
  transition: transform 0.2s ease;
}

.sector-cluster:hover .sector-cluster__pin {
  transform: translateX(-50%) rotate(-45deg) scale(1.08);
  background: #162b6d;
}

.sector-cluster:hover .sector-cluster__content {
  transform: translateX(-50%) scale(1.05);
}

.sector-cluster.is-large {
  width: 62px;
  height: 72px;
}

.sector-cluster.is-large .sector-cluster__pin {
  width: 56px;
  height: 56px;
}

.sector-cluster.is-large .sector-cluster__content {
  top: 14px;
  width: 34px;
  height: 34px;
  font-size: 17px;
}

.sector-cluster.is-xl {
  width: 70px;
  height: 80px;
}

.sector-cluster.is-xl .sector-cluster__pin {
  width: 64px;
  height: 64px;
}

.sector-cluster.is-xl .sector-cluster__content {
  top: 16px;
  width: 38px;
  height: 38px;
  font-size: 19px;
}

@media (prefers-reduced-motion: reduce) {
  .sector-cluster__pin,
  .sector-cluster__content {
    transition: none;
  }
}

@keyframes sector-pulse {
  0% {
    transform: scale(0.7);
    opacity: 0.5;
  }

  70% {
    transform: scale(1.6);
    opacity: 0;
  }

  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sector-marker__pulse {
    animation: none;
  }
}
`;

/* =========================================================
   MAP HELPERS
   ========================================================= */

function FlyToMarker({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(
        position,
        Math.max(map.getZoom(), 11),
        {
          duration: 0.9,
        }
      );
    }
  }, [position, map]);

  return null;
}

function FitToProjects({ points }) {
  const map = useMap();

  const key = points
    .map((p) => p.join(","))
    .join("|");

  useEffect(() => {
    if (!points.length) return;

    if (points.length === 1) {
      map.setView(points[0], 14, {
        animate: true,
      });

      return;
    }

    map.fitBounds(points, {
      padding: [50, 50],
      maxZoom: 13,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map]);

  return null;
}

function MapControls() {
  const map = useMap();
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    L.DomEvent.disableClickPropagation(
      ref.current
    );

    L.DomEvent.disableScrollPropagation(
      ref.current
    );
  }, []);

  const btn =
    "flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/95 text-[#1E2432] shadow-md border border-[#1E2432]/10 hover:bg-[#1F3888] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFBF00]";

  return (
    <div
      ref={ref}
      className="absolute right-3 top-3 z-[1000] flex flex-col gap-1.5 sm:right-4 sm:top-4 sm:gap-2"
    >
      <button
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
        className={btn}
      >
        <Plus className="h-4 w-4" />
      </button>

      <button
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
        className={btn}
      >
        <Minus className="h-4 w-4" />
      </button>

      <button
        onClick={() =>
          map.setView(
            MAP_DEFAULT_CENTER,
            MAP_DEFAULT_ZOOM,
            {
              animate: true,
            }
          )
        }
        aria-label="Reset the map view"
        className={btn}
      >
        <Crosshair className="h-4 w-4" />
      </button>
    </div>
  );
}

function MapBasemapSwitcher({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-[#1E2432]/10 bg-white/95 p-1 shadow-md">
      <Layers className="ml-1 h-3.5 w-3.5 shrink-0 text-[#6C757D]" />

      {Object.entries(BASEMAPS).map(
        ([key, map]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            aria-pressed={value === key}
            className={`rounded-md px-2 py-1 text-[10px] font-semibold transition-colors sm:text-[11px] ${
              value === key
                ? "bg-[#1F3888] text-white"
                : "text-[#6C757D] hover:text-[#1F3888]"
            }`}
          >
            {map.label}
          </button>
        )
      )}
    </div>
  );
}

/* =========================================================
   MARKERS
   ========================================================= */

function createMarkerIcon(isDelivered, isSelected) {
  // الخريطة متسابّة بنفس ألوانها الأصلية
  const color = isDelivered
    ? "#FEC419"
    : "#1F3888";

  return L.divIcon({
    className: "",
    html: `
      <div
        class="sector-marker ${isSelected ? "is-selected" : ""}"
        style="--marker-color:${color}"
      >
        <span class="sector-marker__pin"></span>
        <span class="sector-marker__pin-inner"></span>
      </div>
    `,
    iconSize: [34, 44],
    iconAnchor: [17, 42],
    tooltipAnchor: [0, -34],
  });
}

function createClusterIcon(count) {
  let sizeClass = "";

  if (count >= 15) {
    sizeClass = "is-xl";
  } else if (count >= 8) {
    sizeClass = "is-large";
  }

  const size =
    count >= 15
      ? 70
      : count >= 8
        ? 62
        : 54;

  return L.divIcon({
    className: "",
    html: `
      <div class="sector-cluster ${sizeClass}">
        <span class="sector-cluster__pin"></span>

        <span class="sector-cluster__content">
          ${count}
        </span>
      </div>
    `,
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size],
  });
}

/* =========================================================
   PROJECT CLUSTERS
   ========================================================= */

function ProjectClusters({
  projects,
  selectedProject,
  onSelectProject,
}) {
  const map = useMap();

  const [mapZoom, setMapZoom] = useState(
    map.getZoom()
  );

  useEffect(() => {
    const updateZoom = () => {
      setMapZoom(map.getZoom());
    };

    map.on("zoomend", updateZoom);
    map.on("moveend", updateZoom);

    return () => {
      map.off("zoomend", updateZoom);
      map.off("moveend", updateZoom);
    };
  }, [map]);

  const clusters = useMemo(() => {
    if (!projects.length) return [];

    const CLUSTER_RADIUS = 55;

    const result = [];

    projects.forEach((project) => {
      const point =
        map.latLngToLayerPoint([
          project.lat,
          project.lng,
        ]);

      let foundCluster = null;

      for (const cluster of result) {
        const dx =
          point.x - cluster.pixel.x;

        const dy =
          point.y - cluster.pixel.y;

        const distance = Math.sqrt(
          dx * dx + dy * dy
        );

        if (
          distance <= CLUSTER_RADIUS
        ) {
          foundCluster = cluster;
          break;
        }
      }

      if (foundCluster) {
        foundCluster.projects.push(project);

        const count =
          foundCluster.projects.length;

        const avgLat =
          foundCluster.projects.reduce(
            (sum, item) =>
              sum + item.lat,
            0
          ) / count;

        const avgLng =
          foundCluster.projects.reduce(
            (sum, item) =>
              sum + item.lng,
            0
          ) / count;

        foundCluster.center = [
          avgLat,
          avgLng,
        ];

        foundCluster.pixel =
          map.latLngToLayerPoint(
            foundCluster.center
          );
      } else {
        result.push({
          projects: [project],
          center: [
            project.lat,
            project.lng,
          ],
          pixel: point,
        });
      }
    });

    return result;
  }, [projects, map, mapZoom]);

  return (
    <>
      {clusters.map((cluster) => {
        const clusterProjects =
          cluster.projects;

        /* Single project */
        if (clusterProjects.length === 1) {
          const project =
            clusterProjects[0];

          return (
            <Marker
              key={`project-${project.id}`}
              position={[
                project.lat,
                project.lng,
              ]}
              icon={createMarkerIcon(
                isDelivered(
                  project.status
                ),
                selectedProject?.id ===
                  project.id
              )}
              eventHandlers={{
                click: () =>
                  onSelectProject(
                    project
                  ),
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -35]}
                className="sector-tooltip"
              >
                {project.title}
                {project.location
                  ? ` — ${project.location}`
                  : ""}
              </Tooltip>
            </Marker>
          );
        }

        /* Multiple projects */
        return (
          <Marker
            key={`cluster-${clusterProjects
              .map((p) => p.id)
              .join("-")}`}
            position={cluster.center}
            icon={createClusterIcon(
              clusterProjects.length
            )}
            eventHandlers={{
              click: () => {
                const bounds =
                  L.latLngBounds(
                    clusterProjects.map(
                      (project) => [
                        project.lat,
                        project.lng,
                      ]
                    )
                  );

                const currentZoom =
                  map.getZoom();

                if (
                  bounds
                    .getNorthEast()
                    .equals(
                      bounds.getSouthWest()
                    )
                ) {
                  map.flyTo(
                    cluster.center,
                    Math.min(
                      currentZoom + 3,
                      18
                    ),
                    {
                      duration: 0.7,
                    }
                  );
                } else {
                  map.flyToBounds(
                    bounds,
                    {
                      padding: [70, 70],
                      maxZoom: Math.min(
                        currentZoom + 4,
                        16
                      ),
                      duration: 0.7,
                    }
                  );
                }
              },
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -25]}
              className="sector-tooltip"
            >
              {clusterProjects.length}{" "}
              projects in this area
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}

/* =========================================================
   MAP VIEW
   ========================================================= */

function MapView({
  projects,
  selectedProject,
  onSelectProject,
}) {
  const [basemapKey, setBasemapKey] =
    useState("streets");

  const basemap =
    BASEMAPS[basemapKey];

  const geoProjects =
    projects.filter(
      (p) =>
        typeof p.lat === "number" &&
        typeof p.lng === "number"
    );

  const points = geoProjects.map(
    (p) => [p.lat, p.lng]
  );

  return (
    <div className="sector-map relative h-[380px] w-full overflow-hidden rounded-2xl border border-[#3C3C3B]/15 shadow-sm sm:h-[480px] lg:h-[560px]">
      <style>
        {mapStyles}
      </style>

      <MapContainer
        center={MAP_DEFAULT_CENTER}
        zoom={MAP_DEFAULT_ZOOM}
        minZoom={5}
        maxZoom={basemap.maxZoom}
        scrollWheelZoom
        doubleClickZoom
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          key={basemapKey}
          attribution={
            basemap.attribution
          }
          url={basemap.url}
          maxZoom={basemap.maxZoom}
          className={
            basemap.className || ""
          }
        />

        <FitToProjects
          points={points}
        />

        <MapControls />

        <ProjectClusters
          projects={geoProjects}
          selectedProject={
            selectedProject
          }
          onSelectProject={
            onSelectProject
          }
        />

        {selectedProject && (
          <FlyToMarker
            position={[
              selectedProject.lat,
              selectedProject.lng,
            ]}
          />
        )}
      </MapContainer>

      {/* Map info */}
      <div className="absolute left-3 top-3 z-[1000] flex max-w-[calc(100%-4.5rem)] flex-col items-start gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
        <span className="pointer-events-none rounded-lg border border-[#1E2432]/10 bg-white/95 px-2.5 py-1.5 text-[10px] font-semibold text-[#1E2432] shadow-md sm:text-[11px]">
          {geoProjects.length}{" "}
          projects on the map
        </span>

        <MapBasemapSwitcher
          value={basemapKey}
          onChange={setBasemapKey}
        />

        <div className="pointer-events-none hidden items-center gap-3 rounded-lg border border-[#1E2432]/10 bg-white/95 px-2.5 py-1.5 text-[11px] text-[#1E2432] shadow-md sm:flex">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-white bg-[#1F3888] shadow" />
            Ongoing
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-white bg-[#FFBF00] shadow" />
            Delivered
          </span>
        </div>
      </div>

      {/* Empty state */}
      {geoProjects.length === 0 && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-[#1E2432]/90 px-8 text-center text-sm text-white">
          No project in this filter has
          map coordinates yet. Add lat and
          lng in projectDetails to place it
          on the map.
        </div>
      )}

      {/* Selected project */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
            }}
            className="absolute bottom-3 left-3 right-3 z-[1000] max-h-[75%] overflow-y-auto rounded-xl bg-white shadow-2xl sm:bottom-4 sm:left-4 sm:right-auto sm:w-80"
          >
            <button
              onClick={() =>
                onSelectProject(null)
              }
              aria-label="Close project details"
              className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#1E2432] hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative aspect-[16/7] overflow-hidden rounded-t-xl sm:aspect-[16/10]">
              <img
                src={selectedProject.src}
                alt={
                  selectedProject.title
                }
                className="h-full w-full object-cover"
              />

              <span
                className={`absolute bottom-2 left-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                  isDelivered(
                    selectedProject.status
                  )
                    ? "bg-green-600 text-white"
                    : "bg-yellow-400 text-black"
                }`}
              >
                {getDisplayStatus(
                  selectedProject.status
                )}
              </span>
            </div>

            <div className="p-4">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#2A317A]">
                {
                  selectedProject.category
                }
              </span>

              <h4 className="mt-1 text-sm font-bold uppercase leading-snug text-[#3C3C3B]">
                {
                  selectedProject.title
                }
              </h4>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#3C3C3B]">
                {selectedProject.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#2A317A]" />
                    {
                      selectedProject.location
                    }
                  </span>
                )}

                {selectedProject.year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[#2A317A]" />
                    {
                      selectedProject.year
                    }
                  </span>
                )}
              </div>

              <Link
                to={`/projects/${selectedProject.id}`}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2A317A] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3C3C3B]"
              >
                View project details
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function useStickyTop(ref) {
  const [top, setTop] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () =>
      setTop(Math.min(0, window.innerHeight - el.offsetHeight));

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [ref]);

  return top;
}
/* =========================================================
   MAIN SECTION
   ========================================================= */

export default function SectorFilterSection() {
  const projectsWithDetails = usePublishedProjects();
  const [activePhase, setActivePhase] = useState("all");
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [activeStatus, setActiveStatus] =
    useState("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [viewMode, setViewMode] =
    useState("grid");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const sectionRef = useRef(null);
  const stickyTop = useStickyTop(sectionRef);

  // const filteredProjects = useMemo(() => {
  //   return projectsWithDetails.filter(
  //     (p) => {
  //       const matchesCategory =
  //         activeCategory === "All" ||
  //         p.category === activeCategory;

  //       const matchesStatus =
  //         activeStatus === "All" ||
  //         getDisplayStatus(p.status) ===
  //           activeStatus;

  //       const matchesSearch =
  //         p.title
  //           .toLowerCase()
  //           .includes(
  //             searchTerm
  //               .trim()
  //               .toLowerCase()
  //           );

  //       return (
  //         matchesCategory &&
  //         matchesStatus &&
  //         matchesSearch
  //       );
  //     }
  //   );
  // }, [
  //   activeCategory,
  //   activeStatus,
  //   projectsWithDetails,
  //   searchTerm,
  // ]);

  // 1) المشاريع بعد Category + Status + Search (من غير الـ phase)
const baseFiltered = useMemo(() => {
  return projectsWithDetails.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;

    const matchesStatus =
      activeStatus === "All" || getDisplayStatus(p.status) === activeStatus;

    const matchesSearch = p.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });
}, [activeCategory, activeStatus, projectsWithDetails, searchTerm]);

// 2) عدد المشاريع في كل phase (على حسب الفلاتر التانية)
const phaseCounts = useMemo(() => {
  const counts = {};
  PHASES.forEach((phase) => (counts[phase.id] = 0));

  baseFiltered.forEach((p) => {
    getProjectPhaseIds(p).forEach((id) => {
      if (id in counts) counts[id] += 1;
    });
  });

  return counts;
}, [baseFiltered]);

// 3) النتيجة النهائية بعد فلتر الـ phase
const filteredProjects = useMemo(() => {
  if (activePhase === "all") return baseFiltered;
  return baseFiltered.filter((p) => getProjectPhaseIds(p).includes(activePhase));
}, [baseFiltered, activePhase]);
  const totalPages = Math.ceil(
    filteredProjects.length /
      ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeCategory,
    activeStatus,
    searchTerm,
    activePhase
  ]);

  useEffect(() => {
    if (
      selectedProject &&
      !filteredProjects.some(
        (p) =>
          p.id === selectedProject.id
      )
    ) {
      setSelectedProject(null);
    }
  }, [
    filteredProjects,
    selectedProject,
  ]);

  const startIndex =
    (currentPage - 1) *
    ITEMS_PER_PAGE;

  const paginatedProjects =
    filteredProjects.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
  <section
    ref={sectionRef}
    style={{ top: stickyTop }}
    className="sticky relative w-full bg-white px-4 py-8 sm:px-6 sm:py-10 lg:py-12"
    id="sectors"
  >
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className=" mb-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2A317A]">
            Explore By Sector
          </span>

          <h2 className="mt-1 text-2xl font-bold text-[#3C3C3B] md:text-3xl">
            Our Work, Organized
          </h2>
        </div>

        {/* Categories */}
        <div className="mb-4 flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map(
            ({
              label,
              icon: Icon,
            }) => {
              const isActive =
                activeCategory ===
                label;

              return (
                <button
                  key={label}
                  onClick={() =>
                    setActiveCategory(
                      label
                    )
                  }
                  className={`relative flex items-center gap-2 overflow-hidden rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors duration-300 sm:px-5 sm:py-2.5 sm:text-sm ${
                    isActive
                      ? "bg-[#2A317A] text-white"
                      : "border border-[#3C3C3B]/20 bg-white text-[#3C3C3B] hover:border-[#2A317A] hover:text-[#2A317A]"
                  }`}
                >
                  <motion.span
                    animate={{
                      rotate: isActive
                        ? 360
                        : 0,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.span>

                  {label}

                  {isActive && (
                    <motion.span
                      layoutId="active-sector-stripe"
                      className="absolute bottom-0 left-0 right-0 h-[3px]"
                      style={{
                        background:
                          "#3C3C3B",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            }
          )}
        </div>

        {/* Search + filters */}
       <div className="mb-4 flex flex-col items-stretch gap-3 md:flex-row md:items-center">

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3C3C3B]" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              placeholder="Search projects..."
              className="w-full rounded-lg border border-[#3C3C3B]/20 bg-white py-2.5 pl-10 pr-4 text-sm text-[#3C3C3B] placeholder:text-[#3C3C3B]/60 transition-colors focus:border-[#2A317A] focus:outline-none"
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 rounded-lg border border-[#3C3C3B]/20 bg-white p-1">
            {statusFilters.map(
              (status) => {
                const isActive =
                  activeStatus ===
                  status;

                return (
                  <button
                    key={status}
                    onClick={() =>
                      setActiveStatus(
                        status
                      )
                    }
                    className={`relative rounded-md px-4 py-1.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-[#3C3C3B] hover:text-[#2A317A]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-status-pill"
                        className="absolute inset-0 rounded-md bg-[#2A317A]"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}

                    <span className="relative z-10">
                      {status}
                    </span>
                  </button>
                );
              }
            )}
          </div>

          {/* View mode */}
          <div className="flex items-center gap-2 rounded-lg border border-[#3C3C3B]/20 bg-white p-1">
            <button
              onClick={() =>
                setViewMode("grid")
              }
              aria-label="Grid view"
              className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-[#2A317A] text-white"
                  : "text-[#3C3C3B] hover:text-[#2A317A]"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>

            <button
              onClick={() =>
                setViewMode("map")
              }
              aria-label="Map view"
              className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                viewMode === "map"
                  ? "bg-[#2A317A] text-white"
                  : "text-[#3C3C3B] hover:text-[#2A317A]"
              }`}
            >
              <MapIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <PhaseFilter
  value={activePhase}
  onChange={setActivePhase}
  counts={phaseCounts}
  total={baseFiltered.length}
/>

        {/* Content */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid-view"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
              }}
            >
              {filteredProjects.length ===
              0 ? (
                <p className="py-16 text-center text-[#3C3C3B]">
                  No projects match your
                  search.
                </p>
              ) : (
                <>
                  {/* PROJECT GRID */}
                  <motion.div
                    layout
                    className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
                  >
                    <AnimatePresence mode="popLayout">
                      {paginatedProjects.map(
                        (project) => (
                          <ProjectCard
                            key={
                              project.id
                            }
                            project={
                              project
                            }

                            activePhase={activePhase}
                          />
                        )
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={
                      currentPage
                    }
                    totalPages={
                      totalPages
                    }
                    onPageChange={
                      handlePageChange
                    }
                  />
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="map-view"
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.98,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <MapView
                projects={
                  filteredProjects
                }
                selectedProject={
                  selectedProject
                }
                onSelectProject={
                  setSelectedProject
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}