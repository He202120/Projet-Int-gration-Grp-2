import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import openicon from "../../assets/emplacement.png"; // Icon for open parking
import closeicon from "../../assets/emplacement_rouge.png"; // Icon for closed parking
import { toast } from "react-toastify";

import { useGetparkingMutation } from "../../slices/userApiSlice";

import "./ParkingAccess.css";
import "leaflet/dist/leaflet.css";

const ParkingAccess = () => {
  const [parkingsData, setParkingsData] = useState([]);

  const [parkingsFilter, setParkingsFilter] = useState([]);

  const [takenParkings, setTakenParkings] = useState([]);

  const [parkingsDataFromAPI, { isLoading }] = useGetparkingMutation();

  useEffect(() => {
    try {
      const fetchData = async () => {
        const responseFromApiCall = await parkingsDataFromAPI();

        const parkingsArrays = responseFromApiCall.data.parkingsData;

        //console.log(parkingsArrays);

        const parkingsArray = parkingsArrays.parkingsReturn;

        //console.log(parkingsArray);

        setTakenParkings(parkingsArrays.usersReturn);

        //console.log(takenParkings);

        for (let newparking of parkingsArray) {
          for (let oldparking of parkingsFilter) {
            if (newparking.name == oldparking.name) {
              if (newparking.places == 0 && oldparking.places > 0) {
                toast("Le parking " + newparking.name + " est rempli.", {
                  duration: 4000,
                  position: "bottom-center",

                  // Styling
                  style: {},
                  className: "",

                  // Custom Icon
                  icon: "🛑",

                  // Change colors of success/error/loading icon
                  iconTheme: {
                    primary: "#000",
                    secondary: "#fff",
                  },

                  // Aria
                  ariaProps: {
                    role: "status",
                    "aria-live": "polite",
                  },
                });
              } else if (newparking.places > 0 && oldparking.places == 0) {
                toast("Le parking " + newparking.name + " est disponible.", {
                  duration: 4000,
                  position: "bottom-center",

                  // Styling
                  style: {},
                  className: "",

                  // Custom Icon
                  icon: "☑️",

                  // Change colors of success/error/loading icon
                  iconTheme: {
                    primary: "#000",
                    secondary: "#fff",
                  },

                  // Aria
                  ariaProps: {
                    role: "status",
                    "aria-live": "polite",
                  },
                });
              } else {
                continue;
              }
              break;
            }
          }
        }

        setParkingsData(parkingsArray);
      };

      fetchData();
      const interval = setInterval(() => {
        fetchData(); // Récupérer les données toutes les 5 secondes
      }, 10000); // 1000 millisecondes = 1 secondes

      return () => clearInterval(interval); // Nettoyer l'intervalle lors du démontage du composant
    } catch (err) {
      toast.error(err?.data?.errors[0]?.message || err);

      console.error("Error fetching parkings:", err);
    }
  }, [parkingsDataFromAPI, parkingsFilter]);

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

  const getIcon = (parkingPlaces, id, max) => {
    var takenPlaces = 0;
    for (let taken of takenParkings) {
      if (taken.parking_id == id) {
        takenPlaces += 1;
      }
    }

    return new Icon({
      iconUrl:
        parkingPlaces === 0 || max - takenPlaces === 0 ? closeicon : openicon,
      iconSize: [38, 38],
    });
  };

  const filterOptions = [
    { key: "fhef638cfe", value: "All" },
    { key: "igjc7ejfnq", value: "Libre" },
    { key: "dzdij5zdd2", value: "Handicap" },
    { key: "fefli76d0f", value: "Alias" },
  ];

  const [filterType, setFilterType] = useState("All");

  const [filterPlaces, setFilterPlaces] = useState(0);

  const [filterName, setFilterName] = useState("");

  function handleTypeSelect(event) {
    setFilterType(event.target.value);
  }

  function handlePlacesSelect(event) {
    setFilterPlaces(event.target.value);
  }

  function handleNameSelect(event) {
    setFilterName(event.target.value);
  }

  useEffect(() => {
    const filterUpdate = () => {
      if (filterType == "Libre") {
        var update = [];
        for (let parking of parkingsData) {
          if (parking.places >= filterPlaces && parking.places != 0) {
            update.push(parking);
          }
          var takenPlaces = 0;
          for (let taken of takenParkings) {
            if (taken.parking_id == parking._id) {
              takenPlaces += 1;
            }
          }
          if (
            parking.max_places > takenPlaces &&
            parking.max_places >= filterPlaces
          )
            update.push(parking);
        }
        setParkingsFilter(update);
      } else if (filterType == "Alias") {
        var update2 = [];
        for (let parking of parkingsData) {
          var str1 = parking.name;
          var str2 = filterName;

          // Convertir les deux chaînes en minuscules
          var lowerStr1 = str1.toLowerCase();
          var lowerStr2 = str2.toLowerCase();

          // Vérifier si str2 est un sous-ensemble de str1
          var result = lowerStr1.includes(lowerStr2);
          if (result) {
            update2.push(parking);
          }
        }
        setParkingsFilter(update2);
      } else if (filterType == "Handicap") {
        var update3 = [];
        for (let parking of parkingsData) {
          if (parking.reduced_mobility_spots > 0) update3.push(parking);
        }
        setParkingsFilter(update3);
      } else {
        setParkingsFilter(parkingsData);
      }
    };

    const intervalfilter = setInterval(() => {
      filterUpdate(); // Récupérer les données toutes les 5 secondes
    }, 1000); // 1000 millisecondes = 1 secondes

    return () => clearInterval(intervalfilter);
  }, [filterName, filterPlaces, filterType, parkingsData, takenParkings]);

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

  const statusParking = (places, id, max) => {
    if (places == 0) {
      return "Plein";
    } else if (places > 0) {
      return "Libre";
    } else {
      var takenPlaces = 0;
      for (let taken of takenParkings) {
        console.log(taken);
        if (taken.parking_id === id) {
          takenPlaces += 1;
        }
      }
      if (max <= takenPlaces) {
        return "Plein";
      } else {
        return "Libre";
      }
    }
  };

  const disponibility = (places, id, max_places) => {
    if (places === undefined) {
      var takenPlaces = 0;
      for (let taken of takenParkings) {
        if (taken.parking_id == id) {
          takenPlaces += 1;
        }
      }
      return max_places - takenPlaces + " / " + max_places;
    }
    return places + " / " + max_places;
  };

  return (
    <div className="bodyContainer">
      <MapContainer center={[50.669601, 4.61121]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {parkingsFilter.map((marker) => {
          const distance = userLocation
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                parseFloat(marker.latitude),
                parseFloat(marker.longitude)
              ).toFixed(2)
            : "N/A"; // Distance will be "N/A" until user location is available

          return (
            <Marker
              key={marker._id}
              icon={getIcon(marker.places, marker._id, marker.max_places)}
              position={[marker.latitude, marker.longitude]}
            >
              <Popup>
                <div style={{ width: "300px" }}>
                  <h2>{marker.name}</h2>
                  <p>
                    <strong>Status:</strong>{" "}
                    {statusParking(
                      marker.places,
                      marker._id,
                      marker.max_places
                    )}
                  </p>
                  <p>
                    <strong>Places disponibles:</strong>{" "}
                    {disponibility(
                      marker.places,
                      marker._id,
                      marker.max_places
                    )}
                  </p>
                  <p>
                    <strong>Places Handicapé:</strong>{" "}
                    {marker.reduced_mobility_spots}
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
      <div className="filter">
        <div className="d-flex justify-content-center mt-5">
          <div className="w-200 p-3 border rounded">
            <h4>Filtrer</h4>
            <select
              className="form-select"
              onChange={handleTypeSelect}
              value={filterType}
            >
              {filterOptions.map((option) => (
                <option key={option.key} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
          </div>
        </div>
        {filterType === "Libre" && (
          <div className="numberSelector">
            <label>
              Minimum de places :
              <input
                type="number"
                value={filterPlaces}
                onChange={handlePlacesSelect}
                style={{
                  marginLeft: "10px",
                  width: "60px",
                  borderRadius: "5px",
                  textAlign: "center",
                  borderWidth: "1px",
                  borderColor: "lightgray",
                }}
              />
            </label>
          </div>
        )}
        {filterType === "Alias" && (
          <div className="name-input-container">
            <label htmlFor="name" className="name-label">
              Nom du parking:
            </label>
            <input
              type="text"
              id="name"
              className="name-input"
              placeholder="ex. Baudouin"
              onChange={handleNameSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingAccess;
