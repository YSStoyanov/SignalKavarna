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
});