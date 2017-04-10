
var locate = {};
var city = [];

$(document).ready(function(){
// Initialize collapse button
  $(".button-collapse").sideNav();
    $("#selectLocate").on('change', function() {
        filter($(this).context.value);
    });
    $('select').material_select(); 
});

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement; 
}

//google map
function initialize() {	
    console.log("initialize");

    $.blockUI({ 
        message: "<div class='ball'></div>",
        css: { 
            padding:        0, 
            margin:         0, 
            width:          0, 
            top:            '50%', 
            left:           '50%', 
            textAlign:      'center', 
            color:          '#000', 
            border:         0, 
            backgroundColor:'#000', 
            cursor:         'wait' 
        }, 
    });	
    	 			    
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 25.0475269, lng: 121.522468},
        scrollwheel: true,
        enableTouchUI : true,
        zoom: 6
    });
    map.addListener('click', function() {
        var win = document.getElementById("infoWindow");
        win.style.display = "none";
    });

    //get user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        map.setCenter(pos);
        }, function() {
            // handleLocationError(true, infoWindow, map.getCenter());
            console.error("Error: The Geolocation service failed.");
        });
    } 
    else {
        // Browser doesn't support Geolocation
        // handleLocationError(false, infoWindow, map.getCenter());
        console.error("Error: Your browser doesn\'t support geolocation.");
    }

    //get weather data
    getWeatherData(setMarker); 
    // setInterval(getWeatherData,1200000); //20min auto refresh      	  
}



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}

function setMarker(data){
    
    
    console.log("setMarker");
    console.log(data.length);

    for(var i in data ){

        var myLatlng = {
            lat: Number(data[i].TWD67Lat), 
            lng: Number(data[i].TWD67Lon)
        };
        // console.log(myLatlng);
        var infoWindow = new google.maps.InfoWindow();

        if(data[i].Rainfall10min == 0) {
            image = "icon/sun.png";
        }
        else { 
            image = "icon/rain.png";
        }
        //set marker on map 
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            icon: image,
            title: data.SiteName
        });
        
        // Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                if(data[i].Rainfall10min==0) {
                    content = data[i].SiteName + "<br>Sunny<br>" + data[i].PublishTime;
                    // image = "sun.png";
                }
                else { 
                    content = data[i].SiteName + "<br>Raining<br>" + data[i].PublishTime; 
                    // image = "rain.png";
                }   

                infoWindow.setContent(content);
                infoWindow.open(map, marker);

                map.setZoom(12);
                map.setCenter(marker.getPosition());

                var nowData =  createUnitObj(data[i]);
                showInfoWindow(nowData);
            };

        })(marker, i));

        //update select form
        city.push(data[i].County);


        if(locate[data[i].County] === undefined){
            locate[data[i].County] = [];
        }
        var county = locate[data[i].County];
        if(county[data[i].Township] === undefined){
            county[data[i].Township] = [];
        }
        var township = county[data[i].Township];
        township.push(createUnitObj(data[i])); 

    }
    city = Object.keys(locate);

    for (var idx in city) {
        addIntoSelect("selectLocate", city[idx]);
    }
    $('select').material_select();
    // var select = document.getElementById("dropdownCity");
    // console.log(select);
}

function createUnitObj(data){
    return {
            siteName: data.SiteName,
            siteId: data.SiteId,
            county: data.County,
            township: data.Township,
            lat: Number(data.TWD67Lat),
            lng: Number(data.TWD67Lon),
            rainfall10min: data.Rainfall10min,
            rainfall1hr: data.Rainfall1hr,
            rainfall3hr: data.Rainfall3hr,
            rainfall6hr: data.Rainfall6hr,
            rainfall12hr: data.Rainfall12hr,
            rainfall24hr: data.Rainfall24hr,
            time: data.PublishTime,
        };
}

function filter(key){
    // console.log(key);
    var div = document.getElementById("cityButton");
    div.innerHTML = null;
    // console.log(locate[key]);
    for (var i in locate[key]) {
        // console.log(JSON.stringify(locate[key][i]));
        for (var j in locate[key][i]) {
            // console.log(JSON.stringify(locate[key][i][j]));
            var btn = document.createElement("button");
            btn.id = locate[key][i][j].siteId;
            btn.className += " waves-effect";
            btn.className += " waves-light";
			btn.className += " btn";
            btn.className += " #90caf9";
            btn.className += " blue";
			btn.className += " lighten-3";
            btn.addEventListener('click', function(e){
                setCenter(e.target.innerText);
            });
            var t = document.createTextNode(locate[key][i][j].siteName);
            btn.appendChild(t);

		    var blank = document.createTextNode("\u00A0\u00A0");
		    div.appendChild(blank);
            div.appendChild(btn);
        }
    }
}

function setCenter(key){
    console.log("key: "+key);
    var myLatlng = {};
    for(var i in locate){
        var county = locate[i];
        // console.log(county);
        for(var j in county){
            var township = county[j];
            for(var k in township){
                var site = township[k];
                if(site.siteName == key){
                	showInfoWindow(site);
                    myLatlng.lat = Number(site.lat);
                    myLatlng.lng = Number(site.lng);
                    break;
                }                
            }

        }
    }
    console.log("myLatlng.lat: "+myLatlng.lat);
    console.log("myLatlng.lng: "+myLatlng.lng);

    map.setCenter(myLatlng);
    map.setZoom(12);
}


function addIntoSelect(target, element){    
    var select = document.getElementById(target);
    var opt = document.createElement("option");
    var t = document.createTextNode(element);
    opt.appendChild(t);

    select.appendChild(opt);             
}

function showInfoWindow(site){
	console.log("showInfoWindow");

	var win = document.getElementById("infoWindow");
    win.innerHTML = null;

	var li1 = document.createElement("li");
	var t1 = document.createTextNode(site.county+"/"+site.township);
	li1.appendChild(t1);

	var li2 = document.createElement("li");
	var t2 = document.createTextNode("地點: "+site.siteName);
	li2.appendChild(t2);

    var ul = document.createElement("ul"); 
    var tul = document.createTextNode("即時雨量：");
    ul.appendChild(tul);
        var li10min = document.createElement("li");
        var t10min = document.createTextNode("10min: "+site.rainfall10min);
        li10min.appendChild(t10min);
        var li1hr = document.createElement("li");
        var t1hr = document.createTextNode("1hr: "+site.rainfall1hr);
        li1hr.appendChild(t1hr);
        var li3hr = document.createElement("li");
        var t3hr = document.createTextNode("3hr: "+site.rainfall3hr);
        li3hr.appendChild(t3hr);
        var li6hr = document.createElement("li");
        var t6hr = document.createTextNode("6hr: "+site.rainfall6hr);
        li6hr.appendChild(t6hr);
        var li12hr = document.createElement("li");
        var t12hr = document.createTextNode("12hr: "+site.rainfall12hr);
        li12hr.appendChild(t12hr);
    ul.appendChild(li10min);
    ul.appendChild(li1hr);
    ul.appendChild(li3hr);
    ul.appendChild(li6hr);
    ul.appendChild(li12hr);

	win.appendChild(li1);
	win.appendChild(li2);
    win.appendChild(ul);
	win.style.display = "block";

	// console.log(JSON.stringify(site));


}
