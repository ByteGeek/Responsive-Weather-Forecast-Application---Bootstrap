var facebook_address;
var facebook_icon;
var facebook_summary;
var facebook_temperature;
var facebook_cf;
			
	window.fbAsyncInit = function() {
		FB.init({
			appId      : '1027672633921020',
			xfbml      : true,
			version    : 'v2.5',
		});
	};

	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "https://connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	
	function postToFeed(){	
		FB.login(function(response){
			if (response.authResponse){
				FB.ui({
         
					method: 'feed',
					name: "Current Weather in " + facebook_address,
					link: "http://www.forecast.io",
					description: facebook_summary + ", " + facebook_temperature + facebook_cf,
					picture: facebook_icon,
					caption: "WEATHER INFORMATION FROM FORECAST IO ",
					display: "popup"
       
				},function(response){ if(response && response.post_id){alert("Posted Successfully");} });
			}
			else{
				alert('Not logged in to facebook');
			}
		});
	}


$( document ).ready(function() {
	$('#SearchButton').click(validateInput);
	$('#clear').click(clearvalues);
	function clearvalues(){
		$('#navdiv').css('visibility','hidden');
        $('#basicMap').html("");
		$('#address').val("");
		$('#city').val("");
		$('#state').val("");
		$('#temperatureid').prop('checked',true);
		$('#errorClassState').css('visibility', 'hidden');
		$('#errorClassAddress').css('visibility', 'hidden');
	    $('#errorClassCity').css('visibility', 'hidden');
		 
	}
	var degree;
	function validateInput(){	
		var address = document.getElementById("address").value;
		var city = document.getElementById("city").value;
		var state = document.getElementById("state").value;
		degree =  $('input[name="temperature"]:checked').val();
		var flag = true;
		if(address.trim()==""){
			flag = false;
			document.getElementById("errorClassAddress").style.visibility = "visible";
		}
		if(city.trim()==""){
			flag = false;
			document.getElementById("errorClassCity").style.visibility = "visible";
		}
		if(state.trim()==""){
			flag = false;
			document.getElementById("errorClassState").style.visibility = "visible";
		}
		if(flag){
			processData(address,city,state,degree);
		}
	}
	$('#city').on('change keyup focusout',function(){
	  if($('#city').val().trim() != ""){
		 $('#errorClassCity').css('visibility', 'hidden');
	  }else{
		  $('#errorClassCity').css('visibility', 'visible');
	  }
	});
    $('#address').on('change keyup focusout',function(){	
	  if($('#address').val().trim() != ""){
		   $('#errorClassAddress').css('visibility', 'hidden');
	  }else{
		  $('#errorClassAddress').css('visibility', 'visible');
	  }
	});  
	$('#state').on('change keyup focusout',function(){	
	  if($('#state').val().trim() != ""){
		   $('#errorClassState').css('visibility', 'hidden');
	  }else{
		  $('#errorClassState').css('visibility', 'visible');
	  }
	}); 

    function processData(address,city,state,degree){
		//alert(address+' '+city+' '+state+' '+degree);
		$.ajax({
		url : 'homework8.php',
		type : 'GET',
		dataTyepe: 'json',
		data : {
		  'address' :address,
		  'city' : city,
		  'state': state,
		  'temperature': degree
		},
		success:function(data){
			$('#navdiv').css('visibility','visible');
			getDailyData($.parseJSON(data));
			getTwentyHoursData($.parseJSON(data));
			getCurrentWeather($.parseJSON(data));
		},
		error:function(){
			alert('Error occured');
		}
		});
	}  
        function getDailyData(jsonObject){
			var dateObject;
			var buttonTextData;
			var modalTextData;
			var day, date, month, monthDate, image, minTemp, maxTemp;
			var dailyData = jsonObject.daily.data;
			for(i=1;i<dailyData.length;i++){
				dateObject = new Date(dailyData[i].time*1000);
				day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateObject.getDay()];
				month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][dateObject.getMonth()];			
				date = dateObject.getDate();
				monthDate = month+" "+date;
				icon = getIcon(dailyData[i].icon);	
				minTemp = Math.floor(dailyData[i].temperatureMin)+"&deg";
				maxTemp = Math.floor(dailyData[i].temperatureMax)+"&deg";
				buttonTextData="<h5>"+day+"<h5>"+monthDate+"<br><img height='60px' width='60px' src='"+icon+"'><br>";
				buttonTextData+="Min<br>Temp<br>"+"<h3>"+minTemp+"<h5><br>Max<br>Temp<br>"+"<h3>"+maxTemp;
				var id="#button"+i;
				$(id).html(buttonTextData);

				var summary_data=dailyData[i].summary;
				var humidity_data = parseInt((jsonObject.daily.data[i].humidity)*100)+'%';
				if(degree == "si") {
		            var windspeed_data = isNaN(jsonObject.daily.data[i].windSpeed)?'NA':jsonObject.daily.data[i].windSpeed.toFixed(2)+"m/s";
					var visibilty_data = isNaN(jsonObject.daily.data[i].visibility)?'NA':jsonObject.daily.data[i].visibility.toFixed(2)+"kms";
					var pressure_data = isNaN(jsonObject.daily.data[i].pressure)?'NA':jsonObject.daily.data[i].pressure+" mb";
				} else {
					var windspeed_data = isNaN(jsonObject.daily.data[i].windSpeed)?'NA':jsonObject.daily.data[i].windSpeed.toFixed(2)+"mph";
					var visibilty_data = isNaN(jsonObject.daily.data[i].visibility)?'NA':jsonObject.daily.data[i].visibility.toFixed(2)+"mi";
					var pressure_data = isNaN(jsonObject.daily.data[i].pressure)?'NA':jsonObject.daily.data[i].pressure+" hPa";
				}

				var sunrise=jsonObject.daily.data[i].sunriseTime;
				var sunset=jsonObject.daily.data[i].sunsetTime;
				timezone=jsonObject.timezone;
				var inter_sunrise=moment.unix(sunrise);
				var final_sunrise=inter_sunrise.tz(timezone).format("hh:mm A");
				var inter_sunset=moment.unix(sunset);
				var final_sunset=inter_sunset.tz(timezone).format("hh:mm A");
				modalTextData="Weather in "+$('#city').val().trim()+" on "+monthDate;
				var id="#myModalLabel"+i;
				$(id).html(modalTextData);
				modalTextData="<div class='container-fluid'>\n<div class='row'><div class='col-md-12'><center><img height='150px' width='150px' src='"+icon+"' alt='"+summary_data+"' title='"+summary_data+"'></center></div></div>\n";
				modalTextData+="<div class='row'><div class='col-md-12'><h3><center>"+day+": <span style=\"color:#FFAB10\">"+summary_data+"<span></center></h3></div></div>\n";
				modalTextData+="<div class='row'><div class='col-md-4'><center><h4>Sunrise Time</h4>"+final_sunrise+"</center></div><div class='col-md-4'><center><h4>Sunset Time</h4>"+final_sunset+"</center></div><div class='col-md-4'><center><h4>Humidity</h4>"+humidity_data+"</center></div></div>\n";
				modalTextData+="<div class='row'><div class='col-md-4'><center><h4>Wind Speed</h4>"+windspeed_data+"</center></div><div class='col-md-4'><center><h4>Visibility</h4>"+visibilty_data+"</center></div><div class='col-md-4'><center><h4>Pressure</h4>"+pressure_data+"</center><br></div></div>\n";
				modalTextData+="</div>"
                var id="#myModalBody"+i;
				$(id).html(modalTextData);
			}
		}
		
		function getTwentyHoursData(json_data){
			var degree=$('input[name="temperature"]:checked').val();
		    if(degree=="us")
		    {
			  document.getElementById('DegreeStyle').innerHTML="Temp(&#176F)";
		    }
		    else
		    {
			  document.getElementById('DegreeStyle').innerHTML="Temp(&#176C)";
		    }
			var timezone=json_data.timezone;
			var i=0;
			var HourlyTb="";
            for(i=0;i<24;i++)
             {
				var Visibility_Unit,Windspeed_Unit,Pressure_Unit;
				
				if(degree == "si"){
					
					Visibility_Unit = isNaN(json_data.hourly.data[i].visibility)?'NA':json_data.hourly.data[i].visibility+" kms";
					Windspeed_Unit = isNaN(json_data.hourly.data[i].windSpeed)?'NA':json_data.hourly.data[i].windSpeed+" m/s";
                    Pressure_Unit= isNaN(json_data.hourly.data[i].pressure)?'NA':json_data.hourly.data[i].pressure+" mb";
				}	
				else{
					
					Visibility_Unit = isNaN(json_data.hourly.data[i].visibility)?'NA':json_data.hourly.data[i].visibility+" mi";
					Windspeed_Unit = isNaN(json_data.hourly.data[i].windSpeed)?'NA':json_data.hourly.data[i].windSpeed+" mph";
                    Pressure_Unit= isNaN(json_data.hourly.data[i].pressure)?'NA':json_data.hourly.data[i].pressure+" hPa";
				}
				var rise =     moment.unix(json_data.hourly.data[i].time);
				var local   =  moment.tz(rise, "America/Los_Angeles");
				var t=rise.tz(timezone).format('hh:mm A');
				var icon=getIcon(json_data.hourly.data[i].icon);
                 HourlyTb+= "<div class='panel panel-default' style='margin:0px;'>";
                 HourlyTb+="<div class='panel-heading' style='background-color:white;'>";
				 HourlyTb+="<h4 class=\"panel-title\">";
                 HourlyTb+="<div class='row' style='text-align:center'>";
				 HourlyTb+="<div class='col-md-2 col-sm-2 col-xs-2 col-lg-2'>";
                 HourlyTb+= t+"</a>";
				 HourlyTb+= "</div>";  
                 HourlyTb+="<div class='col-md-3 col-sm-3 col-xs-3 col-lg-3'>";
                 HourlyTb+= "<img src='" + icon + "'alt='"+json_data.hourly.data[i].icon+ "'style='width:50px;height:50px'</img>";
				 HourlyTb+= "</div>";  
                 HourlyTb+="<div class='col-md-2 col-sm-2 col-xs-2 col-lg-2'>";
                 HourlyTb+= parseInt((json_data.hourly.data[i].cloudCover)*100) + "%";
				 HourlyTb+= "</div>";
                 HourlyTb+="<div class='col-md-2 col-sm-2 col-xs-2 col-lg-2'>";
				 HourlyTb+= json_data.hourly.data[i].temperature.toFixed(2); 
				 HourlyTb+= "</div>";
				 HourlyTb+="<div class='col-md-3 col-sm-3 col-xs-3 col-lg-3'>";
				 HourlyTb+=  "<a data-toggle='collapse' data-parent='#accordion' href='#collapse"+i+"'>";
				 HourlyTb+="<span class='glyphicon glyphicon-plus'></span></a>";
				 HourlyTb+= "</div>";			 
				 HourlyTb+= "</div>";     
				 HourlyTb+= "</h4>";
			     HourlyTb+= "</div>";
			     HourlyTb+=" <div id='collapse"+i + "'class='panel-collapse collapse'>";
                 HourlyTb+="<div class='panel-body' style='overflow:auto'>"
                 HourlyTb+="<table class=table>";
                 HourlyTb+="<tr style='background-color:white; font-size:13px;'>";
                 HourlyTb+="<th style='text-align:center'>Wind Speed</th>";
                 HourlyTb+="<th style='text-align:center'>Humidity</th>";
                 HourlyTb+="<th style='text-align:center'>Visibility</th>";
                 HourlyTb+="<th style='text-align:center'>Pressure</th>";
                 HourlyTb+="</tr>";
                 HourlyTb+="<tr style='font-size:12px'>";
                 HourlyTb+="<td style='text-align:center'>" +Windspeed_Unit ;
                 HourlyTb+="</td>";
                 HourlyTb+="<td style='text-align:center'>" + parseInt((json_data.hourly.data[i].humidity)*100) + "%";
                 HourlyTb+="</td>";
                 HourlyTb+="<td style='text-align:center'>" +Visibility_Unit ;
                 HourlyTb+="</td>";
                 HourlyTb+="<td style='text-align:center'>" +Pressure_Unit;
                 HourlyTb+="</td>";
                 HourlyTb+="</tr>";
                 HourlyTb+="</table>";
                 HourlyTb+= "</div>";
				 HourlyTb+= "</div>";
				 HourlyTb+="</div>";
            }
           $("#Expander").html(HourlyTb);
		}
		
		function getCurrentWeather(obj){
			$('#navid').css('visibility','visible');			
			//START OF TAB 1
			var summary_data = obj.currently.summary;
			var Temperature_Data = parseInt(obj.currently.temperature);
			var Precip_Data = obj.currently.precipIntensity;
			var current_precipitation;
			var current_precipprobability = obj.currently.precipProbability;
			var current_chanceofrain = 100 * current_precipprobability + " %";
			var address = document.getElementById("address").value;
			var city = document.getElementById("city").value;
			var state = document.getElementById("state").value;
			degree =  $('input[name="temperature"]:checked').val();
			var latitude=obj.latitude;
			var longitude=obj.longitude;
			var current_icon_name=obj.currently.icon;
			var icon_name;
			var current_tempmax = parseInt(obj.daily.data[0].temperatureMax);
			var current_tempmin = parseInt(obj.daily.data[0].temperatureMin);
			var current_sunrise = obj.daily.data[0].sunriseTime;
			var current_sunset = obj.daily.data[0].sunsetTime;
			var TimeZone = obj.timezone;
			var intermediate_sunrise=moment.unix(current_sunrise);
			var current_dewpoint = obj.currently.dewPoint;
			var humidity_data = parseInt(obj.currently.humidity * 100) + " %";
			var current_sunrise_formatted=intermediate_sunrise.tz(TimeZone).format("hh:mm A");
			var intermediate_sunset=moment.unix(current_sunset);
			var current_sunset_formatted=intermediate_sunset.tz(TimeZone).format("hh:mm A");
			var cf;
			var current_icon=getIcon(current_icon_name);
			if(degree == "si")
				Precip_Data=Precip_Data/25.4;
			if(Precip_Data <0.002){
				current_precipitation = "None";
			}
			else if(Precip_Data < 0.017 && Precip_Data >= 0.002){
				current_precipitation = "Very Light";
			}
			else if(Precip_Data < 0.1 && Precip_Data >= 0.017){
				current_precipitation = "Light";
			}
			else if(Precip_Data < 0.4 && Precip_Data >= 0.1){
				current_precipitation = "Moderate";
			}
			else if(Precip_Data >= 0.4){
				current_precipitation = "Heavy";
			}
			
			if(degree == "si"){
				cf = "&#176;C";
				current_dewpoint += "&#176;C";
				var visibilty_data = isNaN(obj.currently.visibility)?'NA':(obj.currently.visibility).toFixed(2)+" km";
				var windspeed_data = isNaN(obj.currently.windSpeed)?'NA':(obj.currently.windSpeed).toFixed(2)+" m/s";
			}	
			else{
				cf = "&#176;F";
				current_dewpoint += "&#176;F";
				var visibilty_data = isNaN(obj.currently.visibility)?'NA':(obj.currently.visibility).toFixed(2)+" mi";
				var windspeed_data = isNaN(obj.currently.windSpeed)?'NA':(obj.currently.windSpeed).toFixed(2)+" mph";
			}
			//global values required for FB
			facebook_address = city + ", " + state;
			facebook_icon = current_icon;
			facebook_summary = summary_data;
			facebook_temperature = Temperature_Data;
			facebook_cf = cf;
			//global values required for FB ends here
			var TabOne = "<div style='background-color:#F27E7F' class='row'>";
			TabOne+="<div align=center class=' col-md-6 col-sm-6'><img style='display:block;width:130px;height:130px;margin-top:10px;' title='"+ summary_data +"' alt='"+ summary_data + "' src='" + current_icon + "'/></div>";
			TabOne+="<div align='center' class='col-md-6'><span style='color:white'>" + summary_data + " in " + city + ", " + state + "<br>" + "<span style='font-size:60px;font-weight:400;'>" + Temperature_Data + "</span><span style='font-size:16px;position:relative;top:-2.0em;'>" + cf + "</span><br>" + "<span><img style='margin-right:10px;margin-bottom:10px;display:inline-block;' src='http://cs-server.usc.edu:45678/hw/hw8/images/fb_icon.png' class='img-responsive pull-right' width=35px height=35px title= 'post in fb' onclick=postToFeed()> "+"<span style='color:blue;line-height:3;'>L: " + current_tempmax + "&#176;</span>" + "<span style='color:black;line-height:3;'> | </span>" + "<span style='color:green;line-height:3;'>H: " +current_tempmin + "&#176;</span></span></span>" + "</div>";
			TabOne+="</div>";
			TabOne+="<div class='row'><div style='line-height: 250%;background-color:#F9F9F9' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Precipitation</div><div class='col-md-5 col-xs-5 col-sm-5'>" + current_precipitation + "</div></div></div>";
			TabOne+="<div class='row'><div style='line-height: 250%;background-color:#F2DEDE' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Chance of Rain</div><div class='col-md-5 col-xs-5 col-sm-5'>" + current_chanceofrain + "</div></div></div>";
			TabOne+="<div class='row'><div style='line-height: 250%;background-color:#F9F9F9' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Wind Speed</div><div class='col-md-5 col-xs-5 col-sm-5'>" + windspeed_data + "</div></div></div>";
			TabOne+="<div class='row'><div style='line-height: 250%;background-color:#F2DEDE' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Dew Point</div><div class='col-md-5 col-xs-5 col-sm-5'> " + current_dewpoint + "</div></div></div>";
			TabOne+="<div class='row'><div style='line-height: 250%;background-color:#F9F9F9' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Humidity</div><div class='col-md-5 col-xs-5 col-sm-5'> " + humidity_data + "</div></div></div>";
			TabOne+="<div class='row'><div style='line-height: 250%;background-color:#F2DEDE' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Visibility</div><div class='col-md-5 col-xs-5 col-sm-5'> " + visibilty_data + " </div></div></div>";
			TabOne+="<div class='row'><div style='line-height: 250%;background-color:#F9F9F9' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Sunrise</div><div class='col-md-5 col-xs-5 col-sm-5'> " + current_sunrise_formatted + " </div></div></div>";
			TabOne+="<div class='row'><div style='line-height: 250%;background-color:#F2DEDE' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Sunset</div><div class='col-md-5 col-xs-5 col-sm-5'> " + current_sunset_formatted + " </div></div></div>";
			$('#TableTab').html(TabOne);

			//open map code starts here
			$(function() {
				$('#basicMap').html("");
				var map = new OpenLayers.Map("basicMap");
				var mapnik = new OpenLayers.Layer.OSM();

				var layer_cloud = new OpenLayers.Layer.XYZ(
						"clouds",
						"http://${s}.tile.openweathermap.org/map/clouds/${z}/${x}/${y}.png",
					{
						isBaseLayer: false,
						opacity: 1.5,
						sphericalMercator: true
					}
				);
				var layer_precipitation = new OpenLayers.Layer.XYZ(
						"precipitation",
						"http://${s}.tile.openweathermap.org/map/precipitation/${z}/${x}/${y}.png",
					{
						isBaseLayer: false,
						opacity: 1.5,
						sphericalMercator: true
					}
				);
				map.addLayers([mapnik, layer_precipitation, layer_cloud]);
				map.addControl(new OpenLayers.Control.LayerSwitcher());     
			
				var lonlat = new OpenLayers.LonLat(longitude, latitude).transform(
					new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
					map.getProjectionObject() // to Spherical Mercator Projection
				);
				map.setCenter( lonlat, 7 );		
				
				var markers = new OpenLayers.Layer.Markers( "Markers" );
				map.addLayer(markers);
				markers.addMarker(new OpenLayers.Marker(lonlat));
				
			});
					//open map code ends here
					
					// END OF TAB 1
		}
				 
		function getIcon(current_icon_name){
			var current_icon="http://cs-server.usc.edu:45678/hw/hw8/images/";
			if(current_icon_name == "clear-day")
				current_icon += "clear.png";
			else if(current_icon_name == "clear-night")
				current_icon += "clear_night.png";
			else if(current_icon_name == "partly-cloudy-day")
				current_icon += "cloud_day.png";
			else if(current_icon_name == "partly-cloudy-night")
				current_icon += "cloud_night.png";
			else
				current_icon+= current_icon_name+".png";
			return current_icon;
		} 
});

