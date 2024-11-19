import React from "react";
import { Table } from "react-bootstrap";
const CarPlatesList = () => {
    // Tableau contenant les plaques de voiture et les noms/prénoms associés
    const carPlates = [
        { plaque: "1-ABC-123", prenom: "Jean", nom: "Charles", heureArrive: new Date("2024-10-09T08:00:00") },
        { plaque: "2-LFG-543", prenom: "Marie", nom: "Bidule", heureArrive: new Date("2024-10-09T09:00:00") },
        { plaque: "2-GTH-289", prenom: "Pierre", nom: "Truc", heureArrive: new Date("2024-10-09T09:45:00") },
        { plaque: "1-TTR-765", prenom: "Arthur", nom: "jsp", heureArrive: new Date("2024-10-09T12:00:00") },
        { plaque: "1-TYU-989", prenom: "Louis", nom: "Machin", heureArrive: new Date("2024-10-09T13:00:00") },
    ];
    const calculeHeure = (heureArrivee) => {
        const maintenant = new Date();
        const temps = maintenant - heureArrivee;
        const heurs = parseInt(temps / (1000 * 60 * 60), 10);
        const minutes = parseInt((temps % (1000 * 60 * 60)) / (1000 * 60), 10);
        return `${heurs}h ${minutes}min`;
    }
    return (
        <div>
            <h1>Remplissage</h1>
            <div>
                <h1>{carPlates.length}/50</h1>
            </div>
            <h3>Voitures dans le parking:</h3>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Plaque Voiture</th>
                    <th>Prénom</th>
                    <th>Nom</th>
                    <th>Arrivé</th>
                    <th>Temps</th>
                </tr>
                </thead>
                <tbody>
                {carPlates.map((car, index) => (
                    <tr key={index}>
                        <td>{car.plaque}</td>
                        <td>{car.prenom}</td>
                        <td>{car.nom}</td>
                        <td>{car.heureArrive.toLocaleString()}</td>
                        <td>{calculeHeure(car.heureArrive)}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};
export default CarPlatesList;