import prisma from '../config/database.js';

export const listEmployers = async (req, res) => {
  try {
    const employers = await prisma.user.findMany({
      where: { role: 'EMPLOYER', employerProfile: { isNot: null } },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        employerProfile: true,
      },
    });

    res.json({ employers });
  } catch (error) {
    console.error('ListEmployers error:', error);
    res.status(500).json({ error: 'Error al listar empleadores' });
  }
};

export const getEmployerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const employer = await prisma.user.findUnique({
      where: { id: parseInt(id), role: 'EMPLOYER' },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        employerProfile: true,
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

    if (!employer) {
      return res.status(404).json({ error: 'Empleador no encontrado' });
    }

    res.json({ employer });
  } catch (error) {
    console.error('GetEmployerProfile error:', error);
    res.status(500).json({ error: 'Error al obtener perfil de empleador' });
  }
};
