//? ===================================================== V1 Routes =====================================================

// ===================== Importing necessary modules/files =====================
import express from "express";
import userRoutes from "./api-v1/userRoutes.js";
import adminRoutes from "./api-v1/adminRoutes.js";
import ParkingData from "../models/ParkingData.js"; // Assurez-vous d'importer le modèle ParkingData si vous utilisez une base de données pour stocker ces informations.
import User from "../models/userModel.js";

// ===================== Configuring Express Router =====================
const router = express.Router();

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
router.post('/parking-data', async (req, res) => {
    const { parking_name, date, time, plate } = req.body;

    if (!parking_name || !date || !time || !plate) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        // Créer un nouvel enregistrement dans la base de données (si vous utilisez une base de données pour les données du parking)
        const parkingData = new ParkingData({
            parking_name,
            date,
            time,
            plate
        });

        await parkingData.save(); // Sauvegarder l'enregistrement dans la base de données

        console.log('Données du parking enregistrées:', parkingData);

        // Réponse avec les données enregistrées
        return res.status(200).json({
            success: true,
            message: 'Données du parking envoyées et enregistrées.',
            parkingData
        });
    } catch (err) {
        console.error('Erreur lors de l\'enregistrement des données du parking:', err);
        return res.status(500).json({ message: 'Erreur interne lors de l\'enregistrement des données', error: err.message });
    }
});

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

router.post('/update-parking', async (req, res) => {
    const { parking_id, plate } = req.body;

    if (!plate) {
        return res.status(400).json({ message: 'La plaque est requise.' });
    }

    try {
        // Normaliser la plaque détectée
        let normalizedPlate = plate.toUpperCase(); 
        if (normalizedPlate.startsWith("1-")) {
            normalizedPlate = normalizedPlate.slice(2);
        }

        console.log('Plaque normalisée:', normalizedPlate);

        // Chercher l'utilisateur correspondant à la plaque
        let user = await User.findOne({
            $or: [
                { plate: { $regex: new RegExp(`^${normalizedPlate}$`, 'i') } },
                { plate: { $regex: new RegExp(`^1-${normalizedPlate}$`, 'i') } }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        console.log('Utilisateur trouvé:', user);

        // Vérifier l'état actuel du parking de l'utilisateur
        if (user.parking_id === "675efefe982debb80d30bf76") {
            // L'utilisateur quitte le parking
            console.log("Utilisateur quitte le parking, réinitialisation des données.");
            user.parking_id = "0";  // Réinitialiser l'ID du parking
            user.arrival_time = null;  // Réinitialiser l'heure d'arrivée
            user.exit_time = new Date();  // Enregistrer l'heure de sortie
        } else {
            // Vérifier si l'utilisateur a récemment quitté le parking
            if (user.exit_time && new Date() - new Date(user.exit_time) < 60000) { // 1 minute (ajuster selon les besoins)
                return res.status(400).json({ message: 'L\'utilisateur vient de sortir, veuillez attendre avant de revenir.' });
            }

            // L'utilisateur entre dans le parking
            console.log("Utilisateur entre dans le parking.");
            user.parking_id = parking_id;  // Mettre à jour l'ID du parking
            user.arrival_time = new Date();  // Mettre à jour l'heure d'arrivée
            user.exit_time = null;  // Réinitialiser l'heure de sortie
        }

        // Sauvegarder les modifications dans la base de données
        const updatedUser = await user.save();
        console.log('Utilisateur mis à jour:', updatedUser);

        // Répondre avec les informations mises à jour
        return res.status(200).json({
            success: true,
            message: user.parking_id === "0" ? 'Utilisateur sort du parking.' : 'Utilisateur entre dans le parking.',
            user: updatedUser
        });

    } catch (err) {
        console.error('Erreur:', err);
        return res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
});




//* ==================== V1 Routes ====================

router.use("/user", userRoutes);

router.use("/admin", adminRoutes);

export default router;
