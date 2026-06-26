import prisma from '../config/database.js';

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (parseInt(receiverId) === req.user.id) {
      return res.status(400).json({ error: 'No puedes enviarte mensajes a ti mismo' });
    }

    const receiver = await prisma.user.findUnique({ where: { id: parseInt(receiverId) } });
    if (!receiver) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId: parseInt(receiverId),
        content,
      },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
        receiver: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error('SendMessage error:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const otherId = parseInt(userId);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: otherId },
          { senderId: otherId, receiverId: req.user.id },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    await prisma.message.updateMany({
      where: { senderId: otherId, receiverId: req.user.id, read: false },
      data: { read: true },
    });

    res.json({ messages });
  } catch (error) {
    console.error('GetConversation error:', error);
    res.status(500).json({ error: 'Error al obtener conversación' });
  }
};

export const getContacts = async (req, res) => {
  try {
    const sent = await prisma.message.findMany({
      where: { senderId: req.user.id },
      select: { receiverId: true },
      distinct: ['receiverId'],
    });

    const received = await prisma.message.findMany({
      where: { receiverId: req.user.id },
      select: { senderId: true },
      distinct: ['senderId'],
    });

    const contactIds = [
      ...new Set([
        ...sent.map((m) => m.receiverId),
        ...received.map((m) => m.senderId),
      ]),
    ];

    const contacts = await prisma.user.findMany({
      where: { id: { in: contactIds } },
      select: { id: true, name: true, avatarUrl: true, role: true },
    });

    const contactsWithLastMessage = await Promise.all(
      contacts.map(async (contact) => {
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: req.user.id, receiverId: contact.id },
              { senderId: contact.id, receiverId: req.user.id },
            ],
          },
          orderBy: { createdAt: 'desc' },
          select: { content: true, createdAt: true, senderId: true },
        });

        const unreadCount = await prisma.message.count({
          where: { senderId: contact.id, receiverId: req.user.id, read: false },
        });

        return { ...contact, lastMessage, unreadCount };
      })
    );

    contactsWithLastMessage.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
    });

    res.json({ contacts: contactsWithLastMessage });
  } catch (error) {
    console.error('GetContacts error:', error);
    res.status(500).json({ error: 'Error al obtener contactos' });
  }
};
