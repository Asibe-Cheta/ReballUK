import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define all courses with their details
const courses = [
  // STRIKERS
  {
    id: 'striker-1v1-attacking-essential',
    title: 'Essential 1v1 Attacking Striker Finishing Course',
    description: 'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and score goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
    position: 'STRIKER',
    level: 'ESSENTIAL',
    duration: 240, // 4-6 weeks (estimated minutes per week)
    price: 199.00,
    tags: ['striker', 'finishing', '1v1-attacking', 'essential'],
    isActive: true
  },
  {
    id: 'striker-1v1-attacking-advanced',
    title: 'Advanced 1v1 Attacking Striker Finishing Course',
    description: 'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and scoring goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
    position: 'STRIKER',
    level: 'ADVANCED',
    duration: 360, // 6-8 weeks
    price: 299.00,
    tags: ['striker', 'finishing', '1v1-attacking', 'advanced'],
    isActive: true
  },

  // WINGERS - Crossing
  {
    id: 'winger-1v1-attacking-crossing-essential',
    title: 'Essential 1v1 Attacking Winger Crossing Course',
    description: 'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and deliver assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
    position: 'WINGER',
    level: 'ESSENTIAL',
    duration: 240,
    price: 199.00,
    tags: ['winger', 'crossing', '1v1-attacking', 'essential'],
    isActive: true
  },
  {
    id: 'winger-1v1-attacking-crossing-advanced',
    title: 'Advanced 1v1 Attacking Winger Crossing Course',
    description: 'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and delivering assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
    position: 'WINGER',
    level: 'ADVANCED',
    duration: 360,
    price: 299.00,
    tags: ['winger', 'crossing', '1v1-attacking', 'advanced'],
    isActive: true
  },

  // WINGERS - Finishing
  {
    id: 'winger-1v1-attacking-finishing-essential',
    title: 'Essential 1v1 Attacking Winger Finishing Course',
    description: 'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and score goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
    position: 'WINGER',
    level: 'ESSENTIAL',
    duration: 240,
    price: 199.00,
    tags: ['winger', 'finishing', '1v1-attacking', 'essential'],
    isActive: true
  },
  {
    id: 'winger-1v1-attacking-finishing-advanced',
    title: 'Advanced 1v1 Attacking Winger Finishing Course',
    description: 'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and scoring goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
    position: 'WINGER',
    level: 'ADVANCED',
    duration: 360,
    price: 299.00,
    tags: ['winger', 'finishing', '1v1-attacking', 'advanced'],
    isActive: true
  },

  // CAM - Crossing
  {
    id: 'cam-1v1-attacking-crossing-essential',
    title: 'Essential 1v1 Attacking CAM Crossing Course',
    description: 'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and deliver assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
    position: 'CAM',
    level: 'ESSENTIAL',
    duration: 240,
    price: 199.00,
    tags: ['cam', 'crossing', '1v1-attacking', 'essential'],
    isActive: true
  },
  {
    id: 'cam-1v1-attacking-crossing-advanced',
    title: 'Advanced 1v1 Attacking CAM Crossing Course',
    description: 'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and delivering assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
    position: 'CAM',
    level: 'ADVANCED',
    duration: 360,
    price: 299.00,
    tags: ['cam', 'crossing', '1v1-attacking', 'advanced'],
    isActive: true
  },

  // CAM - Finishing
  {
    id: 'cam-1v1-attacking-finishing-essential',
    title: 'Essential 1v1 Attacking CAM Finishing Course',
    description: 'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and score goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
    position: 'CAM',
    level: 'ESSENTIAL',
    duration: 240,
    price: 199.00,
    tags: ['cam', 'finishing', '1v1-attacking', 'essential'],
    isActive: true
  },
  {
    id: 'cam-1v1-attacking-finishing-advanced',
    title: 'Advanced 1v1 Attacking CAM Finishing Course',
    description: 'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and scoring goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
    position: 'CAM',
    level: 'ADVANCED',
    duration: 360,
    price: 299.00,
    tags: ['cam', 'finishing', '1v1-attacking', 'advanced'],
    isActive: true
  },

  // FULL-BACKS
  {
    id: 'fb-1v1-attacking-essential',
    title: 'Essential 1v1 Attacking Full-back Course',
    description: 'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and deliver assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
    position: 'FULLBACK',
    level: 'ESSENTIAL',
    duration: 240,
    price: 199.00,
    tags: ['fullback', 'attacking', 'crossing', 'essential'],
    isActive: true
  },
  {
    id: 'fb-1v1-attacking-advanced',
    title: 'Advanced 1v1 Attacking Full-back Course',
    description: 'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and delivering assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
    position: 'FULLBACK',
    level: 'ADVANCED',
    duration: 360,
    price: 299.00,
    tags: ['fullback', 'attacking', 'crossing', 'advanced'],
    isActive: true
  },

  // CENTRE-BACKS
  {
    id: 'cb-1v1-defending-essential',
    title: 'Essential 1v1 Defending Centre-back Course',
    description: 'Learn the specific essential tactical, movement and technical information you need to instantly increase your 1v1 defending success in the exact 1v1 scenarios you face in the game.',
    position: 'CENTREBACK',
    level: 'ESSENTIAL',
    duration: 240,
    price: 199.00,
    tags: ['centreback', 'defending', '1v1-defending', 'essential'],
    isActive: true
  },
  {
    id: 'cb-1v1-defending-advanced',
    title: 'Advanced 1v1 Defending Centre-back Course',
    description: 'Learn the specific advanced tactical, movement and technical information you need to instantly increase your 1v1 defending success in the exact 1v1 scenarios you face in the game.',
    position: 'CENTREBACK',
    level: 'ADVANCED',
    duration: 360,
    price: 299.00,
    tags: ['centreback', 'defending', '1v1-defending', 'advanced'],
    isActive: true
  }
]

async function seedCourses() {
  console.log('🌱 Seeding courses...')

  for (const courseData of courses) {
    try {
      const course = await prisma.course.upsert({
        where: { id: courseData.id },
        update: {
          name: courseData.title,
          description: courseData.description,
          position: courseData.position,
          type: courseData.level,
          durationWeeks: courseData.duration,
          price121: courseData.price,
          available: courseData.isActive
        },
        create: {
          id: courseData.id,
          name: courseData.title,
          description: courseData.description,
          position: courseData.position,
          type: courseData.level,
          durationWeeks: courseData.duration,
          price121: courseData.price,
          available: courseData.isActive
        }
      })

      console.log(`✅ ${course.name} - £${course.price121}`)
    } catch (error) {
      console.error(`❌ Failed to seed ${courseData.title}:`, error)
    }
  }

  console.log('\n✨ Course seeding complete!')
  console.log(`Total courses: ${courses.length}`)
  console.log(`Active courses: ${courses.filter(c => c.isActive).length}`)
}

// Run the seed function
seedCourses()
  .catch((error) => {
    console.error('Seeding error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

