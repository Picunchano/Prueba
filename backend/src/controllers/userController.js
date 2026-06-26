import prisma from '../config/database.js';

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
