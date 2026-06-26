import prisma from '../config/database.js';

export const listWorkers = async (req, res) => {
  try {
    const { location, skill, minRate, maxRate } = req.query;

    const where = {
      role: 'WORKER',
      workerProfile: { isNot: null },
    };

    if (location) {
      where.workerProfile.location = { contains: location, mode: 'insensitive' };
    }

    if (skill) {
      where.workerProfile.skills = { has: skill };
    }

    if (minRate || maxRate) {
      where.workerProfile.hourlyRate = {};
      if (minRate) where.workerProfile.hourlyRate.gte = parseFloat(minRate);
      if (maxRate) where.workerProfile.hourlyRate.lte = parseFloat(maxRate);
    }

    const workers = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        workerProfile: true,
      },
    });

    res.json({ workers });
  } catch (error) {
    console.error('ListWorkers error:', error);
    res.status(500).json({ error: 'Error al listar trabajadoras' });
  }
};

export const getWorkerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const worker = await prisma.user.findUnique({
      where: { id: parseInt(id), role: 'WORKER' },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        workerProfile: true,
        reviewsReceived: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            author: { select: { id: true, name: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!worker) {
      return res.status(404).json({ error: 'Trabajadora no encontrada' });
    }

    res.json({ worker });
  } catch (error) {
    console.error('GetWorkerProfile error:', error);
    res.status(500).json({ error: 'Error al obtener perfil de trabajadora' });
  }
};
