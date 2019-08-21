


    function html( selected_country ){

        document.getElementById("SelectedCountry").innerHTML = selected_country.country[language];

        var rankings = data_ranking.filter(function(d){ return d.iso3 == selected_country.iso3})[0];
        document.getElementById("RankingHDI").innerHTML = rankings["HDI"];
        document.getElementById("RankingGII").innerHTML = rankings["GII"]; 
        document.getElementById("RankingIIAG").innerHTML = rankings["IIAG"];
        document.getElementById("RankingEODB").innerHTML =rankings["EODB"]; 
        document.getElementById("RankingCPI").innerHTML =rankings["CPI"];  

        document.getElementById("GDPValue").innerHTML = selected_country.gdp.forecast[language].value;
        document.getElementById("GDPYear").innerHTML = selected_country.gdp.forecast[language].year;
        document.getElementById("GDPText").innerHTML = selected_country.gdp.text[language];

        document.getElementById("CABValue").innerHTML = selected_country.cab.cab[language].value;
        document.getElementById("CABYear").innerHTML = selected_country.cab.cab[language].year;
        document.getElementById("CABText").innerHTML = selected_country.cab.text[language];        

        document.getElementById("ARIIREC").innerHTML = selected_country.arii[0].rec_name[language];
        document.getElementById("ARII_Freemovement").innerHTML = selected_country.arii[0].rankings[0];
        document.getElementById("ARII_Trade").innerHTML = selected_country.arii[0].rankings[1];
        document.getElementById("ARII_Productive").innerHTML = selected_country.arii[0].rankings[2];
        document.getElementById("ARII_Infra").innerHTML = selected_country.arii[0].rankings[3];
        document.getElementById("ARII_Finance").innerHTML = selected_country.arii[0].rankings[4];

        document.getElementById("PopulationValue").innerHTML = selected_country.population.forecast[language].value;
        document.getElementById("PopulationYear").innerHTML = selected_country.population.forecast[language].year;
        document.getElementById("PopulationText").innerHTML = selected_country.population.text[language];

    }



    function map (selected_country){

        var width = 350, 
        height = 300, 
        margin = 15, 
        stroke_width = 0.5;
        var map_width = width - margin*2,
        map_height = height - margin*2;


        var svg = d3.selectAll("#SVG_Map").append("svg")
            .attr("width", width).attr("height", height)
            .append("g").attr("transform", "translate(" + margin + "," + margin + ")")
            .attr("font-family", font_family);


        var ft_projection = d3.geo.equirectangular()
          .scale(200).center( [11,3] ).translate( [map_width/2, map_height/2] ); 
        var ft_geoPath = d3.geo.path().projection( ft_projection );


        svg.selectAll("path")
            .data(mapdata).enter()
            .append("path")
            .attr("d", ft_geoPath)
            .attr("stroke-width", stroke_width)
            .attr("stroke", function(d){ return (d.properties.ISO3 ==  selected_country.iso3)? "#0D598E":"#F6F6F6" })
            .attr("fill", function(d){ return (d.properties.ISO3 == selected_country.iso3)? "#0D598E":"#C7C8CA"})

       
        svg.selectAll("text")
            .data(selected_country.information[language]).enter()
            .append("text")
            .attr("text-anchor", "first")
            .text(function(d){return d.name + ": " + d.value})
            .attr("font-size", font_size)
            .attr("x", 30)
            .attr("y", function(d,i ){ return 210 +i*1.5*font_size})
            .attr("font-weight", "bold");


        var markerCoord = countryNames.filter(function(d){ return d.iso3 == selected_country.iso3})[0];

        svg.append("path")
            .attr("id", "marker")
            .attr("transform", "translate(" + markerCoord.x + "," + markerCoord.y + ")")
            .attr("d", "M0,0 C-10,-15 -10,-30 0,-30 C10,-30 10,-15 0,0")
            .attr("fill", "#0D598E")
            .attr("stroke-width", 1)
            .attr("stroke", "white")
        svg.append("circle")
            .attr("id", "marker")
            .attr("transform", "translate(" + markerCoord.x + "," + (markerCoord.y) + ")")
            .attr("cy", -20)
            .attr("fill","white")
            .attr("r",4);


    }


    function map_update (selected_country){

        var map_update = d3.selectAll("#SVG_Map").selectAll("path").data(mapdata);
        map_update.enter().append("path");
        map_update.attr("fill", function(d){ return (d.properties.ISO3 == selected_country.iso3)? "#0D598E":"#C7C8CA"})        
            .attr("stroke", function(d){ return (d.properties.ISO3 ==  selected_country.iso3)? "#0D598E":"#F6F6F6" })

        var map_update2 = d3.selectAll("#SVG_Map").selectAll("text").data(selected_country.information[language]);
        map_update2.enter().append("text");
        map_update2.text(function(d){return d.name + ": " + d.value});

        var markerCoord = countryNames.filter(function(d){ return d.iso3 == selected_country.iso3})[0];
        var map_update3 = d3.selectAll("#SVG_Map").selectAll("#marker");
        map_update3.attr("transform", "translate(" + markerCoord.x + "," + markerCoord.y + ")")

    }



    function GDP( selected_country ){

        var width = 550, 
            height = 300,    
            margin_top = 30,
            margin_bottom = 30,
            margin_left = 53,
            margin_right = 70;
     
        var chart_height = (height - margin_top - margin_bottom),
        chart_width = (width - margin_right - margin_left);

        var data = selected_country.gdp.data;
        data.forEach(function(d){ return  d.values = d.raw.map(function(d2,i) { return {year: selected_country.gdp.year[i], value: d2}})});
        data.forEach(function(d){ return  d.color = ( d.level == "region")? color_excel["blue"]:((d.level == "sub-region")? color_excel["green"]:color_excel["red"])});

        var ft_time = d3.scale.ordinal().domain(selected_country.gdp.year).rangeBands([0, chart_width], 0.4,0.4),
        ft_y = d3.scale.linear().domain(selected_country.gdp.extent).range([chart_height, 0]),
        ft_line = d3.svg.line().interpolate("linear")
            .x(function(d) { return ft_time(d.year) + ft_time.rangeBand()/2; })
            .y(function(d) { return ft_y(d.value); }).defined(function(d){ return d.value != "NA"})

        var  ft_time_axis = d3.svg.axis().scale(ft_time).orient("bottom"),
        ft_y_axis = d3.svg.axis().scale(ft_y).orient("left").ticks(5).innerTickSize(-chart_width).outerTickSize(5).tickPadding(10);


        var svg = d3.select("#SVG_GDP").append("svg")
            .attr("width", width).attr("height",height)
            .append("g")
            .attr("transform", "translate(" + margin_left  + "," + margin_top + ")")
            .attr("font-family",font_family);

        svg.append("path").attr("d", "M0," + ft_y(0) + " L" + chart_width + "," + ft_y(0) + " Z").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey");

        svg.selectAll("path_gdp")
            .data(data).enter().append("path")
            .attr("d", function(d){ return ft_line(d.values) })
            .attr("fill", "none")
            .attr("stroke", function(d){ return d.color})
            .attr("stroke-width", 2)

        svg.append("g")
            .attr("id", "time_axis")
            .attr("transform", "translate(0," + chart_height + ")")
            .call(ft_time_axis)

        d3.selectAll("#time_axis path").attr("fill", "none").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey");
        d3.selectAll("#time_axis line").attr("fill", "none").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey");

        svg.append("g")
          .attr("id", "yaxis")
          .call(ft_y_axis)
          .append("text")
          .attr("y", -note_font_size)
          .text((language == "FR")? "(pourcentage)":"(percentage)")
          .attr("font-size", note_font_size)
          .attr("text-anchor", "middle")
    
        d3.selectAll("#yaxis path").attr("fill", "none").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey");
        d3.selectAll("#yaxis .tick line").attr("stroke-width",0.7).attr("stroke","grey").attr("stroke-dasharray", ("3,3"));
        
        var temp =  data.map(function(d){ return d.values.map(function(d2){ return {name: d.name, color: d.color, value: d2.value, year: d2.year} })});
        var data_circle = temp[0];
        for (var i = 1; i<data.length ; i++){ 
          data_circle = data_circle.concat( temp[i])
        };

        svg.selectAll("circle")
          .data(data_circle).enter()
          .append("circle")
          .attr("cx", function(d) { return ft_time(d.year) + ft_time.rangeBand()/2; })
          .attr("cy", function(d) { return ft_y(d.value); })
          .attr("r", function(d){ return (d.value == "NA")? 0:circle_r} )
          .attr("fill",  function(d) { return d.color; });

        svg.selectAll("label")
          .data(data).enter()
          .append("text")
          .attr("id", function(d){ return "label_"+ d.level})
          .attr("transform", "translate(" + (chart_width-ft_time.rangeBand()/2-1.2*label_font_size)+ ",0)")
          .attr("y", function(d){ return ft_y(d.values[d.values.length-1].value) + note_font_size/2 })
          .attr("fill", function(d) { return d.color; })
          .text(function(d) { return d.name[language]; })
          .attr("font-size", label_font_size);

          // d3.select("#label_country").attr("y", selected_country.gdp.data[2].raw[4] ) 

    };


    function GDP_update (selected_country){

        d3.select("#SVG_GDP svg").remove();
        GDP( selected_country);

    }



    function CAB(selected_country){


        var width = 550, 
            height = 300,     
            margin_top = 30,
            margin_bottom = 30,
            margin_left = 53,
            margin_right = 120;
        var chart_height = (height - margin_top - margin_bottom),
            chart_width = (width - margin_right - margin_left);


        var data = selected_country.cab.data;
        data.forEach(function(d){ return d.values = d.raw.map(function(d2,i){ return {year: selected_country.cab.year[i], value: d2}})});
    

        var ft_time = d3.scale.ordinal().domain( selected_country.cab.year ).rangeBands([0, chart_width], 0.5, 0.2),
        ft_y = d3.scale.linear().domain(selected_country.cab.y_extent).range([chart_height, 0]),
        ft_line = d3.svg.line().interpolate("linear")
          .x(function(d) { return ft_time(d.year)+ ft_time.rangeBand()/2 })
          .y(function(d) { return ft_y(d.value); });


        var ft_y_axis = d3.svg.axis().scale(ft_y).orient("left").ticks(5).innerTickSize(-chart_width).outerTickSize(3).tickPadding(10), 
            ft_time_axis = d3.svg.axis().scale(ft_time).orient("bottom").ticks(5);

        var ft_stack = d3.layout.stack().values(function(d){ return (d.values)})
            .x(function(d){ return (d.year)})
            .y(function(d){ return Math.abs(d.value)});


        var svg = d3.select("#SVG_CAB").append("svg")
            .attr("width", width)
            .attr("height",height)
            .append("g")
            .attr("transform", "translate(" + margin_left  + "," + margin_top + ")")
            .attr("font-family", font_family);    


        svg.append("g")
            .attr("id", "yaxis")
            .call(ft_y_axis)
            .selectAll("text")
            .text(function(d){ return (language == "FR")? ft_FR(d3.format(",.0f")(d)):d3.format(",.0f")(d) } )

        svg.append("text")
            .attr("y", -note_font_size)
            .text(selected_country.cab.y_axis_unit[language])
            .attr("font-size", note_font_size)
            .attr("text-anchor", "middle")
        

        d3.selectAll("#yaxis path").attr("fill", "none").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey")
        d3.selectAll("#yaxis .tick line").attr("stroke-width",0.7).attr("stroke","grey").attr("stroke-dasharray", ("3,3"));
        svg.append("path").attr("d", "M0," + ft_y(0) + " L" + chart_width + "," + ft_y(0) + " Z").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey");


        svg.append("g")
            .attr("id", "xaxis")
            .attr("transform", "translate(0," + chart_height + ")")
            .call(ft_time_axis)

        d3.selectAll("#xaxis path").attr("fill", "none").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey")
        d3.selectAll("#xaxis line").attr("fill", "none").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey")


        var data_stacked = ft_stack(data.filter(function(d,i){ return i>0}));

        var layers = svg.selectAll("layers")
            .data(data_stacked, function(d){ return d.variable[language]}).enter()
            .append("g")
            .attr("class", function(d){ return "layers:" + d.variable[language]} )
            .attr("fill", function(d){ return d.color});

        var data_negativePart = selected_country.cab.year.map( function(d, i){ 
            return d3.sum( data.filter(function(d,i){ return i >0 }), function(d2){ return (d2.values[i].value<0)? Math.abs(d2.values[i].value):0 } )
        })

        layers.selectAll("rect")
            .data(function(d){ return d.values}).enter()
            .append("rect")
            .attr("transform", function(d,i){ return "translate(0," + (ft_y(0)-ft_y(data_negativePart[i])) + ")"})
            .attr("x", function(d){ return ft_time(d.year)})
            .attr("y", function(d){ return ft_y(d.y + d.y0) })
            .attr("width", ft_time.rangeBand())
            .attr("height", function(d){ return ft_y(0) -  ft_y(d.y)})

        svg.selectAll("variable_label")
          .data(data_stacked).enter()
          .append("text")
          .attr("transform", "translate(" + (chart_width) + "," + (ft_y(0)-ft_y(data_negativePart[data_negativePart.length-1])) + ")")
          .attr("y", function(d){ return ft_y(d.values[d.values.length-1].y + d.values[d.values.length-1].y0)  + (ft_y(0)-ft_y(d.values[d.values.length-1].y) )/2})
          .style("fill", function(d) { return d.color; })
          .text(function(d) { return d.variable[language]; })
          .attr("font-size", label_font_size);


        svg.selectAll("line_chart")
            .data(data.filter(function(d,i){ return i==0 })).enter()
            .append("path")
            .attr("d", function(d){ return ft_line(d.values)})
            .attr("fill", "none")
            .attr("stroke", function(d) { return d.color; })
            .attr("stroke-width", stroke_width);

        svg.selectAll("circle")
            .data(data.filter(function(d,i){ return i==0 })[0].values).enter()
            .append("circle")
            .attr("cy", function(d){ return  ft_y(d.value)})
            .attr("cx", function(d){ return ft_time(d.year)+ ft_time.rangeBand()/2 })
            .attr("r", function(d){ return circle_r })
            .attr("fill", data.filter(function(d,i){ return i==0})[0].color  )

        svg.selectAll("text_number")
          .data(data.filter(function(d,i){ return i==0 })[0].values).enter()
          .append("text")      
          .attr("fill", data.filter(function(d,i){ return i==0})[0].color  )
          .attr("font-size", label_font_size)
          .attr("text-anchor", "middle")
          .attr("x", function(d) { return ft_time(d.year) + ft_time.rangeBand()/2  })
          .attr("y", function(d) { return ft_y(d.value) - 0.5*label_font_size })
          .text(function(d){ return (language == "FR")? (ft_FR( d3.format(",.1f")(d.value))):( d3.format(",.1f")(d.value) ) });

        svg.selectAll("variable_label2")
          .data(data.filter(function(d,i){ return i==0})).enter()
          .append("text")      
          .attr("x", chart_width)
          .attr("y", function(d) { return ft_y(d.values[d.values.length-1].value) + label_font_size/2 })
          .style("fill", function(d) { return d.color; })
          .text(function(d) { return d.variable[language]; })
          .attr("font-size", label_font_size);

   }

    function CAB_update (selected_country){

        d3.select("#SVG_CAB svg").remove();
        CAB( selected_country);

    }



    function ARII( selected_country ){

        var width = 530, 
            height = 300,     
            margin_top = 7,
            margin_bottom = 118,
            margin_left = 53,
            margin_right = 30;

        var chart_height = (height - margin_top - margin_bottom),
            chart_width = (width - margin_right - margin_left);

        var data = data_arii.filter(function(d){ return d.rec == selected_country.arii[0].rec })[0].data;
        data.sort(function(a, b){ return d3.descending(a.value, b.value); })
        data.forEach( function(d){ return d.countryName = (language == "FR")? countryNames.filter(function(d2){ return d2.iso3 == d.iso3})[0].countryNameFR:countryNames.filter(function(d2){ return d2.iso3 == d.iso3})[0].countryName})

        var ft_country = d3.scale.ordinal().domain(data.map(function(d){ return d.countryName})).rangeBands([0, chart_width], 0.4,0.4),
        ft_y = d3.scale.linear().domain([0,1]).range([chart_height, 0]);

        var ft_country_axis = d3.svg.axis().scale(ft_country).orient("bottom"),
        ft_y_axis = d3.svg.axis().scale(ft_y).orient("left").ticks(5).outerTickSize(5).innerTickSize(5).tickPadding(10);


        var svg = d3.select("#SVG_ARII").append("svg")
            .attr("width", width)
            .attr("height",height)
            .append("g")
            .attr("transform", "translate(" + margin_left  + "," + margin_top + ")")
            .attr("font-family",font_family);

        svg.selectAll("rect")
        .data(data).enter()
        .append("rect")
        .attr("y", function(d){ return ft_y(d.value)})
        .attr("x", function(d){ return ft_country(d.countryName ) })
        .attr("width", ft_country.rangeBand())
        .attr("height", function(d){ return ft_y(0)-ft_y(d.value) })
        .attr("fill", function(d){ return (d.iso3==selected_country.iso3)? color_excel["red"]:"#C7C8CA"} );


        svg.append("g")
            .attr("id", "country_axis")
            .attr("transform", "translate(0," + chart_height + ")")
            .call(ft_country_axis)
            .selectAll("text")
            .attr("font-size", label_font_size)
            .attr("y", 0)
            .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(90)")
                .style("text-anchor", "start");

        d3.selectAll("#country_axis path").attr("fill", "none").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey")
        d3.selectAll("#country_axis line").attr("fill", "none").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey")


        svg.append("g")
          .attr("id", "yaxis")
          .call(ft_y_axis)
            .selectAll("text")
            .text(function(d){ return (language == "FR")? ft_FR(d3.format(".1f")(d)):d3.format(".1f")(d) } )
        
        d3.selectAll("#yaxis path").attr("fill", "none").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey");
        d3.selectAll("#yaxis .tick line").attr("stroke-width",0.7).attr("stroke","grey").attr("stroke-dasharray", ("3,3"));


        svg.append("text")
            .text((language == "FR")? "Classement général":"Overall rank")
            .attr("y",font_size*2 )
            .attr("x", chart_width)
            .attr("text-anchor", "end")
            .attr("font-size", font_size*3)
            .attr("fill", color_excel["red"])     

        var last_digit = selected_country.arii[0].overall.toString().slice(-1);
        svg.append("text")
            .text( selected_country.arii[0].overall )
            .attr("y",font_size*8 )
            .attr("x", chart_width)
            .attr("text-anchor", "end")
            .attr("font-size", font_size*5)
            .attr("font-weight", "bold")
            .attr("fill", color_excel["red"]);   


        svg.selectAll("text_na")
            .data(data.filter(function(d){ return d.value < 0 })).enter()
            .append("text")
            .text("n/a")
            .attr("y", function(d){ return ft_y(0.05)})
            .attr("x", function(d){ return ft_country(d.countryName ) + ft_country.rangeBand()/2 })
            .attr("text-anchor", "middle")
            .attr("fill", "#C7C8CA" )
    }

    function ARII_update (selected_country){

        d3.select("#SVG_ARII svg").remove();
        ARII( selected_country);

    }



    function trade(selected_country, importExport, SvgID){ 

        var height = ( (selected_country.iso3 == "SOM")||(selected_country.iso3 == "DJI") )? 50:250;
        var width = 470,
            margin = 30,
            radius = Math.min(width, height) / 2;

        // var data = selected_country.trade.filter(function(d){ return d.trade == importExport})[0].data[language];
        // data.forEach(function(d,i){ return d.order_original = i })

        var data = selected_country.trade.filter(function(d){ return d.trade == importExport})[0].data;
        data.forEach(function(d,i){  return d.order_original = i}) 
        data.forEach(function(d,i){  return d.variable_language = d.variable[language] }) 
        
        var svg = d3.select(SvgID)
            .append("svg")
            .attr("width", width)
            .attr("height",height)
            .append("g")
            .attr("transform", "translate(" + (height / 2 + margin) + "," + height / 2 + ")");

        var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) { return d.value;  });

        var arc = d3.svg.arc()
          .outerRadius(radius * 0.8)
          .innerRadius(radius * 0.4);

        var outerArc = d3.svg.arc()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9);


        data.sort(function(a,b){ return d3.descending(a.value, b.value)})
        data.forEach( function(d,i){ return d.color = color_list[i] });
        data.sort(function(a,b){ return d3.ascending(a.order_original, b.order_original)})

        svg.selectAll("path.slice")
            .data(pie(data)).enter()
            .append("path")
            .attr("fill", function(d) { return (d.data.color); })
            .attr("stroke", "white").attr("stroke-width", stroke_width/2)
            .attr("d", arc);


        function midAngle(d){ return d.startAngle + (d.endAngle - d.startAngle)/2; }

        svg.selectAll("text_numbers")
            .data(pie(data)).enter()
            .append("text")
            .attr("dy", ".35em")
            .text(function(d) {  
                var number = d3.format(".1f")( 100*d.data.value/d3.sum(data, function(d2){ return d2.value}));
                return (language == "FR")? (ft_FR(number)+"%"):(number+"%") 
            })
            .attr("font-size", label_font_size)
            .attr("transform", function(d) {
                var pos = outerArc.centroid(d);
                pos[0] = 0.85*radius * ( (midAngle(d) < Math.PI) ? 1 : -1);
                return "translate("+ pos +")";
            })
            .attr("text-anchor", function(d){ return (midAngle(d) < Math.PI )? "start":"end"; })

        svg.selectAll("polyline")
            .data(pie(data), function(d){ return d.data.variable_language; }).enter()
            .append("polyline")
            .attr("fill", "none")
            .attr("stroke", "lightgrey")
            .attr("stroke-width",1)
            .attr("points", function(d){
                var pos = outerArc.centroid(d);
                pos[0] = radius * 0.80 * (midAngle(d) < Math.PI ? 1 : -1);
                return [arc.centroid(d), outerArc.centroid(d), pos];
            })     

        svg.append("text").attr("y", 15).text(selected_country.trade.filter(function(d){ return d.trade == importExport})[0].center_label[language][1]).attr("font-size", 10).attr("text-anchor", "middle")
        svg.append("text").text( selected_country.trade.filter(function(d){ return d.trade == importExport})[0].center_label[language][0]).attr("font-size", 15).attr("text-anchor", (selected_country.iso3 == "SOM")? "start":"middle").attr("font-weight","bold")

        data.sort(function(a,b){ return d3.descending(a.value, b.value)})


        svg.selectAll("legend_rect")
            .data(data).enter()
            .append("rect")
            .attr("transform", "translate(0," + (-0.5*data.length*1.5*label_font_size) + ")")
            .attr("x", radius + margin)
            .attr("y", function(d,i){ return  i*1.5*label_font_size } )
            .attr("width", legend_rect_width).attr("height", legend_rect_width)
            .attr("fill", function(d) { return (d.color); })

        svg.append("text")
            .attr("transform", "translate(0," + (-0.5*data.length*1.5*label_font_size - 0.8*label_font_size) + ")")
            .selectAll("abc")
            .data(data).enter()
            .append("tspan")
            .attr("font-size", label_font_size)
            .attr("x", radius + margin + 1.5*legend_rect_width)
            .attr("dy", 1.5*label_font_size)
            .text(function(d){ return d.variable_language})



    }

    function trade_update (selected_country){

        d3.select("#SVG_Import svg").remove();
        d3.select("#SVG_Export svg").remove();
        trade(selected_country, "import", "#SVG_Import" )
        trade(selected_country, "export", "#SVG_Export" )

    }



    function population(selected_country){


        var width = 550, 
            height = 300,    
            margin_top = 30,
            margin_bottom = 30,
            margin_left = 53,
            margin_right = 70;

        var chart_height = (height - margin_top - margin_bottom),
        chart_width = (width - margin_right - margin_left);

        var svg = d3.select("#SVG_Population").append("svg")
            .attr("width", width)
            .attr("height",height)
            .append("g")
            .attr("transform", "translate(" + margin_left  + "," + margin_top + ")")
            .attr("font-family", font_family);
    
        var data = selected_country.population.data;

        var ft_time = d3.scale.ordinal().domain(data[0].values.map(function(d){ return d.year})).rangeBands([0, chart_width], 0.5, 0.2),
        ft_y = d3.scale.linear().domain(selected_country.population.y_extent).range([chart_height, 0]);

        var ft_y_axis = d3.svg.axis().scale(ft_y).orient("left").ticks(5).innerTickSize(-chart_width).outerTickSize(3).tickPadding(10),
        ft_time_axis = d3.svg.axis().scale(ft_time).orient("bottom");


        var ft_stack = d3.layout.stack()
            .values(function(d){ return d.values})
            .x(function(d){ return d.year })
            .y(function(d){ return d.value});

        var data_stacked = ft_stack(data);
        data_stacked.forEach(function(d){ d.values.forEach(function(d2){ d2.color = d.color; })  });

        svg.append("g")
          .attr("id", "yaxis")
          .call(ft_y_axis)
          .selectAll("text")
            .text(function(d){ return (language == "FR")? ft_FR(d3.format(",")(d)):d3.format(",")(d) } )


        svg.append("text")
          .attr("y", -note_font_size)
          .text(selected_country.population.y_axis_unit[language])
          .attr("font-size", note_font_size)
          .attr("text-anchor", "middle")
      
        d3.selectAll("#yaxis path").attr("fill", "none").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey")
        d3.selectAll("#yaxis .tick line").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey").attr("stroke-dasharray", ("3,3"));

        var data_bar = data_stacked[0].values;
        for (var i = 1; i<data.length ; i++){
            data_bar = data_bar.concat( data_stacked[i].values)
        };

        svg.selectAll("rect")
          .data(data_bar).enter()
          .append("rect")
          .attr("x", function(d){ return ft_time(d.year)})
          .attr("y", function(d){ return ft_y(d.y + d.y0)})
          .attr("width", ft_time.rangeBand())
          .attr("height", function(d){ return ft_y(0)-ft_y(d.value) })
          .attr("fill",  function(d){ return d.color});

        svg.append("g")
            .attr("id", "xaxis")
            .attr("transform", "translate(0," + chart_height + ")")
            .call(ft_time_axis)
            .selectAll("text")


        d3.selectAll("#xaxis path").attr("fill", "none").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey")
        d3.selectAll("#xaxis line").attr("fill", "none").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey")

        data.reverse();

        svg.selectAll("rect_legend")
          .data(data).enter()
          .append("rect")
          .attr("transform", "translate(" + chart_width + ",0)")
          .attr("x", margin_right*0.1 -legend_rect_width/2)
          .attr("y", function(d,i){ return (i+1)*(chart_height/(data.length+1)) - legend_rect_width/2} )
          .attr("width", legend_rect_width)
          .attr("height", legend_rect_width)
          .attr("fill", function(d){ return d.color})

        svg.selectAll("text_legend")
          .data(data).enter()
          .append("text")
          .attr("transform", "translate(" + chart_width + ",0)")
          .attr("x", margin_right*0.1  + legend_rect_width)
          .attr("y", function(d,i){ return (i+1)*(chart_height/(data.length+1)) + legend_rect_width/2} )
          .text(function(d){ return d.variable})
          .attr("font-size", legend_font_size)


        var data_number = data[0].values
        for (var i=1; i<data.length;i++){
            data_number = data_number.concat(data[i].values)
        };

        svg.selectAll("text_number")
          .data(data_number).enter()
          .append("text")
          .attr("x", function(d){ return ft_time(d.year)+ ft_time.rangeBand()/2})
          .attr("y", function(d){ return ft_y(d.y + d.y0) + ( ft_y(0)-ft_y(d.value))/2 + legend_font_size/2})
          .text(function(d){ return (language =="FR")? ft_FR(d3.format(",.1f")(d.value)):d3.format(",.1f")(d.value)})
          .attr("fill", "black")
          .attr("text-anchor", "middle")
          .attr("font-size", legend_font_size);

    }

    function population_update (selected_country){

        d3.select("#SVG_Population svg").remove();
        population( selected_country);
    }




    function health (selected_country, childMother, SvgID){ 

        var width = (childMother == "child")? 550:350, 
            height = 300,     
            margin_top = 30,
            margin_bottom = 60,
            margin_left = 54,
            margin_right = 50;

        var chart_height = (height - margin_top - margin_bottom),
            chart_width = (width - margin_right - margin_left);


        var selected = selected_country.health.filter(function(d){ return d.health == childMother})[0],
        data = selected.data;
        data.forEach(function(d){ return d.values = d.raw.map(function(d2,i){ return {year: selected.year[i], color: d.color, value: d2, variable: d.variable[language]} } )   });


        var ft_time = d3.scale.ordinal().domain(selected.year).rangeBands([0, chart_width], 0.1, 0.1),
        ft_y = d3.scale.linear().domain(selected.y_extent).range([chart_height, 0]),
        ft_group = d3.scale.ordinal().domain(data.map(function(d){ return d.variable[language]})).rangeBands([0, ft_time.rangeBand()], 0.1, 0.1);

        var ft_y_axis = d3.svg.axis().scale(ft_y).orient("left").ticks(5).innerTickSize(-chart_width).outerTickSize(3).tickPadding(10),
        ft_time_axis = d3.svg.axis().scale(ft_time).orient("bottom");


        var svg = d3.select(SvgID).append("svg")
            .attr("width", width).attr("height",height)
            .append("g")
            .attr("transform", "translate(" + margin_left  + "," + margin_top + ")")
            .attr("font-family", font_family);    

        svg.append("g")
          .attr("id", "yaxis")
          .call(ft_y_axis)
          .append("text")
          .attr("y", -note_font_size)
          .text(selected.y_axis_unit[language])
          .attr("font-size", note_font_size)
          .attr("text-anchor", "middle")
      
        svg.selectAll("#yaxis path").attr("fill", "none").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey")
        svg.selectAll("#yaxis .tick line").attr("stroke-width",0.7).attr("stroke","grey").attr("stroke-dasharray", ("3,3"));


        var bars = svg.selectAll("bars")
            .data(data, function(d){ return d.variable[language]}).enter()
            .append("g")
            .attr("class", function(d){ return "bars:" + d.variable[language]} )
            .attr("fill", function(d){ return d.color});

        bars.selectAll("rect")
            .data(function(d){ return d.values}).enter()
            .append("rect")
            .attr("x", function(d){ return ft_time(d.year) + ft_group(d.variable)})
            .attr("y", function(d){ return (d.value=="NA")? ft_y(0):ft_y(d.value) })
            .attr("width", ft_group.rangeBand())
            .attr("height", function(d){ return (d.value=="NA")? 0:(ft_y(0) -  ft_y(d.value))})

        bars.selectAll("text")
            .data(function(d){ return d.values}).enter()
            .append("text")
            .attr("x", function(d){ return ft_time(d.year) + ft_group(d.variable) +ft_group.rangeBand()/2;})
            .attr("y", function(d){ return (d.value=="NA")? (chart_height-label_font_size/2):(ft_y(d.value) -label_font_size/2) })
            .attr("text-anchor", "middle")
            .attr("fill", function(d){ return d.color})
            .attr("font-size", label_font_size)
            .text(function(d){ return (d.value=="NA")? "n/a":d3.format(",f")(d.value) })

        svg.append("g")
            .attr("id", "xaxis")
            .attr("transform", "translate(0," + chart_height + ")")
            .call(ft_time_axis)
            .attr("font-size", label_font_size)
                    
        svg.selectAll("#xaxis path").attr("fill", "none").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey")
        svg.selectAll("#xaxis line").attr("fill", "none").attr("shape-rendering", "crispEdges").attr("stroke-width",1).attr("stroke","grey")



        var legend = svg.selectAll("legend") 
            .data(data).enter()
            .append("g")
            .attr("transform", "translate(" + ((childMother == "child")? chart_width/5:chart_width/3) + "," + (chart_height + margin_bottom/2) + ")")

        legend.append("rect")
            .attr("x", function(d,i ){ return i*100 })
            .attr("width", legend_rect_width).attr("height",legend_rect_width )
            .attr("fill", function(d){ return d.color});     

        legend.append("text")
            .attr("x", function(d,i ){ return i*100 + legend_rect_width*1.5 })
            .attr("y", legend_rect_width*0.8 )
            .text(function(d){ return d.variable[language] })
            .attr("font-size", label_font_size);
     
    }


    function health_update (selected_country){

        d3.select("#SVG_CM svg").remove();
        health(selected_country, "child", "#SVG_CM");

        d3.select("#SVG_MMR svg").remove();
        if ( selected_country.health.length > 1 ){
            health(selected_country, "mother", "#SVG_MMR");
        }
       
    }






    function gender (selected_country){


      function mean_score_function(array){
        var any_NA = 0;
        for (var i = 0;  i< array.length;i ++ ){ any_NA = any_NA + (array[i]=="NA") }
        return (any_NA==0)? Math.round(d3.mean(array)):"NA";
      }


      var data = data_gender.filter(function(d){ return d.iso3 == selected_country.iso3})[0].data;
      data[0].color = "#9E0041"; data[0].ind_num = 3;
      data[1].color = "#5E4EA1"; data[1].ind_num = 2;
      data[2].color = "#4D9DB4"; data[2].ind_num = 2;
      data[3].color = "#6CC4A4"; data[3].ind_num = 1;
      data[4].color = "#FAE38C"; data[4].ind_num = 4;
      data[5].color = "#FB9F59"; data[5].ind_num = 2;
      data[6].color = "#E1514B"; data[6].ind_num = 2;
      data[7].color = "#C7E89E"; data[7].ind_num = 5;

      data[0].mean = mean_score_function( [data[0].ind1, data[0].ind2, data[0].ind3])
      data[1].mean = mean_score_function( [data[1].ind1, data[1].ind2])
      data[2].mean = mean_score_function( [data[2].ind1, data[2].ind2])
      data[3].mean = mean_score_function( [data[3].ind1])
      data[4].mean = mean_score_function( [data[4].ind1, data[4].ind2, data[4].ind3, data[4].ind4])
      data[5].mean = mean_score_function( [data[5].ind1, data[5].ind2])
      data[5].mean = mean_score_function( [data[5].ind1, data[5].ind2])
      data[6].mean = mean_score_function( [data[6].ind1, data[6].ind2])

      var data_pie = data.filter(function(d) {return d.name != "Stand-alone indicators"})
    

    if ( language == "FR" ){
      
      var label_no_data = "pas de données"

      document.getElementById("label_Employment1").innerHTML  = "Emploi dans le secteur non-agricole" 
      document.getElementById("label_Employment2").innerHTML  = "Taux d'activité"
      document.getElementById("label_Business1").innerHTML  = "Postes de direction" 
      document.getElementById("label_Business2").innerHTML  = "Propriétaires"
      document.getElementById("label_Health1").innerHTML  = "Taux de survie avant 5 ans/1000" 
      document.getElementById("label_Health2").innerHTML  = "Enfants des moins de 5 ans, sans retard de croissance"
      document.getElementById("label_Health3").innerHTML  = "Espérance de vie à la naissance" 
      document.getElementById("label_Health4").innerHTML  = "Part de la population non infectée par le VIH"
      document.getElementById("label_Education1").innerHTML  = "Taux d'alphabétisation (des 15-24 ans)" 
      document.getElementById("label_Education2").innerHTML  = "Taux de scolarisation secondaire (net)"
      document.getElementById("label_Education3").innerHTML  = "Taux de scolarisation dans le tertiaire (bruit)" 
      document.getElementById("label_Politics1").innerHTML  = "Representation au Parlement" 
      document.getElementById("label_Politics2").innerHTML  = "Postes Ministériels, Cabinets"
      document.getElementById("label_AccessCredit1").innerHTML  = "Compte ouvert dans une institution financière" 
      document.getElementById("label_AccessCredit2").innerHTML  = "Emprunt souscrit aupres d'une institution financière" 
      document.getElementById("label_AccessLand").innerHTML  = "Accés à la terre"
      document.getElementById("label_StandAlone").innerHTML  = "Indicateurs autonomes" 
      document.getElementById("label_StandAlone1").innerHTML  = "Accès à une source d'eau potable dans 15 minutes (urbain)"
      document.getElementById("label_StandAlone2").innerHTML  = "Accès à une source d'eau potable dans 15 minutes (rural)"
      document.getElementById("label_StandAlone3").innerHTML  = "Amélioration de l'assainissement (urbain)"
      document.getElementById("label_StandAlone4").innerHTML  = "Amélioration de l'assainissement (rural)"
      document.getElementById("label_StandAlone5").innerHTML  = "Taux de mortalité maternelle"

      var pieChart_label = [
        {name: "Education", col: data_pie.filter(function(d){ return d.name=="Education"})[0].color , rotate_angle: 14},
        {name: "Politique", col: data_pie.filter(function(d){ return d.name=="Women in politics"})[0].color, rotate_angle: 16},  
        {name: "Accès au crédit", col: data_pie.filter(function(d){ return d.name=="Access to credit"})[0].color , rotate_angle: 8}, 
        {name: "Accès à la terre",  col: data_pie.filter(function(d){ return d.name=="Access to land"})[0].color , rotate_angle: 9}, 
        {name: "Santé", col: data_pie.filter(function(d){ return d.name=="Health"})[0].color , rotate_angle: 18}, 
        {name: "Entreprise", col: data_pie.filter(function(d){ return d.name=="Business"})[0].color , rotate_angle: 15}, 
        {name: "Emploi", col: data_pie.filter(function(d){ return d.name=="Employment"})[0].color , rotate_angle: 15}
      ];

       var text_footnote = [{y: -32, text: "* Pie Gris: "}, {y: -22, text: "indique les données sont"}, {y: -12, text: "insuffisantes ou pas de données pour"}, {y: -2, text: "calculer la moyenne des notes du secteur"}]

    } else {
      var label_no_data = "No data"

      var pieChart_label = [
        {name: "Education", col: data_pie.filter(function(d){ return d.name=="Education"})[0].color , rotate_angle: 14},
        {name: "Women in politics", col: data_pie.filter(function(d){ return d.name=="Women in politics"})[0].color , rotate_angle: 5},  
        {name: "Access to credit", col: data_pie.filter(function(d){ return d.name=="Access to credit"})[0].color , rotate_angle: 5}, 
        {name: "Access to land",  col: data_pie.filter(function(d){ return d.name=="Access to land"})[0].color , rotate_angle: 9}, 
        {name: "Health", col: data_pie.filter(function(d){ return d.name=="Health"})[0].color , rotate_angle: 18}, 
        {name: "Business", col: data_pie.filter(function(d){ return d.name=="Business"})[0].color , rotate_angle: 15}, 
        {name: "Employment", col: data_pie.filter(function(d){ return d.name=="Employment"})[0].color , rotate_angle: 11}
      ];

          var text_footnote = [{y: -22, text: "* Grey pie: "},  {y: -12, text: "there are insufficient or no data"}, {y: -2, text: "to calculate average sector score"}]

    }


    function na_function(input){ return (input == "NA")? label_no_data:input; };

    for (var i=0; i<data.length; i++){
          for (var j=0; j< data[i].ind_num; j++){
            document.getElementById( data[i].name + "_" + (j+1)).innerHTML = na_function(data[i]["ind"+(j+1)]);
          }
        };



  for (var i=0; i<data_pie.length; i++){
         document.getElementById(data_pie[i].name + "_Score").innerHTML =  (data_pie[i].mean == "NA")? (pieChart_label[i].name + " : n/a"):(pieChart_label[i].name + " : "  + data_pie[i].mean)
    };



    var pie_spec = { width: 450, height: 500, radius: 180, stroke_width: 3};
    pie_spec.innerRadius = 0.4 * pie_spec.radius;
    var font_size_ind_value = 10;


    var PieChart = d3.select('#SVG_gender')
      .append('svg')
      .attr('width', pie_spec.width)
      .attr('height',pie_spec.height) 
      .append('g') 
      .attr("transform", "translate(" + (pie_spec.width / 2 )+ "," + (pie_spec.height / 2 ) + ")");


    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return 1; });


    var outlineArc = d3.svg.arc()
            .innerRadius(pie_spec.innerRadius)
            .outerRadius(pie_spec.radius);


    var arc = d3.svg.arc()
      .innerRadius(pie_spec.innerRadius)
      .outerRadius(function (d) { 
        var temp = (d.data.mean == "NA")? 0:d.data.mean;
        return (temp>10)? pie_spec.radius:((pie_spec.radius - pie_spec.innerRadius) * (temp/10) + pie_spec.innerRadius); 
      });


    PieChart.selectAll(".outlineArc")
      .data(pie(data_pie)).enter()
      .append("path")
      .attr("class", "outlineArc")
      .attr("id", function(d){ return d.data.name;})
      .attr("fill", function(d){ return (d.data.mean == "NA")? "grey":d.data.color;})
      .attr("fill-opacity", 0.3)
      .attr("stroke", "white")
      .attr("stroke-width", pie_spec.stroke_width)
      .attr("d", outlineArc);  


    PieChart.selectAll(".PieArc")
      .data(pie(data_pie)).enter()
      .append("path")
      .attr("class", "PieArc")
      .attr("id", function(d){ return d.data.name;})
      .attr("stroke", "white")
      .attr("fill", function(d){ return d.data.color;})
      .attr("d", arc)



    PieChart.selectAll("text_footnote")
      .data(text_footnote).enter()
      .append("text")
      .attr("transform", "translate(" + (pie_spec.width/2 - 20) + "," + (pie_spec.height/2 - 10)  + ")")
      .attr("y", function(d){ return d.y})
      .text(function(d){ return d.text})
      .attr("text-anchor", "end")
      .attr("font-size", 10)    

     

  var ft_text_ind_value_y = function(value){
    if (value == "NA") {
        return 0;
      } else {
        if (value<2){ 
          return (-pie_spec.innerRadius - (pie_spec.radius - pie_spec.innerRadius)*value/10 - font_size_ind_value/4)
        } else {
          return (value >10)? (-pie_spec.radius+font_size_ind_value):(-pie_spec.innerRadius - (pie_spec.radius - pie_spec.innerRadius)*value/10 +font_size_ind_value)
        }
      }
  }

  PieChart.selectAll("text_ind_value")
    .data(pie(data_pie)).enter()
    .append("text")
    .attr("class", "text_ind_value")
    .attr("x", 0)
    .attr("y", function(d){ return ft_text_ind_value_y(d.data.mean)})
    .attr("transform", function(d,i){ return "rotate(" + ((360/data_pie.length)*(i+0.5)) + ",0,0)" })
    .text(function(d){  return ((d.data.mean == "NA")||(d.data.mean=="Inf"))? " ":d.data.mean;  })
    .attr("font-size", font_size_ind_value )
    .attr("text-anchor", "middle")
    .attr("fill", "white")
      



  var pieChart_guideline = d3.svg.arc()
    .innerRadius(pie_spec.radius)
    .outerRadius(1.05*pie_spec.radius);

  PieChart.selectAll("guideline")
    .data(pie(data_pie))
  .enter().append("path")
  .attr("id", function(d,i){return "id" + i})
  .attr("fill", "none")
  .attr("stroke", "white")
  .attr("stroke-width", 0.1)
  .attr("d", pieChart_guideline);



    PieChart.selectAll("temp").data(pieChart_label).enter()
    .append("text")
    .attr("transform", function(d){ return "rotate(" + d.rotate_angle + ")"})
    .attr("x", 0)
    .attr("y", 0)
        .append("textPath")
        .attr("xlink:href", function(d,i){return "#id"+i})
        .text(function(d){ return d.name})
        .attr("fill", function(d){ return d.col;})
        .attr("font-size", 15)
        .attr("text-anchor", "start")
        .style("font-weight", "bold");


    }

    function gender_update (selected_country){

        d3.select("#SVG_gender svg").remove();
        gender( selected_country);

    }

    function clutter (selected_country){

        if (selected_country.iso3 == "DZA"){
            d3.select("#label_country").attr("y", 10) 
        }
    }
