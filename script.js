

let buses = [];
let routes = [];
let drivers = [];




function showSection(sectionId) {
    // // Hide all sections
    // var sections = document.querySelectorAll('section');
    // sections.forEach(function(section) {
    //     section.style.display = 'none';
    // });

    // // Show the selected section
    // var selectedSection = document.getElementById(sectionId);
    // selectedSection.style.display = 'block';
    const sections = document.querySelectorAll('main > section');
  sections.forEach((section) => {
    section.style.display = 'none';
  });
  document.getElementById(sectionId).style.display = 'block';
}

// Function to add items to local storage and update the UI
function addToLocalStorage(key, item) {
    const items = JSON.parse(localStorage.getItem(key)) || [];
    items.push(item);
    localStorage.setItem(key, JSON.stringify(items));
    return items;
}

// Function to display items from local storage
function displayItems(key, listElement) {
    const items = JSON.parse(localStorage.getItem(key)) || [];
    listElement.innerHTML = '';
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item.text;
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', () => {
            editItem(key, index, li);
        });
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteItem(key, index);
            li.remove();
        });
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        listElement.appendChild(li);
    });
}

// Function to delete an item from local storage
function deleteItem(key, index) {
    const items = JSON.parse(localStorage.getItem(key)) || [];
    items.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(items));
}

// Function to edit an item in local storage
function editItem(key, index, listItem) {
    const items = JSON.parse(localStorage.getItem(key)) || [];
    const newText = prompt('Edit item:', items[index].text);
    if (newText) {
        items[index].text = newText;
        localStorage.setItem(key, JSON.stringify(items));
        listItem.textContent = newText;
    }
}

// Bus Form Handling
document.getElementById('busForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const busNumber = document.getElementById('busNumber');
    const busModel = document.getElementById('busModel');
    if (busNumber.value.trim() === '' || busModel.value.trim() === '') {
        alert('Please fill in all fields.');
        return;
    }
    addToLocalStorage('buses', { text: `Bus Number: ${busNumber.value}, Model: ${busModel.value}` });
    displayItems('buses', document.getElementById('busList'));
    busNumber.value = '';
    busModel.value = '';


    const busEntry = {
        name: busNumber,
        model: busModel
    };


    buses.push(busEntry);

    document.getElementById('totalBuses').textContent = buses.length;

    document.getElementById('busForm').reset();
});

// Route Form Handling
document.getElementById('routeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const routeName = document.getElementById('routeName');
    const routeDestination = document.getElementById('routeDestination');
    if (routeName.value.trim() === '' || routeDestination.value.trim() === '') {
        alert('Please fill in all fields.');
        return;
    }
    addToLocalStorage('routes', { text: `Route: ${routeName.value}, Destination: ${routeDestination.value}` });
    displayItems('routes', document.getElementById('routeList'));
    routeName.value = '';
    routeDestination.value = '';


    const routeEntry = {
        name: routeName,
        start: routeDestination,
     
    };

    // Add the route entry to the list
    routes.push(routeEntry);

    // Update the total routes count in the dashboard
    document.getElementById('totalRoutes').textContent = routes.length;

    // Clear the form
    document.getElementById('routeForm').reset();
});

// Driver Form Handling
document.getElementById('driverForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const driverName = document.getElementById('driverName');
    const driverLicense = document.getElementById('driverLicense');
    if (driverName.value.trim() === '' || driverLicense.value.trim() === '') {
        alert('Please fill in all fields.');
        return;
    }
    addToLocalStorage('drivers', { text: `Driver: ${driverName.value}, License: ${driverLicense.value}` });
    displayItems('drivers', document.getElementById('driverList'));
    driverName.value = '';
    driverLicense.value = '';

    const driverEntry = {
        name: driverName,
        license: driverLicense
    };

    // Add the driver entry to the list
    drivers.push(driverEntry);

    // Update the total drivers count in the dashboard
    document.getElementById('totalDrivers').textContent = drivers.length;

    // Clear the form
    document.getElementById('driverForm').reset();

    // Remove the total drivers count in the dashboard when the driver is deleted from the list 
    if(drivers.length === 0) {
        document.getElementById('totalDrivers').textContent = '';
    }

});

// Display initial items on load
document.addEventListener('DOMContentLoaded', function() {
    displayItems('buses', document.getElementById('busList'));
    displayItems('routes', document.getElementById('routeList'));
    displayItems('drivers', document.getElementById('driverList'));
});


// Function to update user profile
async function updateProfile(username, email) {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ username, email })
    });
    return response.json();
}

// Function to change user password
async function changePassword(currentPassword, newPassword) {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ currentPassword, newPassword })
    });
    return response.json();
}

// Function to update user preferences
async function updatePreferences(notificationsEnabled, darkModeEnabled) {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/preferences', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ notificationsEnabled, darkModeEnabled })
    });
    return response.json();
}

// Handle profile update
document.getElementById('profileForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const result = await updateProfile(username, email);
    alert(result.message);
});

// Handle password change
document.getElementById('passwordForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match');
        return;
    }
    const result = await changePassword(currentPassword, newPassword);
    alert(result.message);
});



