import {NavLink, Outlet} from "react-router-dom";
import styles from "./SidebarCreateList.module.css";
import Button from "./Button";

let map;
let markers = [];

function initMap() {

}

function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}

function addMarker(lat, lng, popupContent) {

}

async function searchDestinations() {
    const searchTerm = document.getElementById('searchInput').value;

        if (!searchTerm || !/^[a-zA-Z0-9]+$/.test(searchTerm)) {
            alert('Please enter valid text(s) in the search box!');
            return;
        }

    let searchField = document.getElementById('searchField').value;

    if (searchField === 'name') {
        searchField = 'Destination';
    }

    const limit = document.getElementById('resultsLimit').value;

    try {
        const response = await fetch(`http://localhost:3000/api/search?field=${searchField}&pattern=${searchTerm}&n=${limit}`);
        if (!response.ok) {
            if (response.status === 404) {
                alert('There is no result matching your input...');
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displaySearchResults(data);
        updateListSelect();
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while searching destinations...');
    }
}


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
    sessionStorage.setItem("search",true)
    sessionStorage.setItem("searchResults",JSON.stringify(results))

    results.forEach(dest => {
        const row = document.createElement('tr');

        const nameTd = document.createElement('td');
        nameTd.textContent = dest.Destination;
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

    resultsContainer.appendChild(table);
}

async function showDetails(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/destination/${id}`);
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
    if(listName != '') {
        const invalidChars = /[-<>/$\][_=+,.:";'{}%@#^&*()|?!\s]/;
        if (invalidChars.test(listName)) {
            alert('Please enter valid character(s) for the list name!');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/lists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: listName}),
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
}

async function updateListSelect() {
    const listSelect = document.getElementById('listSelect');
    listSelect.textContent = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a list';
    listSelect.appendChild(defaultOption);

    try {
        const response = await fetch('http://localhost:3000/api/lists');
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

    try {
        const response = await fetch(`http://localhost:3000/api/lists/${listName}/details`);
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
    const headers = ['Name', 'Region', 'Country', 'Currency', 'Language','Flag'];
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    clearMarkers();

    results.forEach(dest => {
        const row = document.createElement('tr');

        const nameTd = document.createElement('td');
        nameTd.textContent = dest.destination;
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

        const flagTd = document.createElement('td');
        flagTd.textContent = dest.flag;
        row.appendChild(flagTd);

        table.appendChild(row);

        addMarker(dest.coordinates.lat, dest.coordinates.lng, `<b>${dest.name}</b><br>${dest.region}, ${dest.country}`);
    });

    resultsContainer.appendChild(table);
}

async function deleteList() {
    const listName = document.getElementById('listSelect').value;

    if (!listName) {
        alert('Please select a list to delete!');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/lists/${listName}`, {
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

async function flagList() {
    const listName = document.getElementById('listSelect').value;
    const flagName = document.getElementById('flagSelect').value;

    if (!listName) {
        alert('Please select a list to flagList!');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/flagList/${listName}/${flagName}`, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        alert(data.message);
        showList();
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the list...');
    }
}

async function addToList(destId) {
    const listName = document.getElementById('listSelect').value;

    if (!listName) {
        alert('Please select a list in order to add the destination!');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/lists/${listName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const currentList = await response.json();
        const updatedList = [...new Set([...currentList, destId])];

        const updateResponse = await fetch(`http://localhost:3000/api/lists/${listName}`, {
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
}

window.onload = () => {
    initMap();
    updateListSelect();
    addEventListeners();
};

function SidebarCreateList() {
  return (
    <div className={styles.sidebar}>
        <footer className={styles.footer}>
            <nav className={styles.nav}>
                <ul>
                    <li>
                        <NavLink to="/app/cities">
                            Search & Reviews
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/CreateList">
                            Create List
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/SiteManager">
                            Site Manager
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </footer>
        <h1>EuroTime</h1>
        <section className={styles.searchcontainer}>
            <h2>Search Places</h2>
            <div className={styles.searchcontrols}>
                <input type="text" id="searchInput" placeholder="Enter search term" className={styles.searchInput}></input>
                    <select id="searchField"  className={styles.searchInput}>
                        <option value="Destination">Name</option>
                        <option value="Region">Region</option>
                        <option value="Country">Country</option>
                    </select>
                    <select id="resultsLimit">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                    <Button id="searchButton" onClick={searchDestinations}>Search</Button>
                </div>
        </section>

        <section id="searchResults"></section>

        <section className={styles.listcontainer}>
            <h2>My Favourite Lists</h2>
            <div className={styles.listcontrols}>
                <input type="text" id="listName" placeholder="Enter list name"></input>
                    <button id="createListButton" onClick={createList}>Create List</button>
                    <select id="listSelect" onChange={showList}></select>
                    <button id="deleteListButton" onClick={deleteList}>Delete List</button>
                <select id="flagSelect"   className={styles.searchInput}>
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                </select>
                <button id="flagListButton" onClick={flagList}>Set flag</button>
            </div>
        </section>

        <section id="listResults"></section>
      <Outlet />

    </div>
  );
}

export default SidebarCreateList;
