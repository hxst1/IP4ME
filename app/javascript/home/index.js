const myIp = document.getElementById('ipAddress');
const ipInput = document.getElementById('ipInput');
const ipInfo = document.getElementById('ipInfo');
const toggleViewButton = document.getElementById('toggleView');
const dataView = document.getElementById('dataView');

let viewMode = 'list';
let data = {};

myIp.addEventListener('click', () => {
    navigator.clipboard.writeText(myIp.textContent).then(() => {
        const originalText = myIp.textContent;
        myIp.textContent = "Copied!";

        setTimeout(() => {
            myIp.textContent = originalText;
        }, 500);
    }).catch(err => {
        console.error('Error copying to clipboard', err);
    });
});

ipInput.addEventListener('keypress', handleKeypress);
toggleViewButton.addEventListener('click', toggleView);

function getIpInfo() {
    fetch(`http://ip-api.com/json/${ipInput.value}?fields=66846719`)
        .then(response => response.json())
        .then(fetchedData => {
            data = fetchedData;
            updateView();
            ipInfo.classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error:', error);
            dataView.innerHTML = `<p>Error retrieving IP information.</p>`;
        });
}

function handleKeypress(event) {
    if (event.keyCode === 13) {
        getIpInfo();
    }
}

function updateView() {
    if (viewMode === 'json') {
        dataView.innerHTML = `<pre>${syntaxHighlight(data)}</pre>`;
    } else {
        dataView.innerHTML = renderAsList();
    }
}

function renderAsList() {
    return `
        <ul>
            <li><strong>IP:</strong> ${data.query}</li>
            <li><strong>Country:</strong> ${data.country}</li>
            <li><strong>City:</strong> ${data.city}</li>
            <li><strong>ISP:</strong> ${data.isp}</li>
            <li><strong>Organization:</strong> ${data.org}</li>
            <li><strong>Timezone:</strong> ${data.timezone}</li>
            <li><strong>Latitude:</strong> ${data.lat}</li>
            <li><strong>Longitude:</strong> ${data.lon}</li>
            <li><strong>Region:</strong> ${data.regionName}</li>
            <li><strong>Region Code:</strong> ${data.region}</li>
            <li><strong>Zip Code:</strong> ${data.zip}</li>
            <li><strong>AS:</strong> ${data.as}</li>
            <li><strong>Mobile:</strong> ${data.mobile ? 'Yes' : 'No'}</li>
            <li><strong>Proxy:</strong> ${data.proxy ? 'Yes' : 'No'}</li>
            <li><strong>Status:</strong> ${data.status}</li>
            <li><strong>Message:</strong> ${data.message ? data.message : 'N/A'}</li>
            <li><strong>Country Code:</strong> ${data.countryCode}</li>
        </ul>
    `;
}

function toggleView() {
    viewMode = viewMode === 'list' ? 'json' : 'list';
    updateView();

    if (viewMode === 'list') {
        toggleViewButton.innerHTML = `{ }`;
    } else {
        toggleViewButton.innerHTML = `[ ]`;
    }
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
