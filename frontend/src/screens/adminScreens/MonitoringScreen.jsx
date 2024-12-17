import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useGetUsersAllDataMutation, useGetParkingsAllDataMutation } from "../../slices/adminApiSlice";
import Loader from "../../components/Loader";

const CarPlatesList = () => {

    // État pour stocker l'ordre de tri de nom, prénom et arrivé
    const [isAscending, setIsAscending] = useState(true);
    const [isAscendingName, setIsAscendingName] = useState(true);
    const [isAscendingFirstname, setIsAscendingFirstname] = useState(true);

    // État pour stocker les informations des utilisateurs et des parkings
    const [usersData, setUsersData] = useState([]);
    const [parkingsData, setParkingsData] = useState([]);

    // Le parking choisit (null de base)
    const [selectedParking, setSelectedParking] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    // appel API users et parking
    const [getUsersData] = useGetUsersAllDataMutation();
    const [getParkingsData] = useGetParkingsAllDataMutation();

    // doit être true pour charger la page (pour le delai)
    const [isReady, setIsReady] = useState(false);

    // Charge les données de la db.
    useEffect(() => {
        const fetchUsersData = async () => {
            setIsLoading(true);
            try {
                const response = await getUsersData();
                const data = response.data.usersData;
                setUsersData(data);  // Mise à jour des données des utilisateurs
            } catch (error) {
                toast.error("Erreur de récupération des données utilisateurs");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsersData();

        const fetchParkingsData = async () => {
            setIsLoading(true);
            try {
                const response = await getParkingsData();
                const data = response.data.parkingsData;
                setParkingsData(data);  // Mise à jour des données parkings
                if (data.length > 0) {
                    setSelectedParking(data[0])
                }
            } catch (error) {
                toast.error("Erreur de récupération des parkings");
            } finally {
                setIsLoading(false);
            }
        };
        fetchParkingsData();

        // ajout délai pour éviter erreur.
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 500);

    }, [getUsersData, getParkingsData]);

    // Fct pour calculer depuis combien de temp la voiture est arrivé.
    const calculeHeure = (heureArrivee) => {
        const maintenant = new Date();
        const temps = maintenant - heureArrivee;
        const heurs = parseInt(temps / (1000 * 60 * 60), 10);
        const minutes = parseInt((temps % (1000 * 60 * 60)) / (1000 * 60), 10);
        return `${heurs}h ${minutes}min`;
    }

    // Fonctions pour trier les voitures par heure arrivé, nom et prénom.
    const sortByArrivalTime = () => {
        const sortedUsers = [...usersData].sort((a, b) => {
            return isAscending
                ? new Date(a.arrival_time) - new Date(b.arrival_time)
                : new Date(b.arrival_time) - new Date(a.arrival_time);
        });
        setUsersData(sortedUsers);
        setIsAscending(!isAscending);
    };
    const sortByName = () => {
        const sortedUsers = [...usersData].sort((a, b) => {
            return isAscendingName
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        });
        setUsersData(sortedUsers);
        setIsAscendingName(!isAscendingName);
    };
    const sortByFirstname = () => {
        const sortedUsers = [...usersData].sort((a, b) => {
            return isAscendingFirstname
                ? a.firstname.localeCompare(b.firstname)
                : b.firstname.localeCompare(a.firstname);
        });
        setUsersData(sortedUsers);
        setIsAscendingFirstname(!isAscendingFirstname);
    };

    // change le parking selectionner quand on clique sur le bouton.
    const handleParkingClick = (Parking) => {
        setSelectedParking(Parking);
        console.log(`Parking sélectionné : ${Parking}`);

    };


    // Filtrer les utilisateurs avec parking_id
    const filteredUsers = selectedParking
        ? usersData.filter(user => user.parking_id === selectedParking._id)
        : [];
    const countUsersInParking = filteredUsers.length;

    // Filtrer les utilisateurs PMR
    const PmrUsersInParking = filteredUsers.filter(user => user.requires_accessible_parking === true);

    const countPmrUsersInParking = PmrUsersInParking.length;

    // couleur cercle avec calcule en pourcent
    const getCircleColor = () => {
        if (!selectedParking) return "gray"; // Par défaut si aucun parking n'est sélectionné
        const occupancyRate = (countUsersInParking / selectedParking.max_places) * 100;
        if (occupancyRate < 75) return "green";
        if (occupancyRate >= 75 && occupancyRate <= 95) return "orange";
        return "red";
    };


    if (!isReady) {
        return <Loader />;
    }

    return (
        <div>

            <div style={{ marginBottom: "20px" }}>
                <h2>Liste des parkings :</h2>
                {parkingsData.map((parking, index) => (
                    <Button
                        key={index}
                        variant="primary"
                        style={{ margin: "5px" }}
                        onClick={() => handleParkingClick(parking)}
                    >
                        {parking.name}
                    </Button>
                ))}
            </div>

            <hr style={{ border: "1px solid", margin: "20px" }} />

            <h1>
                Remplissage du parking: {selectedParking ? selectedParking.name : "Aucun parking sélectionné"}
            </h1>
            <div style={{ display: "flex", alignItems: "center" }}>
                <h1 style={{ margin: 0 }}>
                    {countUsersInParking}/{selectedParking ? selectedParking.max_places : "Aucun parking sélectionné"}
                </h1>
                <div
                    style={{
                        width: "4vw",
                        height: "4vw",
                        borderRadius: "50%",
                        marginLeft: "1em",
                        backgroundColor: getCircleColor(),
                    }}
                ></div>
            </div>
            <div>
                <h2>
                    {countPmrUsersInParking}/{selectedParking ? selectedParking.reduced_mobility_spots : "Aucun parking sélectionné"} ♿
                </h2>
            </div>


            <div className="new-data-section" style={{ marginTop: "20px" }}>
                <h2>Voitures dans le parking:</h2>
                {isLoading ? (
                    <Loader /> // Affiche un loader pendant le chargement
                ) : (
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Plaque</th>
                            <th>PMR</th>
                            <th>
                                <Button
                                    variant="link"
                                    onClick={sortByName}
                                    style={{ textDecoration: "none" }}
                                >
                                    Nom {isAscendingName ? "↑" : "↓"}
                                </Button>
                            </th>
                            <th>
                                <Button
                                    variant="link"
                                    onClick={sortByFirstname}
                                    style={{ textDecoration: "none" }}
                                >
                                    Prénom {isAscendingFirstname ? "↑" : "↓"}
                                </Button>
                            </th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Temps</th>
                            <th>
                                <Button
                                    variant="link"
                                    onClick={sortByArrivalTime}
                                    style={{ textDecoration: "none" }}
                                >
                                    Arrivé {isAscending ? "↑" : "↓"}
                                </Button>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {usersData
                            .filter(user => user.parking_id === selectedParking._id) //attention test a changer apres
                            .map((user, index) => (
                                <tr key={index}>
                                    <td>{user.plate}</td>
                                    <td>
                                        {user.requires_accessible_parking ? "♿" : ""}
                                    </td>
                                    <td>{user.name}</td>
                                    <td>{user.firstname}</td>
                                    <td>{user.email}</td>
                                    <td>{user.telephone}</td>
                                    <td>{calculeHeure(new Date(user.arrival_time))}</td>
                                    <td>{new Date(user.arrival_time).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>


        </div>
    );
};
export default CarPlatesList;