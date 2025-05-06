-- Добавить поля contact_information, description, booking в таблицу photostudios

ALTER TABLE photostudios
ADD COLUMN contact_information VARCHAR(255),
ADD COLUMN description TEXT,
ADD COLUMN booking BOOLEAN;
