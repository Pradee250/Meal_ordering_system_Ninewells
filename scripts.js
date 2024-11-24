<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meal Orders</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        table {
            width: 100%;
            margin-bottom: 10px;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        button {
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
        #loginSection {
            margin-bottom: 20px;
        }
        #departmentDropdown {
            display: none;
        }
    </style>
</head>
<body>

    <div id="loginSection">
        <h2>Login</h2>
        <label for="username">Username:</label>
        <input type="text" id="username">
        <button onclick="login()">Login</button>
    </div>

    <h1>Meal Orders</h1>
    <div id="userSection" style="display: none;">
        <label for="dateSelect">Select Date:</label>
        <input type="date" id="dateSelect">
        <p id="selectedDateDisplay"></p>

        <div id="breakfastSection">
            <h2>Breakfast</h2>
            <button onclick="addOrder('breakfast')">Add Breakfast Order</button>
            <table id="breakfastTable">
                <thead>
                    <tr><th>Name</th><th>EPF No.</th><th>Department</th></tr>
                </thead>
                <tbody></tbody>
            </table>
            <p>Total Orders: <span id="breakfastCount">0</span></p>
        </div>

        <div id="lunchSection">
            <h2>Lunch</h2>
            <button onclick="addOrder('lunch')">Add Lunch Order</button>
            <table id="lunchTable">
                <thead>
                    <tr><th>Name</th><th>EPF No.</th><th>Department</th></tr>
                </thead>
                <tbody></tbody>
            </table>
            <p>Total Orders: <span id="lunchCount">0</span></p>
        </div>

        <div id="dinnerSection">
            <h2>Dinner</h2>
            <button onclick="addOrder('dinner')">Add Dinner Order</button>
            <table id="dinnerTable">
                <thead>
                    <tr><th>Name</th><th>EPF No.</th><th>Department</th></tr>
                </thead>
                <tbody></tbody>
            </table>
            <p>Total Orders: <span id="dinnerCount">0</span></p>
        </div>

        <p>Total Orders Across All Meals: <span id="totalCount">0</span></p>
    </div>

    <!-- Department Dropdown Modal -->
    <div id="departmentDropdown">
        <label for="departmentSelect">Select Department:</label>
        <select id="departmentSelect">
            <option value="Administration">Administration</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Ward4">Ward4</option>
            <option value="Ward5">Ward5</option>
            <option value="Ward6">Ward6</option>
            <option value="Ward7">Ward7</option>
            <option value="Ward8">Ward8</option>
            <option value="Ward9">Ward9</option>
            <option value="IT">IT</option>
            <option value="Procurement">Procurement</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Drivers">Drivers</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Others">Others</option>
        </select>
        <button onclick="submitDepartment()">Submit</button>
    </div>

    <script>
        let currentUser = null;

        // Function to handle login
        function login() {
            const username = document.getElementById('username').value;
            if (username) {
                currentUser = username;
                document.getElementById('loginSection').style.display = 'none';
                document.getElementById('userSection').style.display = 'block';
                loadUserOrders();
            } else {
                alert("Please enter a username.");
            }
        }

        // Function to retrieve meal orders from localStorage for the current user
        function getMealOrders() {
            let orders = localStorage.getItem(currentUser);
            if (orders) {
                return JSON.parse(orders);
            } else {
                return {
                    breakfast: [],
                    lunch: [],
                    dinner: []
                };
            }
        }

        // Function to save meal orders to localStorage for the current user
        function saveMealOrders(orders) {
            localStorage.setItem(currentUser, JSON.stringify(orders));
        }

        // Global object to store meal orders (initial load from localStorage)
        let mealOrders = getMealOrders();

        // Function to update orders when the user selects a date
        function updateOrders() {
            const selectedDate = document.getElementById("dateSelect").value;
            if (selectedDate) {
                document.getElementById("selectedDateDisplay").innerText = selectedDate;
                displayOrders();
            }
        }

        // Function to display orders for the selected date
        function displayOrders() {
            const selectedDate = document.getElementById("dateSelect").value;
            if (!selectedDate) return;

            renderMealOrders('breakfast', selectedDate);
            renderMealOrders('lunch', selectedDate);
            renderMealOrders('dinner', selectedDate);
            updateTotalCount();
        }

        // Function to render orders for each meal type (breakfast, lunch, dinner)
        function renderMealOrders(mealType, date) {
            const mealSection = document.getElementById(`${mealType}Table`).querySelector('tbody');
            const mealCount = document.getElementById(`${mealType}Count`);

            const ordersForDate = mealOrders[mealType].filter(order => order.date === date);

            mealSection.innerHTML = '';  // Clear the table

            ordersForDate.forEach((order, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${order.name}</td><td>${order.epfNo}</td><td>${order.department}</td><td><button onclick="deleteOrder('${mealType}', ${index})">Delete</button></td>`;
                mealSection.appendChild(row);
            });

            mealCount.innerText = ordersForDate.length;
        }

        // Function to delete an order
        function deleteOrder(mealType, index) {
            const selectedDate = document.getElementById("dateSelect").value;
            mealOrders[mealType] = mealOrders[mealType].filter((order, idx) => idx !== index || order.date !== selectedDate);

            saveMealOrders(mealOrders);
            displayOrders();
        }

        // Function to update the total count of all orders
        function updateTotalCount() {
            const selectedDate = document.getElementById("dateSelect").value;
            let totalCount = 0;

            if (selectedDate) {
                totalCount += mealOrders.breakfast.filter(order => order.date === selectedDate).length;
                totalCount += mealOrders.lunch.filter(order => order.date === selectedDate).length;
                totalCount += mealOrders.dinner.filter(order => order.date === selectedDate).length;
            }

            document.getElementById("totalCount").innerText = totalCount;
        }

        // Function to add a new order (called when the "Add Order" button is clicked)
        function addOrder(mealType) {
            const name = prompt('Enter staff name:');
            const epfNo = prompt('Enter staff EPF No.:');
            
            // Show department dropdown
            document.getElementById('departmentDropdown').style.display = 'block';

            // Store the meal type in a global variable to use when submitting
            window.selectedMealType = mealType;
        }

        // Function to submit the selected department
        function submitDepartment() {
            const department = document.getElementById('departmentSelect').value;
            const name = prompt('Enter staff name:');
            const epfNo = prompt('Enter staff EPF No.:');
            const
