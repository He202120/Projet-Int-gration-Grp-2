import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,

    },
    
    rating: {
        type: Number, // Note entre 1 et 5
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String, // Commentaire de l'utilisateur
        required: true,
        trim: true,
        maxlength: 500 // Limite la longueur du commentaire
    },
    createdAt: {
        type: Date,
        default: Date.now // Définit la date de création par défaut
    }
});

// Exporter le modèle
const Avis = mongoose.model('Avis', reviewSchema);   

export default Avis;
