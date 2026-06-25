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

-- Add profile_id if it doesn't exist to link with user_profiles/profiles table
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS profile_id UUID;

-- Since the user explicitly mentioned user_profiles, let's ensure it's referenced if possible
-- but we don't know the exact schema of user_profiles, so we'll just ensure the column exists.
