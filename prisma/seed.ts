import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample courses
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: "Striker Fundamentals",
        description: "Master the basics of striker play with finishing techniques and positioning",
        level: "BEGINNER",
        position: "STRIKER",
        duration: 45,
        price: 29.99,
        tags: ["finishing", "positioning", "fundamentals"],
        thumbnailUrl: "/images/courses/striker-fundamentals.jpg",
        videos: {
          create: [
            {
              title: "Introduction to Striker Play",
              description: "Overview of striker responsibilities and key skills",
              videoUrl: "/videos/striker/intro.mp4",
              duration: 300, // 5 minutes
              orderIndex: 1,
              isPreview: true,
              analysisType: "TAV",
              tags: ["introduction", "overview"],
            },
            {
              title: "Finishing Techniques",
              description: "Learn various finishing techniques in the box",
              videoUrl: "/videos/striker/finishing.mp4",
              duration: 600, // 10 minutes
              orderIndex: 2,
              analysisType: "SISW",
              tags: ["finishing", "technique"],
            },
            {
              title: "Movement and Positioning",
              description: "How to find space and create scoring opportunities",
              videoUrl: "/videos/striker/movement.mp4",
              duration: 480, // 8 minutes
              orderIndex: 3,
              analysisType: "TAV",
              tags: ["movement", "positioning"],
            }
          ]
        }
      }
    }),

    prisma.course.create({
      data: {
        title: "Winger Mastery",
        description: "Advanced wing play techniques for creating width and delivering crosses",
        level: "INTERMEDIATE",
        position: "WINGER",
        duration: 60,
        price: 39.99,
        tags: ["crossing", "pace", "width"],
        thumbnailUrl: "/images/courses/winger-mastery.jpg",
        videos: {
          create: [
            {
              title: "Wing Play Fundamentals",
              description: "Basic principles of effective wing play",
              videoUrl: "/videos/winger/fundamentals.mp4",
              duration: 420, // 7 minutes
              orderIndex: 1,
              isPreview: true,
              analysisType: "TAV",
              tags: ["fundamentals", "width"],
            },
            {
              title: "Crossing Techniques",
              description: "Master different types of crosses and when to use them",
              videoUrl: "/videos/winger/crossing.mp4",
              duration: 540, // 9 minutes
              orderIndex: 2,
              analysisType: "SISW",
              tags: ["crossing", "technique"],
            }
          ]
        }
      }
    }),

    prisma.course.create({
      data: {
        title: "CAM Playmaking",
        description: "Learn to control the game from the attacking midfield position",
        level: "ADVANCED",
        position: "CAM",
        duration: 75,
        price: 49.99,
        tags: ["playmaking", "vision", "passing"],
        thumbnailUrl: "/images/courses/cam-playmaking.jpg",
        videos: {
          create: [
            {
              title: "Vision and Awareness",
              description: "Develop your field vision and game awareness",
              videoUrl: "/videos/cam/vision.mp4",
              duration: 660, // 11 minutes
              orderIndex: 1,
              isPreview: true,
              analysisType: "TAV",
              tags: ["vision", "awareness"],
            },
            {
              title: "Creative Passing",
              description: "Master through balls and creative passing options",
              videoUrl: "/videos/cam/passing.mp4",
              duration: 720, // 12 minutes
              orderIndex: 2,
              analysisType: "SISW",
              tags: ["passing", "creativity"],
            }
          ]
        }
      }
    }),

    prisma.course.create({
      data: {
        title: "Goalkeeper Basics",
        description: "Essential goalkeeping skills for shot stopping and distribution",
        level: "BEGINNER",
        position: "GOALKEEPER",
        duration: 50,
        price: 34.99,
        tags: ["shot-stopping", "distribution", "positioning"],
        thumbnailUrl: "/images/courses/goalkeeper-basics.jpg",
        videos: {
          create: [
            {
              title: "Basic Positioning",
              description: "Learn proper goalkeeper positioning and stance",
              videoUrl: "/videos/goalkeeper/positioning.mp4",
              duration: 480, // 8 minutes
              orderIndex: 1,
              isPreview: true,
              analysisType: "TAV",
              tags: ["positioning", "basics"],
            },
            {
              title: "Shot Stopping Techniques",
              description: "Master diving saves and shot stopping",
              videoUrl: "/videos/goalkeeper/saves.mp4",
              duration: 600, // 10 minutes
              orderIndex: 2,
              analysisType: "SISW",
              tags: ["saves", "technique"],
            }
          ]
        }
      }
    })
  ])

  console.log(`✅ Created ${courses.length} courses with videos`)

  // Create sample certificates
  console.log('🏆 Creating sample certificates...')
  
  // You would create these for actual users in production
  console.log('✅ Database seeding completed!')

  console.log('\n📊 Summary:')
  console.log(`- Courses: ${courses.length}`)
  console.log(`- Videos: ${courses.reduce((total, course) => total + (course.videos?.length || 0), 0)}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
