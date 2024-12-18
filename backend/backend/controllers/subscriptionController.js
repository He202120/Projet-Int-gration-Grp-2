import asyncHandler from "express-async-handler";
import { BadRequestError,  NotAuthorizedError, NotFoundError,} from "base-error-handler";
import Subscription from "../models/subscriptionModel.js";

const putSubscriptionData = asyncHandler(async (req, res) => {
    const { name, time, price } = req.body;

    // Validation des données
    if (!name || !time || !price) {
        throw new BadRequestError("Need name, time, and price to have a valid request!");
    }

    // Vérification si la souscription existe déjà
    const subExists = await Subscription.findOne({ name });
    if (subExists) {
        throw new BadRequestError("Subscription already exists.");
    }

    // Création de la souscription si elle n'existe pas
    const subscription = await Subscription.create({
        name: name,
        time: time,
        price: price,
    });

    // Réponse après création
    res.status(201).json({
        message: "Subscription created successfully!",
        subscription,
    });
});

const getAllSubscription= asyncHandler(async (req, res) => {

  const sub = await Subscription.find({},{
    name: 1,
    time: 1,
    price: 1,
  });

  if (sub) {
    res.status(200).json({ sub });
  } else {
    throw new NotFoundError("nothing find");
  }
});

const deleteSubscription = asyncHandler(async (req, res) => {
  const subId = req.body.id;
  if (!subId) {
    throw new BadRequestError(
      "subId not received in request - delete sub failed."
    );
  }

  const deletedsub = await Subscription.findByIdAndDelete(subId);

  if (deletedsub) {
    res.status(200).json({ message: "subscription deleted successfully." });
  } else {
    throw new BadRequestError("subscription not found or already deleted.");
  }
});

const update_Subscription = asyncHandler(async (req, res) => {
  /*
     # Desc: Update subscription price
     # Route: PUT /api/v1/admin/updat-sub
     # Access: PRIVATE
  */
  console.log("Corps de la requête :", req.body);
  const { id, price } = req.body; // Récupérer l'ID et le prix depuis req.body

  console.log("ID de l'abonnement :", id);

  // Vérifier si l'ID est présent
  if (!id) {
    throw new BadRequestError("ID not provided in the request.");
  }

  // Rechercher la souscription par ID
  const sub = await Subscription.findById(id);

  if (sub) {
    // Mettre à jour le prix si fourni dans la requête
    sub.price = price || sub.price;

    // Sauvegarder les modifications
    const updatedSub = await sub.save();

    // Répondre avec les données mises à jour
    res.status(200).json({
      message: "Subscription price updated successfully!",
      price: updatedSub.price,
    });
  } else {
    throw new BadRequestError("Subscription not found.");
  }
});


export { putSubscriptionData, getAllSubscription, deleteSubscription, update_Subscription };
