let draws = [...utensilData.draws];

let question = document.getElementById("question");
let drawImg = document.getElementById("drawImg");
let sourceLink = document.getElementById("sourceLink");

let currentUtensilName;

const IMG_FOLDER = "drawImages/";

let resizableImageMap;

let currentQueueIndex = 0;

let totalItems = 0;
let utensilQueue = prepareUtensilQueue(utensilData);

// Preload all images
function preloadImages() {
  const imagePreloadPromises = [];

  // Iterate over all draws and preload each image
  draws.forEach((draw) => {
    const imageUrl = IMG_FOLDER + draw.img; // Image path
    const img = new Image(); // Create an image object
    img.src = imageUrl; // Set the source of the image
    imagePreloadPromises.push(
      new Promise((resolve) => {
        img.onload = resolve; // Resolve the promise when the image is loaded
      })
    );
  });

  // Wait until all images are loaded
  Promise.all(imagePreloadPromises).then(() => {
    console.log("All images preloaded!");
    // Now you can safely call nextUtensil or any other function that uses these images
    nextUtensil();
  });
}

// Start preloading when the page loads
window.onload = preloadImages;

function updateProgressBar() {
  const progressBar = document.getElementById("progressBar");
  // Calculate progress percentage
  const progressPercentage = (currentQueueIndex / totalItems) * 100;
  // Update the width of the progress bar
  progressBar.style.width = `${progressPercentage}%`;
  // Update the progress text
}

function nextUtensil() {
  if (currentQueueIndex >= utensilQueue.length) {
    // All items have been processed, show THANKS!
    question.innerHTML = "THANKS!";
    drawImg.src = ""; // Optional: clear the image when finished
    drawImg.classList.add("hidden");
    sourceLink.classList.add("hidden"); // Hide the source link when done
    return; // Stop further execution
  }

  let { draw, utensil, description, source } = getNextUtensil();

  // Update the image source
  drawImg.src = IMG_FOLDER + draw.img;
  if (source) {
    sourceLink.classList.remove("hidden");
    sourceLink.href = source;
  } else {
    sourceLink.classList.add("hidden");
  }

  // Update the question with the selected description
  question.innerHTML = "Hey, could you pass me the " + description + "?";

  // Clear and populate the image map
  let utensilMap = document.getElementById("utensilMap");
  utensilMap.innerHTML = "";

  draw.utensils.forEach((ut) => {
    let newArea = document.createElement("area");
    newArea.setAttribute("shape", "poly");
    newArea.setAttribute("coords", ut.mapBoundary);
    newArea.setAttribute("href", "javascript:void(0);");

    // Attach the click handler
    newArea.setAttribute("onclick", "areaClicked('" + ut.name + "')");
    utensilMap.appendChild(newArea);

    if (ut.name === utensil.name) {
      currentUtensilName = ut.name;
    }
  });

  // Resize the image map after the image is loaded
  drawImg.onload = () => {
    resizableImageMap = new ImageMap(utensilMap, drawImg);
  };
}

// Handle window resize
window.onresize = () => {
  if (resizableImageMap) {
    resizableImageMap.resize();
  }
};

let lastResponse = "";

function areaClicked(areaName) {
  const incorrectResponses = [
    "Uhh, that's not it!",
    "Uhh, nope!",
    `No, that's the ${areaName}.`,
  ];

  // Filter out the last response to avoid repetition
  const filteredResponses = incorrectResponses.filter(
    (response) => response !== lastResponse
  );

  // Pick a random incorrect response from the filtered list
  const responseText =
    filteredResponses[Math.floor(Math.random() * filteredResponses.length)];

  if (areaName === currentUtensilName) {
    console.log("Correct!");
    nextUtensil();
    response.innerHTML = "";
    updateProgressBar();
  } else {
    console.log(responseText);
    response.innerHTML = responseText;
    lastResponse = responseText;
  }
}

// Prepare the queue of utensils, ensuring no consecutive images are the same
function prepareUtensilQueue(data) {
  const queue = [];
  data.draws.forEach((draw, drawIndex) => {
    draw.utensils.forEach((utensil, utensilIndex) => {
      utensil.descriptions.forEach((description, descriptionIndex) => {
        queue.push({
          draw,
          utensil,
          description,
          source: draw.source,
          indices: { drawIndex, utensilIndex, descriptionIndex },
        });
      });
    });
  });

  console.log("num items", queue.length);

  totalItems = queue.length;

  // Shuffle and check for consecutive draws with the same image
  shuffleArray(queue);
  return queue;
}

// Shuffle the array using Fisher-Yates
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Get the next utensil
function getNextUtensil() {
  if (currentQueueIndex >= utensilQueue.length) {
    shuffleArray(utensilQueue);
    currentQueueIndex = 0;
  }
  const nextItem = utensilQueue[currentQueueIndex];
  currentQueueIndex++;
  return nextItem;
}
