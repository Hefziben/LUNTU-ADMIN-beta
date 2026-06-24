-- Ensure all requested columns exist in coaches table
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS specialty TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS experience TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS affiliation TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 5.0;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS id_card_url TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS certificate_url TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add profile_id if it doesn't exist to link with profiles table
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE;

-- Ensure profiles table has phone column if it was missing
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
