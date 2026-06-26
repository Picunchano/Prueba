import prisma from '../config/database.js';

export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { message } = req.body;

    const job = await prisma.job.findUnique({ where: { id: parseInt(jobId) } });
    if (!job) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }
    if (job.status !== 'OPEN') {
      return res.status(400).json({ error: 'Este trabajo no está disponible' });
    }
    if (job.employerId === req.user.id) {
      return res.status(400).json({ error: 'No puedes postularte a tu propio trabajo' });
    }

    const existing = await prisma.application.findUnique({
      where: { workerId_jobId: { workerId: req.user.id, jobId: parseInt(jobId) } },
    });
    if (existing) {
      return res.status(400).json({ error: 'Ya te has postulado a este trabajo' });
    }

    const application = await prisma.application.create({
      data: {
        workerId: req.user.id,
        jobId: parseInt(jobId),
        message,
      },
      include: {
        worker: { select: { id: true, name: true, avatarUrl: true } },
        job: { select: { id: true, title: true } },
      },
    });

    res.status(201).json({ application });
  } catch (error) {
    console.error('ApplyToJob error:', error);
    res.status(500).json({ error: 'Error al postularse' });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { workerId: req.user.id },
      include: {
        job: {
          include: {
            employer: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ applications });
  } catch (error) {
    console.error('GetMyApplications error:', error);
    res.status(500).json({ error: 'Error al obtener postulaciones' });
  }
};

export const acceptApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const appId = parseInt(id);

    const application = await prisma.application.findUnique({
      where: { id: appId },
      include: { job: true },
    });

    if (!application) {
      return res.status(404).json({ error: 'Postulación no encontrada' });
    }
    if (application.job.employerId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    const updated = await prisma.application.update({
      where: { id: appId },
      data: { status: 'ACCEPTED' },
    });

    await prisma.job.update({
      where: { id: application.jobId },
      data: { status: 'CLOSED' },
    });

    res.json({ application: updated });
  } catch (error) {
    console.error('AcceptApplication error:', error);
    res.status(500).json({ error: 'Error al aceptar postulación' });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const appId = parseInt(id);

    const application = await prisma.application.findUnique({
      where: { id: appId },
      include: { job: true },
    });

    if (!application) {
      return res.status(404).json({ error: 'Postulación no encontrada' });
    }
    if (application.job.employerId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    const updated = await prisma.application.update({
      where: { id: appId },
      data: { status: 'REJECTED' },
    });

    res.json({ application: updated });
  } catch (error) {
    console.error('RejectApplication error:', error);
    res.status(500).json({ error: 'Error al rechazar postulación' });
  }
};

export const getApplicationsForMyJobs = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: {
        job: { employerId: req.user.id },
      },
      include: {
        worker: { select: { id: true, name: true, avatarUrl: true, workerProfile: true } },
        job: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ applications });
  } catch (error) {
    console.error('GetApplicationsForMyJobs error:', error);
    res.status(500).json({ error: 'Error al obtener postulaciones' });
  }
};
