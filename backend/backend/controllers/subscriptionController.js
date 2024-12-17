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
  }
);
  if (sub) {
    res.status(200).json({ sub });
  } else {
    throw new NotFoundError("nothing find");
  }
});

export { putSubscriptionData, getAllSubscription };
