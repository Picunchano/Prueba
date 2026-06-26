import prisma from '../config/database.js';

export const getMyContracts = async (req, res) => {
  try {
    const contracts = await prisma.contract.findMany({
      where: {
        OR: [
          { workerId: req.user.id },
          { employerId: req.user.id },
        ],
      },
      include: {
        worker: { select: { id: true, name: true, avatarUrl: true } },
        employer: { select: { id: true, name: true, avatarUrl: true } },
        job: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ contracts });
  } catch (error) {
    console.error('GetMyContracts error:', error);
    res.status(500).json({ error: 'Error al obtener contratos' });
  }
};

export const createContract = async (req, res) => {
  try {
    const { workerId, jobId, agreedRate } = req.body;

    const job = await prisma.job.findUnique({ where: { id: parseInt(jobId) } });
    if (!job) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }
    if (job.employerId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    const contract = await prisma.contract.create({
      data: {
        workerId: parseInt(workerId),
        employerId: req.user.id,
        jobId: parseInt(jobId),
        agreedRate: agreedRate ? parseFloat(agreedRate) : null,
      },
      include: {
        worker: { select: { id: true, name: true } },
        employer: { select: { id: true, name: true } },
        job: { select: { id: true, title: true } },
      },
    });

    res.status(201).json({ contract });
  } catch (error) {
    console.error('CreateContract error:', error);
    res.status(500).json({ error: 'Error al crear contrato' });
  }
};

export const completeContract = async (req, res) => {
  try {
    const { id } = req.params;
    const contractId = parseInt(id);

    const contract = await prisma.contract.findUnique({ where: { id: contractId } });
    if (!contract) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }
    if (contract.workerId !== req.user.id && contract.employerId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }
    if (contract.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'El contrato no está activo' });
    }

    const updated = await prisma.contract.update({
      where: { id: contractId },
      data: { status: 'COMPLETED', endDate: new Date() },
    });

    res.json({ contract: updated });
  } catch (error) {
    console.error('CompleteContract error:', error);
    res.status(500).json({ error: 'Error al completar contrato' });
  }
};

export const cancelContract = async (req, res) => {
  try {
    const { id } = req.params;
    const contractId = parseInt(id);

    const contract = await prisma.contract.findUnique({ where: { id: contractId } });
    if (!contract) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }
    if (contract.workerId !== req.user.id && contract.employerId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }
    if (contract.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'El contrato no está activo' });
    }

    const updated = await prisma.contract.update({
      where: { id: contractId },
      data: { status: 'CANCELLED', endDate: new Date() },
    });

    res.json({ contract: updated });
  } catch (error) {
    console.error('CancelContract error:', error);
    res.status(500).json({ error: 'Error al cancelar contrato' });
  }
};
