import express from 'express';
import { supabase } from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = supabase.from('food_items').select('*').eq('is_available', true);

    if (category && category !== 'সব খাবার') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { data, error } = await supabase.from('food_items').insert([req.body]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;