import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, role, address } = req.body;

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'এই ফোন নম্বরটি ইতিমধ্যে নিবন্ধিত' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ name, phone, password: hashedPassword, role: role || 'CUSTOMER', address }])
      .select()
      .single();

    if (error) throw error;

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ user: { id: newUser.id, name: newUser.name, phone: newUser.phone, role: newUser.role }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error || !user) return res.status(404).json({ message: 'ব্যবহারকারী পাওয়া যায়নি' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'পাসওয়ার্ড সঠিক নয়' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ user: { id: user.id, name: user.name, phone: user.phone, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;