// Client ID and API key from the Developer Console
var CLIENT_ID = '669094137680-a3gphu17c5erj1r4igtafbjhaa61965m.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

// Authorization scopes required by the API. If using multiple scopes,
// separated them with spaces.
var SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

var authorizeButton = document.getElementById('authorize-button');
var calculateButton = document.getElementById('calculate-button');
var signoutButton = document.getElementById('signout-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
    calculateButton.onclick = calculateProfit;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    calculateButton.style.display = 'block';
    getChannel();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    calculateButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append text to a pre element in the body, adding the given message
 * to a text node in that element. Used to display info from API response.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Youtube API Communication
 */

//Reads channel's data from Youtube API's reponse and print it
function extractAndPrintChannelData(response){
var channel = response.items[0];
    appendPre('This channel\'s ID is ' + channel.id + '. ' +
              'Its title is \'' + channel.snippet.title + ', ' +
              'and it has ' + channel.statistics.viewCount + ' views.');
}

function removeEmptyParams(params) {
    for (var p in params) {
      if (!params[p] || params[p] == 'undefined') {
        delete params[p];
      }
    }
    return params;
  }

function executeRequest(request) {
    request.execute(function(response) {
      console.log(response);    
      extractAndPrintChannelData(response);
    });
  }

function buildApiRequest(requestMethod, path, params, properties) {
params = removeEmptyParams(params);
var request;
if (properties) {
    var resource = createResource(properties);
    request = gapi.client.request({
        'body': resource,
        'method': requestMethod,
        'path': path,
        'params': params
    });
} else {
    request = gapi.client.request({
        'method': requestMethod,
        'path': path,
        'params': params
    });
}
executeRequest(request);
}
/**
 * End of Youtube API Communication
 */

/**
 * Calculate Profit
 */
function calculateProfit(){
    buildApiRequest('GET',
                '/youtube/v3/channels',
                {'id': $('#channel-id')[0].value,
                 'part': 'snippet,contentDetails,statistics'});

}
/**
 * End of Calculate profit
 */

/**
 * Print files.
 */
function getChannel() {
  gapi.client.youtube.channels.list({
    'part': 'snippet,contentDetails,statistics',
    'forUsername': 'GoogleDevelopers'
  }).then(function(response) {
    var channel = response.result.items[0];
    appendPre('This channel\'s ID is ' + channel.id + '. ' +
              'Its title is \'' + channel.snippet.title + ', ' +
              'and it has ' + channel.statistics.viewCount + ' views.');
  });
}