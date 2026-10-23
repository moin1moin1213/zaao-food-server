import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: String,
  customerPhone: String,
  deliveryAddress: String,
  items: [{
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
    name: String,
    quantity: Number,
    price: Number,
    size: String,
    flavor: String,
    customMessage: String
  }],
  subtotal: Number,
  deliveryCharge: { type: Number, default: 60 },
  totalAmount: Number,
  paymentMethod: { type: String, enum: ['COD', 'BKASH'], default: 'COD' },
  status: {
    type: String,
    enum: ['PENDING', 'PREPARING', 'RIDER_ASSIGNED', 'PICKED_UP', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  },
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  riderLocation: {
    lat: { type: Number, default: 22.2858 },
    lng: { type: Number, default: 89.9622 }
  }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);