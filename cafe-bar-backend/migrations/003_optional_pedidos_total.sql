-- migrations/003_optional_pedidos_total.sql
-- This migration attempts to add a total column to pedidos to enable simple sales aggregation.
ALTER TABLE pedidos
  ADD COLUMN IF NOT EXISTS total DECIMAL(10,2) DEFAULT 0;
