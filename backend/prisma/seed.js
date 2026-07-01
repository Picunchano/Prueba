import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Test1234', 12);

  const workersData = [
    {
      name: 'María González',
      email: 'maria.gonzalez@gmail.com',
      bio: '5 años de experiencia en limpieza y cuidado de niños',
      hourlyRate: 4500,
      location: 'Providencia',
      skills: ['limpieza', 'cocina', 'cuidado niños'],
    },
    {
      name: 'Carmen López',
      email: 'carmen.lopez@gmail.com',
      bio: 'Especialista en cuidado de adultos mayores con certificación',
      hourlyRate: 5000,
      location: 'Las Condes',
      skills: ['adultos mayores', 'primeros auxilios', 'cocina'],
    },
    {
      name: 'Rosa Martínez',
      email: 'rosa.martinez@gmail.com',
      bio: 'Trabajadora de casa particular con 8 años de experiencia',
      hourlyRate: 4000,
      location: 'Maipú',
      skills: ['limpieza', 'plancha', 'cocina'],
    },
    {
      name: 'Ana Pérez',
      email: 'ana.perez@gmail.com',
      bio: 'Nana con experiencia en cuidado de bebés y niños pequeños',
      hourlyRate: 5500,
      location: 'Ñuñoa',
      skills: ['cuidado niños', 'bebés', 'primeros auxilios'],
    },
    {
      name: 'Lucía Torres',
      email: 'lucia.torres@gmail.com',
      bio: 'Limpieza profunda y organización del hogar',
      hourlyRate: 4200,
      location: 'Santiago Centro',
      skills: ['limpieza', 'organización', 'plancha'],
    },
    {
      name: 'Isabel Díaz',
      email: 'isabel.diaz@gmail.com',
      bio: 'Cuidado de niños y adultos mayores, manejo básico de medicamentos',
      hourlyRate: 4800,
      location: 'La Florida',
      skills: ['cuidado niños', 'adultos mayores', 'cocina'],
    },
  ];

  const employersData = [
    {
      name: 'Familia Rodríguez',
      email: 'familia.rodriguez@gmail.com',
      familyName: 'Familia Rodríguez',
      address: 'Las Condes, Santiago',
    },
    {
      name: 'Familia Soto',
      email: 'familia.soto@gmail.com',
      familyName: 'Familia Soto',
      address: 'Providencia, Santiago',
    },
    {
      name: 'Familia Muñoz',
      email: 'familia.munoz@gmail.com',
      familyName: 'Familia Muñoz',
      address: 'Vitacura, Santiago',
    },
  ];

  let userCount = 0;

  const workers = [];
  for (const w of workersData) {
    const user = await prisma.user.create({
      data: {
        name: w.name,
        email: w.email,
        password: passwordHash,
        role: 'WORKER',
        workerProfile: {
          create: {
            bio: w.bio,
            hourlyRate: w.hourlyRate,
            location: w.location,
            skills: w.skills,
          },
        },
      },
    });
    workers.push(user);
    userCount++;
  }

  const employers = [];
  for (const e of employersData) {
    const user = await prisma.user.create({
      data: {
        name: e.name,
        email: e.email,
        password: passwordHash,
        role: 'EMPLOYER',
        employerProfile: {
          create: {
            familyName: e.familyName,
            address: e.address,
          },
        },
      },
    });
    employers.push(user);
    userCount++;
  }

  const jobsData = [
    {
      title: 'Nana para hogar en Las Condes',
      employerIdx: 0,
      description: 'Buscamos nana puertas afuera lunes a viernes, cuidado de dos niños de 3 y 6 años',
      location: 'Las Condes',
      hourlyRate: 5000,
      schedule: 'Lunes a Viernes 8:00-18:00',
      status: 'OPEN',
    },
    {
      title: 'Cuidadora de adulto mayor en Providencia',
      employerIdx: 1,
      description: 'Cuidado de abuela de 78 años, necesita ayuda con medicamentos y movilidad',
      location: 'Providencia',
      hourlyRate: 5500,
      schedule: 'Lunes a Sábado 9:00-17:00',
      status: 'OPEN',
    },
    {
      title: 'Aseo del hogar en Vitacura',
      employerIdx: 2,
      description: 'Limpieza general del hogar dos veces por semana',
      location: 'Vitacura',
      hourlyRate: 4000,
      schedule: 'Martes y Jueves 9:00-14:00',
      status: 'OPEN',
    },
    {
      title: 'Nana puertas adentro en Ñuñoa',
      employerIdx: 0,
      description: 'Buscamos nana puertas adentro para cuidado de bebé de 8 meses',
      location: 'Ñuñoa',
      hourlyRate: 6000,
      schedule: 'Lunes a Domingo',
      status: 'OPEN',
    },
  ];

  let jobCount = 0;
  for (const j of jobsData) {
    await prisma.job.create({
      data: {
        title: j.title,
        description: j.description,
        location: j.location,
        hourlyRate: j.hourlyRate,
        schedule: j.schedule,
        status: j.status,
        employerId: employers[j.employerIdx].id,
      },
    });
    jobCount++;
  }

  console.log(`Seed completado: ${userCount} usuarios, ${jobCount} trabajos creados`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });