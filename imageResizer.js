class ImageMap {
  constructor(map, img) {
    this.imgWidth = img.width;
    this.areas = map.getElementsByTagName("area");
    this.coords = [];
    this.previousWidth = img.width;
    this.map = map;
    this.img = img;

    for (let n = 0; n < this.areas.length; n++) {
      this.coords[n] = this.areas[n].coords.split(",");
    }
    this.resize();
  }
  resize() {
    let sf = this.img.width / this.img.naturalWidth;
    console.log(this.img);
    console.log(sf);
    console.log("width", this.img.width);
    console.log("naturalWidth", this.img.naturalWidth);

    for (let a = 0; a < this.areas.length; a++) {
      let newCoords = [];
      for (let i = 0; i < this.coords[a].length; i++) {
        newCoords.push(this.coords[a][i] * sf);
      }
      this.areas[a].coords = newCoords.join(",");
    }
  }
}
