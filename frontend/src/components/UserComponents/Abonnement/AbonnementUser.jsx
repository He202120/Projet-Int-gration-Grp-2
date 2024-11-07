import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux"; // Import de useSelector
import { useUpdateSubscriptionMutation } from "../../../slices/userApiSlice"; 
import { toast } from "react-toastify";// Import de la mutation

// Fonction pour calculer la date de fin d'abonnement
const calculateEndDate = (plan) => {
  const today = new Date();
  if (plan === "Year") {
    today.setFullYear(today.getFullYear() + 1);
  } else if (plan === "Month") {
    today.setMonth(today.getMonth() + 1);
  } else if (plan === "Day") {
    today.setDate(today.getDate() + 1);
  }
  return today;
};

function ChoixAbo() {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [userInfo, setUserInfo] = useState({}); // Nouveau state local pour stocker les données de authState

  // Utilisation de useSelector pour accéder à state.auth
  const authState = useSelector((state) => state.auth);

  // Import de la mutation
  const [updateSubscription, { isLoading, isError, isSuccess, error }] = useUpdateSubscriptionMutation();

  // Affichage des données dans authState pour déboguer
  useEffect(() => {
  //  console.log("authState dans useEffect :", authState);
  }, [authState]);

  // Utilisation de useEffect pour attendre que authState ait des données
  useEffect(() => {
    if (authState?.userInfo?.name && authState?.userInfo?.email) {
      // Si les données sont disponibles, les mettre dans userInfo
      setUserInfo({
        name: authState.userInfo.name,
        email: authState.userInfo.email,
      });
    } else {
      // Si authState n'a pas les données attendues, loguer un message pour déboguer
      console.log("Données de authState manquantes : ", authState);
    }
  }, [authState]); // Effectué lorsque authState change

  // Affichage de state.auth dans la console une fois que les données sont disponibles
  useEffect(() => {
    if (userInfo.name && userInfo.email) {
//      console.log("Données de l'état auth :", userInfo);
    }
  }, [userInfo]); // Affiche les données dans la console quand userInfo change

  // Fonction pour gérer la sélection d'un abonnement
  const handleSelectPlan = async (plan) => {
    setSelectedPlan(plan);
  
    // Création de l'objet d'abonnement avec date de fin et nombre d'entrées
    const newSubscription = {
      name: userInfo.name || "Nom non disponible", // Fallback si name est undefined
      mail: userInfo.email || "Email non disponible", // Fallback si email est undefined
      subscription: plan,
      end_date: calculateEndDate(plan),
      entrance: 0, // Utilisation de entranceValue calculé
    };
  
    // Appel à la mutation pour mettre à jour les données d'abonnement de l'utilisateur
    try {
      const result = await updateSubscription(newSubscription).unwrap();
      toast.success("Nouvelle abonnement mise à jour");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour de l'abonnement:");
    }
  
    // Affichage en console de l'abonnement sélectionné avec les données supplémentaires
    // console.log("Nouvel abonnement sélectionné:", newSubscription);
  };

  return (
    <Container className="text-center mt-5">
      <h1>Choisissez votre abonnement</h1>
      <Row className="mt-4">
        <Col md={4}>
          <SubscriptionCard
            title="Abonnement Annuel"
            price="100€/an"
            description="Profitez d'une année complète d'accès !"
            onSelect={() => handleSelectPlan("Year")}
            isSelected={selectedPlan === "Year"}
          />
        </Col>
        <Col md={4}>
          <SubscriptionCard
            title="Abonnement Mensuel"
            price="10€/mois"
            description="Flexibilité avec des paiements mensuels."
            onSelect={() => handleSelectPlan("Month")}
            isSelected={selectedPlan === "Month"}
          />
        </Col>
        <Col md={4}>
          <SubscriptionCard
            title="Pass Journée"
            price="5€/jour"
            description="Accès pour une journée seulement."
            onSelect={() => handleSelectPlan("Day")}
            isSelected={selectedPlan === "Day"}
          />
        </Col>
      </Row>
      {selectedPlan && (
        <p className="mt-4">
          Vous avez sélectionné l'abonnement : <strong>{selectedPlan}</strong>
        </p>
      )}
    </Container>
  );
}

function SubscriptionCard({ title, price, description, onSelect, isSelected }) {
  return (
    <Card border={isSelected ? "success" : "light"} className="h-100">
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title>{title}</Card.Title>
          <Card.Text className="text-muted">{price}</Card.Text>
          <Card.Text>{description}</Card.Text>
        </div>
        <Button
          onClick={onSelect}
          variant={isSelected ? "success" : "primary"}
          className="mt-3"
        >
          Choisir
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ChoixAbo;
