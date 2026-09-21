-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id                    SERIAL PRIMARY KEY,
  restaurant_id         INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name                  TEXT NOT NULL,
  description           TEXT,
  price                 NUMERIC(10,2) NOT NULL,
  category              TEXT NOT NULL CHECK (category IN ('Bowls', 'Wraps', 'Salads', 'Sides', 'Drinks')),
  is_veg                BOOLEAN NOT NULL DEFAULT FALSE,
  prep_time_minutes     INTEGER NOT NULL,
  image_url             TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add menu_item_id to reviews (nullable FK)
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE SET NULL;