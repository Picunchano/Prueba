import prisma from '../config/database.js';

export const createReview = async (req, res) => {
  try {
    const { contractId, rating, comment } = req.body;

    const contract = await prisma.contract.findUnique({ where: { id: parseInt(contractId) } });
    if (!contract) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }
    if (contract.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Solo puedes reseñar contratos completados' });
    }
    if (contract.workerId !== req.user.id && contract.employerId !== req.user.id) {
      return res.status(403).json({ error: 'No estás involucrado en este contrato' });
    }

    const targetId = contract.workerId === req.user.id
      ? contract.employerId
      : contract.workerId;

    const existing = await prisma.review.findUnique({
      where: { authorId_contractId: { authorId: req.user.id, contractId: parseInt(contractId) } },
    });
    if (existing) {
      return res.status(400).json({ error: 'Ya has reseñado este contrato' });
    }

    const review = await prisma.review.create({
      data: {
        authorId: req.user.id,
        targetId,
        contractId: parseInt(contractId),
        rating,
        comment,
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        target: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({ review });
  } catch (error) {
    console.error('CreateReview error:', error);
    res.status(500).json({ error: 'Error al crear reseña' });
  }
};

export const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { targetId: parseInt(userId) },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        contract: {
          include: { job: { select: { title: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const stats = await prisma.review.aggregate({
      where: { targetId: parseInt(userId) },
      _avg: { rating: true },
      _count: { rating: true },
    });

    res.json({
      reviews,
      stats: {
        averageRating: stats._avg.rating,
        totalReviews: stats._count.rating,
      },
    });
  } catch (error) {
    console.error('GetReviewsByUser error:', error);
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
};
