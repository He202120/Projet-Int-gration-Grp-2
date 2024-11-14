import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import openicon from "../../assets/emplacement.png"; // Icon for open parking
import closeicon from "../../assets/emplacement_rouge.png"; // Icon for closed parking

import "./ParkingAccess.css";
import "leaflet/dist/leaflet.css";

const ParkingAccess = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [markers, setMarkers] = useState([
    {
      geocode: [50.66621031188031, 4.612283636463168],
      name: "Ephec",
      status: "Libre",
      parkingPlaces: 50,
      id: "ec-lln",
    },
    {
      geocode: [50.664354957837446, 4.621078875552762],
      name: "Baudoin 1er",
      status: "Plein",
      parkingPlaces: 0,
      id: "bn1-lln",
    },
    {
      geocode: [50.671503891861924, 4.616754274493264],
      name: "L'Esplanade",
      status: "Libre",
      parkingPlaces: 30,
      id: "esp-lln",
    },
    {
      geocode: [50.66682565717643, 4.613395577000956],
      name: "Lerclercq",
      status: "Libre",
      parkingPlaces: 20,
      id: "lcq-lln",
    },
  ]);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  const getIcon = (status, parkingPlaces) => {
    return new Icon({
      iconUrl: parkingPlaces === 0 ? closeicon : openicon,
      iconSize: [38, 38],
    });
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  return (
    <div className="bodyContainer">
      <MapContainer center={[50.669601, 4.61121]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker) => {
          const distance = userLocation
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                marker.geocode[0],
                marker.geocode[1]
              ).toFixed(2)
            : "N/A"; // Distance will be "N/A" until user location is available

          return (
            <Marker
              key={marker.id}
              icon={getIcon(marker.status, marker.parkingPlaces)}
              position={marker.geocode}
            >
              <Popup>
                <div style={{ width: "500px" }}>
                  <h3>{marker.name}</h3>
                  <p>
                    <strong>Status:</strong> {marker.status}
                  </p>
                  <p>
                    <strong>Places disponibles:</strong> {marker.parkingPlaces}
                  </p>
                  <p>
                    <strong>Distance de vous:</strong> {distance} km
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ParkingAccess;
