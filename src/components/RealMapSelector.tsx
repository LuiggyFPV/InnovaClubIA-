import React, { useEffect, useRef, useState } from "react";

interface RealMapSelectorProps {
  onLocationSelected: (address: string, coordsStr: string) => void;
  currentUbi: string;
}

export default function RealMapSelector({ onLocationSelected, currentUbi }: RealMapSelectorProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({ lat: 4.6097, lng: -74.0817 }); // Default: Bogotá CO

  useEffect(() => {
    let active = true;

    // Load Leaflet dynamically from CDN safely
    const loadLeaflet = async () => {
      try {
        if (!(window as any).L) {
          // Add style tag
          if (!document.getElementById("leaflet-cdn-css")) {
            const link = document.createElement("link");
            link.id = "leaflet-cdn-css";
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
          }

          // Add script tag
          if (!document.getElementById("leaflet-cdn-js")) {
            const script = document.createElement("script");
            script.id = "leaflet-cdn-js";
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            document.head.appendChild(script);

            await new Promise((resolve, reject) => {
              script.onload = resolve;
              script.onerror = () => reject(new Error("No se pudo cargar el script del mapa."));
            });
          }
        }

        if (!active) return;
        setLoading(false);

        // Check if map container exists and map hasn't been initialized
        if (mapContainerRef.current && !mapInstanceRef.current) {
          const L = (window as any).L;
          if (!L) return;

          // Attempt to parse lat/lng from currentUbi if it has coordinates
          let centerCoords = [4.6097, -74.0817]; // Bogotá default
          const coRegex = /([+-]?\d+\.\d+)\s*[°,]?\s*([+-]?\d+\.\d+)/;
          const match = currentUbi.match(coRegex);
          if (match) {
            const lat = parseFloat(match[1]);
            const lng = parseFloat(match[2]);
            if (!isNaN(lat) && !isNaN(lng)) {
              centerCoords = [lat, lng];
              setCurrentCoords({ lat, lng });
            }
          }

          // Initialize Leaflet Map
          const map = L.map(mapContainerRef.current, {
            center: centerCoords,
            zoom: 13,
            zoomControl: true,
          });

          // OpenStreetMap Elegant Dark/Satelite layer styles (CartoDB Dark Matter fits perfectly our cosmic slate style!)
          L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
          }).addTo(map);

          // Add custom marker
          const customMarker = L.marker(centerCoords, {
            draggable: true,
          }).addTo(map);

          // Update refs
          mapInstanceRef.current = map;
          markerInstanceRef.current = customMarker;

          // Event: Map Click to position marker
          map.on("click", async (e: any) => {
            const { lat, lng } = e.latlng;
            customMarker.setLatLng([lat, lng]);
            setCurrentCoords({ lat, lng });
            await reverseGeocode(lat, lng);
          });

          // Event: Marker dragend to detect coordinates
          customMarker.on("dragend", async () => {
            const position = customMarker.getLatLng();
            setCurrentCoords({ lat: position.lat, lng: position.lng });
            await reverseGeocode(position.lat, position.lng);
          });
        }
      } catch (err: any) {
        if (active) {
          setErrorMsg(err.message || "Error al inicializar el mapa.");
          setLoading(false);
        }
      }
    };

    loadLeaflet();

    return () => {
      active = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerInstanceRef.current = null;
      }
    };
  }, []);

  // Nomimatim reverse geocode API
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "es",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const address = data.display_name || "Ubicación Georeferenciada";
        const coordsStr = `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° W`;
        onLocationSelected(address, coordsStr);
      } else {
        onLocationSelected(`Ubicación de Radar`, `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° W`);
      }
    } catch (e) {
      onLocationSelected(`Ubicación Escogida`, `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° W`);
    }
  };

  // Search Address utilizing Free Nominatim Search API
  const handleSearchAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "es",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const firstResult = data[0];
          const lat = parseFloat(firstResult.lat);
          const lng = parseFloat(firstResult.lon);
          
          if (!isNaN(lat) && !isNaN(lng)) {
            setCurrentCoords({ lat, lng });

            if (mapInstanceRef.current && markerInstanceRef.current) {
              const L = (window as any).L;
              mapInstanceRef.current.setView([lat, lng], 15);
              markerInstanceRef.current.setLatLng([lat, lng]);
            }

            const address = firstResult.display_name || searchQuery;
            const coordsStr = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° W`;
            onLocationSelected(address, coordsStr);
          }
        } else {
          alert("No se encontraron ubicaciones para la búsqueda especificada. Intenta detallar la ciudad.");
        }
      }
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setIsSearching(false);
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${currentCoords.lat},${currentCoords.lng}`;

  return (
    <div className="space-y-3.5 mt-2.5 animate-fadeIn">
      {/* Map Search Form */}
      <form onSubmit={handleSearchAddress} className="flex gap-1.5">
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Buscar barrio, ciudad, dirección exacta..."
          className="flex-1 bg-black/80 border border-purple-500/35 rounded-xl p-2.5 text-xs text-white focus:border-[#FF2EFB] outline-none cursor-text"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="px-4.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 active:scale-95 text-white text-[11px] font-black uppercase rounded-xl transition cursor-pointer"
        >
          {isSearching ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {/* Actual Map Canvas Div Container */}
      <div className="relative w-full rounded-2xl border-2 border-purple-900/40 overflow-hidden bg-black flex flex-col justify-center items-center min-h-[280px]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 space-y-2">
            <span className="text-sm text-[#FF2EFB] font-bold animate-pulse">📡 Cargando mapa satelital global...</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase">Cargando OpenStreetMap &amp; Leaflet</span>
          </div>
        )}

        {errorMsg && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-4 text-center z-20 text-xs font-semibold text-pink-400">
            <span>🚨 {errorMsg}</span>
            <span className="text-gray-500 text-[10px] mt-1">Conéctate a internet para arrastrar y posicionar pines</span>
          </div>
        )}

        <div 
          ref={mapContainerRef} 
          className="w-full h-[280px] z-10" 
          style={{ height: "280px", minHeight: "280px" }}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs">
        <div>
          <span className="text-gray-450 block text-[9.5px] uppercase font-bold">Coordenadas del Pointer</span>
          <span className="text-white font-mono font-bold tracking-tight">Lat: {currentCoords.lat.toFixed(5)} | Lng: {currentCoords.lng.toFixed(5)}</span>
        </div>

        {/* GOOGLE MAPS LINK AND METADATA */}
        <a 
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-[#2E8BFF] text-[#2E8BFF] hover:bg-[#2E8BFF]/10 transition text-[10px] uppercase font-black tracking-wider cursor-pointer text-center justify-center shrink-0"
        >
          <span>🛰️ Abrir en Google Maps</span>
        </a>
      </div>

      <p className="text-[10px] text-gray-400 italic text-center">
        💡 Arrastra el pin azul o haz clic en cualquier zona para reubicar. El radar analizará el microentorno comercial del punto seleccionado.
      </p>
    </div>
  );
}
