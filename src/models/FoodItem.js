import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['সব খাবার', 'ফাস্ট ফুড', 'রেস্টুরেন্ট', 'কেক'], 
    default: 'সব খাবার' 
  },
  price: { type: Number, required: true },
  image: { type: String, default: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
  isPreorder: { type: Boolean, default: false },
  variants: [{
    size: String,
    price: Number
  }],
  flavors: [String],
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('FoodItem', foodItemSchema);