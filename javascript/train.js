
//firebase call
var config = {
  apiKey: "AIzaSyC2CEGGKaN4755hCms9tj7dQYN0GphLCHc",
  authDomain: "my-awesome-project-id-973da.firebaseapp.com",
  databaseURL: "https://my-awesome-project-id-973da.firebaseio.com",
  projectId: "my-awesome-project-id-973da",
  storageBucket: "my-awesome-project-id-973da.appspot.com",
  messagingSenderId: "684900106551"
};

firebase.initializeApp(config);

var database = firebase.database();

//adding train to database when button is clicked

$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // recording new train input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var arrival = moment($("#arrival-input").val().trim(), "HH:mm").format("HH:mm");
  var frequency = $("#frequency-input").val().trim();

  // local object to hold new information entered
  var nextTrain = {
    name: trainName,
    trainDestination: destination,
    trainArrival: arrival,
    trainFrequency: frequency
  };
  //pushing new information to database
  database.ref().push(nextTrain);
//confirming the user input has been recorded
  alert("New Train Added");

  //resets the input fields to ""
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#arrival-input").val("");
  $("#frequency-input").val("");

});


//Updates the table when new child element is loaded
database.ref().on("child_added", function (childSnapshot) {

  // Store firebase infomration into a variable.
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().trainDestination;
  var trainArrives = childSnapshot.val().trainArrival;
  var trainInterval = childSnapshot.val().trainFrequency;

  //Time table conversions
  var firstTimeConverted = moment(trainArrives, "HH:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var tRemainder = diffTime % trainInterval;
  var tMinutesTillTrain = trainInterval - tRemainder;
  var nextArrival = moment().add(tMinutesTillTrain, "minutes").format('LTS');

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td scope='col'>").text(destination),
    $("<td scope='col'>").text(trainArrives),
    $("<td scope='col'>").text(trainInterval),
    $("<td scope='col'>").text(nextArrival)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});
