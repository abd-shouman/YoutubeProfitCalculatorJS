// Client ID and API key from the Developer Console
var CLIENT_ID = '669094137680-a3gphu17c5erj1r4igtafbjhaa61965m.apps.googleusercontent.com';
var API_KEY = "AIzaSyAgoLL_F_fzRhAdXQk--19ONBMG_mWA5zk";

var GoogleAuth;
//var SCOPE = 'https://www.googleapis.com/auth/yt-analytics-monetary.readonly';
var SCOPE = 'https://www.googleapis.com/auth/yt-analytics.readonly';
function handleClientLoad() {
  // Load the API's client and auth2 modules.
  // Call the initClient function after the modules load.
  gapi.load('client:auth2', initClient);
}

/**
 * Handle Authentication
 */
function initClient() {
  // Retrieve the discovery document for version 1 of YouTube Analytics API.
  // In practice, your app can retrieve one or more discovery documents.
  var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtubeAnalytics/v1/rest';

  // Initialize the gapi.client object, which app uses to make API requests.
  // Get API key and client ID from API Console.
  // 'scope' field specifies space-delimited list of access scopes.
  gapi.client.init({
      'apiKey': API_KEY,
      'discoveryDocs': [discoveryUrl],
      'clientId': CLIENT_ID,
      'scope': SCOPE
  }).then(function () {
    GoogleAuth = gapi.auth2.getAuthInstance();

    // Listen for sign-in state changes.
    GoogleAuth.isSignedIn.listen(updateSigninStatus);

    // Handle initial sign-in state. (Determine if user is already signed in.)
    var user = GoogleAuth.currentUser.get();
    setSigninStatus();

    // Call handleAuthClick function when user clicks on
    //      "Sign In/Authorize" button.
    $('#sign-in-or-out-button').click(function() {
      handleAuthClick();
    }); 
    $('#revoke-access-button').click(function() {
      revokeAccess();
    });
    $('#execute').click(function(){
      execute();
    })
  });
}

function handleAuthClick() {
  if (GoogleAuth.isSignedIn.get()) {
    // User is authorized and has clicked 'Sign out' button.
    GoogleAuth.signOut();
  } else {
    // User is not signed in. Start Google auth flow.
    GoogleAuth.signIn();
  }
}

function revokeAccess() {
  GoogleAuth.disconnect();
}

function setSigninStatus(isSignedIn) {
  var user = GoogleAuth.currentUser.get();
  var isAuthorized = user.hasGrantedScopes(SCOPE);
  if (isAuthorized) {
    $('#sign-in-or-out-button').html('Sign out');
    $('#revoke-access-button').css('display', 'inline-block');
    $('#execute').css('display', 'inline-block');
    $('#auth-status').html('You are currently signed in and have granted ' +
        'access to this app.');
  } else {
    $('#sign-in-or-out-button').html('Sign In/Authorize');
    $('#revoke-access-button').css('display', 'none');
    $('#execute').css('display', 'none');
    $('#auth-status').html('You have not authorized this app or you are ' +
        'signed out.');
  }
}

function updateSigninStatus(isSignedIn) {
  setSigninStatus();
}
/**
 * End of Handle Authentication
 */

 /**
  * Youtube Analytics and Reports API Communaction
  */
 // Make sure the client is loaded and sign-in is complete before calling this method.
 function execute() {
  return gapi.client.youtubeAnalytics.reports.query({
    "ids": "channel==MINE",
    "start-date": "2017-01-01",
    "end-date": "2017-12-12",
    "metrics": "views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained",
    //"metrics":"views,estimatedRevenue,estimatedAdRevenue,estimatedRedPartnerRevenue",
    "dimensions": "day",
    "sort": "day"
  }).then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Response", response);
            },
            function(err) { console.error("Execute error", err); });
}