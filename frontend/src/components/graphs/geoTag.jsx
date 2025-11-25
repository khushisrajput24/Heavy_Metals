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
  Alert: "orange", // Yellow
  Critical: "#ff5c5c", // Red
  Safe: "#52d17a", // Green
};

export const DelhiHeatMap = () => {
  const googleMapsApiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey,
    libraries: ["visualization"],
  });

  const [hovered, setHovered] = React.useState(null);

  const dataPoints = React.useMemo(() => {
    if (!isLoaded) return [];
    const google = window.google;
    return reportsData.map((item) => ({
      location: new google.maps.LatLng(item.lat, item.lng),
      weight: item.hpi,
    }));
  }, [isLoaded]);

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
      <HeatmapLayer data={dataPoints} />
      {reportsData.map((item) => (
        <Circle
          key={item.region}
          center={{ lat: item.lat, lng: item.lng }}
          radius={700}
          options={{
            strokeColor: statusColors[item.status],
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: statusColors[item.status],
            fillOpacity: 0.5,
          }}
          onMouseOver={() => setHovered(item)}
          onMouseOut={() => setHovered(null)}
        />
      ))}
      {hovered && (
        <InfoWindow
          position={{ lat: hovered.lat, lng: hovered.lng }}
          onCloseClick={() => setHovered(null)}
        >
          <div>
            <span style={{ fontWeight: "bold" }}>{hovered.region}</span>
            <br />
            <strong>HPI Value:</strong>
            <span style={{ fontWeight: "bold" }}>{hovered.hpi}</span>
            <br />
            <strong>Risk:</strong>
            <span
              style={{
                color: statusColors[hovered.status],
                fontWeight: "bold",
                padding: "2px",
              }}
            >
              {hovered.status}
            </span>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : null;
};
