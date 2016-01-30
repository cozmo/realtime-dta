var feq;

feq = function(f1, f2) {
  return Math.abs(f1 - f2) < 0.0001;
};

google.maps.Marker.prototype.animatedMoveTo = function(toLat, toLng) {
  var curLat, curLng, frames, fromLat, fromLng, move, percent;
  fromLat = this.getPosition().lat();
  fromLng = this.getPosition().lng();
  this.frames = [];
  if (feq(fromLat, toLat) && feq(fromLng, toLng)) {
    this.frames.push(new google.maps.LatLng(toLat, toLng))
  } else {
    percent = 0;
    while (percent < 1) {
      curLat = fromLat + percent * (toLat - fromLat);
      curLng = fromLng + percent * (toLng - fromLng);
      this.frames.push(new google.maps.LatLng(curLat, curLng));
      percent += 0.05;
    }
  }
  move = function(marker, latlngs, index, wait) {
    marker.setPosition(latlngs[index]);
    if (index !== latlngs.length - 1 && index < latlngs.length) {
      return setTimeout((function() {
        return move(marker, latlngs, index + 1, wait);
      }), wait);
    }
  };
  return move(this, this.frames, 0, 25);
};
