import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, ListGroup } from "react-bootstrap";
import FormContainer from "../../FormContainer";
import { useSelector } from "react-redux";
import { useAddAvisMutation, useGetAvisMutation } from "../../../slices/userApiSlice";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";
import StarRating from "../../../components/StarRating"; // Importation du composant StarRating

const Advis = () => {
  const [userId, setUserId] = useState(""); 
  const [rating, setRating] = useState(0); 
  const [comment, setComment] = useState(""); 
  const [avisList, setAvisList] = useState([]);
  const [isLoadingAvis, setIsLoadingAvis] = useState(false); // Gérer le chargement des avis

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [addAvis, { isLoading: isAdding }] = useAddAvisMutation();
  const [getAvis, { isLoading: isFetching }] = useGetAvisMutation();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      setUserId(userInfo.name); 
      fetchAvis(); 
    }
  }, [navigate, userInfo]);

  const fetchAvis = async () => {
    setIsLoadingAvis(true); // Lancer le chargement des avis
    try {
      const responseFromApiCall = await getAvis(); 
      const responses = responseFromApiCall.data.avisData;
      setAvisList(responses);
    } catch (err) {
       console.error(err);
      toast.error("Impossible de charger les avis.");
    } finally {
      setIsLoadingAvis(false); // Terminer le chargement des avis
    }
  };

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
      const newAvis = { userId, rating, comment };
      await addAvis(newAvis).unwrap(); 
      toast.success("Votre avis a été soumis avec succès.");
      setRating(0);
      setComment(""); 
      fetchAvis(); 
    } catch (err) {
      const errorMessage =
        err?.data?.errors?.[0]?.message ||
        err?.data?.message ||
        err?.message ||
        "Une erreur est survenue.";
      toast.error(errorMessage);
    }
  };

  return (
    <FormContainer>
      <h1>Ajouter un avis</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="rating">
          <Form.Label>Note</Form.Label>
          {/* Remplacer la saisie numérique par le composant StarRating */}
          <StarRating rating={rating} setRating={setRating} />
        </Form.Group>

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

        <Button type="submit" variant="primary" className="mt-3" disabled={isAdding}>
          {isAdding ? "Envoi en cours..." : "Soumettre l'avis"}
        </Button>
      </Form>

      {isAdding && <Loader />}

      <h2 className="mt-4">Avis des utilisateurs</h2>
      {isLoadingAvis ? (
        <Loader /> 
      ) : avisList.length === 0 ? (
        <p>Aucun avis pour le moment.</p>
      ) : (
        <ListGroup>
          {avisList.map((avis, index) => (
            <ListGroup.Item key={index}>
              <strong>{avis.userId}</strong>  <small>{new Date(avis.createdAt).toLocaleString()}</small> {" "}
              {/* Affichage de la note sous forme d'étoiles */}
              <StarRating rating={avis.rating} setRating={() => {}} />
              <p><strong>Avis utilisateur:</strong> {avis.comment}</p> {/* Affichage du commentaire correctement */}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <Row className="py-3">
        <Col>
          <Link to="/">Retour à l'accueil</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default Advis;
