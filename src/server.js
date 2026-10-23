import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT'] }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);

// নতুন অর্ডার তৈরি
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    orderData.order_number = 'ZFD' + Math.floor(100000 + Math.random() * 900000);

    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) throw error;

    // সকেট ইভেন্ট পাঠানো
    io.emit('new_order_alert', newOrder);
    io.emit('admin_order_update', newOrder);

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// অর্ডার স্ট্যাটাস পরিবর্তন
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status, rider_id } = req.body;

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update({ status, ...(rider_id && { rider_id }) })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    io.to(`order_${updatedOrder.id}`).emit('order_status_changed', updatedOrder);
    io.emit('admin_order_update', updatedOrder);

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('join_order_room', (orderId) => {
    socket.join(`order_${orderId}`);
  });

  socket.on('rider_location_push', async ({ orderId, lat, lng }) => {
    io.to(`order_${orderId}`).emit('rider_location_update', { lat, lng });
    io.emit('admin_rider_live_move', { orderId, lat, lng });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 ZaaoFood Server running on port ${PORT}`));