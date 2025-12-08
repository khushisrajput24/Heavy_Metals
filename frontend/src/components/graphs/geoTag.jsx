import React from "react";
import {
  GoogleMap,
  HeatmapLayer,
  Circle,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { reportsData } from "../../utils/constants";

const containerStyle = {
  width: "100%",
  height: "500px",
};
const center = { lat: 28.7041, lng: 77.1025 };

const statusColors = {
  Alert: "orange",
  Critical: "#ff5c5c",
  Safe: "#52d17a",
};

export const DelhiHeatMap = () => {
  const googleMapsApiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey,
    libraries: ["visualization"],
  });

  const [hovered, setHovered] = React.useState(null);
  const [address, setAddress] = React.useState("Loading...");

  // FREE Reverse Geocoding (NO billing required)
  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      setAddress(data.display_name || "Address not available");
    } catch (err) {
      setAddress("Address not available");
    }
  };

  const dataPoints = React.useMemo(() => {
    if (!isLoaded || !window.google) return [];
    return reportsData.map((item) => ({
      location: new window.google.maps.LatLng(item.lat, item.lng),
      weight: item.hpi,
    }));
  }, [isLoaded]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
      <HeatmapLayer data={dataPoints} />

      {reportsData.map((item) => (
        <Circle
          key={`${item.lat}-${item.lng}`}
          center={{ lat: item.lat, lng: item.lng }}
          radius={700}
          options={{
            strokeColor: statusColors[item.status],
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: statusColors[item.status],
            fillOpacity: 0.5,
          }}
          onMouseOver={() => {
            setHovered(item);
            fetchAddress(item.lat, item.lng); // FREE ADDRESS LOOKUP
          }}
          onMouseOut={() => {
            setHovered(null);
            setAddress("Loading...");
          }}
        />
      ))}

      {hovered && (
        <InfoWindow
          position={{ lat: hovered.lat, lng: hovered.lng }}
          onCloseClick={() => setHovered(null)}
        >
          <div style={{ maxWidth: "250px" }}>
            <strong>Location:</strong> <br />
            {address}
            <br />
            <br />
            <strong>HPI:</strong> {hovered.hpi} <br />
            <strong>Risk:</strong>{" "}
            <span
              style={{
                color: statusColors[hovered.status],
                fontWeight: "bold",
              }}
            >
              {hovered.status}
            </span>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};
