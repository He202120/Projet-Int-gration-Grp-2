import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  useUpdateSubscriptionMutation,
  useGetSubscriptionMutation,
  useGetAllSubscriptionMutation,
} from "../../../slices/userApiSlice";
import { toast } from "react-toastify";

// Fonction pour calculer la date de fin d'abonnement
const calculateEndDate = (time) => {
  const today = new Date();
  const match = time.match(/(\d+)(Day|Month|Year)/); // Extrait le chiffre et l'unité (ex: "5Month" => ["5Month", "5", "Month"])
  
  if (match) {
    const value = parseInt(match[1], 10); // La valeur numérique
    const unit = match[2]; // L'unité (Day, Month, Year)

    if (unit === "Day") {
      today.setDate(today.getDate() + value);
    } else if (unit === "Month") {
      today.setMonth(today.getMonth() + value);
    } else if (unit === "Year") {
      today.setFullYear(today.getFullYear() + value);
    }
  }
  return today;
};

function ChoixAbo() {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [allSubscriptions, setAllSubscriptions] = useState([]); // Stocker toutes les subscriptions

  // Utilisation de useSelector pour accéder à state.auth
  const authState = useSelector((state) => state.auth);

  // Import des mutations
  const [updateSubscription] = useUpdateSubscriptionMutation();
  const [getSubscription] = useGetSubscriptionMutation();
  const [getAllSubscriptions] = useGetAllSubscriptionMutation();

  // Récupération des données authState
  useEffect(() => {
    if (authState?.userInfo?.name && authState?.userInfo?.email) {
      setUserInfo({
        name: authState.userInfo.name,
        email: authState.userInfo.email,
      });
    }
  }, [authState]);

  // Récupération des données d'abonnement pour l'utilisateur
  useEffect(() => {
    const fetchSubscription = async () => {
      if (userInfo.email) {
        try {
          const result = await getSubscription({ email: userInfo.email }).unwrap();
          setSubscriptionData(result);
          console.log(subscriptionData)
        } catch (err) {
          toast.error("Erreur lors de la récupération des données d'abonnement.");
        }
      }
    };

    fetchSubscription();
  }, [userInfo, getSubscription]);

  // Récupération de toutes les subscriptions
  useEffect(() => {
    const fetchAllSubscriptions = async () => {
      try {
        const result = await getAllSubscriptions().unwrap();
        setAllSubscriptions(result.sub); // Stocker les données
      } catch (err) {
        toast.error("Erreur lors de la récupération des subscriptions.");
      }
    };

    fetchAllSubscriptions();
  }, [getAllSubscriptions]);

  // Fonction pour gérer la sélection d'un abonnement
  const handleSelectPlan = async (planId, time) => {
    setSelectedPlan(planId);

    const newSubscription = {
      name: userInfo.name || "Nom non disponible",
      mail: userInfo.email || "Email non disponible",
      type_subscription: planId, // Utilisation de l'ID de l'abonnement
      subscription_end_date: calculateEndDate(time)
    };
console.log(newSubscription);
    try {
      await updateSubscription(newSubscription).unwrap();
      toast.success("Nouvel abonnement mis à jour");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour de l'abonnement.");
    }
  };

  return (
    <Container className="text-center mt-5">
      <h1>Choisissez votre abonnement</h1>

      {subscriptionData && (
  <div className="mt-4">
    <h3>Votre abonnement actuel :</h3>
    <p>Type : {subscriptionData.type_subscription || "aucun"}</p>
    <p>
      Date de fin :{" "}
      {subscriptionData.subscription_end_date
        ? new Date(subscriptionData.subscription_end_date).toLocaleDateString()
        : "aucun"}
    </p>
  </div>
)}

      {allSubscriptions.length > 0 && (
        <Row className="mt-4">
          {allSubscriptions.map((sub) => (
            <Col key={sub._id} md={4}>
              <SubscriptionCard
                title={sub.name}
                price={`${sub.price}€`}
                description={`Durée : ${sub.time}`}
                onSelect={() => handleSelectPlan(sub._id, sub.time)}
                isSelected={selectedPlan === sub._id}
              />
            </Col>
          ))}
        </Row>
      )}

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
