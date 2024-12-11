import Parking from "../models/parkingModel.js";

// Fonction pour récupérer tous les parkings
const fetchAllParkings = async (req, res) => {
  try {
    const parkings = await Parking.find(); // Fetch all parkings from the database
    if (parkings.length === 0) {
      return res.status(404).json({ message: "No parking records found." });
    }
    return parkings; // Respond with the parking data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving parking records." });
  }
};

//ajout greg

const getParkings = async () => {
  try {
    const parkings = await Parking.find(
      {},
      {
        name: 1,
        email: 1,
        telephone: 1,
        longitude: 1,
        latitude: 1,
        places: 1,
        max_places: 1,
        completion: 1,
        num_parking: 1,
      }
    );

    return parkings;
  } catch (error) {
    console.error("Error fetching data parkings:", error);

    throw error;
  }
};

export { fetchAllParkings, getParkings };
