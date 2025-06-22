-- Insert mock data

-- Users (Customers, Drivers, Manager)
INSERT INTO Users (id, username, phone, hashed_password, fcm_token, role, created_at, updated_at) VALUES
('user_cust_1', 'customer_one', '0901234561', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_cust_1', 'CUSTOMER', NOW(), NOW()),
('user_cust_2', 'customer_two', '0901234562', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_cust_2', 'CUSTOMER', NOW(), NOW()),
('user_cust_3', 'customer_three', '0901234563', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_cust_3', 'CUSTOMER', NOW(), NOW()),
('user_cust_4', 'customer_four', '0901234564', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_cust_4', 'CUSTOMER', NOW(), NOW()),
('user_cust_5', 'customer_five', '0901234565', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_cust_5', 'CUSTOMER', NOW(), NOW()),
('user_driver_1', 'driver_one', '0902000001', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d1', 'DRIVER', NOW(), NOW()),
('user_driver_2', 'driver_two', '0902000002', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d2', 'DRIVER', NOW(), NOW()),
('user_driver_3', 'driver_three', '0902000003', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d3', 'DRIVER', NOW(), NOW()),
('user_driver_4', 'driver_four', '0902000004', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d4', 'DRIVER', NOW(), NOW()),
('user_driver_5', 'driver_five', '0902000005', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d5', 'DRIVER', NOW(), NOW()),
('user_driver_6', 'driver_six', '0902000006', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d6', 'DRIVER', NOW(), NOW()),
('user_driver_7', 'driver_seven', '0902000007', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d7', 'DRIVER', NOW(), NOW()),
('user_driver_8', 'driver_eight', '0902000008', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d8', 'DRIVER', NOW(), NOW()),
('user_driver_9', 'driver_nine', '0902000009', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d9', 'DRIVER', NOW(), NOW()),
('user_driver_10', 'driver_ten', '0902000010', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d10', 'DRIVER', NOW(), NOW()),
('user_driver_11', 'driver_eleven', '0902000011', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d11', 'DRIVER', NOW(), NOW()),
('user_driver_12', 'driver_twelve', '0902000012', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d12', 'DRIVER', NOW(), NOW()),
('user_driver_13', 'driver_thirteen', '0902000013', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d13', 'DRIVER', NOW(), NOW()),
('user_driver_14', 'driver_fourteen', '0902000014', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d14', 'DRIVER', NOW(), NOW()),
('user_driver_15', 'driver_fifteen', '0902000015', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d15', 'DRIVER', NOW(), NOW()),
('user_driver_16', 'driver_sixteen', '0902000016', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d16', 'DRIVER', NOW(), NOW()),
('user_driver_17', 'driver_seventeen', '0902000017', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d17', 'DRIVER', NOW(), NOW()),
('user_driver_18', 'driver_eighteen', '0902000018', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d18', 'DRIVER', NOW(), NOW()),
('user_driver_19', 'driver_nineteen', '0902000019', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d19', 'DRIVER', NOW(), NOW()),
('user_driver_20', 'driver_twenty', '0902000020', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_d20', 'DRIVER', NOW(), NOW()),
('user_manager_1', 'manager_one', '0903000001', '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me', 'fcm_token_m1', 'MANAGER', NOW(), NOW());

-- Depots
INSERT INTO Depots (id, latitude, longitude, category, address, created_at, updated_at) VALUES
('depot_1', 10.7769, 106.6978, 'GENERAL', '123 General St, District 1, HCMC', NOW(), NOW()),
('depot_2', 10.7818, 106.7001, 'ORGANIC', '456 Organic Ave, District 1, HCMC', NOW(), NOW()),
('depot_3', 10.7628, 106.6826, 'RECYCLABLE', '789 Recyclable Ln, District 3, HCMC', NOW(), NOW()),
('depot_4', 10.7997, 106.6775, 'HAZARDOUS', '101 Hazardous Blvd, Tan Binh District, HCMC', NOW(), NOW()),
('depot_5', 10.8231, 106.6297, 'ELECTRONIC', '202 Electronic Rd, Tan Phu District, HCMC', NOW(), NOW()),
('depot_6', 10.7588, 106.6669, 'GENERAL', '303 General Way, District 5, HCMC', NOW(), NOW()),
('depot_7', 10.7306, 106.7077, 'ORGANIC', '404 Organic Pl, District 7, HCMC', NOW(), NOW()),
('depot_8', 10.8037, 106.7118, 'RECYCLABLE', '505 Recyclable Ct, Binh Thanh District, HCMC', NOW(), NOW()),
('depot_9', 10.8113, 106.6067, 'HAZARDOUS', '606 Hazardous Sq, Binh Tan District, HCMC', NOW(), NOW()),
('depot_10', 10.7188, 106.6033, 'ELECTRONIC', '707 Electronic Cir, District 8, HCMC', NOW(), NOW());

-- Vehicles (each belonging to one driver, category matches depot)
INSERT INTO Vehicles (id, driver_id, depot_id, license_plate, current_latitude, current_longitude, current_load, capacity, type, category, status, created_at, updated_at) VALUES
('vehicle_1', 'user_driver_1', 'depot_1', '51A-123.45', 10.7769, 106.6978, 0, 5000, 'COMPACTOR_TRUCK', 'GENERAL', 'IDLE', NOW(), NOW()),
('vehicle_2', 'user_driver_2', 'depot_1', '51B-234.56', 10.7769, 106.6978, 0, 4500, 'COMPACTOR_TRUCK', 'GENERAL', 'IDLE', NOW(), NOW()),
('vehicle_3', 'user_driver_3', 'depot_2', '51C-345.67', 10.7818, 106.7001, 0, 3000, 'THREE_WHEELER', 'ORGANIC', 'IDLE', NOW(), NOW()),
('vehicle_4', 'user_driver_4', 'depot_2', '51D-456.78', 10.7818, 106.7001, 0, 2500, 'THREE_WHEELER', 'ORGANIC', 'IDLE', NOW(), NOW()),
('vehicle_5', 'user_driver_5', 'depot_3', '51E-567.89', 10.7628, 106.6826, 0, 6000, 'COMPACTOR_TRUCK', 'RECYCLABLE', 'IDLE', NOW(), NOW()),
('vehicle_6', 'user_driver_6', 'depot_3', '51F-678.90', 10.7628, 106.6826, 0, 5500, 'COMPACTOR_TRUCK', 'RECYCLABLE', 'IDLE', NOW(), NOW()),
('vehicle_7', 'user_driver_7', 'depot_4', '51G-789.01', 10.7997, 106.6775, 0, 1000, 'THREE_WHEELER', 'HAZARDOUS', 'IDLE', NOW(), NOW()),
('vehicle_8', 'user_driver_8', 'depot_4', '51H-890.12', 10.7997, 106.6775, 0, 900, 'THREE_WHEELER', 'HAZARDOUS', 'IDLE', NOW(), NOW()),
('vehicle_9', 'user_driver_9', 'depot_5', '51I-901.23', 10.8231, 106.6297, 0, 1500, 'THREE_WHEELER', 'ELECTRONIC', 'IDLE', NOW(), NOW()),
('vehicle_10', 'user_driver_10', 'depot_5', '51J-012.34', 10.8231, 106.6297, 0, 1200, 'THREE_WHEELER', 'ELECTRONIC', 'IDLE', NOW(), NOW()),
('vehicle_11', 'user_driver_11', 'depot_6', '51K-111.22', 10.7588, 106.6669, 0, 4800, 'COMPACTOR_TRUCK', 'GENERAL', 'IDLE', NOW(), NOW()),
('vehicle_12', 'user_driver_12', 'depot_6', '51L-222.33', 10.7588, 106.6669, 0, 4200, 'COMPACTOR_TRUCK', 'GENERAL', 'IDLE', NOW(), NOW()),
('vehicle_13', 'user_driver_13', 'depot_7', '51M-333.44', 10.7306, 106.7077, 0, 2800, 'THREE_WHEELER', 'ORGANIC', 'IDLE', NOW(), NOW()),
('vehicle_14', 'user_driver_14', 'depot_7', '51N-444.55', 10.7306, 106.7077, 0, 2200, 'THREE_WHEELER', 'ORGANIC', 'IDLE', NOW(), NOW()),
('vehicle_15', 'user_driver_15', 'depot_8', '51O-555.66', 10.8037, 106.7118, 0, 5800, 'COMPACTOR_TRUCK', 'RECYCLABLE', 'IDLE', NOW(), NOW()),
('vehicle_16', 'user_driver_16', 'depot_8', '51P-666.77', 10.8037, 106.7118, 0, 5300, 'COMPACTOR_TRUCK', 'RECYCLABLE', 'IDLE', NOW(), NOW()),
('vehicle_17', 'user_driver_17', 'depot_9', '51Q-777.88', 10.8113, 106.6067, 0, 950, 'THREE_WHEELER', 'HAZARDOUS', 'IDLE', NOW(), NOW()),
('vehicle_18', 'user_driver_18', 'depot_9', '51R-888.99', 10.8113, 106.6067, 0, 850, 'THREE_WHEELER', 'HAZARDOUS', 'IDLE', NOW(), NOW()),
('vehicle_19', 'user_driver_19', 'depot_10', '51S-999.00', 10.7188, 106.6033, 0, 1400, 'THREE_WHEELER', 'ELECTRONIC', 'IDLE', NOW(), NOW()),
('vehicle_20', 'user_driver_20', 'depot_10', '51T-000.11', 10.7188, 106.6033, 0, 1100, 'THREE_WHEELER', 'ELECTRONIC', 'IDLE', NOW(), NOW());

-- Orders (30 orders with real locations around Ho Chi Minh City)
INSERT INTO Orders (id, index, user_id, route_id, latitude, longitude, category, image_url, description, address, weight, status, completed_at, created_at, updated_at) VALUES
('order_1', 1, 'user_cust_1', NULL, 10.7725, 106.6966, 'GENERAL', 'http://example.com/img1.jpg', 'Household trash', '1 Nguyen Hue, District 1, HCMC', 15, 'PENDING', NULL, NOW(), NOW()),
('order_2', 2, 'user_cust_2', NULL, 10.7816, 106.7021, 'ORGANIC', 'http://example.com/img2.jpg', 'Kitchen waste', '2 Le Loi, District 1, HCMC', 10, 'PENDING', NULL, NOW(), NOW()),
('order_3', 3, 'user_cust_3', NULL, 10.7634, 106.6853, 'RECYCLABLE', 'http://example.com/img3.jpg', 'Plastic bottles and cans', '3 Vo Van Tan, District 3, HCMC', 8, 'PENDING', NULL, NOW(), NOW()),
('order_4', 4, 'user_cust_4', NULL, 10.8005, 106.6788, 'HAZARDOUS', 'http://example.com/img4.jpg', 'Old batteries', '4 Cong Hoa, Tan Binh District, HCMC', 2, 'PENDING', NULL, NOW(), NOW()),
('order_5', 5, 'user_cust_5', NULL, 10.8240, 106.6310, 'ELECTRONIC', 'http://example.com/img5.jpg', 'Broken laptop', '5 Luy Ban Bich, Tan Phu District, HCMC', 5, 'PENDING', NULL, NOW(), NOW()),
('order_6', 6, 'user_cust_1', NULL, 10.7592, 106.6678, 'GENERAL', 'http://example.com/img6.jpg', 'Mixed waste', '6 Tran Hung Dao, District 5, HCMC', 12, 'PENDING', NULL, NOW(), NOW()),
('order_7', 7, 'user_cust_2', NULL, 10.7315, 106.7085, 'ORGANIC', 'http://example.com/img7.jpg', 'Food scraps', '7 Nguyen Thi Thap, District 7, HCMC', 7, 'PENDING', NULL, NOW(), NOW()),
('order_8', 8, 'user_cust_3', NULL, 10.8045, 106.7125, 'RECYCLABLE', 'http://example.com/img8.jpg', 'Cardboard boxes', '8 Dien Bien Phu, Binh Thanh District, HCMC', 10, 'PENDING', NULL, NOW(), NOW()),
('order_9', 9, 'user_cust_4', NULL, 10.8120, 106.6075, 'HAZARDOUS', 'http://example.com/img9.jpg', 'Expired medicine', '9 Kinh Duong Vuong, Binh Tan District, HCMC', 1, 'PENDING', NULL, NOW(), NOW()),
('order_10', 10, 'user_cust_5', NULL, 10.7195, 106.6040, 'ELECTRONIC', 'http://example.com/img10.jpg', 'Old TV', '10 Pham Hung, District 8, HCMC', 20, 'PENDING', NULL, NOW(), NOW()),
('order_11', 11, 'user_cust_1', NULL, 10.7850, 106.6900, 'GENERAL', 'http://example.com/img11.jpg', 'General household waste', '11 Pasteur, District 1, HCMC', 18, 'PENDING', NULL, NOW(), NOW()),
('order_12', 12, 'user_cust_2', NULL, 10.7700, 106.6900, 'ORGANIC', 'http://example.com/img12.jpg', 'Garden waste', '12 Dong Khoi, District 1, HCMC', 9, 'PENDING', NULL, NOW(), NOW()),
('order_13', 13, 'user_cust_3', NULL, 10.7600, 106.6750, 'RECYCLABLE', 'http://example.com/img13.jpg', 'Paper and newspaper', '13 Cao Thang, District 3, HCMC', 6, 'PENDING', NULL, NOW(), NOW()),
('order_14', 14, 'user_cust_4', NULL, 10.8050, 106.6800, 'HAZARDOUS', 'http://example.com/img14.jpg', 'Paint cans', '14 Hoang Van Thu, Tan Binh District, HCMC', 3, 'PENDING', NULL, NOW(), NOW()),
('order_15', 15, 'user_cust_5', NULL, 10.8300, 106.6350, 'ELECTRONIC', 'http://example.com/img15.jpg', 'Old phone', '15 Au Co, Tan Phu District, HCMC', 1, 'PENDING', NULL, NOW(), NOW()),
('order_16', 16, 'user_cust_1', NULL, 10.7550, 106.6600, 'GENERAL', 'http://example.com/img16.jpg', 'Regular trash', '16 Nguyen Trai, District 5, HCMC', 14, 'PENDING', NULL, NOW(), NOW()),
('order_17', 17, 'user_cust_2', NULL, 10.7250, 106.7000, 'ORGANIC', 'http://example.com/img17.jpg', 'Fruit peels', '17 Nguyen Luong Bang, District 7, HCMC', 6, 'PENDING', NULL, NOW(), NOW()),
('order_18', 18, 'user_cust_3', NULL, 10.8100, 106.7050, 'RECYCLABLE', 'http://example.com/img18.jpg', 'Glass bottles', '18 Dinh Bo Linh, Binh Thanh District, HCMC', 11, 'PENDING', NULL, NOW(), NOW()),
('order_19', 19, 'user_cust_4', NULL, 10.8150, 106.6100, 'HAZARDOUS', 'http://example.com/img19.jpg', 'Cleaning chemicals', '19 Quoc Lo 1A, Binh Tan District, HCMC', 2, 'PENDING', NULL, NOW(), NOW()),
('order_20', 20, 'user_cust_5', NULL, 10.7150, 106.6100, 'ELECTRONIC', 'http://example.com/img20.jpg', 'DVD player', '20 Ta Quang Buu, District 8, HCMC', 4, 'PENDING', NULL, NOW(), NOW()),
('order_21', 21, 'user_cust_1', NULL, 10.7700, 106.6750, 'GENERAL', 'http://example.com/img21.jpg', 'Household waste', '21 Ly Tu Trong, District 1, HCMC', 13, 'PENDING', NULL, NOW(), NOW()),
('order_22', 22, 'user_cust_2', NULL, 10.7800, 106.6950, 'ORGANIC', 'http://example.com/img22.jpg', 'Compostable waste', '22 Ton Duc Thang, District 1, HCMC', 8, 'PENDING', NULL, NOW(), NOW()),
('order_23', 23, 'user_cust_3', NULL, 10.7650, 106.6800, 'RECYCLABLE', 'http://example.com/img23.jpg', 'Aluminum cans', '23 Nguyen Dinh Chieu, District 3, HCMC', 7, 'PENDING', NULL, NOW(), NOW()),
('order_24', 24, 'user_cust_4', NULL, 10.7950, 106.6700, 'HAZARDOUS', 'http://example.com/img24.jpg', 'Fluorescent bulbs', '24 Truong Chinh, Tan Binh District, HCMC', 1, 'PENDING', NULL, NOW(), NOW()),
('order_25', 25, 'user_cust_5', NULL, 10.8200, 106.6250, 'ELECTRONIC', 'http://example.com/img25.jpg', 'Keyboard and mouse', '25 Kenh Nuoc Den, Tan Phu District, HCMC', 2, 'PENDING', NULL, NOW(), NOW()),
('order_26', 26, 'user_cust_1', NULL, 10.7500, 106.6550, 'GENERAL', 'http://example.com/img26.jpg', 'Daily refuse', '26 Chau Van Liem, District 5, HCMC', 16, 'PENDING', NULL, NOW(), NOW()),
('order_27', 27, 'user_cust_2', NULL, 10.7350, 106.7150, 'ORGANIC', 'http://example.com/img27.jpg', 'Yard waste', '27 Lam Van Ben, District 7, HCMC', 10, 'PENDING', NULL, NOW(), NOW()),
('order_28', 28, 'user_cust_3', NULL, 10.8000, 106.7000, 'RECYCLABLE', 'http://example.com/img28.jpg', 'Mixed paper', '28 Bach Dang, Binh Thanh District, HCMC', 9, 'PENDING', NULL, NOW(), NOW()),
('order_29', 29, 'user_cust_4', NULL, 10.8050, 106.6000, 'HAZARDOUS', 'http://example.com/img29.jpg', 'Motor oil', '29 Le Trong Tan, Binh Tan District, HCMC', 3, 'PENDING', NULL, NOW(), NOW()),
('order_30', 30, 'user_cust_5', NULL, 10.7200, 106.5950, 'ELECTRONIC', 'http://example.com/img30.jpg', 'Printer', '30 Hung Phu, District 8, HCMC', 6, 'PENDING', NULL, NOW(), NOW());

-- Dispatches (empty for now, as they are created during dispatching process)
-- Routes (empty for now, as they are created during dispatching process)
-- Notifications (empty for now, as they are created by system actions)