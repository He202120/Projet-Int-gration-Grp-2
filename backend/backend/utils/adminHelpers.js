import User from "../models/userModel.js";
import Avis from "../models/avisModel.js";

const fetchAllUsers = async () => {
  try {
    const users = await User.find(
      {},
      {
        name: 1,
        firstname: 1,
        email: 1,
        blocked: 1,
        plate: 1,
        parking_id: 1,
        type_subscription: 1,
        subscription_end_date: 1,
        arrival_time: 1,
      }
    );
    console.log(users);
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const blockUserHelper = async (userId) => {
  try {
    // Attempt to find the user by their _id
    const user = await User.findById(userId);

    if (!user) {
      return { success: false, message: "User not found." };
    }

    user.blocked = true;
    await user.save();

    return { success: true, message: "User blocked successfully." };
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }
};

const unBlockUserHelper = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return { success: false, message: "User not found." };
    }

    user.blocked = false;
    await user.save();

    return { success: true, message: "User un-blocked successfully." };
  } catch (error) {
    console.error("Error un-blocking user:", error);
    throw error;
  }
};

const updateUser = async (userData) => {
  try {
    const user = await User.findById(userData.userId);

    if (!user) {
      return { success: false, message: "User not found." };
    }

    user.name = userData.name;
    user.email = userData.email;

    await user.save();

    return { success: true, message: "User updated successfully." };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const getUsers = async () => {
  try {
    const users = await User.find(
      {},
      {
        name: 1,
        email: 1,
        blocked: 1,
        plate: 1,
        telephone: 1,
        parking_id: 1,
        type_subscription: 1,
        subscription_end_date: 1,
        arrival_time: 1,
      }
    ).populate({
      path: "type_subscription", // Champ à peupler
      select: "name -_id", // Récupère uniquement le champ "name" sans l'_id
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const getUsersByParkingId = async (parkingId) => {
    try {
        const users = await User.find(
            { parking_id: parkingId }, // Condition pour filtrer par parking_id
            {
                name: 1,
                firstname: 1,
                email: 1,
                blocked: 1,
                plate: 1,
                telephone: 1,
                parking_id: 1,
                type_subscription: 1,
                subscription_end_date: 1,
                arrival_time: 1,
                requires_accessible_parking: 1,
            }
        );

        return users;
    } catch (error) {
        console.error("Error fetching users by parking ID:", error);

        throw error;
    }
};



const getReview = async (req, res) => {
  try {
    // Requête pour récupérer les avis
    const dispAvis = await Avis.find(

      {},
      
      {
        userId: 1,
        rating: 1,
        comment: 1,
        createdAt: 1,
      }
    
    );
    // Vérification si aucun avis n'est trouvé
    if (dispAvis.length === 0) {
      return res.status(404).json({ message: "No reviews found." });
    }
    // Retourne les avis trouvés
    return dispAvis; // Ajout de la réponse avec les avis
  } catch (error) {
    // Gestion des erreurs
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Error retrieving reviews." });
  }
};

export { fetchAllUsers, blockUserHelper, unBlockUserHelper, updateUser, getUsers, getReview, getUsersByParkingId };
