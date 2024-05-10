// Kakao Map API
window.onload = function initMap() {
    let container = document.getElementById("map");
    let options = {
        center: new kakao.maps.LatLng(37.546576, 127.066010),
        level: 3
    };
    let map = new kakao.maps.Map(container, options);

    var markerPosition  = new kakao.maps.LatLng(37.546576, 127.066010);
		var marker = new kakao.maps.Marker({
		    position: markerPosition
		});

		marker.setMap(map); 
}