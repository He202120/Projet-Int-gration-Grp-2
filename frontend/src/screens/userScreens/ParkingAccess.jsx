import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import openicon from "../../assets/emplacement.png"; // Icon for open parking
import closeicon from "../../assets/emplacement_rouge.png"; // Icon for closed parking
import { toast } from "react-toastify";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { useGetparkingMutation } from "../../slices/userApiSlice";

import "./ParkingAccess.css";
import "leaflet/dist/leaflet.css";

const ParkingAccess = () => {
  const [parkingsData, setParkingsData] = useState([]);

  const [parkingsDataFromAPI, { isLoading }] = useGetparkingMutation();

  useEffect(() => {
    try {
      const fetchData = async () => {
        const responseFromApiCall = await parkingsDataFromAPI();

        const parkingsArray = responseFromApiCall.data.parkingsData;
        console.log(parkingsArray);

        setParkingsData(parkingsArray);
      };

      fetchData();
      const interval = setInterval(() => {
        fetchData(); // Récupérer les données toutes les 5 secondes
      }, 5000); // 5000 millisecondes = 5 secondes

      return () => clearInterval(interval); // Nettoyer l'intervalle lors du démontage du composant
    } catch (err) {
      toast.error(err?.data?.errors[0]?.message || err);

      console.error("Error fetching parkings:", err);
    }
  }, []);

  const [userLocation, setUserLocation] = useState(null);

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

  const getIcon = (parkingPlaces) => {
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

  const statusParking = (places) => {
    return places > 0 ? "Libre" : "Plein";
  };

  return (
    <div className="bodyContainer">
      <MapContainer center={[50.669601, 4.61121]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {parkingsData.map((marker) => {
          const distance = userLocation
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                marker.latitude,
                marker.longitude
              ).toFixed(2)
            : "N/A"; // Distance will be "N/A" until user location is available

          return (
            <Marker
              key={marker._id}
              icon={getIcon(marker.places)}
              position={[marker.latitude, marker.longitude]}
            >
              <Popup>
                <div style={{ width: "500px" }}>
                  <h3>{marker.name}</h3>
                  <p>
                    <strong>Status:</strong> {statusParking(marker.places)}
                  </p>
                  <p>
                    <strong>Places disponibles:</strong> {marker.places}
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
