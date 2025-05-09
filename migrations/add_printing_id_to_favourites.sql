ALTER TABLE favourites
ADD COLUMN printing_id INTEGER REFERENCES printing(id);
