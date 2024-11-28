// ===================== Importation des modules/ fichiers nécessaires =====================
import asyncHandler from "express-async-handler";
import { fetchAllAvis } from "../utils/avisHelpers.js";

const getAllAvis = asyncHandler(async (req, res) => {
 

  const avisData = await fetchAllAvis();

  if (avisData ) {
    res.status(200).json({ avisData });
  } else {
    res.status(404).json({ message: "No reviews found." });
  }
});

export { getAllAvis };
