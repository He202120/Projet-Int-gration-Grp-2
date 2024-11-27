import Avis from "../models/avisModel.js"; 

const fetchAllAvis = async (req, res) => {
  try {
      const recAvis = await Avis.find(
          {},
          {
            userId: 1,
            rating: 1,
            comment: 1,
            createdAt: 1,
          }
      );

    if (recAvis.length === 0) {
      return res.status(404).json({ message: "No reviews found." });
    }

    return recAvis; 
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Error retrieving reviews." });
  }
};

export { fetchAllAvis };
