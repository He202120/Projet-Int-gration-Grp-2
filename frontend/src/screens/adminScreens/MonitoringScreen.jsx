import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useGetUsersAllDataMutation } from "../../slices/adminApiSlice";
import Loader from "../../components/Loader";

const CarPlatesList = () => {

    // État pour stocker l'ordre de tri (true pour ascendant, false pour descendant)
    const [isAscending, setIsAscending] = useState(true);
    const [isAscendingName, setIsAscendingName] = useState(true);
    // État pour stocker les informations des utilisateurs
    const [usersData, setUsersData] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    // API users data
    const [getUsersData] = useGetUsersAllDataMutation();

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
    }, [getUsersData]);


    const calculeHeure = (heureArrivee) => {
        const maintenant = new Date();
        const temps = maintenant - heureArrivee;
        const heurs = parseInt(temps / (1000 * 60 * 60), 10);
        const minutes = parseInt((temps % (1000 * 60 * 60)) / (1000 * 60), 10);
        return `${heurs}h ${minutes}min`;
    }

    // Fonction pour trier les voitures par heure arrivé
    const sortByArrivalTime = () => {
        const sortedUsers = [...usersData].sort((a, b) => {
            return isAscending
                ? new Date(a.arrival) - new Date(b.arrival)
                : new Date(b.arrival) - new Date(a.arrival);
        });
        setUsersData(sortedUsers);
        setIsAscending(!isAscending);
    };

    // Fonction pour trier nom par ordre alphabet
    const sortByName = () => {
        const sortedUsers = [...usersData].sort((a, b) => {
            return isAscendingName
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        });
        setUsersData(sortedUsers);
        setIsAscendingName(!isAscendingName);
    };

    // test debug
    console.log(usersData);

    // Test filtrer les utilisateurs avec num_parking ici 1
    const filteredUsers = usersData.filter(user => user.num_parking === 1);
    const countUsersInParking = filteredUsers.length;


    return (
        <div>
            <h1>Remplissage</h1>
            <div>
                <h1>{countUsersInParking}/50</h1>
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
                            <th>
                                <Button
                                    variant="link"
                                    onClick={sortByName}
                                    style={{ textDecoration: "none" }}
                                >
                                    Nom {isAscendingName ? "↑" : "↓"}
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
                            .filter(user => user.num_parking === 1) //attention test a changer apres
                            .map((user, index) => (
                                <tr key={index}>
                                    <td>{user.plate}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.telephone}</td>
                                    <td>{calculeHeure(new Date(user.arrival))}</td>
                                    <td>{new Date(user.arrival).toLocaleString()}</td>
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