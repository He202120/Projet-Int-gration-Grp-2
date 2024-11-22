import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../../FormContainer";

import { useDispatch, useSelector } from "react-redux";
import { useAddAvisMutation } from "../../../slices/userApiSlice";

import { toast } from "react-toastify";
import Loader from "../../../components/Loader";

const Advis = () => {
  const [userId, setUserId] = useState(""); // ID utilisateur, récupéré dynamiquement
  const [rating, setRating] = useState(0); // Note entre 1 et 5
  const [comment, setComment] = useState(""); // Commentaire de l'utilisateur

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const [addAvis, { isLoading }] = useAddAvisMutation(); // Renommé pour éviter la confusion

  useEffect(() => {
    if (!userInfo) {
      navigate("/login"); // Redirection si l'utilisateur n'est pas connecté
    } else {
      setUserId(userInfo.name); // Remplir l'ID utilisateur
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      toast.error("La note doit être comprise entre 1 et 5.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Le commentaire ne peut pas être vide.");
      return;
    }

    try {
      console.log("Données soumises :", { userId, rating, comment });

      const response = await addAvis({ userId, rating, comment }).unwrap();

      toast.success("Votre avis a été soumis avec succès.");
      navigate("/"); // Rediriger après soumission
    } catch (err) {
      const errorMessage =
        err?.data?.errors?.[0]?.message ||
        err?.data?.message ||
        err?.message || // Gestion par défaut
        "Une erreur est survenue.";

      toast.error(errorMessage);
    }
  };

  return (
    <FormContainer>
      <h1>Ajouter un avis</h1>

      <Form onSubmit={submitHandler}>
        {/* Note de l'avis */}
        <Form.Group className="my-2" controlId="rating">
          <Form.Label>Note (1 à 5)</Form.Label>
          <Form.Control
            type="number"
            min="1"
            max="5"
            placeholder="Entrez une note entre 1 et 5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))} // Conversion en nombre
          ></Form.Control>
        </Form.Group>

        {/* Commentaire */}
        <Form.Group className="my-2" controlId="comment">
          <Form.Label>Commentaire</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Laissez un commentaire..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Soumettre l'avis
        </Button>
      </Form>

      {isLoading && <Loader />}

      <Row className="py-3">
        <Col>
          <Link to="/">Retour à l'accueil</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default Advis;
