import axios from 'axios';
import jwt from 'jsonwebtoken';
import { oauth2Client } from '../utils/googleClient.js';
import User from '../models/user.model.js';
import Visitor from '../models/visitor.model.js';
import crypto from 'crypto'; 

export const googleAuth = async (req, res, next) => {
    const code = req.query.code;
    try {
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        const { email, name, picture } = userRes.data;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                image: picture,
            });
        }
        const { _id } = user;
        const token = jwt.sign({ _id, email },
            process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_TIMEOUT,
        });
        res.status(200).json({
            message: 'success',
            token,
            user,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
};

export async function guestLogin(req, res) {
  try {
    let { visitorId } = req.body || {};
    if (!visitorId) {
      visitorId = crypto.randomUUID ? crypto.randomUUID() : ('v_' + Math.random().toString(36).slice(2));
    }

    const existing = await Visitor.findOne({ visitorId });
    if (existing) {
      existing.lastSeen = Date.now();
      existing.visits = (existing.visits || 0) + 1;
      await existing.save();
      return res.json({ visitorId, returning: true, ok: true });
    } else {
      await Visitor.create({ visitorId });
      return res.json({ visitorId, returning: false, ok: true });
    }
  } catch (err) {
    console.error('guestLogin error', err);
    res.status(500).json({ error: err.message });
  }
}

export async function getVisitorCount(req, res) {
  try {
    const count = await Visitor.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
