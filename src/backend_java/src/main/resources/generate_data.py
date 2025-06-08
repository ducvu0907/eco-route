import uuid
import datetime
import random
import json

# Configuration
NUM_USERS = 100 # Reduced from 1000
NUM_DEPOTS = 5 # Reduced from 10
NUM_VEHICLES_PER_DEPOT = 2 # This will be effectively overridden for drivers to 1, but still good to keep low
NUM_ROUTES_PER_VEHICLE = 50 # New: Each vehicle will have 50 routes
MIN_ORDERS_PER_ROUTE = 10
MAX_ORDERS_PER_ROUTE = 20
NUM_DISPATCHES = 50 # Number of dispatches remains the same, but status logic changes

# Enum values
TRASH_CATEGORIES = ["GENERAL", "ORGANIC", "RECYCLABLE", "HAZARDOUS", "ELECTRONIC"]
VEHICLE_TYPES = ["THREE_WHEELER", "COMPACTOR_TRUCK"]
ROLES = ["CUSTOMER", "DRIVER", "MANAGER"]
ORDER_STATUSES = ["REASSIGNED", "PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]
VEHICLE_STATUSES = ["IDLE", "ACTIVE", "REPAIR"]
ROUTE_STATUSES = ["IN_PROGRESS", "COMPLETED"]
DISPATCH_STATUSES = ["IN_PROGRESS", "COMPLETED"]

def generate_uuid():
    return str(uuid.uuid4())

def random_latitude():
    return round(random.uniform(-90.0, 90.0), 6)

def random_longitude():
    return round(random.uniform(-180.0, 180.0), 6)

def random_phone():
    return f"+1{random.randint(100,999)}-{random.randint(100,999)}-{random.randint(1000,9999)}"

def random_date(start_year=2023, end_year=2025):
    start_date = datetime.datetime(start_year, 1, 1, 0, 0, 0)
    end_date = datetime.datetime(end_year, 12, 31, 23, 59, 59)
    time_delta = end_date - start_date
    random_seconds = random.randint(0, int(time_delta.total_seconds()))
    return start_date + datetime.timedelta(seconds=random_seconds)

def generate_hashed_password():
    return '$2a$10$l9iB8MFx6W4PdHQr29aWQerBxie/MiIfSt6oTidL9e2uBI7oBk3Me'

def generate_fcm_token():
    return f"fcm_token_{generate_uuid()}"

def generate_address():
    streets = ["Main St", "Oak Ave", "Pine Ln", "Elm Rd", "Maple Dr"]
    cities = ["Springfield", "Rivertown", "Metroville", "Central City"]
    states = ["NY", "CA", "TX", "FL", "IL"]
    zip_codes = [f"{random.randint(10000, 99999)}" for _ in range(5)]
    return f"{random.randint(1, 999)} {random.choice(streets)}, {random.choice(cities)}, {random.choice(states)} {random.choice(zip_codes)}"

def generate_description():
    descriptions = [
        "Household waste", "Old newspapers and plastic bottles",
        "Garden trimmings", "Used batteries and light bulbs",
        "Broken laptop and old phone", "Mixed recyclables"
    ]
    return random.choice(descriptions)

def generate_license_plate():
    return f"{chr(random.randint(65, 90))}{chr(random.randint(65, 90))}{random.randint(100, 999)}{chr(random.randint(65, 90))}{chr(random.randint(65, 90))}"

def generate_geometry():
    # Simple example of a JSONB geometry (e.g., a line string for a route)
    num_points = random.randint(2, 5)
    coords = []
    for _ in range(num_points):
        coords.append([random_longitude(), random_latitude()])
    return json.dumps({"type": "LineString", "coordinates": coords})

# --- Generate Data ---
sql_statements = []

# 1. Users
users_data = []
for _ in range(NUM_USERS):
    user_id = generate_uuid()
    username = f"user_{generate_uuid()[:8]}"
    phone = random_phone()
    hashed_password = generate_hashed_password()
    fcm_token = generate_fcm_token()
    role = random.choice(ROLES)
    created_at = random_date()
    updated_at = created_at
    users_data.append((user_id, username, phone, hashed_password, fcm_token, role, created_at, updated_at))
    sql_statements.append(f"INSERT INTO Users (id, username, phone, hashed_password, fcm_token, role, created_at, updated_at) VALUES ('{user_id}', '{username}', '{phone}', '{hashed_password}', '{fcm_token}', '{role}', '{created_at.isoformat()}', '{updated_at.isoformat()}');")

# Filter for drivers
drivers_data = [u for u in users_data if u[5] == 'DRIVER']
customer_users_data = [u for u in users_data if u[5] == 'CUSTOMER']

# 2. Depots
depots_data = []
for _ in range(NUM_DEPOTS):
    depot_id = generate_uuid()
    latitude = random_latitude()
    longitude = random_longitude()
    address = generate_address()
    created_at = random_date()
    updated_at = created_at
    depots_data.append((depot_id, latitude, longitude, address, created_at, updated_at))
    sql_statements.append(f"INSERT INTO Depots (id, latitude, longitude, address, created_at, updated_at) VALUES ('{depot_id}', {latitude}, {longitude}, '{address}', '{created_at.isoformat()}', '{updated_at.isoformat()}');")

# 3. Vehicles
vehicles_data = []
assigned_drivers = set()
if drivers_data and depots_data:
    for driver_id, _, _, _, _, _, _, _ in drivers_data:
        # Assign one vehicle per driver (as per original script's behavior)
        if driver_id not in assigned_drivers:
            vehicle_id = generate_uuid()
            depot_id = random.choice(depots_data)[0]
            license_plate = generate_license_plate()
            current_latitude = random_latitude()
            current_longitude = random_longitude()
            current_load = round(random.uniform(0, 5000), 2)
            capacity = random.randint(5000, 20000)
            vehicle_type = random.choice(VEHICLE_TYPES)
            category = random.choice(TRASH_CATEGORIES)
            status = random.choice(VEHICLE_STATUSES)
            created_at = random_date()
            updated_at = created_at
            vehicles_data.append((vehicle_id, driver_id, depot_id, license_plate, current_latitude, current_longitude, current_load, capacity, vehicle_type, category, status, created_at, updated_at))
            sql_statements.append(f"INSERT INTO Vehicles (id, driver_id, depot_id, license_plate, current_latitude, current_longitude, current_load, capacity, type, category, status, created_at, updated_at) VALUES ('{vehicle_id}', '{driver_id}', '{depot_id}', '{license_plate}', {current_latitude}, {current_longitude}, {current_load}, {capacity}, '{vehicle_type}', '{category}', '{status}', '{created_at.isoformat()}', '{updated_at.isoformat()}');")
            assigned_drivers.add(driver_id)

# 4. Dispatches
dispatches_data = []
in_progress_dispatch_created = False
for i in range(NUM_DISPATCHES):
    dispatch_id = generate_uuid()
    if not in_progress_dispatch_created and i == 0: # Ensure exactly one 'IN_PROGRESS' dispatch
        status = "IN_PROGRESS"
        in_progress_dispatch_created = True
    else:
        status = "COMPLETED"

    created_at = random_date()
    completed_at = random_date(created_at.year, created_at.year) if status == "COMPLETED" else None
    updated_at = completed_at if completed_at else created_at
    dispatches_data.append((dispatch_id, status, completed_at, created_at, updated_at))
    completed_at_str = f"'{completed_at.isoformat()}'" if completed_at else 'NULL'
    sql_statements.append(f"INSERT INTO Dispatches (id, status, completed_at, created_at, updated_at) VALUES ('{dispatch_id}', '{status}', {completed_at_str}, '{created_at.isoformat()}', '{updated_at.isoformat()}');")

# 5. Routes
routes_data = []
if vehicles_data and dispatches_data:
    for vehicle_id, _, _, _, _, _, _, _, _, _, _, _, _ in vehicles_data:
        for _ in range(NUM_ROUTES_PER_VEHICLE): # Generate many routes per vehicle
            route_id = generate_uuid()
            # Randomly assign to a dispatch, prioritizing the 'IN_PROGRESS' one if available
            in_progress_dispatches = [d for d in dispatches_data if d[1] == "IN_PROGRESS"]
            if in_progress_dispatches:
                dispatch_id = random.choice(in_progress_dispatches)[0]
            else:
                dispatch_id = random.choice(dispatches_data)[0]

            status = random.choice(ROUTE_STATUSES)
            distance = round(random.uniform(10.0, 500.0), 2)
            duration = round(random.uniform(30.0, 300.0), 2) # in minutes
            geometry = generate_geometry()
            created_at = random_date()
            completed_at = random_date(created_at.year, created_at.year) if status == "COMPLETED" else None
            updated_at = completed_at if completed_at else created_at
            routes_data.append((route_id, vehicle_id, dispatch_id, status, distance, duration, geometry, completed_at, created_at, updated_at))
            completed_at_str = f"'{completed_at.isoformat()}'" if completed_at else 'NULL'
            sql_statements.append(f"INSERT INTO Routes (id, vehicle_id, dispatch_id, status, distance, duration, geometry, completed_at, created_at, updated_at) VALUES ('{route_id}', '{vehicle_id}', '{dispatch_id}', '{status}', {distance}, {duration}, '{geometry}', {completed_at_str}, '{created_at.isoformat()}', '{updated_at.isoformat()}');")

# 6. Orders
orders_data = []
if customer_users_data and routes_data:
    order_index = 0
    # Create a list of available customer user IDs
    available_customer_ids = [u[0] for u in customer_users_data]

    for route_id, _, _, _, _, _, _, _, _, _ in routes_data:
        num_orders_for_route = random.randint(MIN_ORDERS_PER_ROUTE, MAX_ORDERS_PER_ROUTE)
        for _ in range(num_orders_for_route):
            order_id = generate_uuid()
            order_index += 1
            user_id = random.choice(available_customer_ids) # Assign order to a random customer user

            latitude = random_latitude()
            longitude = random_longitude()
            category = random.choice(TRASH_CATEGORIES)
            image_url = f"https://example.com/images/{generate_uuid()}.jpg"
            description = generate_description()
            address = generate_address()
            weight = round(random.uniform(1.0, 100.0), 2)
            status = random.choice(ORDER_STATUSES)
            created_at = random_date()
            completed_at = random_date(created_at.year, created_at.year) if status == "COMPLETED" else None
            updated_at = completed_at if completed_at else created_at

            orders_data.append((order_id, order_index, user_id, route_id, latitude, longitude, category, image_url, description, address, weight, status, completed_at, created_at, updated_at))
            completed_at_str = f"'{completed_at.isoformat()}'" if completed_at else 'NULL'
            sql_statements.append(f"INSERT INTO Orders (id, index, user_id, route_id, latitude, longitude, category, image_url, description, address, weight, status, completed_at, created_at, updated_at) VALUES ('{order_id}', {order_index}, '{user_id}', '{route_id}', {latitude}, {longitude}, '{category}', '{image_url}', '{description}', '{address}', {weight}, '{status}', {completed_at_str}, '{created_at.isoformat()}', '{updated_at.isoformat()}');")


# 7. Notifications
if users_data:
    for _ in range(NUM_USERS * 3): # Generate roughly 3 notifications per user
        notification_id = generate_uuid()
        user_id = random.choice(users_data)[0]
        content = f"Your order {generate_uuid()[:6]} has been updated." if random.random() < 0.5 else f"New dispatch available for vehicle {generate_uuid()[:6]}."
        is_read = random.choice([True, False])
        created_at = random_date()
        updated_at = created_at
        sql_statements.append(f"INSERT INTO Notifications (id, user_id, content, is_read, created_at, updated_at) VALUES ('{notification_id}', '{user_id}', '{content}', {is_read}, '{created_at.isoformat()}', '{updated_at.isoformat()}');")

# Output the SQL statements
output_filename = "mock_data.sql"
with open(output_filename, "w") as f:
    for statement in sql_statements:
        f.write(statement + "\n")

print(f"Mock data generated and saved to {output_filename}")
print(f"Generated {len(users_data)} users.")
print(f"Generated {len(depots_data)} depots.")
print(f"Generated {len(vehicles_data)} vehicles.")
print(f"Generated {len(dispatches_data)} dispatches.")
print(f"Generated {len(routes_data)} routes.")
print(f"Generated {len(orders_data)} orders.")
print(f"Generated {len(sql_statements) - len(users_data) - len(depots_data) - len(vehicles_data) - len(dispatches_data) - len(routes_data) - len(orders_data)} notifications.")