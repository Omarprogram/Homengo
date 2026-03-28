// LocationPicker.jsx
// This component provides a location picker with Google Maps integration.
// Users can search for locations using an autocomplete input and select a location by dragging a marker on the map.


import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
  margin: "1rem 0",
};

const defaultCenter = {
  lat: 31.9539,
  lng: 35.9106, // Amman
};

function LocationPicker({ location, setLocation }) {
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const newPos = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMarkerPosition(newPos);
        setLocation(place.formatted_address);
      }
    }
  };

  const handleMarkerDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    setLocation(`${lat}, ${lng}`);
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY" libraries={["places"]}>
      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "12px",
            border: "1px solid rgba(0,0,0,0.3)",
            marginBottom: "0.5rem",
            fontSize: "1rem",     
    }}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={markerPosition}
        zoom={14}
      >
        <Marker
          position={markerPosition}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
        />
      </GoogleMap>
    </LoadScript>
  );
}

export default LocationPicker;
