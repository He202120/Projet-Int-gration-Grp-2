import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetReviewsDataMutation } from "../../slices/adminApiSlice";
import Loader from "../../components/Loader";
import StarRating from "../../components/StarRating";
import { Link } from 'react-router-dom';  // Ajoutez cette ligne

const ReviewScreen = () => {
  const [avisList, setAvisList] = useState([]); // Liste des avis
  const [isLoadingAvis, setIsLoadingAvis] = useState(false); // Gérer le chargement des avis

  const navigate = useNavigate(); // Redirection
  const { userInfo } = useSelector((state) => state.auth); // Récupérer l'utilisateur connecté

  const [getReview] = useGetReviewsDataMutation(); // Mutation pour récupérer les avis

  useEffect(() => {
    if (!userInfo) {
      // navigate("/login"); // Redirection si l'utilisateur n'est pas connecté
    } else {
      fetchAvis(); // Récupération des avis si connecté
    }
  }, [navigate, userInfo]);

  const fetchAvis = async () => {
    setIsLoadingAvis(true); // Lancer le chargement des avis
    try {
      const responseFromApiCall = await getReview(); // Appel API
      const responses = responseFromApiCall.data?.avisData || [];
      setAvisList(responses); // Mettre à jour la liste des avis
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAvis(false); // Terminer le chargement des avis
    }
  };

  return (
    <div className="container"> {/* Utilisation d'une div avec une classe 'container' pour le conteneur principal */}
      <h2 className="mt-4">Avis des utilisateurs</h2>

      {/* Affichage du loader pendant le chargement des avis */}
      {isLoadingAvis ? (
        <Loader />
      ) : avisList.length === 0 ? (
        <p>Aucun avis pour le moment.</p> // Message si aucun avis disponible
      ) : (
        <ListGroup>
          {avisList.map((avis, index) => (
            <ListGroup.Item key={index}>
              <strong>{avis.userId}</strong>  <small>{new Date(avis.createdAt).toLocaleString()}</small> {" "}
              {/* Affichage de la note sous forme d'étoiles */}
              <StarRating rating={avis.rating} setRating={() => {}} />
              <p><strong>Avis utilisateur:</strong> {avis.comment}</p> {/* Affichage du commentaire */}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Lien pour retourner à l'accueil */}
      <Row className="py-3">
        <Col>
          <Link to="/">Retour à l'accueil</Link>
        </Col>
      </Row>
    </div>
  );
};

export default ReviewScreen;
