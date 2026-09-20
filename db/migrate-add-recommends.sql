-- Migration: Add recommends column to reviews table
-- Run this once against the database

ALTER TABLE reviews 
ADD COLUMN recommends BOOLEAN NOT NULL DEFAULT false;