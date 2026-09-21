-- Add created_at to restaurants
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Add created_at to menu_items
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Update existing restaurants: set created_at to 60+ days ago for all except recent ones
UPDATE restaurants SET created_at = NOW() - INTERVAL '90 days' WHERE id IN (1, 2, 3, 4, 5, 6, 7);

-- Mark a couple as "new" (within 30 days)
UPDATE restaurants SET created_at = NOW() - INTERVAL '15 days' WHERE id IN (5, 7);

-- Update existing menu_items: set created_at to match restaurant
UPDATE menu_items SET created_at = NOW() - INTERVAL '90 days';
-- Mark a few menu items as new
UPDATE menu_items SET created_at = NOW() - INTERVAL '10 days' WHERE id IN (1, 2, 25, 26, 27);