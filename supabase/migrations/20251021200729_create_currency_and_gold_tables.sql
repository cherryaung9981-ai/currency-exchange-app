/*
  # Currency Exchange Application Schema

  ## Overview
  This migration creates the necessary tables for a currency exchange application
  that displays exchange rates, gold prices, and provides currency conversion.

  ## New Tables
  
  ### `exchange_rates`
  Stores daily currency exchange rates against Myanmar Kyat (MMK)
  - `id` (uuid, primary key) - Unique identifier
  - `currency_code` (text) - ISO currency code (e.g., USD, EUR, JPY)
  - `currency_name` (text) - Full currency name
  - `rate_to_mmk` (numeric) - How much MMK equals one unit of this currency
  - `flag_emoji` (text) - Unicode flag emoji for the currency's country
  - `last_updated` (timestamptz) - When this rate was last updated
  - `created_at` (timestamptz) - Record creation timestamp

  ### `gold_prices`
  Stores current gold prices for world and Myanmar markets
  - `id` (uuid, primary key) - Unique identifier
  - `price_type` (text) - Type: 'world', 'myanmar_16_pae', 'myanmar_15_pae'
  - `price` (numeric) - Current price
  - `currency` (text) - Currency code (USD for world, MMK for Myanmar)
  - `unit` (text) - Unit of measurement (e.g., 'per_ounce', 'per_tical')
  - `last_updated` (timestamptz) - When this price was last updated
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on both tables
  - Public read access for all users (no authentication required)
  - No write access from client (updates handled via backend/admin only)

  ## Notes
  - Exchange rates are stored as how much MMK equals one unit of foreign currency
  - Gold prices support both world prices and Myanmar-specific prices
  - All prices use numeric type for precision
*/

-- Create exchange_rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  currency_code text NOT NULL UNIQUE,
  currency_name text NOT NULL,
  rate_to_mmk numeric(12, 2) NOT NULL,
  flag_emoji text NOT NULL DEFAULT '🏳️',
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create gold_prices table
CREATE TABLE IF NOT EXISTS gold_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  price_type text NOT NULL UNIQUE,
  price numeric(12, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  unit text NOT NULL DEFAULT 'per_ounce',
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE gold_prices ENABLE ROW LEVEL SECURITY;

-- Public read access for exchange rates
CREATE POLICY "Allow public read access to exchange rates"
  ON exchange_rates
  FOR SELECT
  TO public
  USING (true);

-- Public read access for gold prices
CREATE POLICY "Allow public read access to gold prices"
  ON gold_prices
  FOR SELECT
  TO public
  USING (true);

-- Insert sample exchange rates data
INSERT INTO exchange_rates (currency_code, currency_name, rate_to_mmk, flag_emoji) VALUES
  ('USD', 'US Dollar', 2100.00, '🇺🇸'),
  ('EUR', 'Euro', 2280.00, '🇪🇺'),
  ('GBP', 'British Pound', 2650.00, '🇬🇧'),
  ('JPY', 'Japanese Yen', 14.50, '🇯🇵'),
  ('CNY', 'Chinese Yuan', 290.00, '🇨🇳'),
  ('THB', 'Thai Baht', 60.00, '🇹🇭'),
  ('SGD', 'Singapore Dollar', 1560.00, '🇸🇬'),
  ('MYR', 'Malaysian Ringgit', 470.00, '🇲🇾')
ON CONFLICT (currency_code) DO NOTHING;

-- Insert sample gold prices data
INSERT INTO gold_prices (price_type, price, currency, unit) VALUES
  ('world', 2050.00, 'USD', 'per_ounce'),
  ('myanmar_16_pae', 3850000.00, 'MMK', 'per_tical'),
  ('myanmar_15_pae', 3650000.00, 'MMK', 'per_tical')
ON CONFLICT (price_type) DO NOTHING;
