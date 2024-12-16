document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([43.612, 28.283], 12);
  
    // Добавяне на OpenStreetMap слой
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  
    // Зареждане и визуализация на границите на Каварна
    fetch('Kavarna_boundary_corrected.geojson')
      .then(response => response.json())
      .then(data => {
        const kavarnaBoundary = L.geoJSON(data, {
          style: {
            color: 'blue',
            weight: 2,
            opacity: 0.7
          }
        }).addTo(map);
  
        // Центриране на картата спрямо границите
        map.fitBounds(kavarnaBoundary.getBounds());
      })
      .catch(error => console.error('Грешка при зареждане на GeoJSON:', error));
  
    // Форма за добавяне на сигнал
    const addSignalButton = document.getElementById('addSignalButton');
    const signalForm = document.getElementById('signalForm');
    const cancelFormButton = document.getElementById('cancelFormButton');
  
    addSignalButton.addEventListener('click', () => {
      signalForm.classList.add('active');
    });
  
    cancelFormButton.addEventListener('click', () => {
      signalForm.classList.remove('active');
    });
  });