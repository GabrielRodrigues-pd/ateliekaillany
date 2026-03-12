import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'O email é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
