import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['CUSTOMER', 'RESTAURANT', 'RIDER', 'ADMIN'], 
    default: 'CUSTOMER' 
  },
  address: { type: String, default: 'মঠবাড়িয়া, পিরোজপুর' },
  isOnline: { type: Boolean, default: false },
  currentLocation: {
    lat: { type: Number, default: 22.2858 },
    lng: { type: Number, default: 89.9622 }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);