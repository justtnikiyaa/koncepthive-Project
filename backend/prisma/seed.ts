import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // Create default admin user
  const hashedPassword = await bcrypt.hash('123456', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@test.com',
      password: hashedPassword,
    },
  });

  console.log(`👤 Created admin user: ${adminUser.email}`);

  // Calculate dates for sample tasks
  const today = new Date();
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 3);

  // Seed initial tasks
  const sampleTasks = [
    {
      title: 'Design Task Management Dashboard UI',
      description: 'Create responsive high-fidelity UI components for the dashboard overview and task cards.',
      priority: 'High',
      status: 'In Progress',
      dueDate: tomorrow,
      userId: adminUser.id,
    },
    {
      title: 'Implement JWT Authentication Backend',
      description: 'Set up Express login endpoint with bcrypt password verification and JWT token issuance.',
      priority: 'High',
      status: 'Completed',
      dueDate: today,
      userId: adminUser.id,
    },
    {
      title: 'Setup Database Migrations & Seeds',
      description: 'Define Prisma schema models for User and Task entities, run migrations, and write seed scripts.',
      priority: 'Medium',
      status: 'Completed',
      dueDate: today,
      userId: adminUser.id,
    },
    {
      title: 'Submit Koncepthive Technical Assessment',
      description: 'Finalize README documentation, verify test cases, export SQL dump, and submit to career email.',
      priority: 'High',
      status: 'Pending',
      dueDate: nextWeek,
      userId: adminUser.id,
    },
    {
      title: 'Submit Initial Prototype Draft',
      description: 'Legacy task created earlier to verify overdue task dashboard status tracking.',
      priority: 'Low',
      status: 'Pending',
      dueDate: pastDate, // Overdue task!
      userId: adminUser.id,
    },
  ];

  for (const taskData of sampleTasks) {
    const task = await prisma.task.create({ data: taskData });
    console.log(`📋 Created sample task: "${task.title}" [Status: ${task.status}]`);
  }

  console.log('✅ Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
