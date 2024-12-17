import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import { useAddSubMutation } from "../../slices/adminApiSlice";

const SubscriptionScreen = () => {
  // États locaux pour les champs du formulaire
  const [name, setName] = useState("");
  const [timeValue, setTimeValue] = useState(0); // Valeur numérique pour la durée
  const [timeUnit, setTimeUnit] = useState("Day"); // Unité de temps sélectionnée
  const [time, setTime] = useState(""); // Valeur combinée (ex: "7Day")
  const [price, setPrice] = useState(0);
  const [addsub, { isLoading }] = useAddSubMutation();

  // Effet pour mettre à jour "time" lorsque timeValue ou timeUnit change
  useEffect(() => {
    setTime(`${timeValue}${timeUnit}`);
  }, [timeValue, timeUnit]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const subs = {
      name: name,
      time: time,
      price: price,
    };

    // Validation des données
    if (!name || timeValue <= 0 || price <= 0) {
      toast.error("Veuillez remplir tous les champs correctement.");
      return;
    }

    // Simuler une action avec les données (comme un envoi à un serveur)
    try {
      console.log(subs);
      const responseFromApiCall = await addsub({ name, time, price }).unwrap();
    } catch (err) {
      toast.error(err?.data?.errors[0]?.message || err?.error);
    }

    // Réinitialiser le formulaire
    setName("");
    setTimeValue(0);
    setTimeUnit("Day");
    setPrice(0);
    setTime("");
  };

  return (
    <FormContainer>
      <h1>Créer un Abonnement</h1>
      <Form onSubmit={handleSubmit}>
        {/* Champ pour le nom de l'abonnement */}
        <Form.Group controlId="subscriptionName">
          <Form.Label>Nom de l'abonnement</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez le nom de l'abonnement"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        {/* Champ pour le temps */}
        <Form.Group controlId="time">
          <Form.Label>Durée</Form.Label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Form.Control
              type="number"
              placeholder="Entrez la durée"
              value={timeValue}
              onChange={(e) => setTimeValue(Number(e.target.value))}
            />
            <Form.Select
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value)}
            >
              <option value="Day">Day</option>
              <option value="Month">Month</option>
              <option value="Year">Year</option>
            </Form.Select>
          </div>
        </Form.Group>

        {/* Champ pour le prix */}
        <Form.Group controlId="price">
          <Form.Label>Prix (en EUR)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Entrez le prix en euros"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </Form.Group>

        {/* Bouton de soumission */}
        <Button type="submit" variant="primary" className="mt-3">
          Soumettre
        </Button>
      </Form>
    </FormContainer>
  );
};

export default SubscriptionScreen;
