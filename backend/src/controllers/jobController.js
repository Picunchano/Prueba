import prisma from '../config/database.js';

export const listJobs = async (req, res) => {
  try {
    const { location, minRate, maxRate, status } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    } else {
      where.status = 'OPEN';
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (minRate || maxRate) {
      where.hourlyRate = {};
      if (minRate) where.hourlyRate.gte = parseFloat(minRate);
      if (maxRate) where.hourlyRate.lte = parseFloat(maxRate);
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        employer: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ jobs });
  } catch (error) {
    console.error('ListJobs error:', error);
    res.status(500).json({ error: 'Error al listar trabajos' });
  }
};

export const getJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: {
        employer: { select: { id: true, name: true, avatarUrl: true, employerProfile: true } },
        applications: {
          select: {
            id: true,
            status: true,
            message: true,
            createdAt: true,
            worker: { select: { id: true, name: true, avatarUrl: true, workerProfile: true } },
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }

    res.json({ job });
  } catch (error) {
    console.error('GetJob error:', error);
    res.status(500).json({ error: 'Error al obtener trabajo' });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, description, location, hourlyRate, schedule } = req.body;

    const job = await prisma.job.create({
      data: {
        employerId: req.user.id,
        title,
        description,
        location,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        schedule,
      },
      include: {
        employer: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({ job });
  } catch (error) {
    console.error('CreateJob error:', error);
    res.status(500).json({ error: 'Error al crear trabajo' });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const jobId = parseInt(id);

    const existing = await prisma.job.findUnique({ where: { id: jobId } });
    if (!existing) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }
    if (existing.employerId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para editar este trabajo' });
    }

    const { title, description, location, hourlyRate, schedule, status } = req.body;

    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(location !== undefined && { location }),
        ...(hourlyRate !== undefined && { hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null }),
        ...(schedule !== undefined && { schedule }),
        ...(status !== undefined && { status }),
      },
    });

    res.json({ job });
  } catch (error) {
    console.error('UpdateJob error:', error);
    res.status(500).json({ error: 'Error al actualizar trabajo' });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const jobId = parseInt(id);

    const existing = await prisma.job.findUnique({ where: { id: jobId } });
    if (!existing) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }
    if (existing.employerId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este trabajo' });
    }

    await prisma.job.delete({ where: { id: jobId } });

    res.json({ message: 'Trabajo eliminado' });
  } catch (error) {
    console.error('DeleteJob error:', error);
    res.status(500).json({ error: 'Error al eliminar trabajo' });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { employerId: req.user.id },
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ jobs });
  } catch (error) {
    console.error('GetMyJobs error:', error);
    res.status(500).json({ error: 'Error al obtener trabajos' });
  }
};
