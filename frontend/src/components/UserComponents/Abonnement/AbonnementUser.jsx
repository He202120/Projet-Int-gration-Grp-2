import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  useUpdateSubscriptionMutation,
  useGetSubscriptionMutation,
} from "../../../slices/userApiSlice";
import { toast } from "react-toastify";

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
  const [subscriptionData, setSubscriptionData] = useState(null); // State pour stocker la réponse de l'abonnement

  // Utilisation de useSelector pour accéder à state.auth
  const authState = useSelector((state) => state.auth);

  // Import des mutations
  const [updateSubscription] = useUpdateSubscriptionMutation();
  const [getSubscription, { data, isLoading, isError, error }] =
    useGetSubscriptionMutation();

  // Récupération des données authState
  useEffect(() => {
    if (authState?.userInfo?.name && authState?.userInfo?.email) {
      setUserInfo({
        name: authState.userInfo.name,
        email: authState.userInfo.email,
      });
    } else {
      console.log("Données de authState manquantes : ", authState);
    }
  }, [authState]);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (userInfo.email) {
        try {
          const result = await getSubscription({ email: userInfo.email }).unwrap();
          setSubscriptionData(result);
        } catch (err) {
          console.error("Erreur lors de l'appel API :", err);
          toast.error("Erreur lors de la récupération des données d'abonnement.");
        }
      }
    };
  
    fetchSubscription();
  }, [userInfo, getSubscription]);
  

  // Fonction pour gérer la sélection d'un abonnement
  const handleSelectPlan = async (plan) => {
    setSelectedPlan(plan);

    const newSubscription = {
      name: userInfo.name || "Nom non disponible",
      mail: userInfo.email || "Email non disponible",
      subscription: plan,
      end_date: calculateEndDate(plan),
      entrance: 0,
    };

    try {
      const result = await updateSubscription(newSubscription).unwrap();
      toast.success("Nouvel abonnement mis à jour");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour de l'abonnement:");
    }
  };

  return (
    <Container className="text-center mt-5">
      <h1>Choisissez votre abonnement</h1>
      {isLoading && <p>Chargement des données d'abonnement...</p>}
      {isError && <p>Erreur lors du chargement des données : {error?.data?.message}</p>}
      {subscriptionData && (
        <div className="mt-4">
          <h3>Votre abonnement actuel :</h3>
          <p>Type : {subscriptionData.subscription}</p>
          <p>Date de fin : {new Date(subscriptionData.end_date).toLocaleDateString()}</p>
        </div>
      )}
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
