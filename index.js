let draws = [...utensilData.draws];

let question = document.getElementById("question");
let drawImg = document.getElementById("drawImg");
let sourceLink = document.getElementById("sourceLink");

let currentUtensilName;

const IMG_FOLDER = "drawImages/";

let resizableImageMap;

let utensilQueue = prepareUtensilQueue(utensilData);
let currentQueueIndex = 0;

function nextUtensil() {
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

// Start the first utensil selection
nextUtensil();

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

  // Shuffle and check for consecutive draws with the same image
  shuffleArray(queue);
  let filteredQueue = [];
  let lastImage = null;

  queue.forEach((item) => {
    if (item.draw.img !== lastImage) {
      filteredQueue.push(item);
      lastImage = item.draw.img;
    }
  });

  let maxConsecutiveDuplicates = 2;
  let finalQueue = [];
  let duplicateCount = 0;

  for (let i = 0; i < filteredQueue.length; i++) {
    if (i > 0 && filteredQueue[i].draw.img === filteredQueue[i - 1].draw.img) {
      duplicateCount++;
    } else {
      duplicateCount = 0;
    }

    if (duplicateCount < maxConsecutiveDuplicates) {
      finalQueue.push(filteredQueue[i]);
    }
  }

  return finalQueue;
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
