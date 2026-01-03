-- Categories (Health, Professional, Personal)
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(10),
  sort_order INT DEFAULT 0
);

-- Task definitions (configurable)
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  days_active VARCHAR(20) DEFAULT 'daily',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Daily completions
CREATE TABLE IF NOT EXISTS completions (
  id SERIAL PRIMARY KEY,
  task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(task_id, completed_date)
);

-- Insert default categories
INSERT INTO categories (name, icon, sort_order) VALUES
  ('Health', '💪', 1),
  ('Professional', '💼', 2),
  ('Personal', '🏠', 3)
ON CONFLICT DO NOTHING;

-- Insert default health tasks based on the user's plan
INSERT INTO tasks (category_id, name, days_active, sort_order) VALUES
  -- Training (day-specific)
  (1, 'HIIT 20min → Zone 2 20-40min', 'MON', 1),
  (1, 'Heavy Lift 45-60min', 'TUE', 2),
  (1, 'HIIT 20min', 'WED', 3),
  (1, 'Zone 2 50-55min → Finish spikes', 'THU', 4),
  (1, 'Heavy Lift → HIIT 20min', 'FRI', 5),
  (1, 'HIIT 20min → Zone 2 20-50min', 'SAT', 6),
  (1, 'Long Zone 2 60-75min', 'SUN', 7),
  -- Daily tasks
  (1, '10k Steps', 'daily', 10),
  (1, 'Protein Shake (serving 1)', 'daily', 11),
  (1, 'Protein Shake (serving 2)', 'daily', 12),
  (1, 'Eggs + Cottage Cheese', 'daily', 13),
  (1, 'EVOO (1 tbsp)', 'daily', 14),
  (1, 'Fish Oil (1 tbsp)', 'daily', 15),
  (1, 'Dinner (high protein + carbs)', 'daily', 16),
  (1, 'Chia Seeds + Glycine', 'daily', 17),
  -- Sauna (Mon/Wed/Fri/Sun)
  (1, 'Sauna 15-25min', 'MWFS', 20),
  -- Evening prep
  (1, 'Make tomorrow''s shake', 'daily', 30),
  (1, 'Prep fiber bolus', 'daily', 31),
  (1, 'Fill electrolyte bottle', 'daily', 32);
