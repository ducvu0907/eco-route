-- users
INSERT INTO users (id, username, phone, hashed_password, fcm_token, role, created_at, updated_at) VALUES
  ('c1', 'customer1', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('c2', 'customer2', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('c3', 'customer3', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('c4', 'customer4', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('c5', 'customer5', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('c6', 'customer6', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('c7', 'customer7', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('c8', 'customer8', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('c9', 'customer9', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now()),
  ('c10', 'customer10', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'CUSTOMER', now(), now());

INSERT INTO users (id, username, phone, hashed_password, fcm_token, role, created_at, updated_at) VALUES
  ('m1', 'manager1', '+8490'||floor(random()*8999999+1000000)::text, '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'MANAGER', now(), now());

INSERT INTO users (id, username, phone, hashed_password, fcm_token, role, created_at, updated_at) VALUES
  ('d1', 'driver1', '+849011100001', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d2', 'driver2', '+849011100002', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d3', 'driver3', '+849011100003', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d4', 'driver4', '+849011100004', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d5', 'driver5', '+849011100005', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d6', 'driver6', '+849011100006', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d7', 'driver7', '+849011100007', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d8', 'driver8', '+849011100008', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d9', 'driver9', '+849011100009', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now()),
  ('d10', 'driver10', '+849011100010', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', NULL, 'DRIVER', now(), now());

-- depots
INSERT INTO depots (id, latitude, longitude, address, created_at, updated_at) VALUES
  ('d1', 21.0285, 105.8542, 'Hoan Kiem, Hanoi', now(), now()),
  ('d2', 21.0381, 105.7821, 'Cau Giay, Hanoi', now(), now()),
  ('d3', 21.0039, 105.8209, 'Dong Da, Hanoi', now(), now()),
  ('d4', 21.0535, 105.9229, 'Long Bien, Hanoi', now(), now()),
  ('d5', 21.1166, 105.8601, 'Soc Son, Hanoi', now(), now());

-- orders
INSERT INTO orders (id, user_id, route_id, latitude, longitude, address, weight, status, completed_at, created_at, updated_at, image_url, description, category, index) VALUES
-- customer1
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000001', 'c1', NULL, 21.0290, 105.8600, 'Trang Tien, Hanoi', 2.5, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Kitchen waste', 'GENERAL', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000002', 'c1', NULL, 21.0301, 105.8611, 'Ly Thai To, Hanoi', 1.8, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Cardboard boxes', 'GENERAL', NULL),

-- customer2
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000003', 'c2', NULL, 21.0400, 105.7900, 'Nghia Tan, Hanoi', 3.0, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Plastic bottles', 'GENERAL', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000004', 'c2', NULL, 21.0411, 105.7911, 'Mai Dich, Hanoi', 4.1, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Broken glass', 'GENERAL', NULL),

-- customer3
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000005', 'c3', NULL, 21.0070, 105.8250, 'Kham Thien, Hanoi', 5.2, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Expired meds', 'GENERAL', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000006', 'c3', NULL, 21.0061, 105.8261, 'Ton Duc Thang, Hanoi', 1.9, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'E-waste', 'GENERAL', NULL),

-- customer4
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000007', 'c4', NULL, 21.0560, 105.9300, 'Ngoc Lam, Hanoi', 3.6, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Leaves and food scraps', 'GENERAL', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000008', 'c4', NULL, 21.0571, 105.9311, 'Bo De, Hanoi', 2.7, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Used oil', 'GENERAL', NULL),

-- customer5
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000009', 'c5', NULL, 21.1200, 105.8700, 'Minh Phu, Hanoi', 6.0, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Old phone', 'GENERAL', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000010', 'c5', NULL, 21.1211, 105.8711, 'Phu Lo, Hanoi', 2.2, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Paper waste', 'GENERAL', NULL),

-- customer6
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000011', 'c6', NULL, 21.0001, 105.8000, 'Khuat Duy Tien, Hanoi', 1.5, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Batteries', 'GENERAL', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000012', 'c6', NULL, 21.0011, 105.8011, 'Le Van Luong, Hanoi', 4.4, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Food waste', 'GENERAL', NULL),

-- customer7
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000013', 'c7', NULL, 21.0560, 105.7450, 'My Dinh, Hanoi', 3.3, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Laptop', 'GENERAL', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000014', 'c7', NULL, 21.0571, 105.7461, 'Pham Hung, Hanoi', 2.0, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Textbooks', 'GENERAL', NULL),

-- customer8
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000015', 'c8', NULL, 20.9870, 105.8800, 'Linh Nam, Hanoi', 3.7, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Kitchen trash', 'GENERAL', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000016', 'c8', NULL, 20.9881, 105.8811, 'Vinh Hung, Hanoi', 1.1, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Fruit peels', 'GENERAL', NULL),

-- customer9
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000017', 'c9', NULL, 21.0170, 105.8550, 'Giang Vo, Hanoi', 5.6, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Old newspaper', 'GENERAL', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000018', 'c9', NULL, 21.0181, 105.8561, 'Lang Ha, Hanoi', 1.0, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Leftovers', 'GENERAL', NULL),

-- customer10
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000019', 'c10', NULL, 21.0850, 105.7100, 'Dong Quang, Hanoi', 2.8, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Light bulbs', 'GENERAL', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000020', 'c10', NULL, 21.0861, 105.7111, 'Ngoc My, Hanoi', 3.1, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Mixed garbage', 'GENERAL', NULL);


-- vehicles
INSERT INTO vehicles (id, driver_id, depot_id, license_plate, capacity, current_latitude, current_longitude, current_load, status, created_at, updated_at, type, category) VALUES
('11111111-1111-1111-1111-111111111111', 'd1', 'd1', '29A-11111', 300.0, 21.0285, 105.8542, 0, 'IDLE', now(), now(), 'THREE_WHEELER', 'GENERAL'),
('22222222-2222-2222-2222-222222222222', 'd2', 'd2', '29A-22222', 1000.0, 21.0381, 105.7821, 0, 'IDLE', now(), now(), 'COMPACTOR_TRUCK', 'GENERAL'),
('33333333-3333-3333-3333-333333333333', 'd3', 'd3', '29A-33333', 300.0, 21.0039, 105.8209, 0, 'IDLE', now(), now(), 'THREE_WHEELER', 'GENERAL'),
('44444444-4444-4444-4444-444444444444', 'd4', 'd1', '29A-44444', 1000.0, 21.0285, 105.8542, 0, 'IDLE', now(), now(), 'COMPACTOR_TRUCK', 'GENERAL'),
('55555555-5555-5555-5555-555555555555', 'd5', 'd2', '29A-55555', 300.0, 21.0381, 105.7821, 0, 'IDLE', now(), now(), 'THREE_WHEELER', 'GENERAL'),
('66666666-6666-6666-6666-666666666666', 'd6', 'd3', '29A-66666', 1000.0, 20.0039, 105.8209, 0, 'IDLE', now(), now(), 'COMPACTOR_TRUCK', 'ORGANIC'),
('77777777-7777-7777-7777-777777777777', 'd7', 'd1', '29A-77777', 300.0, 21.0285, 105.8542, 0, 'IDLE', now(), now(), 'THREE_WHEELER', 'ORGANIC'),
('88888888-8888-8888-8888-888888888888', 'd8', 'd2', '29A-88888', 1000.0, 20.0381, 105.7821, 0, 'IDLE', now(), now(), 'COMPACTOR_TRUCK', 'ORGANIC'),
('99999999-9999-9999-9999-999999999999', 'd9', 'd3', '29A-99999', 300.0, 21.0039, 105.8209, 0, 'IDLE', now(), now(), 'THREE_WHEELER', 'ORGANIC'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd10', 'd1', '29A-00000', 1000.0, 21.0285, 105.8542, 0, 'IDLE', now(), now(), 'COMPACTOR_TRUCK', 'ORGANIC');

-- 10 more orders with category ORGANIC, further from previous locations
INSERT INTO orders (id, user_id, route_id, latitude, longitude, address, weight, status, completed_at, created_at, updated_at, image_url, description, category, index) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000031', 'c1', NULL, 21.0725, 105.8105, 'Xuan La, Tay Ho, Hanoi', 0.9, 'REASSIGNED', NULL, now(), now(), 'https://placehold.co/400x300', 'Used cooking oil (small container)', 'ORGANIC', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000032', 'c2', NULL, 21.0335, 105.8165, 'Doi Can, Ba Dinh, Hanoi', 1.4, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Expired food products (non-liquid)', 'ORGANIC', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000033', 'c3', NULL, 20.9995, 105.8505, 'Bach Mai, Hai Ba Trung, Hanoi', 1.8, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Compostable packaging', 'ORGANIC', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000034', 'c4', NULL, 20.9955, 105.7955, 'Nguyen Tuan, Thanh Xuan, Hanoi', 0.6, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Leftover fruits', 'ORGANIC', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000035', 'c5', NULL, 20.9755, 105.8555, 'Tam Trinh, Hoang Mai, Hanoi', 2.1, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Yard waste', 'ORGANIC', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000036', 'c6', NULL, 21.0205, 105.7555, 'Chau Van Liem, Nam Tu Liem, Hanoi', 1.0, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Stale pastries', 'ORGANIC', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000037', 'c7', NULL, 20.9705, 105.7805, 'To Hieu, Ha Dong, Hanoi', 1.5, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Vegetable scraps', 'ORGANIC', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000038', 'c8', NULL, 21.0505, 105.9105, 'Viet Hung, Long Bien, Hanoi', 0.7, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Pet food waste', 'ORGANIC', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000039', 'c9', NULL, 21.1105, 105.8005, 'Hai Boi, Dong Anh, Hanoi', 1.2, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Dairy waste', 'ORGANIC', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaa000040', 'c10', NULL, 21.0500, 105.6800, 'Son Dong, Hoai Duc, Hanoi', 1.9, 'PENDING', NULL, now(), now(), 'https://placehold.co/400x300', 'Spoiled produce', 'ORGANIC', NULL);

