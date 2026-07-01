import prisma from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const avatarsDir = path.join(__dirname, '../../public/uploads/avatars');

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        avatarUrl: true,
        workerProfile: true,
        employerProfile: true,
      },
    });

    res.json({ user });
  } catch (error) {
    console.error('GetProfile error:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatarUrl } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone, avatarUrl },
      select: { id: true, email: true, name: true, role: true, phone: true, avatarUrl: true },
    });

    res.json({ user });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

export const updateWorkerProfile = async (req, res) => {
  try {
    const { bio, experience, hourlyRate, location, availability, skills } = req.body;

    const profile = await prisma.workerProfile.update({
      where: { userId: req.user.id },
      data: { bio, experience, hourlyRate, location, availability, skills },
    });

    res.json({ profile });
  } catch (error) {
    console.error('UpdateWorkerProfile error:', error);
    res.status(500).json({ error: 'Error al actualizar perfil de trabajadora' });
  }
};

export const updateEmployerProfile = async (req, res) => {
  try {
    const { bio, familyName, address } = req.body;

    const profile = await prisma.employerProfile.update({
      where: { userId: req.user.id },
      data: { bio, familyName, address },
    });

    res.json({ profile });
  } catch (error) {
    console.error('UpdateEmployerProfile error:', error);
    res.status(500).json({ error: 'Error al actualizar perfil de empleador' });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const existing = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { avatarUrl: true },
    });

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl },
      select: { id: true, avatarUrl: true },
    });

    if (existing && existing.avatarUrl) {
      const oldFileName = path.basename(existing.avatarUrl);
      const oldFilePath = path.join(avatarsDir, oldFileName);
      if (fs.existsSync(oldFilePath)) {
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error('Error al eliminar avatar anterior:', err);
        });
      }
    }

    res.json({ avatarUrl: updated.avatarUrl });
  } catch (error) {
    console.error('UploadAvatar error:', error);
    res.status(500).json({ error: 'Error al subir foto de perfil' });
  }
};
