-- Multi-user SaaS foundation
-- Adds users + accounts for per-customer Instagram connection and AI customization.

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'facebook',
  provider_account_id text,
  instagram_id text NOT NULL UNIQUE,
  facebook_token text NOT NULL,
  custom_ai_prompt text,
  token_expires_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT accounts_instagram_id_not_empty CHECK (length(trim(instagram_id)) > 0),
  CONSTRAINT accounts_facebook_token_not_empty CHECK (length(trim(facebook_token)) > 0)
);

-- Optional provider/account uniqueness for OAuth identities when available.
CREATE UNIQUE INDEX IF NOT EXISTS accounts_provider_identity_idx
  ON accounts(provider, provider_account_id)
  WHERE provider_account_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts(user_id);
CREATE INDEX IF NOT EXISTS accounts_instagram_id_idx ON accounts(instagram_id);

-- Keep updated_at in sync using the trigger function from 002_onboarding_tables.sql
DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS accounts_updated_at ON accounts;
CREATE TRIGGER accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Service role can manage all rows (webhooks/background jobs).
DROP POLICY IF EXISTS "Service role full access users" ON users;
CREATE POLICY "Service role full access users"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access accounts" ON accounts;
CREATE POLICY "Service role full access accounts"
  ON accounts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Future-proof app policies for logged-in users (Supabase Auth context).
DROP POLICY IF EXISTS "Users can view own user row" ON users;
CREATE POLICY "Users can view own user row"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own user row" ON users;
CREATE POLICY "Users can update own user row"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own accounts" ON accounts;
CREATE POLICY "Users can view own accounts"
  ON accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own accounts" ON accounts;
CREATE POLICY "Users can insert own accounts"
  ON accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own accounts" ON accounts;
CREATE POLICY "Users can update own accounts"
  ON accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own accounts" ON accounts;
CREATE POLICY "Users can delete own accounts"
  ON accounts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
