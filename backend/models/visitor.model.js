import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  visitorId: { type: String, unique: true, required: true },
  firstSeen: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
  visits: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.model('Visitor', VisitorSchema);