-- ================================================
-- REBALL Course Seeding - SQL Script
-- Run this in Supabase SQL Editor AFTER stripe-schema-migration.sql
-- ================================================

-- Insert or update all 14 active courses

-- STRIKERS (2 courses)
INSERT INTO courses (id, title, description, position, level, duration, price, tags, is_active, created_at, updated_at)
VALUES 
(
  'striker-1v1-attacking-essential',
  'Essential 1v1 Attacking Striker Finishing Course',
  'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and score goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'STRIKER',
  'ESSENTIAL',
  240,
  199.00,
  ARRAY['striker', 'finishing', '1v1-attacking', 'essential'],
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  level = EXCLUDED.level,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO courses (id, title, description, position, level, duration, price, tags, is_active, created_at, updated_at)
VALUES 
(
  'striker-1v1-attacking-advanced',
  'Advanced 1v1 Attacking Striker Finishing Course',
  'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and scoring goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'STRIKER',
  'ADVANCED',
  360,
  299.00,
  ARRAY['striker', 'finishing', '1v1-attacking', 'advanced'],
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  level = EXCLUDED.level,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- WINGERS - Crossing (2 courses)
INSERT INTO courses (id, title, description, position, level, duration, price, tags, is_active, created_at, updated_at)
VALUES 
(
  'winger-1v1-attacking-crossing-essential',
  'Essential 1v1 Attacking Winger Crossing Course',
  'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and deliver assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'WINGER',
  'ESSENTIAL',
  240,
  199.00,
  ARRAY['winger', 'crossing', '1v1-attacking', 'essential'],
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  level = EXCLUDED.level,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO courses (id, title, description, position, level, duration, price, tags, is_active, created_at, updated_at)
VALUES 
(
  'winger-1v1-attacking-crossing-advanced',
  'Advanced 1v1 Attacking Winger Crossing Course',
  'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and delivering assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'WINGER',
  'ADVANCED',
  360,
  299.00,
  ARRAY['winger', 'crossing', '1v1-attacking', 'advanced'],
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  level = EXCLUDED.level,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- WINGERS - Finishing (2 courses)
INSERT INTO courses (id, title, description, position, level, duration, price, tags, is_active, created_at, updated_at)
VALUES 
(
  'winger-1v1-attacking-finishing-essential',
  'Essential 1v1 Attacking Winger Finishing Course',
  'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and score goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'WINGER',
  'ESSENTIAL',
  240,
  199.00,
  ARRAY['winger', 'finishing', '1v1-attacking', 'essential'],
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  level = EXCLUDED.level,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO courses (id, title, description, position, level, duration, price, tags, is_active, created_at, updated_at)
VALUES 
(
  'winger-1v1-attacking-finishing-advanced',
  'Advanced 1v1 Attacking Winger Finishing Course',
  'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and scoring goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'WINGER',
  'ADVANCED',
  360,
  299.00,
  ARRAY['winger', 'finishing', '1v1-attacking', 'advanced'],
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  level = EXCLUDED.level,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- CAM - Crossing (2 courses)
INSERT INTO courses (id, title, description, position, level, duration, price, tags, is_active, created_at, updated_at)
VALUES 
(
  'cam-1v1-attacking-crossing-essential',
  'Essential 1v1 Attacking CAM Crossing Course',
  'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and deliver assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'CAM',
  'ESSENTIAL',
  240,
  199.00,
  ARRAY['cam', 'crossing', '1v1-attacking', 'essential'],
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  level = EXCLUDED.level,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO courses (id, title, description, position, level, duration, price, tags, is_active, created_at, updated_at)
VALUES 
(
  'cam-1v1-attacking-crossing-advanced',
  'Advanced 1v1 Attacking CAM Crossing Course',
  'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and delivering assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'CAM',
  'ADVANCED',
  360,
  299.00,
  ARRAY['cam', 'crossing', '1v1-attacking', 'advanced'],
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  level = EXCLUDED.level,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- CAM - Finishing (2 courses)
INSERT INTO courses (id, title, description, position, level, duration, price, tags, is_active, created_at, updated_at)
VALUES 
(
  'cam-1v1-attacking-finishing-essential',
  'Essential 1v1 Attacking CAM Finishing Course',
  'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and score goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'CAM',
  'ESSENTIAL',
  240,
  199.00,
  ARRAY['cam', 'finishing', '1v1-attacking', 'essential'],
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  level = EXCLUDED.level,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO courses (id, title, description, position, level, duration, price, tags, is_active, created_at, updated_at)
VALUES 
(
  'cam-1v1-attacking-finishing-advanced',
  'Advanced 1v1 Attacking CAM Finishing Course',
  'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and scoring goals. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'CAM',
  'ADVANCED',
  360,
  299.00,
  ARRAY['cam', 'finishing', '1v1-attacking', 'advanced'],
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  level = EXCLUDED.level,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- FULL-BACKS (2 courses)
INSERT INTO courses (id, title, description, position, level, duration, price, tags, is_active, created_at, updated_at)
VALUES 
(
  'fb-1v1-attacking-essential',
  'Essential 1v1 Attacking Full-back Course',
  'Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and deliver assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'FULLBACK',
  'ESSENTIAL',
  240,
  199.00,
  ARRAY['fullback', 'attacking', 'crossing', 'essential'],
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  level = EXCLUDED.level,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO courses (id, title, description, position, level, duration, price, tags, is_active, created_at, updated_at)
VALUES 
(
  'fb-1v1-attacking-advanced',
  'Advanced 1v1 Attacking Full-back Course',
  'Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and delivering assists. This course features the exact 8 1v1 attacking scenarios you face in the game.',
  'FULLBACK',
  'ADVANCED',
  360,
  299.00,
  ARRAY['fullback', 'attacking', 'crossing', 'advanced'],
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  level = EXCLUDED.level,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- CENTRE-BACKS (2 courses)
INSERT INTO courses (id, title, description, position, level, duration, price, tags, is_active, created_at, updated_at)
VALUES 
(
  'cb-1v1-defending-essential',
  'Essential 1v1 Defending Centre-back Course',
  'Learn the specific essential tactical, movement and technical information you need to instantly increase your 1v1 defending success in the exact 1v1 scenarios you face in the game.',
  'CENTREBACK',
  'ESSENTIAL',
  240,
  199.00,
  ARRAY['centreback', 'defending', '1v1-defending', 'essential'],
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  level = EXCLUDED.level,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO courses (id, title, description, position, level, duration, price, tags, is_active, created_at, updated_at)
VALUES 
(
  'cb-1v1-defending-advanced',
  'Advanced 1v1 Defending Centre-back Course',
  'Learn the specific advanced tactical, movement and technical information you need to instantly increase your 1v1 defending success in the exact 1v1 scenarios you face in the game.',
  'CENTREBACK',
  'ADVANCED',
  360,
  299.00,
  ARRAY['centreback', 'defending', '1v1-defending', 'advanced'],
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  position = EXCLUDED.position,
  level = EXCLUDED.level,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Verify seeding
SELECT 
  id,
  title,
  position,
  level,
  price,
  is_active
FROM courses
ORDER BY position, level;

-- Summary
SELECT 
  position,
  level,
  COUNT(*) as course_count,
  AVG(price) as avg_price
FROM courses
WHERE is_active = true
GROUP BY position, level
ORDER BY position, level;

