// ===================== Importing necessary modules/files =====================
import asyncHandler from "express-async-handler";

import { fetchAllParkings } from "../utils/parkingHelpers.js";

const getAllParkings = asyncHandler(async (req, res) => {
  /*
     # Desc: Fetch all parking data
     # Route: PUT /api/v1/user/parking
     # Access: PRIVATE
  */

  const parkingsData = await fetchAllParkings();

  if (parkingsData) {
    res.status(200).json({ parkingsData });
  } else {
    throw new NotFoundError();
  }
});

export { getAllParkings };
