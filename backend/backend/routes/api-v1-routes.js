//? ===================================================== V1 Routes =====================================================

// ===================== Importing necessary modules/files =====================
import express from "express";

import userRoutes from "./api-v1/userRoutes.js"
import adminRoutes from "./api-v1/adminRoutes.js"
import User from "../models/userModel.js";

// ===================== Configuring Express Router =====================
const router = express.Router();


router.post('/check-plate', async (req, res) => {
    const { plate } = req.body;

    console.log('Plaque reçue:', plate);

    if (!plate) {
        return res.status(400).json({ message: 'La plaque est requise.' });
    }

    try {
        // Chercher l'utilisateur par la plaque
        const user = await User.findOne({ plate });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        console.log('Utilisateur trouvé:', user);

        // Mettre à jour les champs parking et arrival
        user.parking = 1; // 1 signifie que la voiture est dans le parking
        user.arrival = new Date(); // Mettre à jour avec la date et heure actuelle
        user.num_parking = 1; // numéro du parking

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


//* ==================== V1 Routes ====================

router.use("/user", userRoutes);

router.use("/admin", adminRoutes);

export default router;