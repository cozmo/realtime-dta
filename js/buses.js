(function(){
  buses = {};
  firebus = new Firebase("https://realtime-dta.firebaseio.com/duluth-transit-authority");

  map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(46.7833, -92.1064),
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  add_bus = function(bus, firebase_id) {
    if (!bus.route) {
      return;
    }
    var marker = new MarkerWithLabel({
      position: new google.maps.LatLng(bus.lat, bus.lon),
      map: map,
      draggable: false,
      labelContent: bus.route.name.match(/^([A-z0-9]+)/)[1],
      labelClass: "route_card",
      icon: "#"
    });
    return buses[firebase_id] = {
      marker: marker
    };
  };

  firebus.once("value", function(agency_ref) {
    return agency_ref.forEach(function(bus_ref) {
      return add_bus(bus_ref.val(), bus_ref.name());
    });
  });

  firebus.on("child_changed", function(bus_ref) {
    var bus = buses[bus_ref.name()];
    if (typeof bus === "undefined") {
      return add_bus(bus_ref.val(), bus_ref.name());
    } else {
      return bus.marker.animatedMoveTo(bus_ref.val().lat, bus_ref.val().lon);
    }
  });

  firebus.on("child_removed", function(bus_ref) {
    var bus = buses[bus_ref.name()];
    if (typeof bus !== "undefined") {
      bus.marker.setMap(null);
      return delete buses[bus_ref.name()];
    }
  });
})();
