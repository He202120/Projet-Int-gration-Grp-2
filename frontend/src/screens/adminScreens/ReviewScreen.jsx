import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, Form, ProgressBar } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetReviewsDataMutation } from "../../slices/adminApiSlice";
import Loader from "../../components/Loader";
import StarRating from "../../components/StarRating";
import { Link } from "react-router-dom";

const ReviewScreen = () => {
  const [avisList, setAvisList] = useState([]);
  const [filteredAvisList, setFilteredAvisList] = useState([]);
  const [isLoadingAvis, setIsLoadingAvis] = useState(false);
  const [searchRating, setSearchRating] = useState("");
  const [ratingsCount, setRatingsCount] = useState({});
  const [totalReviews, setTotalReviews] = useState(0);

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [getReviewsData] = useGetReviewsDataMutation();

  useEffect(() => {
    fetchAvis();
  }, [navigate, userInfo]);

  useEffect(() => {
    
    if (searchRating === "") {
      setFilteredAvisList(avisList);
    } else {
      setFilteredAvisList(
        avisList.filter((avis) => avis.rating === parseInt(searchRating))
      );
    }
  }, [searchRating, avisList]);

  const fetchAvis = async () => {
    setIsLoadingAvis(true);
    try {
      const responseFromApiCall = await getReviewsData();
      const responses = responseFromApiCall.data?.usersData || [];

      setAvisList(responses);
      setFilteredAvisList(responses);

      const counts = responses.reduce((acc, avis) => {
        acc[avis.rating] = (acc[avis.rating] || 0) + 1;
        return acc;
      }, {});
      setRatingsCount(counts);
      setTotalReviews(responses.length);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAvis(false);
    }
  };

  const calculatePercentage = (count) => {
    return totalReviews ? ((count / totalReviews) * 100).toFixed(0) : 0;
  };

  return (
    <div className="container">
      <h2 className="mt-4">Avis des utilisateurs</h2>

      {/* Barre de recherche */}
      <Form.Group controlId="searchRating" className="mb-3">
        <Form.Label>Rechercher par note</Form.Label>
        <Form.Control
          as="select"
          value={searchRating}
          onChange={(e) => setSearchRating(e.target.value)}
        >
          <option value="">Toutes les notes</option>
          <option value="1">1 étoile</option>
          <option value="2">2 étoiles</option>
          <option value="3">3 étoiles</option>
          <option value="4">4 étoiles</option>
          <option value="5">5 étoiles</option>
        </Form.Control>
      </Form.Group>

      {/* Résumé des avis */}
      <div className="mb-4">
        <h5 style={{ fontSize: "1rem", marginBottom: "10px" }}>
          Note moyenne :{" "}
          {(
            Object.entries(ratingsCount).reduce(
              (sum, [rating, count]) => sum + rating * count,
              0
            ) / (totalReviews || 1)
          ).toFixed(1)}{" "}
          sur 5
        </h5>
        <p style={{ fontSize: "0.9rem" }}>{totalReviews} évaluations globales</p>

        {/* Barres de progression */}
        {[5, 4, 3, 2, 1].map((rating) => (
          <div
            key={rating}
            className="d-flex align-items-center mb-2"
            style={{ fontSize: "0.85rem" }}
          >
            <span
              style={{ width: "60px", textAlign: "right", marginRight: "10px" }}
            >
              {rating} étoiles
            </span>
            <div style={{ flex: 1 }}>
              <ProgressBar
                now={calculatePercentage(ratingsCount[rating])}
                variant="warning"
                style={{
                  height: "8px",
                  marginBottom: "0",
                }}
              />
            </div>
            <span
              style={{ marginLeft: "10px", width: "40px", textAlign: "left" }}
            >
              {calculatePercentage(ratingsCount[rating])}%
            </span>
          </div>
        ))}
      </div>

      {/* Affichage des avis */}
      {isLoadingAvis ? (
        <Loader />
      ) : filteredAvisList.length === 0 ? (
        <p>Aucun avis correspondant à cette note.</p>
      ) : (
        <ListGroup>
          {filteredAvisList.map((avis, index) => (
            <ListGroup.Item key={index}>
              <strong>{avis.userId}</strong>{" "}
              <small>{new Date(avis.createdAt).toLocaleString()}</small>{" "}
              <StarRating rating={avis.rating} setRating={() => {}} />
              <p>
                <strong>Avis utilisateur:</strong> {avis.comment}
              </p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Lien pour retourner à l'accueil */}
      <Row className="py-3">
        <Col>
          <Link to="/admin/login">Retour à l'accueil</Link>
        </Col>
      </Row>
    </div>
  );
};

export default ReviewScreen;
