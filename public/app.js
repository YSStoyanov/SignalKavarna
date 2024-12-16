document.addEventListener("DOMContentLoaded", () => {
    const map = L.map('map').setView([43.426, 28.334], 14);
    const addSignalButton = document.getElementById('addSignalButton');
    const signalForm = document.getElementById('signalForm');
    const cancelFormButton = document.getElementById('cancelFormButton');
    const locationInput = document.getElementById('location');
    const manualLocationButton = document.getElementById('manualLocation');
    const detectLocationButton = document.getElementById('detectLocation');
    const adminPanelButton = document.getElementById('adminPanelButton');

    let selectedCoordinates = null;

    // Initialize the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Картата © OpenStreetMap',
    }).addTo(map);

    // Click on map to select location
    map.on('click', (e) => {
        if (!signalForm.style.display || signalForm.style.display === 'none') return;
        selectedCoordinates = e.latlng;
        locationInput.value = `Ширина: ${e.latlng.lat}, Дължина: ${e.latlng.lng}`;
    });

    // Manual location button
    manualLocationButton.addEventListener('click', () => {
        alert('Кликнете върху картата, за да изберете местоположение.');
    });

    // Detect location button
    detectLocationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    selectedCoordinates = { lat: latitude, lng: longitude };
                    locationInput.value = `Ширина: ${latitude}, Дължина: ${longitude}`;
                    map.setView([latitude, longitude], 14);
                },
                () => {
                    alert('Неуспешно разпознаване на местоположението.');
                }
            );
        } else {
            alert('Вашият браузър не поддържа геолокация.');
        }
    });

    // Show form
    addSignalButton.addEventListener('click', () => {
        signalForm.style.display = "block"; // Показва формата
    });
    signalForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Спира презареждането на страницата
    
        if (!selectedCoordinates) {
            alert('Моля, изберете местоположение.');
            return;
        }
    
        // Събиране на данните от формата
        const signalData = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            latitude: selectedCoordinates.lat,
            longitude: selectedCoordinates.lng,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            image_url: document.getElementById('image_url').value || '',
            about: document.getElementById('about').value || '',
            sender_name: document.getElementById('sender_name').value || '',
        };
    
        try {
            // Изпращане на POST заявка до бекенда
            const response = await fetch('/api/signals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signalData),
            });
    
            if (!response.ok) {
                throw new Error('Неуспешно подаване на сигнал');
            }
    
            const result = await response.json();
            alert('Сигналът е подаден успешно!');
            signalForm.style.display = 'none'; // Скриване на формата
            locationInput.value = ''; // Изчистване на полетата
            selectedCoordinates = null;
        } catch (error) {
            console.error('Грешка:', error);
            alert('Неуспешно подаване на сигнал. Опитайте отново.');
        }
    });
    // Hide form
    cancelFormButton.addEventListener('click', () => {
        signalForm.style.display = "none"; // Скрива формата
        locationInput.value = '';
        selectedCoordinates = null;
    });

    // Submit signal
    signalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!selectedCoordinates) {
            alert('Моля, изберете местоположение.');
            return;
        }
        alert('Сигналът е подаден успешно!');
    });

    // Admin panel button
    adminPanelButton.addEventListener('click', () => {
        alert("Функционалността на администраторския панел е в разработка.");
    });
    let kavarnaBoundary = null; // Границите на община Каварна

// Зареждане на GeoJSON границите на общината
fetch('Kavarna_boundary_corrected.geojson')
    .then(response => response.json())
    .then(data => {
        kavarnaBoundary = L.geoJSON(data).addTo(map);
    })
    .catch(error => console.error('Грешка при зареждането на границите:', error));

// Функция за проверка дали координатите са в границите
function isWithinBoundary(latlng) {
    if (!kavarnaBoundary) return false;
    return kavarnaBoundary.getBounds().contains(latlng);
}

// Актуализация на събитието при избор на местоположение
map.on('click', (e) => {
    if (!signalForm.style.display || signalForm.style.display === 'none') return;

    const { lat, lng } = e.latlng;
    if (isWithinBoundary(e.latlng)) {
        selectedCoordinates = { lat, lng };
        locationInput.value = `Ширина: ${lat}, Дължина: ${lng}`;
    } else {
        alert('Избраното местоположение не е в границите на община Каварна.');
        locationInput.value = ''; // Изчистване на полето
        selectedCoordinates = null;
    }
});
document.getElementById('addSignalButton').addEventListener('click', () => {
    document.getElementById('signalForm').classList.add('active');
});

document.getElementById('cancelFormButton').addEventListener('click', () => {
    document.getElementById('signalForm').classList.remove('active');
});
});