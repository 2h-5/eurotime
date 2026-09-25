let map;
let markers = [];

function initMap() {
  map = L.map('map').setView([51.505, -0.09], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}

function clearMarkers() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
}
// @author 🆉. Sūn
function addMarker(lat, lng, popupContent) {
  const marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup(popupContent);
  markers.push(marker);
}

async function searchDestinations() {
  const searchTerm = document.getElementById('searchInput').value;

  // Reject empty input or input containing anything other than letters/numbers/spaces
  if (!searchTerm || !/^[a-zA-Z0-9]+$/.test(searchTerm)) {
    alert('Please enter valid character(s) in the search box!');
    return;
  }
  /*  🆉. Sun 2026 */
  let searchField = document.getElementById('searchField').value;

  // Default to 'Destination' if the field is 'name'
  if (searchField === 'name') {
    searchField = 'destination';
  }

  const limit = document.getElementById('resultsLimit').value;

  try {
    const response = await fetch(`/api/search?field=${searchField}&pattern=${searchTerm}&n=${limit}`);
    if (!response.ok) {
      if (response.status === 404) {
        alert('There is no result matching your input...');
        return;
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displaySearchResults(data);
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while searching destinations...');
  }
}

/*  🆉. 2026 */
function displaySearchResults(results) {
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.textContent = '';

  if (results.length === 0) {
    const noResults = document.createElement('p');
    noResults.textContent = 'No results found.';
    resultsContainer.appendChild(noResults);
    return;
  }

  const table = document.createElement('table');
  const headers = ['Name', 'Region', 'Country', 'Category', 'Actions'];
  const headerRow = document.createElement('tr');
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  clearMarkers();
  // @author Sūn 2026
  results.forEach(dest => {
    const row = document.createElement('tr');
    
    const nameTd = document.createElement('td');
    nameTd.textContent = dest.Destination || dest.destination;
    row.appendChild(nameTd);

    const regionTd = document.createElement('td');
    regionTd.textContent = dest.Region;
    row.appendChild(regionTd);

    const countryTd = document.createElement('td');
    countryTd.textContent = dest.Country;
    row.appendChild(countryTd);

    const categoryTd = document.createElement('td');
    categoryTd.textContent = dest.Category;
    row.appendChild(categoryTd);

    const actionsTd = document.createElement('td');
    const detailsButton = document.createElement('button');
    detailsButton.textContent = 'Details';
    detailsButton.addEventListener('click', () => showDetails(dest.id));
    actionsTd.appendChild(detailsButton);

    const addToListButton = document.createElement('button');
    addToListButton.textContent = 'Add to List';
    addToListButton.addEventListener('click', () => addToList(dest.id));
    actionsTd.appendChild(addToListButton);

    row.appendChild(actionsTd);
    table.appendChild(row);

    addMarker(dest.Latitude, dest.Longitude, `<b>${dest.Destination}</b><br>${dest.Region}, ${dest.Country}`);
  });
  /* github.com/2h-5 */
  resultsContainer.appendChild(table);
}

async function showDetails(id) {
  try {
    const response = await fetch(`/api/destination/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    alert(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while fetching destination details...');
  }
}

async function createList() {
  const listName = document.getElementById('listName').value;

  // Input sanitization: Block special characters
  const invalidChars = /[-<>/$\][_=+,.:";'{}%@#^&*()|?!\s]/;
  if (invalidChars.test(listName)) {
    alert('Please enter valid character(s) for the list name!');
    return;
  }
  /* @author 🆉. Sūn 2026 */
  try {
    const response = await fetch('/api/lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: listName }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      if (response.status === 400 && errorData.error === 'List already exists!') {
        alert('The list name has already been used!');
        return;
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    alert(data.message);
    updateListSelect();

  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while creating the list...');
  }
}
// @author 🆉. Sūn 2026
async function updateListSelect() {
  const listSelect = document.getElementById('listSelect');
  listSelect.textContent = '';
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select a list';
  listSelect.appendChild(defaultOption);

  try {
    const response = await fetch('/api/lists');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    data.forEach(listName => {
      const option = document.createElement('option');
      option.value = listName;
      option.textContent = listName;
      listSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while fetching lists...');
  }
}

async function showList() {
  const listName = document.getElementById('listSelect').value;

  if (!listName) {
    return;
  }
  /* Sun 2026 */
  try {
    const response = await fetch(`/api/lists/${listName}/details`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayListResults(data);
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while fetching list details...');
  }
}

function displayListResults(results) {
  const resultsContainer = document.getElementById('listResults');
  resultsContainer.textContent = '';

  if (results.length === 0) {
    const noResults = document.createElement('p');
    noResults.textContent = 'No destinations in this list.';
    resultsContainer.appendChild(noResults);
    return;
  }

  const table = document.createElement('table');
  const headers = ['Name', 'Region', 'Country', 'Currency', 'Language'];
  const headerRow = document.createElement('tr');
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);
  // @author 🆉. Sūn
  clearMarkers();

  results.forEach(dest => {
    const row = document.createElement('tr');
    
    const nameTd = document.createElement('td');
    nameTd.textContent = dest.Destination || dest.destination;
    row.appendChild(nameTd);

    const regionTd = document.createElement('td');
    regionTd.textContent = dest.region;
    row.appendChild(regionTd);

    const countryTd = document.createElement('td');
    countryTd.textContent = dest.country;
    row.appendChild(countryTd);

    const currencyTd = document.createElement('td');
    currencyTd.textContent = dest.currency;
    row.appendChild(currencyTd);

    const languageTd = document.createElement('td');
    languageTd.textContent = dest.language;
    row.appendChild(languageTd);

    table.appendChild(row);

    addMarker(dest.coordinates.lat, dest.coordinates.lng, `<b>${dest.Destination || dest.destination}</b><br>${dest.region}, ${dest.country}`);
  });
  /* 🆉. 2026 */
  resultsContainer.appendChild(table);
}

async function deleteList() {
  const listName = document.getElementById('listSelect').value;

  if (!listName) {
    alert('Please select a list to delete!');
    return;
  }

  try {
    const response = await fetch(`/api/lists/${listName}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    alert(data.message);
    updateListSelect();
    document.getElementById('listResults').textContent = '';
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while deleting the list...');
  }
}
// @author Z. 
async function addToList(destId) {
  const listName = document.getElementById('listSelect').value;

  if (!listName) {
    alert('Please select a list in order to add the destination!');
    return;
  }

  try {
    const response = await fetch(`/api/lists/${listName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const currentList = await response.json();

    const updatedList = [...new Set([...currentList, destId])];
    /* @author github.com/2h-5 */
    const updateResponse = await fetch(`/api/lists/${listName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ destinations: updatedList }),
    });
    if (!updateResponse.ok) {
      throw new Error(`HTTP error! status: ${updateResponse.status}`);
    }
    const updateData = await updateResponse.json();
    alert('Destination has successfully added to the list!');
    showList();
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while adding the destination to the list...');
  }
}

function addEventListeners() {
  document.getElementById('searchButton').addEventListener('click', searchDestinations);
  document.getElementById('createListButton').addEventListener('click', createList);
  document.getElementById('deleteListButton').addEventListener('click', deleteList);
  document.getElementById('listSelect').addEventListener('change', showList);
}
// 🆉. Sūn 2026 
function enableSidebarResize() {
  const sidebar = document.getElementById('sidebar');

  let isResizing = false;

  sidebar.addEventListener('mousedown', (event) => {
    const sidebarRect = sidebar.getBoundingClientRect();

    // Only start resizing when clicking near the left boundary
    if (event.clientX >= sidebarRect.left &&
        event.clientX <= sidebarRect.left + 10) {
      isResizing = true;
      document.body.style.cursor = 'ew-resize';
      event.preventDefault();
    }
  });

  document.addEventListener('mousemove', (event) => {
    if (!isResizing) return;

    const newWidth = window.innerWidth - event.clientX;

    const minWidth = 250;
    const maxWidth = window.innerWidth * 0.7;

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      sidebar.style.width = `${newWidth}px`;
    }
  });
  /* @author 2h-5 */
  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = '';
    }
  });
}

// Initialize the map and update the list select on page load
window.onload = () => {
  initMap();
  updateListSelect();
  addEventListeners();
  enableSidebarResize();
};