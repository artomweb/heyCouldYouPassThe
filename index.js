let draws = [...utensilData.draws];

let question = document.getElementById("question");
let drawImg = document.getElementById("drawImg");

let currentUtensilName;

const IMG_FOLDER = "drawImages/";

function nextUtensil() {
  let rndDraw = draws[Math.floor(Math.random() * draws.length)];

  console.log("rndDraw", rndDraw);

  drawImg.src = IMG_FOLDER + rndDraw.img;

  if (
    typeof rndDraw.workingUtensils == "undefined" ||
    rndDraw.workingUtensils.length == 0
  ) {
    console.log("No more utensils");
    rndDraw.workingUtensils = [...rndDraw.utensils];
  }
  let workingUtensils = rndDraw.workingUtensils;

  let rndUtensilIdx = Math.floor(Math.random() * workingUtensils.length);

  let rndUtensil = workingUtensils[rndUtensilIdx];
  let randomDesc =
    rndUtensil.descriptions[
      Math.floor(Math.random() * rndUtensil.descriptions.length)
    ];
  question.innerHTML = "Hey, could you pass me the " + randomDesc;

  document.getElementById("utensilMap").innerHTML = "";

  rndDraw.utensils.forEach((ut) => {
    let newArea = document.createElement("area");
    newArea.setAttribute("shape", "poly");
    newArea.setAttribute("coords", ut.mapBoundary);
    newArea.setAttribute("href", "javascript:void(0);"); // set href to javascript:void(0) to prevent navigation

    newArea.setAttribute("onclick", "areaClicked('" + ut.name + "')");

    document.getElementById("utensilMap").appendChild(newArea);

    if (ut.name === rndUtensil.name) {
      currentUtensilName = ut.name;
      workingUtensils.splice(rndUtensilIdx, 1);
    }
  });
  imageMapResize();
}

nextUtensil();

function areaClicked(areaName) {
  console.log("areaClicked", areaName);
  if (areaName === currentUtensilName) {
    console.log("correct!");
    nextUtensil();
  }
}

document.onload = () => {
  imageMapResize();
};
