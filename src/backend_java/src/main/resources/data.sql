-- users
INSERT INTO users (id, username, phone, hashed_password, fcm_token, role, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'customer1', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'customer2', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'customer3', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('44444444-4444-4444-4444-444444444444', 'customer4', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('55555555-5555-5555-5555-555555555555', 'customer5', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('66666666-6666-6666-6666-666666666666', 'customer6', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('77777777-7777-7777-7777-777777777777', 'customer7', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('88888888-8888-8888-8888-888888888888', 'customer8', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('99999999-9999-9999-9999-999999999999', 'customer9', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'customer10', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now());

INSERT INTO users (id, username, phone, hashed_password, fcm_token, role, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'manager', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'MANAGER', now(), now());

INSERT INTO users (id, username, phone, hashed_password, fcm_token, role, created_at, updated_at)
VALUES
  ('d1111111-1111-1111-1111-111111111111', 'driver1', '+849011100001', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d2222222-2222-2222-2222-222222222222', 'driver2', '+849011100002', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d3333333-3333-3333-3333-333333333333', 'driver3', '+849011100003', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d4444444-4444-4444-4444-444444444444', 'driver4', '+849011100004', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d5555555-5555-5555-5555-555555555555', 'driver5', '+849011100005', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d6666666-6666-6666-6666-666666666666', 'driver6', '+849011100006', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d7777777-7777-7777-7777-777777777777', 'driver7', '+849011100007', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d8888888-8888-8888-8888-888888888888', 'driver8', '+849011100008', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d9999999-9999-9999-9999-999999999999', 'driver9', '+849011100009', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('daaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'driver10', '+849011100010', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now());

-- depots
INSERT INTO depots (id, latitude, longitude, address, created_at, updated_at)
VALUES
  ('depothk1-0000-0000-0000-000000000001', 21.0285, 105.8542, 'Hoan Kiem, Hanoi', now(), now()),
  ('depothk2-0000-0000-0000-000000000002', 21.0381, 105.7821, 'Cau Giay, Hanoi', now(), now()),
  ('depothk3-0000-0000-0000-000000000003', 21.0039, 105.8209, 'Dong Da, Hanoi', now(), now()),
  ('depothk4-0000-0000-0000-000000000004', 21.0535, 105.9229, 'Long Bien, Hanoi', now(), now()),
  ('depothk5-0000-0000-0000-000000000005', 21.1166, 105.8601, 'Soc Son, Hanoi', now(), now()),
  ('depothk6-0000-0000-0000-000000000006', 20.9980, 105.7938, 'Thanh Xuan, Hanoi', now(), now()),
  ('depothk7-0000-0000-0000-000000000007', 21.0532, 105.7383, 'Nam Tu Liem, Hanoi', now(), now()),
  ('depothk8-0000-0000-0000-000000000008', 20.9856, 105.8752, 'Hoang Mai, Hanoi', now(), now()),
  ('depothk9-0000-0000-0000-000000000009', 21.0151, 105.8499, 'Ba Dinh, Hanoi', now(), now()),
  ('depothk10-0000-0000-0000-000000000010', 21.0830, 105.7005, 'Quoc Oai, Hanoi', now(), now());

-- orders
INSERT INTO orders (
  id, user_id, route_id, latitude, longitude, address, weight, status,
  completed_at, created_at, updated_at, image_url, description, category, index
) VALUES
-- customer1
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000001', '11111111-1111-1111-1111-111111111111', NULL, 21.0290, 105.8600, 'Trang Tien, Hanoi', 2.5, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Kitchen waste', 'ORGANIC', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000002', '11111111-1111-1111-1111-111111111111', NULL, 21.0301, 105.8611, 'Ly Thai To, Hanoi', 1.8, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Cardboard boxes', 'RECYCLABLE', NULL),

-- customer2
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000003', '22222222-2222-2222-2222-222222222222', NULL, 21.0400, 105.7900, 'Nghia Tan, Hanoi', 3.0, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Plastic bottles', 'RECYCLABLE', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000004', '22222222-2222-2222-2222-222222222222', NULL, 21.0411, 105.7911, 'Mai Dich, Hanoi', 4.1, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Broken glass', 'GENERAL', NULL),

-- customer3
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000005', '33333333-3333-3333-3333-333333333333', NULL, 21.0070, 105.8250, 'Kham Thien, Hanoi', 5.2, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Expired meds', 'HAZARDOUS', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000006', '33333333-3333-3333-3333-333333333333', NULL, 21.0061, 105.8261, 'Ton Duc Thang, Hanoi', 1.9, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'E-waste', 'ELECTRONIC', NULL),

-- customer4
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000007', '44444444-4444-4444-4444-444444444444', NULL, 21.0560, 105.9300, 'Ngoc Lam, Hanoi', 3.6, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Leaves and food scraps', 'ORGANIC', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000008', '44444444-4444-4444-4444-444444444444', NULL, 21.0571, 105.9311, 'Bo De, Hanoi', 2.7, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Used oil', 'HAZARDOUS', NULL),

-- customer5
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000009', '55555555-5555-5555-5555-555555555555', NULL, 21.1200, 105.8700, 'Minh Phu, Hanoi', 6.0, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Old phone', 'ELECTRONIC', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000010', '55555555-5555-5555-5555-555555555555', NULL, 21.1211, 105.8711, 'Phu Lo, Hanoi', 2.2, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Paper waste', 'RECYCLABLE', NULL),

-- customer6
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000011', '66666666-6666-6666-6666-666666666666', NULL, 21.0001, 105.8000, 'Khuat Duy Tien, Hanoi', 1.5, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Batteries', 'HAZARDOUS', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000012', '66666666-6666-6666-6666-666666666666', NULL, 21.0011, 105.8011, 'Le Van Luong, Hanoi', 4.4, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Food waste', 'ORGANIC', NULL),

-- customer7
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000013', '77777777-7777-7777-7777-777777777777', NULL, 21.0560, 105.7450, 'My Dinh, Hanoi', 3.3, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Laptop', 'ELECTRONIC', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000014', '77777777-7777-7777-7777-777777777777', NULL, 21.0571, 105.7461, 'Pham Hung, Hanoi', 2.0, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Textbooks', 'RECYCLABLE', NULL),

-- customer8
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000015', '88888888-8888-8888-8888-888888888888', NULL, 20.9870, 105.8800, 'Linh Nam, Hanoi', 3.7, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Kitchen trash', 'GENERAL', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000016', '88888888-8888-8888-8888-888888888888', NULL, 20.9881, 105.8811, 'Vinh Hung, Hanoi', 1.1, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Fruit peels', 'ORGANIC', NULL),

-- customer9
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000017', '99999999-9999-9999-9999-999999999999', NULL, 21.0170, 105.8550, 'Giang Vo, Hanoi', 5.6, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Old newspaper', 'RECYCLABLE', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000018', '99999999-9999-9999-9999-999999999999', NULL, 21.0181, 105.8561, 'Lang Ha, Hanoi', 1.0, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Leftovers', 'ORGANIC', NULL),

-- customer10
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000019', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 21.0850, 105.7100, 'Dong Quang, Hanoi', 2.8, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Light bulbs', 'HAZARDOUS', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000020', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 21.0861, 105.7111, 'Ngoc My, Hanoi', 3.1, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Mixed garbage', 'GENERAL', NULL);


-- vehicles
INSERT INTO vehicles (id, driver_id, depot_id, license_plate, capacity, current_latitude, current_longitude, current_load, status, created_at, updated_at, type, category)
VALUES
(gen_random_uuid(), 'd1111111-1111-1111-1111-111111111111', 'depothk1-0000-0000-0000-000000000001', '29A-11111', 300.0, 21.0285, 105.8542, 0, 'IDLE', now(), now(), 'THREE_WHEELER', 'ORGANIC'),
(gen_random_uuid(), 'd2222222-2222-2222-2222-222222222222', 'depothk2-0000-0000-0000-000000000002', '29A-22222', 1000.0, 21.0381, 105.7821, 0, 'IDLE', now(), now(), 'COMPACTOR_TRUCK', 'RECYCLABLE'),
(gen_random_uuid(), 'd3333333-3333-3333-3333-333333333333', 'depothk3-0000-0000-0000-000000000003', '29A-33333', 300.0, 21.0039, 105.8209, 0, 'IDLE', now(), now(), 'THREE_WHEELER', 'GENERAL'),
(gen_random_uuid(), 'd4444444-4444-4444-4444-444444444444', 'depothk4-0000-0000-0000-000000000004', '29A-44444', 1000.0, 21.0535, 105.9229, 0, 'IDLE', now(), now(), 'COMPACTOR_TRUCK', 'HAZARDOUS'),
(gen_random_uuid(), 'd5555555-5555-5555-5555-555555555555', 'depothk5-0000-0000-0000-000000000005', '29A-55555', 300.0, 21.1166, 105.8601, 0, 'IDLE', now(), now(), 'THREE_WHEELER', 'ELECTRONIC'),
(gen_random_uuid(), 'd6666666-6666-6666-6666-666666666666', 'depothk6-0000-0000-0000-000000000006', '29A-66666', 1000.0, 20.9980, 105.7938, 0, 'IDLE', now(), now(), 'COMPACTOR_TRUCK', 'ORGANIC'),
(gen_random_uuid(), 'd7777777-7777-7777-7777-777777777777', 'depothk7-0000-0000-0000-000000000007', '29A-77777', 300.0, 21.0532, 105.7383, 0, 'IDLE', now(), now(), 'THREE_WHEELER', 'RECYCLABLE'),
(gen_random_uuid(), 'd8888888-8888-8888-8888-888888888888', 'depothk8-0000-0000-0000-000000000008', '29A-88888', 1000.0, 20.9856, 105.8752, 0, 'IDLE', now(), now(), 'COMPACTOR_TRUCK', 'GENERAL'),
(gen_random_uuid(), 'd9999999-9999-9999-9999-999999999999', 'depothk9-0000-0000-0000-000000000009', '29A-99999', 300.0, 21.0151, 105.8499, 0, 'IDLE', now(), now(), 'THREE_WHEELER', 'HAZARDOUS'),
(gen_random_uuid(), 'daaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'depothk10-0000-0000-0000-000000000010', '29A-00000', 1000.0, 21.0830, 105.7005, 0, 'IDLE', now(), now(), 'COMPACTOR_TRUCK', 'ELECTRONIC');

