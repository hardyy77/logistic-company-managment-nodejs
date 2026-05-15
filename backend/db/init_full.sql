-- Full database reset + schema + seed for logistics project

CREATE EXTENSION IF NOT EXISTS pgcrypto;



DROP TABLE IF EXISTS service_records CASCADE;

DROP TABLE IF EXISTS transport_orders CASCADE;

DROP TABLE IF EXISTS driver_permissions CASCADE;

DROP TABLE IF EXISTS permissions CASCADE;

DROP TABLE IF EXISTS trailers CASCADE;

DROP TABLE IF EXISTS vehicles CASCADE;

DROP TABLE IF EXISTS drivers CASCADE;

DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS roles CASCADE;



CREATE TABLE roles (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE drivers (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(255),
    license_number VARCHAR(100) NOT NULL UNIQUE,
    license_category VARCHAR(50) NOT NULL,
    medical_exam_valid_until DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'available',
    user_id INTEGER UNIQUE REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
    id INTEGER PRIMARY KEY,
    registration_number VARCHAR(30) NOT NULL UNIQUE,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    production_year INTEGER NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    capacity_kg NUMERIC(10,2) NOT NULL DEFAULT 0,
    mileage INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'available',
    inspection_valid_until DATE,
    insurance_valid_until DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trailers (
    id INTEGER PRIMARY KEY,
    registration_number VARCHAR(30) NOT NULL UNIQUE,
    trailer_type VARCHAR(50) NOT NULL,
    capacity_kg NUMERIC(10,2) NOT NULL,
    volume_m3 NUMERIC(10,2),
    status VARCHAR(30) NOT NULL DEFAULT 'available',
    inspection_valid_until DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id INTEGER PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE driver_permissions (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (driver_id, permission_id)
);

CREATE TABLE transport_orders (
    id INTEGER PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    client_name VARCHAR(255) NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    delivery_location VARCHAR(255) NOT NULL,
    cargo_weight_kg NUMERIC(10,2) NOT NULL,
    cargo_type VARCHAR(50),
    cargo_name VARCHAR(255),
    planned_distance_km NUMERIC(10,2),
    planned_duration_minutes INTEGER,
    estimated_cost NUMERIC(10,2),
    planned_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'new',
    driver_id INTEGER REFERENCES drivers(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    trailer_id INTEGER REFERENCES trailers(id),
    created_by_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE service_records (
    id INTEGER PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    service_type VARCHAR(100) NOT NULL,
    description TEXT,
    service_date DATE NOT NULL,
    cost NUMERIC(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'planned',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE UNIQUE INDEX ux_transport_orders_active_driver
ON transport_orders (driver_id)
WHERE driver_id IS NOT NULL AND status IN ('planned', 'in_progress');

CREATE UNIQUE INDEX ux_transport_orders_active_vehicle
ON transport_orders (vehicle_id)
WHERE vehicle_id IS NOT NULL AND status IN ('planned', 'in_progress');

CREATE UNIQUE INDEX ux_transport_orders_active_trailer
ON transport_orders (trailer_id)
WHERE trailer_id IS NOT NULL AND status IN ('planned', 'in_progress');


INSERT INTO roles (id, name) VALUES (1, 'admin'), (2, 'dispatcher'), (3, 'driver');

INSERT INTO users (id, first_name, last_name, email, password_hash, role_id, is_active) VALUES
(1, 'Arek', 'Admin', 'arek@example.com', crypt('tajnehaslo123', gen_salt('bf')), 1, TRUE),
(2, 'Anna', 'Dispatcher', 'dispatcher@example.com', crypt('tajnehaslo123', gen_salt('bf')), 2, TRUE),
(3, 'Piotr', 'Nowak', 'piotr.nowak.driver@example.com', crypt('tajnehaslo123', gen_salt('bf')), 3, TRUE),
(4, 'Piotr', 'Nowak', 'piotr.nowak.container@example.com', crypt('tajnehaslo123', gen_salt('bf')), 3, TRUE),
(5, 'Adam', 'Kowalski', 'adam.kowalski.driver@example.com', crypt('tajnehaslo123', gen_salt('bf')), 3, TRUE),
(6, 'Tomasz', 'Wojcik', 'tomasz.wojcik.driver@example.com', crypt('tajnehaslo123', gen_salt('bf')), 3, TRUE),
(7, 'Krzysztof', 'Kaczmarek', 'krzysztof.kaczmarek.driver@example.com', crypt('tajnehaslo123', gen_salt('bf')), 3, TRUE);

INSERT INTO drivers (id, first_name, last_name, phone, email, license_number, license_category, medical_exam_valid_until, status, user_id) VALUES
(1, 'Piotr', 'Nowak', '600000001', 'piotr.nowak1@example.com', 'DRV1001', 'C+E', '2027-06-06', 'in_route', 3),
(2, 'Piotr', 'Nowak', '600000002', 'piotr.nowak2@example.com', 'DRV1002', 'C+E', '2027-06-11', 'in_route', 4),
(3, 'Adam', 'Kowalski', '600000003', 'adam.kowalski3@example.com', 'DRV1003', 'C+E', '2027-06-16', 'in_route', 5),
(4, 'Marcin', 'Wiśniewski', '600000004', 'marcin.wisniewski4@example.com', 'DRV1004', 'C+E', '2027-06-21', 'available', NULL),
(5, 'Tomasz', 'Wójcik', '600000005', 'tomasz.wojcik5@example.com', 'DRV1005', 'C+E', '2027-06-26', 'in_route', 6),
(6, 'Krzysztof', 'Kaczmarek', '600000006', 'krzysztof.kaczmarek6@example.com', 'DRV1006', 'C+E', '2027-07-01', 'in_route', 7),
(7, 'Michał', 'Mazur', '600000007', 'michal.mazur7@example.com', 'DRV1007', 'C+E', '2027-07-06', 'available', NULL),
(8, 'Paweł', 'Krawczyk', '600000008', 'pawel.krawczyk8@example.com', 'DRV1008', 'C+E', '2027-07-11', 'available', NULL),
(9, 'Łukasz', 'Piotrowski', '600000009', 'lukasz.piotrowski9@example.com', 'DRV1009', 'C+E', '2027-07-16', 'available', NULL),
(10, 'Sebastian', 'Grabowski', '600000010', 'sebastian.grabowski10@example.com', 'DRV1010', 'C+E', '2027-07-21', 'available', NULL),
(11, 'Rafał', 'Zieliński', '600000011', 'rafal.zielinski11@example.com', 'DRV1011', 'C+E', '2027-07-26', 'available', NULL),
(12, 'Damian', 'Szymański', '600000012', 'damian.szymanski12@example.com', 'DRV1012', 'C+E', '2027-07-31', 'unavailable', NULL),
(13, 'Karol', 'Woźniak', '600000013', 'karol.wozniak13@example.com', 'DRV1013', 'C+E', '2027-08-05', 'available', NULL),
(14, 'Adrian', 'Lis', '600000014', 'adrian.lis14@example.com', 'DRV1014', 'C+E', '2027-08-10', 'available', NULL),
(15, 'Bartosz', 'Maj', '600000015', 'bartosz.maj15@example.com', 'DRV1015', 'C+E', '2027-08-15', 'available', NULL),
(16, 'Cezary', 'Król', '600000016', 'cezary.krol16@example.com', 'DRV1016', 'C+E', '2027-08-20', 'available', NULL),
(17, 'Daniel', 'Urban', '600000017', 'daniel.urban17@example.com', 'DRV1017', 'C+E', '2027-08-25', 'inactive', NULL),
(18, 'Emil', 'Kurek', '600000018', 'emil.kurek18@example.com', 'DRV1018', 'C+E', '2027-08-30', 'available', NULL),
(19, 'Filip', 'Bąk', '600000019', 'filip.bak19@example.com', 'DRV1019', 'C+E', '2027-09-04', 'available', NULL),
(20, 'Grzegorz', 'Walczak', '600000020', 'grzegorz.walczak20@example.com', 'DRV1020', 'C+E', '2027-09-09', 'available', NULL),
(21, 'Hubert', 'Czarnecki', '600000021', 'hubert.czarnecki21@example.com', 'DRV1021', 'C+E', '2027-09-14', 'available', NULL),
(22, 'Igor', 'Sikora', '600000022', 'igor.sikora22@example.com', 'DRV1022', 'C+E', '2027-09-19', 'available', NULL),
(23, 'Jakub', 'Baran', '600000023', 'jakub.baran23@example.com', 'DRV1023', 'C+E', '2027-09-24', 'available', NULL),
(24, 'Kamil', 'Rybak', '600000024', 'kamil.rybak24@example.com', 'DRV1024', 'C+E', '2027-09-29', 'in_route', NULL),
(25, 'Leon', 'Pawlak', '600000025', 'leon.pawlak25@example.com', 'DRV1025', 'C+E', '2027-10-04', 'available', NULL),
(26, 'Marek', 'Głowacki', '600000026', 'marek.glowacki26@example.com', 'DRV1026', 'C+E', '2027-10-09', 'available', NULL),
(27, 'Nikodem', 'Michalak', '600000027', 'nikodem.michalak27@example.com', 'DRV1027', 'C+E', '2027-10-14', 'available', NULL),
(28, 'Oskar', 'Rutkowski', '600000028', 'oskar.rutkowski28@example.com', 'DRV1028', 'C+E', '2027-10-19', 'available', NULL),
(29, 'Patryk', 'Jaworski', '600000029', 'patryk.jaworski29@example.com', 'DRV1029', 'C+E', '2027-10-24', 'available', NULL),
(30, 'Radosław', 'Adamczyk', '600000030', 'radoslaw.adamczyk30@example.com', 'DRV1030', 'C+E', '2027-10-29', 'unavailable', NULL),
(31, 'Szymon', 'Malinowski', '600000031', 'szymon.malinowski31@example.com', 'DRV1031', 'C+E', '2027-11-03', 'available', NULL),
(32, 'Tadeusz', 'Dudek', '600000032', 'tadeusz.dudek32@example.com', 'DRV1032', 'C+E', '2027-11-08', 'available', NULL),
(33, 'Wiktor', 'Włodarczyk', '600000033', 'wiktor.wlodarczyk33@example.com', 'DRV1033', 'C+E', '2027-11-13', 'available', NULL),
(34, 'Aleksander', 'Kubiak', '600000034', 'aleksander.kubiak34@example.com', 'DRV1034', 'C+E', '2027-11-18', 'available', NULL),
(35, 'Błażej', 'Mróz', '600000035', 'blazej.mroz35@example.com', 'DRV1035', 'C+E', '2027-11-23', 'inactive', NULL),
(36, 'Cyprian', 'Zawadzki', '600000036', 'cyprian.zawadzki36@example.com', 'DRV1036', 'C+E', '2027-11-28', 'available', NULL),
(37, 'Damian', 'Piasecki', '600000037', 'damian.piasecki37@example.com', 'DRV1037', 'C+E', '2027-12-03', 'available', NULL),
(38, 'Edward', 'Kołodziej', '600000038', 'edward.kolodziej38@example.com', 'DRV1038', 'C+E', '2027-12-08', 'available', NULL),
(39, 'Fabian', 'Tomczak', '600000039', 'fabian.tomczak39@example.com', 'DRV1039', 'C+E', '2027-12-13', 'available', NULL),
(40, 'Gabriel', 'Kozłowski', '600000040', 'gabriel.kozlowski40@example.com', 'DRV1040', 'C+E', '2027-12-18', 'available', NULL),
(41, 'Henryk', 'Kania', '600000041', 'henryk.kania41@example.com', 'DRV1041', 'C+E', '2027-12-23', 'available', NULL),
(42, 'Ireneusz', 'Sobczak', '600000042', 'ireneusz.sobczak42@example.com', 'DRV1042', 'C+E', '2027-12-28', 'in_route', NULL),
(43, 'Jerzy', 'Wilk', '600000043', 'jerzy.wilk43@example.com', 'DRV1043', 'C+E', '2028-01-02', 'available', NULL),
(44, 'Konrad', 'Wieczorek', '600000044', 'konrad.wieczorek44@example.com', 'DRV1044', 'C+E', '2028-01-07', 'available', NULL),
(45, 'Łukasz', 'Błaszczyk', '600000045', 'lukasz.blaszczyk45@example.com', 'DRV1045', 'C+E', '2028-01-12', 'available', NULL),
(46, 'Mateusz', 'Bednarek', '600000046', 'mateusz.bednarek46@example.com', 'DRV1046', 'C+E', '2028-01-17', 'available', NULL),
(47, 'Norbert', 'Sadowski', '600000047', 'norbert.sadowski47@example.com', 'DRV1047', 'C+E', '2028-01-22', 'available', NULL),
(48, 'Olaf', 'Pietrzak', '600000048', 'olaf.pietrzak48@example.com', 'DRV1048', 'C+E', '2028-01-27', 'unavailable', NULL),
(49, 'Przemysław', 'Marciniak', '600000049', 'przemyslaw.marciniak49@example.com', 'DRV1049', 'C+E', '2028-02-01', 'available', NULL),
(50, 'Robert', 'Nowicki', '600000050', 'robert.nowicki50@example.com', 'DRV1050', 'C+E', '2028-02-06', 'available', NULL),
(51, 'Sebastian', 'Kaczor', '600000051', 'sebastian.kaczor51@example.com', 'DRV1051', 'C+E', '2028-02-11', 'available', NULL),
(52, 'Tomasz', 'Cieślak', '600000052', 'tomasz.cieslak52@example.com', 'DRV1052', 'C+E', '2028-02-16', 'available', NULL),
(53, 'Wojciech', 'Laskowski', '600000053', 'wojciech.laskowski53@example.com', 'DRV1053', 'C+E', '2028-02-21', 'inactive', NULL),
(54, 'Artur', 'Olszewski', '600000054', 'artur.olszewski54@example.com', 'DRV1054', 'C+E', '2028-02-26', 'available', NULL),
(55, 'Bogdan', 'Jasiński', '600000055', 'bogdan.jasinski55@example.com', 'DRV1055', 'C+E', '2028-03-02', 'available', NULL),
(56, 'Czesław', 'Kowalik', '600000056', 'czeslaw.kowalik56@example.com', 'DRV1056', 'C+E', '2028-03-07', 'available', NULL),
(57, 'Dariusz', 'Kaczmarczyk', '600000057', 'dariusz.kaczmarczyk57@example.com', 'DRV1057', 'C+E', '2028-03-12', 'available', NULL),
(58, 'Eryk', 'Kopeć', '600000058', 'eryk.kopec58@example.com', 'DRV1058', 'C+E', '2028-03-17', 'available', NULL),
(59, 'Franciszek', 'Milewski', '600000059', 'franciszek.milewski59@example.com', 'DRV1059', 'C+E', '2028-03-22', 'available', NULL),
(60, 'Gustaw', 'Wrona', '600000060', 'gustaw.wrona60@example.com', 'DRV1060', 'C+E', '2028-03-27', 'in_route', NULL),
(61, 'Hieronim', 'Sroka', '600000061', 'hieronim.sroka61@example.com', 'DRV1061', 'C+E', '2028-04-01', 'available', NULL),
(62, 'Ignacy', 'Borowski', '600000062', 'ignacy.borowski62@example.com', 'DRV1062', 'C+E', '2028-04-06', 'available', NULL),
(63, 'Julian', 'Kamiński', '600000063', 'julian.kaminski63@example.com', 'DRV1063', 'C+E', '2028-04-11', 'available', NULL);

INSERT INTO vehicles (id, registration_number, brand, model, production_year, vehicle_type, capacity_kg, mileage, status, inspection_valid_until, insurance_valid_until) VALUES
(1, 'RZ1234A', 'Scania', 'R450', 2021, 'truck', 0.00, 180000, 'available', '2027-06-30', '2027-12-31'),
(2, 'RTA60234', 'Volvo', 'FH16', 2016, 'truck', 0.00, 20222, 'available', '2027-10-20', '2027-12-29'),
(3, 'KR5678B', 'Volvo', 'FH500', 2020, 'truck', 0.00, 240000, 'available', '2027-05-15', '2027-11-30'),
(4, 'LU9012C', 'MAN', 'TGX 18.510', 2019, 'truck', 0.00, 320000, 'in_use', '2026-10-20', '2027-04-18'),
(5, 'WA3456D', 'Mercedes-Benz', 'Actros 1845', 2022, 'truck', 0.00, 95000, 'available', '2028-01-10', '2028-06-01'),
(6, 'PO7890E', 'DAF', 'XF 480', 2018, 'truck', 0.00, 410000, 'in_service', '2026-08-14', '2027-02-20'),
(7, 'GD1122F', 'Renault', 'T High 480', 2021, 'truck', 0.00, 150000, 'in_use', '2027-09-01', '2027-12-15'),
(8, 'BI3344G', 'Iveco', 'S-Way 460', 2020, 'truck', 0.00, 230000, 'inactive', '2027-03-25', '2027-10-05'),
(9, 'KRA5566H', 'Scania', 'S500', 2023, 'truck', 0.00, 60000, 'in_use', '2028-07-20', '2028-12-31'),
(10, 'RZE7788I', 'Volvo', 'FH460', 2019, 'truck', 0.00, 295000, 'available', '2027-04-11', '2027-08-19'),
(11, 'RZA5011A', 'Scania', 'R450', 2022, 'truck', 0.00, 127000, 'in_use', '2027-07-07', '2027-12-27'),
(12, 'RZA5012A', 'Volvo', 'FH500', 2023, 'truck', 0.00, 134000, 'available', '2027-07-24', '2028-01-15'),
(13, 'RZA5013A', 'MAN', 'TGX 18.510', 2024, 'truck', 0.00, 141000, 'available', '2027-08-10', '2028-02-03'),
(14, 'RZA5014A', 'Mercedes-Benz', 'Actros 1845', 2018, 'truck', 0.00, 148000, 'in_use', '2027-08-27', '2028-02-22'),
(15, 'RZA5015A', 'DAF', 'XF 530', 2019, 'truck', 0.00, 155000, 'in_service', '2027-09-13', '2028-03-12'),
(16, 'RZA5016A', 'Renault', 'T High 480', 2020, 'truck', 0.00, 162000, 'in_use', '2027-09-30', '2028-03-31'),
(17, 'RZA5017A', 'Iveco', 'S-Way 460', 2021, 'truck', 0.00, 169000, 'inactive', '2027-10-17', '2028-04-19'),
(18, 'RZA5018A', 'Scania', 'S500', 2022, 'truck', 0.00, 176000, 'available', '2027-11-03', '2028-05-08'),
(19, 'RZA5019A', 'Volvo', 'FH460', 2023, 'truck', 0.00, 183000, 'available', '2027-11-20', '2028-05-27'),
(20, 'RZA5020A', 'Mercedes-Benz', 'Actros 1851', 2024, 'truck', 0.00, 190000, 'available', '2027-12-07', '2028-06-15'),
(21, 'RZA5021A', 'Scania', 'R450', 2018, 'truck', 0.00, 197000, 'available', '2027-12-24', '2028-07-04'),
(22, 'RZA5022A', 'Volvo', 'FH500', 2019, 'truck', 0.00, 204000, 'available', '2028-01-10', '2028-07-23'),
(23, 'RZA5023A', 'MAN', 'TGX 18.510', 2020, 'truck', 0.00, 211000, 'available', '2028-01-27', '2028-08-11'),
(24, 'RZA5024A', 'Mercedes-Benz', 'Actros 1845', 2021, 'truck', 0.00, 218000, 'in_use', '2028-02-13', '2028-08-30'),
(25, 'RZA5025A', 'DAF', 'XF 530', 2022, 'truck', 0.00, 225000, 'in_service', '2028-03-01', '2028-09-18'),
(26, 'RZA5026A', 'Renault', 'T High 480', 2023, 'truck', 0.00, 232000, 'available', '2028-03-18', '2028-10-07'),
(27, 'RZA5027A', 'Iveco', 'S-Way 460', 2024, 'truck', 0.00, 239000, 'inactive', '2028-04-04', '2028-10-26'),
(28, 'RZA5028A', 'Scania', 'S500', 2018, 'truck', 0.00, 246000, 'available', '2028-04-21', '2028-11-14'),
(29, 'RZA5029A', 'Volvo', 'FH460', 2019, 'truck', 0.00, 253000, 'available', '2028-05-08', '2028-12-03'),
(30, 'RZA5030A', 'Mercedes-Benz', 'Actros 1851', 2020, 'truck', 0.00, 260000, 'available', '2028-05-25', '2028-12-22'),
(31, 'RZA5031A', 'Scania', 'R450', 2021, 'truck', 0.00, 267000, 'available', '2028-06-11', '2029-01-10'),
(32, 'RZA5032A', 'Volvo', 'FH500', 2022, 'truck', 0.00, 274000, 'available', '2028-06-28', '2029-01-29'),
(33, 'RZA5033A', 'MAN', 'TGX 18.510', 2023, 'truck', 0.00, 281000, 'available', '2028-07-15', '2029-02-17'),
(34, 'RZA5034A', 'Mercedes-Benz', 'Actros 1845', 2024, 'truck', 0.00, 288000, 'in_use', '2028-08-01', '2029-03-08'),
(35, 'RZA5035A', 'DAF', 'XF 530', 2018, 'truck', 0.00, 295000, 'in_service', '2028-08-18', '2029-03-27'),
(36, 'RZA5036A', 'Renault', 'T High 480', 2019, 'truck', 0.00, 302000, 'available', '2028-09-04', '2029-04-15'),
(37, 'RZA5037A', 'Iveco', 'S-Way 460', 2020, 'truck', 0.00, 309000, 'inactive', '2028-09-21', '2029-05-04'),
(38, 'RZA5038A', 'Scania', 'S500', 2021, 'truck', 0.00, 316000, 'available', '2028-10-08', '2029-05-23'),
(39, 'RZA5039A', 'Volvo', 'FH460', 2022, 'truck', 0.00, 323000, 'available', '2028-10-25', '2029-06-11'),
(40, 'RZA5040A', 'Mercedes-Benz', 'Actros 1851', 2023, 'truck', 0.00, 330000, 'available', '2028-11-11', '2029-06-30'),
(41, 'RZA5041A', 'Scania', 'R450', 2024, 'truck', 0.00, 337000, 'available', '2028-11-28', '2029-07-19'),
(42, 'RZA5042A', 'Volvo', 'FH500', 2018, 'truck', 0.00, 344000, 'available', '2028-12-15', '2029-08-07'),
(43, 'RZA5043A', 'MAN', 'TGX 18.510', 2019, 'truck', 0.00, 351000, 'available', '2029-01-01', '2029-08-26'),
(44, 'RZA5044A', 'Mercedes-Benz', 'Actros 1845', 2020, 'truck', 0.00, 358000, 'in_use', '2029-01-18', '2029-09-14'),
(45, 'RZA5045A', 'DAF', 'XF 530', 2021, 'truck', 0.00, 365000, 'in_service', '2029-02-04', '2029-10-03'),
(46, 'RZA5046A', 'Renault', 'T High 480', 2022, 'truck', 0.00, 372000, 'available', '2029-02-21', '2029-10-22'),
(47, 'RZA5047A', 'Iveco', 'S-Way 460', 2023, 'truck', 0.00, 379000, 'inactive', '2029-03-10', '2029-11-10'),
(48, 'RZA5048A', 'Scania', 'S500', 2024, 'truck', 0.00, 386000, 'available', '2029-03-27', '2029-11-29'),
(49, 'RZA5049A', 'Volvo', 'FH460', 2018, 'truck', 0.00, 393000, 'available', '2029-04-13', '2029-12-18'),
(50, 'RZA5050A', 'Mercedes-Benz', 'Actros 1851', 2019, 'truck', 0.00, 400000, 'available', '2029-04-30', '2030-01-06');

INSERT INTO trailers (id, registration_number, trailer_type, capacity_kg, volume_m3, status, inspection_valid_until) VALUES
(1, 'RZT5001T', 'curtain', 28000.00, 90.00, 'available', '2027-02-14'),
(2, 'RZT5002T', 'refrigerated', 24000.00, 82.00, 'in_use', '2027-02-27'),
(3, 'RZT5003T', 'box', 22000.00, 78.00, 'in_use', '2027-03-12'),
(4, 'RZT5004T', 'tanker', 30000.00, 95.00, 'in_use', '2027-03-25'),
(5, 'RZT5005T', 'container', 26000.00, 88.00, 'in_use', '2027-04-07'),
(6, 'RZT5006T', 'dump', 27000.00, 60.00, 'in_use', '2027-04-20'),
(7, 'RZT5007T', 'curtain', 28000.00, 90.00, 'available', '2027-05-03'),
(8, 'RZT5008T', 'refrigerated', 24000.00, 82.00, 'inactive', '2027-05-16'),
(9, 'RZT5009T', 'box', 22000.00, 78.00, 'available', '2027-05-29'),
(10, 'RZT5010T', 'tanker', 30000.00, 95.00, 'available', '2027-06-11'),
(11, 'RZT5011T', 'container', 26000.00, 88.00, 'available', '2027-06-24'),
(12, 'RZT5012T', 'dump', 27000.00, 60.00, 'available', '2027-07-07'),
(13, 'RZT5013T', 'curtain', 28000.00, 90.00, 'available', '2027-07-20'),
(14, 'RZT5014T', 'refrigerated', 24000.00, 82.00, 'available', '2027-08-02'),
(15, 'RZT5015T', 'box', 22000.00, 78.00, 'in_use', '2027-08-15'),
(16, 'RZT5016T', 'tanker', 30000.00, 95.00, 'available', '2027-08-28'),
(17, 'RZT5017T', 'container', 26000.00, 88.00, 'available', '2027-09-10'),
(18, 'RZT5018T', 'dump', 27000.00, 60.00, 'available', '2027-09-23'),
(19, 'RZT5019T', 'curtain', 28000.00, 90.00, 'available', '2027-10-06'),
(20, 'RZT5020T', 'refrigerated', 24000.00, 82.00, 'available', '2027-10-19'),
(21, 'RZT5021T', 'box', 22000.00, 78.00, 'available', '2027-11-01'),
(22, 'RZT5022T', 'tanker', 30000.00, 95.00, 'in_service', '2027-11-14'),
(23, 'RZT5023T', 'container', 26000.00, 88.00, 'available', '2027-11-27'),
(24, 'RZT5024T', 'dump', 27000.00, 60.00, 'available', '2027-12-10'),
(25, 'RZT5025T', 'curtain', 28000.00, 90.00, 'available', '2027-12-23'),
(26, 'RZT5026T', 'refrigerated', 24000.00, 82.00, 'available', '2028-01-05'),
(27, 'RZT5027T', 'box', 22000.00, 78.00, 'available', '2028-01-18'),
(28, 'RZT5028T', 'tanker', 30000.00, 95.00, 'in_use', '2028-01-31'),
(29, 'RZT5029T', 'container', 26000.00, 88.00, 'available', '2028-02-13'),
(30, 'RZT5030T', 'dump', 27000.00, 60.00, 'inactive', '2028-02-26'),
(31, 'RZT5031T', 'curtain', 28000.00, 90.00, 'available', '2028-03-10'),
(32, 'RZT5032T', 'refrigerated', 24000.00, 82.00, 'available', '2028-03-23'),
(33, 'RZT5033T', 'box', 22000.00, 78.00, 'available', '2028-04-05'),
(34, 'RZT5034T', 'tanker', 30000.00, 95.00, 'in_use', '2028-04-18'),
(35, 'RZT5035T', 'container', 26000.00, 88.00, 'available', '2028-05-01'),
(36, 'RZT5036T', 'dump', 27000.00, 60.00, 'in_service', '2028-05-14'),
(37, 'RZT5037T', 'curtain', 28000.00, 90.00, 'available', '2028-05-27'),
(38, 'RZT5038T', 'refrigerated', 24000.00, 82.00, 'available', '2028-06-09'),
(39, 'RZT5039T', 'box', 22000.00, 78.00, 'available', '2028-06-22'),
(40, 'RZT5040T', 'tanker', 30000.00, 95.00, 'available', '2028-07-05'),
(41, 'RZT5041T', 'container', 26000.00, 88.00, 'available', '2028-07-18'),
(42, 'RZT5042T', 'dump', 27000.00, 60.00, 'available', '2028-07-31'),
(43, 'RZT5043T', 'curtain', 28000.00, 90.00, 'available', '2028-08-13'),
(44, 'RZT5044T', 'refrigerated', 24000.00, 82.00, 'available', '2028-08-26'),
(45, 'RZT5045T', 'box', 22000.00, 78.00, 'available', '2028-09-08'),
(46, 'RZT5046T', 'tanker', 30000.00, 95.00, 'available', '2028-09-21'),
(47, 'RZT5047T', 'container', 26000.00, 88.00, 'inactive', '2028-10-04'),
(48, 'RZT5048T', 'dump', 27000.00, 60.00, 'available', '2028-10-17'),
(49, 'RZT5049T', 'curtain', 28000.00, 90.00, 'available', '2028-10-30'),
(50, 'RZT5050T', 'refrigerated', 24000.00, 82.00, 'available', '2028-11-12');

INSERT INTO permissions (id, code, name, category) VALUES
(1, 'C_E', 'Prawo jazdy C+E', 'license'),
(2, 'ADR', 'ADR', 'certificate'),
(3, 'REFRIGERATED', 'Obsługa chłodni', 'specialization'),
(4, 'TANKER', 'Obsługa cystern', 'specialization'),
(5, 'CONTAINER', 'Obsługa kontenerów', 'specialization'),
(6, 'DUMP', 'Obsługa wywrotek', 'specialization'),
(7, 'CURTAIN', 'Obsługa naczep typu firanka', 'specialization'),
(8, 'BOX', 'Obsługa naczep typu box', 'specialization');

INSERT INTO driver_permissions (id, driver_id, permission_id) VALUES
(1, 1, 1),
(2, 1, 3),
(3, 2, 1),
(4, 2, 5),
(5, 3, 1),
(6, 3, 6),
(7, 4, 1),
(8, 4, 7),
(9, 4, 3),
(10, 5, 8),
(11, 5, 1),
(12, 6, 1),
(13, 6, 4),
(14, 6, 2),
(15, 7, 1),
(16, 7, 7),
(17, 8, 1),
(18, 8, 8),
(19, 9, 1),
(20, 9, 3),
(21, 10, 1),
(22, 10, 4),
(23, 10, 2),
(24, 11, 1),
(25, 11, 5),
(26, 12, 1),
(27, 12, 6),
(28, 13, 1),
(29, 13, 7),
(30, 14, 1),
(31, 14, 8),
(32, 15, 1),
(33, 15, 3),
(34, 16, 1),
(35, 16, 4),
(36, 16, 2),
(37, 17, 1),
(38, 17, 5),
(39, 18, 1),
(40, 18, 6),
(41, 19, 1),
(42, 19, 7),
(43, 20, 1),
(44, 20, 8),
(45, 21, 1),
(46, 21, 3),
(47, 22, 1),
(48, 22, 4),
(49, 22, 2),
(50, 23, 1),
(51, 23, 5),
(52, 24, 1),
(53, 24, 6),
(54, 25, 1),
(55, 25, 7),
(56, 26, 1),
(57, 26, 8),
(58, 27, 1),
(59, 27, 3),
(60, 28, 1),
(61, 28, 4),
(62, 28, 2),
(63, 29, 1),
(64, 29, 5),
(65, 30, 1),
(66, 30, 6),
(67, 31, 1),
(68, 31, 7),
(69, 32, 1),
(70, 32, 8),
(71, 33, 1),
(72, 33, 3),
(73, 34, 1),
(74, 34, 4),
(75, 34, 2),
(76, 35, 1),
(77, 35, 5),
(78, 36, 1),
(79, 36, 6),
(80, 37, 1),
(81, 37, 7),
(82, 38, 1),
(83, 38, 8),
(84, 39, 1),
(85, 39, 3),
(86, 40, 1),
(87, 40, 4),
(88, 40, 2),
(89, 41, 1),
(90, 41, 5),
(91, 42, 1),
(92, 42, 6),
(93, 43, 1),
(94, 43, 7),
(95, 44, 1),
(96, 44, 8),
(97, 45, 1),
(98, 45, 3),
(99, 46, 1),
(100, 46, 4),
(101, 46, 2),
(102, 47, 1),
(103, 47, 5),
(104, 48, 1),
(105, 48, 6),
(106, 49, 1),
(107, 49, 7),
(108, 50, 1),
(109, 50, 8),
(110, 51, 1),
(111, 51, 3),
(112, 52, 1),
(113, 52, 4),
(114, 52, 2),
(115, 53, 1),
(116, 53, 5),
(117, 54, 1),
(118, 54, 6),
(119, 55, 1),
(120, 55, 7),
(121, 56, 1),
(122, 56, 8),
(123, 57, 1),
(124, 57, 3),
(125, 58, 1),
(126, 58, 4),
(127, 58, 2),
(128, 59, 1),
(129, 59, 5),
(130, 60, 1),
(131, 60, 6),
(132, 61, 1),
(133, 61, 7),
(134, 62, 1),
(135, 62, 8),
(136, 63, 1),
(137, 63, 3);

INSERT INTO transport_orders (id, order_number, client_name, pickup_location, delivery_location, cargo_weight_kg, cargo_type, cargo_name, planned_distance_km, planned_duration_minutes, estimated_cost, planned_date, status, driver_id, vehicle_id, trailer_id, created_by_user_id) VALUES
(1, 'ZT-2026-001', 'Fresh Fruit Sp. z o.o.', 'Sandomierz', 'Warszawa', 18000.00, 'food', 'jabłka', 220.00, 1440, 2600.00, '2026-05-30', 'planned', 1, 7, 2, 1),
(2, 'ZT-2026-002', 'Container Partner', 'Gdynia', 'Łódź', 20000.00, 'containerized', 'kontener 40HC', 360.00, 1440, 3200.00, '2026-05-31', 'planned', 2, 9, 5, 1),
(3, 'ZT-2026-003', 'Build Stone', 'Kielce', 'Katowice', 24000.00, 'aggregate', 'kruszywo', 190.00, 1440, 2100.00, '2026-06-01', 'planned', 3, 11, 6, 2),
(4, 'ZT-2026-004', 'Electro-Hurt', 'Rzeszów', 'Poznań', 12000.00, 'electronics', 'laptopy', 510.00, 2880, 3900.00, '2026-06-02', 'in_progress', 5, 14, 3, 2),
(5, 'ZT-2026-005', 'Fuel-Trans', 'Płock', 'Rzeszów', 22000.00, 'fuel', 'olej napędowy', 410.00, 2880, 4700.00, '2026-06-03', 'in_progress', 6, 16, 4, 1),
(6, 'ZT-2026-006', 'Retail Polska', 'Wrocław', 'Białystok', 15000.00, 'general', 'towar mieszany', 560.00, 2880, 3800.00, '2026-06-04', 'new', 13, 18, 7, 1),
(7, 'ZT-2026-007', 'Parcel Group', 'Łódź', 'Lublin', 9000.00, 'parcel', 'przesyłki kurierskie', 290.00, 1440, 1800.00, '2026-06-05', 'completed', 8, 19, 9, 2),
(8, 'ZT-2026-008', 'Frozen Cargo', 'Lublin', 'Gdańsk', 14000.00, 'frozen', 'mrożonki', 540.00, 2880, 4100.00, '2026-06-06', 'cancelled', 9, 20, 8, 1),
(9, 'ZT-2026-009', 'Steel Logistic', 'Opole', 'Rzeszów', 17000.00, 'general', 'profile stalowe', 350.00, 1440, 2500.00, '2026-06-07', 'new', 19, 21, 13, 2),
(10, 'ZT-2026-010', 'Med Pharma', 'Warszawa', 'Szczecin', 11000.00, 'pharma', 'leki', 610.00, 2880, 4700.00, '2026-06-08', 'new', 15, 22, 15, 1);

INSERT INTO service_records (id, vehicle_id, service_type, description, service_date, cost, status) VALUES
(1, 7, 'inspection', 'Przegląd okresowy ciągnika siodłowego', '2026-03-15', 1200.00, 'completed'),
(2, 9, 'oil_change', 'Wymiana oleju i filtrów', '2026-04-12', 850.00, 'completed'),
(3, 11, 'tires', 'Wymiana kompletu opon', '2026-02-20', 5600.00, 'completed'),
(4, 14, 'brakes', 'Serwis układu hamulcowego', '2026-01-18', 2300.00, 'completed'),
(5, 16, 'diagnostics', 'Diagnostyka komputerowa', '2026-05-05', 450.00, 'planned');

SELECT setval(pg_get_serial_sequence('roles', 'id'), COALESCE((SELECT MAX(id) FROM roles), 1), true);

SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1), true);

SELECT setval(pg_get_serial_sequence('drivers', 'id'), COALESCE((SELECT MAX(id) FROM drivers), 1), true);

SELECT setval(pg_get_serial_sequence('vehicles', 'id'), COALESCE((SELECT MAX(id) FROM vehicles), 1), true);

SELECT setval(pg_get_serial_sequence('trailers', 'id'), COALESCE((SELECT MAX(id) FROM trailers), 1), true);

SELECT setval(pg_get_serial_sequence('permissions', 'id'), COALESCE((SELECT MAX(id) FROM permissions), 1), true);

SELECT setval(pg_get_serial_sequence('transport_orders', 'id'), COALESCE((SELECT MAX(id) FROM transport_orders), 1), true);

SELECT setval(pg_get_serial_sequence('service_records', 'id'), COALESCE((SELECT MAX(id) FROM service_records), 1), true);

SELECT setval(pg_get_serial_sequence('driver_permissions', 'id'), COALESCE((SELECT MAX(id) FROM driver_permissions), 1), true);