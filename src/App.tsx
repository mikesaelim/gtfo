import { useState } from "react";
import "./App.css";

const DELTA_MILES = { lat: 0.25, lng: 0.25 };

interface LatLng {
  lat: number;
  lng: number;
}

function App() {
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);

  function calculateDestination() {
    navigator.geolocation.getCurrentPosition((position) => {
      const currentLat = position.coords.latitude;
      const currentLng = position.coords.longitude;
      setCurrentLocation({lat: currentLat, lng: currentLng});
      setLocationAccuracy(position.coords.accuracy);

      const deltaLat = milesToDegreesLat(DELTA_MILES.lat);
      const newLat = (currentLat - deltaLat) + Math.random() * 2 * deltaLat;
      const deltaLng = milesToDegreesLng(DELTA_MILES.lng, currentLat);
      const newLng = (currentLng - deltaLng) + Math.random() * 2 * deltaLng;

      setDestination({lat: newLat, lng: newLng});
    });
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(`${destination?.lat.toFixed(5)}, ${destination?.lng.toFixed(5)}`);
  }

  return (
    <div className="App">
      { currentLocation &&
        <div>
          Current location: {`${currentLocation.lat}, ${currentLocation.lng}`}
          <br />
          Accuracy: {locationAccuracy} meters
        </div>
      }
      { destination &&
        <div>
          Destination: {`${destination.lat.toFixed(5)}, ${destination.lng.toFixed(5)}`}
          &nbsp;&nbsp;
          <button onClick={copyToClipboard}>copy</button>
        </div>
      }
      <button onClick={calculateDestination}>
        Get destination!
      </button>
    </div>
  );
}

function milesToDegreesLat(miles: number): number {
  return miles / 69.1;
}

function milesToDegreesLng(miles: number, latitude: number): number {
  return miles / (69.1 * Math.cos(latitude * Math.PI / 180));
}

export default App;
