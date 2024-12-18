import Parking from "../models/parkingModel.js";
import User from "../models/userModel.js";

// Fonction pour récupérer tous les parkings
const fetchAllParkings = async (req, res) => {
  try {
    const parkings = await Parking.find(); // Fetch all parkings from the database
    const users = await User.find({}, { name: 1, parking_id: 1 }); // Fetch all users inside a parking
    if (parkings.length === 0) {
      return res.status(404).json({ message: "No parking records found." });
    }
    return { parkingsReturn: parkings, usersReturn: users }; // Respond with the parking data
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
        _id: 1,
        name: 1,
        email: 1,
        contact: 1,
        longitude: 1,
        latitude: 1,
        max_places: 1,
        reduced_mobility_spots: 1,
      }
    );

    return parkings;
  } catch (error) {
    console.error("Error fetching data parkings:", error);

    throw error;
  }
};

export { fetchAllParkings, getParkings };
