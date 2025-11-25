import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

// Center coordinates for India (approximate)
const center = {
    lat: 22.9734,
    lng: 78.6569
};

// Example marker position (e.g., Delhi)
const markerPosition = {
    lat: 28.6139,
    lng: 77.2090
};

function MapAndCharts() {
    const googleMapsApiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

    if (!googleMapsApiKey) {
        return <div>Error: Google Maps API key is missing. Please set VITE_REACT_APP_GOOGLE_MAPS_API_KEY in your .env file and restart the development server.</div>;
    }

    // Prevent rendering on server side
    if (typeof window === "undefined") {
        return null;
    }

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={5}
            >
                <Marker position={markerPosition} />
            </GoogleMap>
        </LoadScript>
    );
}

export default MapAndCharts;
