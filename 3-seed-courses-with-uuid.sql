-- ================================================
-- REBALL Course Seeding - Using UUIDs
-- Run this in Supabase SQL Editor
-- ================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STRIKERS (2 courses)
INSERT INTO courses (id, name, description, position, type, duration_weeks, price_121, price_group, available, created_at, updated_at)
VALUES 
(
  gen_random_uuid(),
  'Essential 1v1 Attacking Striker Finishing Course',
  'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and score goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'STRIKER',
  'ESSENTIAL',
  4,
  199.00,
  149.00,
  true,
  NOW(),
  NOW()
);

INSERT INTO courses (id, name, description, position, type, duration_weeks, price_121, price_group, available, created_at, updated_at)
VALUES 
(
  gen_random_uuid(),
  'Advanced 1v1 Attacking Striker Finishing Course',
  'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and scoring goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'STRIKER',
  'ADVANCED',
  6,
  299.00,
  249.00,
  true,
  NOW(),
  NOW()
);

-- WINGERS - Crossing (2 courses)
INSERT INTO courses (id, name, description, position, type, duration_weeks, price_121, price_group, available, created_at, updated_at)
VALUES 
(
  gen_random_uuid(),
  'Essential 1v1 Attacking Winger Crossing Course',
  'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and deliver assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'WINGER',
  'ESSENTIAL',
  4,
  199.00,
  149.00,
  true,
  NOW(),
  NOW()
);

INSERT INTO courses (id, name, description, position, type, duration_weeks, price_121, price_group, available, created_at, updated_at)
VALUES 
(
  gen_random_uuid(),
  'Advanced 1v1 Attacking Winger Crossing Course',
  'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and delivering assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'WINGER',
  'ADVANCED',
  6,
  299.00,
  249.00,
  true,
  NOW(),
  NOW()
);

-- WINGERS - Finishing (2 courses)
INSERT INTO courses (id, name, description, position, type, duration_weeks, price_121, price_group, available, created_at, updated_at)
VALUES 
(
  gen_random_uuid(),
  'Essential 1v1 Attacking Winger Finishing Course',
  'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and score goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'WINGER',
  'ESSENTIAL',
  4,
  199.00,
  149.00,
  true,
  NOW(),
  NOW()
);

INSERT INTO courses (id, name, description, position, type, duration_weeks, price_121, price_group, available, created_at, updated_at)
VALUES 
(
  gen_random_uuid(),
  'Advanced 1v1 Attacking Winger Finishing Course',
  'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and scoring goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'WINGER',
  'ADVANCED',
  6,
  299.00,
  249.00,
  true,
  NOW(),
  NOW()
);

-- CAM - Crossing (2 courses)
INSERT INTO courses (id, name, description, position, type, duration_weeks, price_121, price_group, available, created_at, updated_at)
VALUES 
(
  gen_random_uuid(),
  'Essential 1v1 Attacking CAM Crossing Course',
  'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and deliver assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'CAM',
  'ESSENTIAL',
  4,
  199.00,
  149.00,
  true,
  NOW(),
  NOW()
);

INSERT INTO courses (id, name, description, position, type, duration_weeks, price_121, price_group, available, created_at, updated_at)
VALUES 
(
  gen_random_uuid(),
  'Advanced 1v1 Attacking CAM Crossing Course',
  'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and delivering assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'CAM',
  'ADVANCED',
  6,
  299.00,
  249.00,
  true,
  NOW(),
  NOW()
);

-- CAM - Finishing (2 courses)
INSERT INTO courses (id, name, description, position, type, duration_weeks, price_121, price_group, available, created_at, updated_at)
VALUES 
(
  gen_random_uuid(),
  'Essential 1v1 Attacking CAM Finishing Course',
  'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and score goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'CAM',
  'ESSENTIAL',
  4,
  199.00,
  149.00,
  true,
  NOW(),
  NOW()
);

INSERT INTO courses (id, name, description, position, type, duration_weeks, price_121, price_group, available, created_at, updated_at)
VALUES 
(
  gen_random_uuid(),
  'Advanced 1v1 Attacking CAM Finishing Course',
  'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and scoring goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'CAM',
  'ADVANCED',
  6,
  299.00,
  249.00,
  true,
  NOW(),
  NOW()
);

-- FULL-BACKS (2 courses)
INSERT INTO courses (id, name, description, position, type, duration_weeks, price_121, price_group, available, created_at, updated_at)
VALUES 
(
  gen_random_uuid(),
  'Essential 1v1 Attacking Full-back Course',
  'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and deliver assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'FULLBACK',
  'ESSENTIAL',
  4,
  199.00,
  149.00,
  true,
  NOW(),
  NOW()
);

INSERT INTO courses (id, name, description, position, type, duration_weeks, price_121, price_group, available, created_at, updated_at)
VALUES 
(
  gen_random_uuid(),
  'Advanced 1v1 Attacking Full-back Course',
  'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and delivering assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'FULLBACK',
  'ADVANCED',
  6,
  299.00,
  249.00,
  true,
  NOW(),
  NOW()
);

-- CENTRE-BACKS (2 courses)
INSERT INTO courses (id, name, description, position, type, duration_weeks, price_121, price_group, available, created_at, updated_at)
VALUES 
(
  gen_random_uuid(),
  'Essential 1v1 Defending Centre-back Course',
  'Learn the specific essential tactical, movement and technical information you need to instantly increase your 1v1 defending success in the exact 1v1 scenarios you face in the game.',
  'CENTREBACK',
  'ESSENTIAL',
  4,
  199.00,
  149.00,
  true,
  NOW(),
  NOW()
);

INSERT INTO courses (id, name, description, position, type, duration_weeks, price_121, price_group, available, created_at, updated_at)
VALUES 
(
  gen_random_uuid(),
  'Advanced 1v1 Defending Centre-back Course',
  'Learn the specific advanced tactical, movement and technical information you need to instantly increase your 1v1 defending success in the exact 1v1 scenarios you face in the game.',
  'CENTREBACK',
  'ADVANCED',
  6,
  299.00,
  249.00,
  true,
  NOW(),
  NOW()
);

-- Verify seeding worked
SELECT 
  id,
  name,
  position,
  type,
  duration_weeks,
  price_121,
  price_group,
  available
FROM courses
WHERE available = true
ORDER BY position, type;

-- Summary
SELECT 
  position,
  type,
  COUNT(*) as course_count,
  ROUND(AVG(price_121::numeric), 2) as avg_121_price,
  ROUND(AVG(price_group::numeric), 2) as avg_group_price
FROM courses
WHERE available = true
GROUP BY position, type
ORDER BY position, type;

-- Final count
SELECT 
  '✅ Total Active Courses Seeded:' as status,
  COUNT(*) as count
FROM courses
WHERE available = true;

