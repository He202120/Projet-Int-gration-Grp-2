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
router.post('/check-plate', async (req, res) => {
    const { plate } = req.body;
    console.log('Plaque reçue:', plate);

    if (!plate) {
        return res.status(400).json({ message: 'La plaque est requise.' });
    }

    try {
        // Normaliser la plaque détectée (convertir en majuscules et retirer le "1-" si présent)
        let normalizedPlate = plate.toUpperCase(); // Convertir en majuscules
        if (normalizedPlate.startsWith("1-")) {
            normalizedPlate = normalizedPlate.slice(2); // Enlever le "1-" du début
        }

        console.log('Plaque normalisée:', normalizedPlate);

        // Chercher l'utilisateur par la plaque normalisée (sans tenir compte de la casse ni du "1-")
        let user = await User.findOne({
            $or: [
                { plate: { $regex: new RegExp(`^${normalizedPlate}$`, 'i') } },  // Plaque sans 1- (casse insensible)
                { plate: { $regex: new RegExp(`^1-${normalizedPlate}$`, 'i') } }  // Plaque avec 1- (casse insensible)
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        console.log('Utilisateur trouvé:', user);

        // Mettre à jour les champs parking et arrival
        user.arrival_time = new Date(); // Mettre à jour avec la date et heure actuelle

        const updatedUser = await user.save();

        console.log('Utilisateur mis à jour:', updatedUser);

        // Réponse avec les informations mises à jour
        return res.status(200).json({ 
            success: true, 
            message: 'Utilisateur vérifié et parking mis à jour.', 
            user: updatedUser 
        });
    } catch (err) {
        console.error('Erreur:', err);
        return res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
});


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

    if (!parking_id || !plate) {
        return res.status(400).json({ message: 'Le parking_id et la plaque sont requis.' });
    }

    try {
        // Normaliser la plaque détectée
        let normalizedPlate = plate.toUpperCase();
        if (normalizedPlate.startsWith("1-")) {
            normalizedPlate = normalizedPlate.slice(2); // Enlever le "1-" du début
        }

        console.log('Plaque normalisée:', normalizedPlate);

        // Chercher l'utilisateur correspondant à la plaque
        let user = await User.findOne({
            $or: [
                { plate: { $regex: new RegExp(`^${normalizedPlate}$`, 'i') } },  // Plaque sans 1- (casse insensible)
                { plate: { $regex: new RegExp(`^1-${normalizedPlate}$`, 'i') } }  // Plaque avec 1- (casse insensible)
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        console.log('Utilisateur trouvé:', user);

        // Mettre à jour le champ parking_id
        user.parking_id = parking_id;

        const updatedUser = await user.save();

        console.log('Utilisateur mis à jour:', updatedUser);

        // Répondre avec le statut de succès
        return res.status(200).json({
            success: true,
            message: 'parking_id mis à jour pour l\'utilisateur.',
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
