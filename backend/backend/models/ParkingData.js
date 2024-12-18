import mongoose from 'mongoose';

const parkingDataSchema = new mongoose.Schema({
    parking_name: { 
        type: String, 
        required: true 
    },

    date: { 
        type: String, 
        required: true 
    },

    time: { 
        type: String, 
        required: true 
    },

    plate: { 
        type: String, 
        required: true 
    }
});

const ParkingData = mongoose.model('ParkingData', parkingDataSchema);

export default ParkingData;
