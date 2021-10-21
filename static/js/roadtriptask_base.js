var instructions_text = []
var instructions_urls = []

//Information needed to run trial
var trial_infos
var city_info
var city_names
var hide_feedback_timer
var start_city
var end_city
var num_practice_trials=1

var data_log = []
var map = {
	nodes: {}, // vis.DataSet()
	edges: {}, // vis.DataSet()
	net: {}, // vis.Network()
};
var is_selected = {}
var node_border_width = 2;
var selected_edge_color = "#A40802"
var selected_node_color = "#A40802"
var unselected_edge_color = "#848484"
var unselected_edge_width = 1;
var selected_edge_width = 2;
var node_on_route_width = 3;
var edge_on_route_width = 3;
var bonus;
var image_array
var overlayed_was_on

// vis.js network options
var vis_options = {
	physics: {
		enabled: false
	},
	edges: {
		smooth: {
			enabled: false
		},
		color: {
			color: unselected_edge_color,
			hover: selected_edge_color,
			highlight: selected_edge_color,
			opacity: 1,
		},
		width: unselected_edge_width,
		hoverWidth: unselected_edge_width,
		arrows:'middle'
	},
	nodes : {
		labelHighlightBold: false,
		shape: "dot",
		size: 10,
		borderWidth: node_border_width,
		font: {
		strokeWidth : 5
		},
		color: {
			border: "#2471A3",
			background: "#E5E7E9",
			highlight:{
				border: "#2471A3",
				background: "#CACFD2",
			},
			hover:{
				border: "#2471A3",
				background: "#CACFD2",
			}
		}
	},
	interaction: {
		dragView: false,
		dragNodes: false,
		selectConnectedEdges: false,
		hover: true,
		hoverConnectedEdges: false,
		zoomView: false,
		selectable: true,
		keyboard: {
			enabled: false
		},
		multiselect: false
	},
	manipulation: {
		enabled: false,
		addNode: false,
		deleteNode: false,
		addEdge: function(edgeData,callback) {
			if (edgeData.from !== edgeData.to) {
				callback(edgeData);
			}
		}
	}
};

function shuffle(array){
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex){
	randomIndex = Math.floor(Math.random() * currentIndex);
	currentIndex -= 1;
	temporaryValue = array[currentIndex];
	array[currentIndex] = array[randomIndex];
	array[randomIndex] = temporaryValue;
  }
  return array;
}

function get_graph_data(){
	map.net.storePositions();
	var x = JSON.parse(JSON.stringify(map.nodes._data))
	_.forEach(x,function(val,key,obj){
		obj[key].x = obj[key].x/$("#canvas").width()
		obj[key].y = obj[key].y/$("#canvas").height()
	})
	return {
		edges : _.map(map.edges._data, function(d,idx){return [d.from, d.to];}),
		nodes : x
	}
}

function set_map_image(name){
	$("#map").css('background-image',"url('" + get_image_path(name) + "')")
}

function get_map_name(){
	var name = $("#map").css('background-image').replace(/url\(['"]*(.*?)['"]*\)/g, '$1')
	return name.slice(name.indexOf('fantasy'))
}

function get_trial_info(){
	return {"city_info" : city_info, "map" : get_map_name(), "graph" : get_graph_data(), "start_city" : start_city, "end_city" : end_city}
}

function update_edge_colors(){
	_.forEach(is_selected,function(val,key,obj){
		map.edges.update({
			id : key,
			color: val?selected_edge_color:unselected_edge_color,
			width: val?selected_edge_width:unselected_edge_width
		})
	})
}

function show_feedback(feedbacktext,duration,callback){
	log_data({"event_type": "Show feedback", "event_info" : {"feedback" : feedbacktext}})
	$('#feedback').show()
	$('#feedback span').text(feedbacktext);
	clearTimeout(hide_feedback_timer);
	if(duration != undefined){
		hide_feedback_timer = setTimeout(function(){
			$('#feedback').hide()
			if(callback != undefined){
				callback()
			}
		},duration)
	}
}

function show_reward_on_city(id,city_name,feedback){
	var reward = get_reward(map.nodes.get(id).label)
	if(reward==undefined)
		reward = city_info[city_name]["possible_rewards"][Math.floor(Math.random() * 4)];
	log_data({"event_type": "Show city reward", "event_info" : {"city" : city_name, "reward" :reward}})
	map.nodes.update({id : id, label: "\n" + city_name + "\n$" + reward})
	if(feedback){
		show_feedback(city_name + ": $" + reward,3000)
	}
}

function clean_label(label){
	return label.toString().split('\n').join('').split('$')[0]
}

function get_reward(label){
	l = label.split('\n')
	if(l.length>1)
		return parseFloat(l[l.length-1].replace('$',''));
	return undefined
}

function get_average_reward(city_name){
	var retval =0
	for(var i=0;i<city_info[city_name]["possible_rewards"].length;i++){
		retval += city_info[city_name]["possible_rewards"][i]/city_info[city_name]["possible_rewards"].length
	}
	return retval
}

function create_route_graph(start,finish,allow_all_edges = false){
	retval = {}
	_.forEach(is_selected,function(val,key,obj){
	if(val || allow_all_edges){
		var city_from = clean_label(map.nodes.get(map.edges.get(key).from).label)
		var city_to = clean_label(map.nodes.get(map.edges.get(key).to).label)
		var reward = get_reward(map.nodes.get(map.edges.get(key).to).label)
		if(reward==undefined){
			reward = get_average_reward(city_to)
		}
		//var reward = city_info[city_to]["actual_reward"]
		if (city_from == start){
			city_from = "start"
		}
		if (city_from == finish){
			city_from = "finish"
		}
		if (city_to == start){
			city_to = "start"
		}
		if (city_to == finish){
			city_to = "finish"
		}
		if(retval[city_from]===undefined){
			retval[city_from] = {}
		}
		if(retval[city_to]===undefined){
			retval[city_to] = {}
		}
		retval[city_from][city_to] = reward
	}
	})
	return retval
}

function get_state_string(){
	s = "0"
	for(var i=1;i<city_names.length;i++){
	label = map.nodes.get(i).label
	if(label.split('\n').length==1){
		s+="-X"
	}
	else{
		s+="-"+get_reward(label)
	}
	}
	return s
}

function listen_for_spacebar(callback){
	$(document).off("keypress").on( "keypress", function(e){
		if(e.keyCode==32){
			callback()
		}
	})
}

function simulate_optimal_solution(){
	optimal_actions = get_optimal_actions()
	if(optimal_actions.includes(0)){
		$( "#finishedbutton" ).css({"background-color" : "#00ff00"})
		listen_for_spacebar(function(){
			$( "#finishedbutton" ).css({"background-color" : "#999999"})
			route = get_optimal_route(start_city,end_city,true)
			show_route(route)
		})
	}
	else{
		_.forEach(optimal_actions,function(a){
			console.log(a)
			map.nodes.update({id: a-1, color: {background: "#00ff00"}})
		})
		listen_for_spacebar(function(){
			action = optimal_actions[Math.floor(Math.random() * optimal_actions.length)]
			show_reward_on_city(action-1,clean_label(city_names[action-1]),false)
			listen_for_spacebar(function(){
				_.forEach(optimal_actions,function(a){
					map.nodes.update({id: a-1, color: {background: "#E5E7E9"}})
				})
				listen_for_spacebar(function(){
					simulate_optimal_solution()
				})
			})
		})
	}
}

function visualize_model_data(j){
	//$("#cityinput").hide()
	if(j<ACTION_TRACE.length){
		vis_data = ACTION_TRACE[j]
		$("#visualizationbutton").off("click")
		for(var i =0;i<trial_infos.length;i++){
			if(trial_infos[i]['map']==vis_data['map']){
				var trial_info = trial_infos[i]
				city_info = trial_info['city_info']
				graph_data = trial_info['graph']
				start_city = trial_info['start_city']
				end_city = trial_info['end_city']
				map_name = trial_info['map']
				city_names = Object.keys(city_info)
				$('.overlayed').hide();
				// $('#trace-info').html(`cost = ${vis_data.cost}; alpha = ${vis_data.alpha}; epsilon = ${vis_data.epsilon}`)
				$('#trace-info').html(`cost = ${vis_data.cost}; opt_logp=${vis_data.opt_logp};  bf_logp=${vis_data.bf_logp}`)
				var image = new Image();
				image.onload = function(){
					enable_resize_correction(image.width/image.height,function(){
						$("#visualizationbutton").off("click").on("click",function(){
							$("#finishedbutton").css({"background-color" : "#999999"})
							visualize_model_data(j+1)
						})
						draw_graph_from_json(graph_data);
						draw_car();
						disable_edit_mode()
						var qs = vis_data['q'].split(",");
						var q, is_bf
						for(var k=0;k<city_names.length;k++){
							reward = vis_data['b'].split("-")[k]
							q = qs[k+1]
							is_bf = vis_data.bf_choice[k+1]
							if(reward=="X" || reward=="0"){
								if(q!="null")
									var r, b, g
									if (q > 0) {
										b = Math.min(256, Math.max(0, 128 + 10*q))
										r = g = 128 - 10*Math.abs(q)
									} else {
										r = Math.min(256, Math.max(0, 128 - 10*q))
										b = g = 128 - 10*Math.abs(q)
									}


									map.nodes.update({id : k,
										label: "\n" + city_names[k]+ "\nq = " + q,
										color: {
											background: `rgb(${r}, ${g}, ${b})`,
											border: is_bf ? '#FC41C1' : 'black',
											borderWidth: is_bf ? 3 : 1
										}
									})
									// map.nodes.update({id : k, label: "\n" + city_names[k]+ "\nq = " + q})
							}
							else
								map.nodes.update({id : k, label: "\n" + city_names[k] + "\n$" + reward})
							q = vis_data['q'].split(",")[0]
							$("#finishedbutton").text("q = " + q)
						}
						if(vis_data['c']>0){

							map.nodes.update({
								id: vis_data['c']-1,
								shape: 'diamond',
								size: 20,
							})
							// map.nodes.update({id:vis_data['c']-1, color: {background: "#00ff00"}})
						}
						else{
							$("#finishedbutton").css({"background-color" : "#00ff00"})
						}
					})
				}
			}
		}
		set_map_image(map_name)
		image.src = get_image_path(map_name)
	}
}

function get_optimal_actions(){
	Q=optimal_solution[get_state_string()]
	m=Infinity
	retval = []
	for(var i=0;i<Q.length;i++){
		if(Q[i]!=null && Q[i]<m)
			m=Q[i]
	}
	for(var i=0;i<Q.length;i++){
		if(Q[i]==m)
			retval.push(i)
	}
	return retval
}

function get_optimal_route(start,finish,allow_all_edges = false){
	route_graph = create_route_graph(start,finish,allow_all_edges)
	optimal_route = dijkstra(route_graph)
	for(var i=0;i<optimal_route.path.length;i++){
	if(optimal_route.path[i] == "start"){
		optimal_route.path[i] = start
	}
	if(optimal_route.path[i] == "finish"){
		optimal_route.path[i] = finish
	}
	}
	return optimal_route.path
}

function show_route(route,feedback=true,is_practice=false,callback){
	log_data({"event_type": "Show route", "event_info" : {"route" : route}})
	node_ids = _.map(route,function(city){
		return map.nodes.getIds({
			filter : function(node){
			return clean_label(node.label)==city;
			}
		});
	});
	_.forEach(node_ids,function(id){
		map.nodes.update({id : id, color : {border : selected_node_color}, borderWidth : node_on_route_width})
	})
	edge_ids = map.edges.getIds({
		filter: function(edge){
			var i = route.indexOf(clean_label(map.nodes.get(edge.from).label))
			var j = route.indexOf(clean_label(map.nodes.get(edge.to).label))
			return i>=0 && j>=0 && j-i == 1
		}
	})
	_.forEach(edge_ids,function(id){
		map.edges.update({id : id, width : edge_on_route_width, color: selected_edge_color})
	})
	route_cost = 0
	for(var i=1;i<node_ids.length && i<route.length;i++){
		for(var j=0;j<node_ids[i].length;j++){
			if(route[i]!=end_city){
				show_reward_on_city(node_ids[i][j],route[i],false)
				route_cost += get_reward(map.nodes.get(node_ids[i][j]).label)
			}
		}
	}
	trial_bonus = Math.max((300 - route_cost)/1000,0)
	log_data({"event_type": "Route scored", "event_info" : {"route": route, "route_cost" : route_cost, "trial_bonus" : trial_bonus, "total_bonus" : bonus, "is_practice" : is_practice}})
	if(is_practice){
		feedbacktext="Route cost: $" + route_cost + ", You would have earned: $" + trial_bonus.toFixed(2)
	}
	else{
		bonus += trial_bonus
		feedbacktext="Route cost: $" + route_cost + ", Bonus so far: $" + bonus.toFixed(2)
	}
	if(feedback){
		map.net.setOptions({interaction : {"selectable" : false}})
		$( "#cityinput [type=submit]" ).off("click")
		$( "#cityinput [type=text]").unbind("keydown").unbind("keyup").autocomplete({"lookup":[]}).autocomplete('disable');
		show_feedback(feedbacktext)
		callback()
	}
}

function get_unambiguous_route(start,finish){
	retval = [start]
	edges = _.map(_.pick(is_selected,function(val,key,obj){
		return val
	}),function(val,key,obj){
		var city_from = clean_label(map.nodes.get(map.edges.get(key).from).label)
		var city_to = clean_label(map.nodes.get(map.edges.get(key).to).label)
		return [city_from,city_to]
	})
	city = start;
	while(city != finish){
		edges_from_city = _.filter(edges,function(e){
			return e[0]==city
		})
		if(edges_from_city.length !=1){
			break;
		}
		else{
			city = edges_from_city[0][1]
		}
		retval.push(city)
	}
	return retval
}

function disable_edit_mode(){
	map.net.off("selectNode").off("selectEdge").off("hoverNode").off("blurNode")
	map.net.setOptions({
		nodes: {
			chosen: {
				label: false,
				node: function(values, id, selected, hovering) {
					values.borderWidth = node_border_width;
				}
			}
		},
		edges: {
			selectionWidth: 0
		},
		interaction: {
			dragNodes: false,
			dragView: false,
			hover: false,
			selectable : true
		}
	})
	map.net.disableEditMode()
}

function enable_report_mode(){
	disable_edit_mode()
	is_selected = _.object(_.map(map.edges.getIds(),function(id){return [id, false]}))
	map.net.on("selectNode",function(e){
		for(var i=0;i<e.nodes.length;i++){
			map.nodes.update({id : e.nodes[i], borderWidth: node_border_width})
		}
	})
	map.net.on("click",function(e){
		for(var i=0;i<e.edges.length;i++){
			var city_from = clean_label(map.nodes.get(map.edges.get(e.edges[i]).from).label)
			var city_to = clean_label(map.nodes.get(map.edges.get(e.edges[i]).to).label)
			log_data({"event_type": "Select edge", "event_info" : {"from" : city_from, "to" : city_to, "mode" : (is_selected[e.edges[i]] ? "off" : "on")}})
			is_selected[e.edges[i]] = !is_selected[e.edges[i]]
		}
		update_edge_colors()
	})
	$( "#cityinput [type=submit]" ).off("click").on("click",function(){
		city_name = $("#cityinput [type=text]").val()
		log_data({"event_type": "Reveal city price clicked", "event_info" : {"city" : city_name}})
		matching_node_ids = map.nodes.getIds({
			filter: function(node){
				return node.label.toLowerCase() == city_name.toLowerCase() && city_name.toLowerCase()!=start_city.toLowerCase();
			}
		})
		if(matching_node_ids.length==1){
			$("#cityinput [type=submit]").prop( "disabled", true )
			$("#cityinput [type=text]").prop( "disabled", true )
			$("#finishedbutton").prop("disabled",true)
			$(".loader").css('display','inline-block')
			show_feedback("Looking up " + city_name, PARAMS.clickDelay, function(){
				$("#cityinput [type=submit]").prop( "disabled", false )
				$("#cityinput [type=text]").prop( "disabled", false )
				$("#finishedbutton").prop("disabled",false)
				$(".loader").hide()
				$("#cityinput [type=text]").val('')
				log_data({"event_type": "Reveal city price", "event_info" : {"city" : city_name}})
				show_reward_on_city(matching_node_ids[0],clean_label(map.nodes.get(matching_node_ids[0]).label),true)
			})
		}
		else if(city_name.length>0){
			show_feedback(city_name + " does not exist", 1000)
		}
	})
}

function enable_editing(){
	map.net.on("selectNode", function (params) {
		map.net.addEdgeMode();
	});

	map.net.setOptions({interaction: {dragNodes: true}})

	/** Delete edge by clicking */
	map.net.on("selectEdge", function(e) {
		map.edges.remove(e.edges);
	});

	/** Highlight connected edges on node hover */
	map.net.on("hoverNode", function(evt) {_.each(map.net.getConnectedEdges(evt.node), function(e){map.edges.update({id: e, width: 2})}); })
	map.net.on("blurNode",	function(evt) {_.each(map.net.getConnectedEdges(evt.node), function(e){map.edges.update({id: e, width: 1})}); })
}

function move_icon(icon_name,nodes) {
	var dom_coords = map.net.canvasToDOM({x:nodes[0].x,y:nodes[0].y});
	$("#" + icon_name).css({
		"left" : $("#canvas").offset()["left"] + dom_coords.x - $("#" + icon_name).width()/2,
		"top" : $("#canvas").offset()["top"] + dom_coords.y - $("#" + icon_name).height()/2
	})
}

function draw_car(){
	start_nodes = map.nodes.get({
		filter : function(node){
			return node.label == start_city
		}
	});
	end_nodes = map.nodes.get({
		filter : function(node){
			return node.label == end_city
		}
	});
	if(start_nodes.length==1 && end_nodes.length==1){
		$("#car").show()
		$("#star").show()
		map.net.off("afterDrawing").on("afterDrawing", function (ctx) {
			move_icon("car",start_nodes);
			move_icon("star",end_nodes);
		});
		map.net.redraw()
	}
	else {
		console.log("None or multiple start nodes")
	}
}

function draw_graph(){
	// Construct vis.js nodes
	map.nodes = new vis.DataSet();

	for (var i = 0; i < city_names.length; i++) {
		map.nodes.add({
			id: i,
			label: city_names[i],
			x: i * 90, y: 10 // fixed node positions (comment to make random)
		});
	}

	map.edges = new vis.DataSet();

	// Display initial map
	map.net = new vis.Network($("#canvas")[0], map, vis_options);
	map.net.storePositions();
}


function draw_graph_from_json(){
	// Construct vis.js nodes
	map.nodes = new vis.DataSet();
	_.each(graph_data['nodes'], function(node, key, obj) {
		map.nodes.add({
			id: node["id"],
			label: node["label"],
			x : node["x"]*$("#canvas").width(),
			y : node["y"]*$("#canvas").height()
		});
	});

	map.edges = new vis.DataSet();

	_.each(graph_data['edges'], function(edge) {
		map.edges.add({
			from: edge[0],
			to: edge[1],
		});
	});

	// Display initial map
	map.net = new vis.Network($("#canvas")[0], map, vis_options);
	map.net.storePositions();
	map.net.moveTo({scale:1,position:{x:0,y:0}})
}

function set_autocomplete(mode){
	if(mode){
		$( "#cityinput [type=text]").unbind("keydown").bind("keydown", function( event ) {
			if ( event.keyCode === 9) {
				event.preventDefault();
				var text_pre = $("#cityinput [type=text]").val()
				var suggestions = $( "#cityinput [type=text]").data()["autocomplete"].suggestions;
				if(suggestions.length>0){
					$( "#cityinput [type=text]").val(suggestions[0].value)
				}
				var text_post = $("#cityinput [type=text]").val()
				log_data({"event_type": "Autocomplete used", "event_info" : {"text_pre" : text_pre, "text_post" : text_post}})
			}
		}).unbind("keyup").bind("keyup", function( event ) {
			log_data({"event_type": "Keypress in input", "event_info" : {"keycode" : event.keyCode, "text_post" : $("#cityinput [type=text]").val()}})
			if (event.keyCode === 13){
				event.preventDefault();
				$( "#cityinput [type=submit]" ).click()
				return false;
			}
		}).autocomplete({
			lookup: city_names,
			lookupLimit : 3,
			minChars : 1,
			lookupFilter : function (suggestion, query, queryLowerCase) {
				return suggestion['value'].toLowerCase().startsWith(queryLowerCase)
			}
		});
	}
	else {
		$( "#cityinput [type=text]").unbind("keyup").bind("keyup", function( event ) {
			log_data({"event_type": "Keypress in input", "event_info" : {"keycode" : event.keyCode, "text_post" : $("#cityinput [type=text]").val()}})
		})
	}
}

function resize_canvas(aspect_ratio){
	map_width = parseInt($("#map").css("width"), 10);
	map_height = parseInt($("#map").css("height"), 10);
	if(map_width/map_height > aspect_ratio){
		$("#canvas").css({height: map_height, width: aspect_ratio*map_height})
	}
	else{
		$("#canvas").css({height: map_width/aspect_ratio, width: map_width})
	}
	if(!_.isEmpty(map.net)){
		map.net.redraw()
	}
}

function check_screen_size(){
	if ($(window).width() < 900 || $(window).height() < 700) {
		if(!$('#window_error').is(":visible")){
			overlayed_was_on = $('.overlayed').is(":visible")
		}
		$('.overlayed').show();
		$('#window_error').show();
	}
	else{
		if(!overlayed_was_on){
			$('.overlayed').hide();
		}		
		$('#window_error').hide();		
	}
}

function enable_resize_correction(aspect_ratio,callback){
	resize_canvas(aspect_ratio)
	$(window).off('resize').on('resize', function(params){
		check_screen_size()
		resize_canvas(aspect_ratio)
	});
	callback()
}

function do_trial(trial_num){
	var trial_info = trial_infos[trial_order[trial_num]]
	city_info = trial_info['city_info']
	graph_data = trial_info['graph']
	start_city = trial_info['start_city']
	end_city = trial_info['end_city']
	map_name = trial_info['map']
	city_names = Object.keys(city_info)
	log_data({"event_type": "Start trial", "event_info" : {"trial_num" : trial_num, "trial_id" : trial_order[trial_num], "trial_info" : trial_info}})
	$('.overlayed').hide();
	var image = new Image();
	image.onload = function(){
		enable_resize_correction(image.width/image.height,function(){
			set_map_image(map_name)
			draw_graph_from_json(graph_data);
			draw_car();
			set_autocomplete(PARAMS.autocomplete);
			enable_report_mode()
			//enable_editing()
			//simulate_optimal_solution()
		})
	}
	$("#finishedbutton").off("click").on("click",function(){
		var route = get_unambiguous_route(start_city,end_city)
		log_data({"event_type": "Submit route", "event_info" : {"route" : route}})
		if(route[route.length-1] == end_city){
			$("#finishedbutton").off("click")
			show_route(route,true,trial_num<num_practice_trials,function(){
				$("#nexttrialbutton").show().off('click').on('click',function(){
					$("#feedback").hide()
					$("#nexttrialbutton").hide()
					map.net.destroy()
					$("#cityinput [type=text]").val('')
					map = {
						nodes: {}, // vis.DataSet()
						edges: {}, // vis.DataSet()
						net: {}, // vis.Network()
					};
					if(trial_num==num_practice_trials-1){
						show_instructions(0,instructions_text_after_practice,instructions_urls_after_practice,function(){
							do_trial(trial_num+1)
						},"Start");
					}
					else if(trial_num==trial_infos.length-1){
						enter_comments()
					}
					else{
						do_trial(trial_num+1)
					}
				})
			})
		}
		else {
			show_feedback("Error: Invalid route from " + start_city + " to " + end_city,2000)
		}
	});
	image.src = get_image_path(map_name)
}

function pass_quiz(num_previous_tries){
	log_data({"event_type": "Pass quiz", "event_info" : {"number_of_previous_tries" : num_previous_tries}})
	show_instructions(0,instructions_text_pass_quiz,instructions_urls_pass_quiz,function(){
		do_trial(0)
	},"Start")
}

function enter_comments(){
	log_data({"event_type": "enter_comments", "event_info" : {}})
	$('.overlayed').show();
	$('#comments').show()
	$('#comments p').text(enter_comments_text)
	$('#comments textarea').text("").prop('disabled', false);
	$("#comments button").text("Submit").off("click").on("click",function(){
		log_data({"event_type": "submit_comments", "event_info" : {"comments" : $('#comments textarea').val()}})
		$("#comments").hide()
		log_data({"event_type": "Finish experiment", "event_info" : {}})
		finish_experiment()
	})
}

function fail_quiz(num_previous_tries){
	log_data({"event_type": "Fail quiz", "event_info" : {"number_of_previous_tries" : num_previous_tries}})
	if(num_previous_tries==3){
		finish_experiment()
	}
	else{
		show_instructions(0,instructions_text_fail_quiz,instructions_urls_fail_quiz,function(){
			do_quiz(num_previous_tries+1)
		},"Next")
	}
}

function do_quiz(num_previous_tries){
	log_data({"event_type": "Start quiz", "event_info" : {"number_of_previous_tries" : num_previous_tries}})
	$('.overlayed').show();
	$('#attention_quiz').show();
	if($('#attention_quiz p').length==0){
		for(var i=0;i<quiz_content.length;i++){
			quiz_question = $("<p />").text(quiz_content[i]["question"])
			quiz_answers = $("<select></select>").css({"width" : "50vw"}).append("<option>Choose your answer</option")
			question_order = []
			for(var j =0; j<quiz_content[i]["answers"].length; j++){
				question_order.push(j);
			}
			question_order = shuffle(question_order)
			for(var k=0;k<question_order.length;k++){
				var j = question_order[k]
				quiz_answers.append($("<option></option>").text(quiz_content[i]["answers"][j]).val(quiz_content[i]["answers"][j]==quiz_content[i]["correct_answer"]))
			}
			$('#attention_quiz button').before(quiz_question).before(
				$("<div />").css({"text-align" :"left"}).append(quiz_answers)
			)
		}
	}
	$('#attention_quiz button').off("click").on("click",function(){
		$('#attention_quiz').hide();
		all_correct = true
		$('#attention_quiz select').each(function(){
			correct = $(this).val()=="true"
			all_correct = all_correct && correct
			log_data({"event_type": "submit quiz answer", "event_info" : {"selected answer" : $(this).children("option").filter(":selected").text(), "correct" : correct}})
		})
		if(all_correct){
			pass_quiz(num_previous_tries)
		}
		else{
			fail_quiz(num_previous_tries)
		}
	})
}

function show_instructions(i,texts,urls,callback,start_text,verbose=true){
	if(verbose){
		log_data({"event_type": "Show instructions", "event_info" : {"screen_number": i}})
	}
	$('.overlayed').show();
	$('#instructions').show();
	$('#instructions p').remove();
	$('#instructions h4').after("<p>" + texts[i] + "</p>");
	if(urls[i]==""){
		$('#instructions img').hide()
	}
	else{
		$('#instructions img').show().attr("src",get_image_path(urls[i] + "-crop.png"));
	}
	if(i==0){
		$('#previousbutton').hide()
	}
	else {
		$('#previousbutton').show().off("click").on("click",function(){
			show_instructions(i-1,texts,urls,callback,start_text);
		});
	}
	if(i == texts.length - 1 || i == urls.length - 1){
		$('#nextbutton').text(start_text)
		$('#nextbutton').off("click").on("click",function(){
			$('#instructions').hide();
			$('.overlayed').hide();
			callback();
		})
	}
	else {
		$('#nextbutton').text("Next")
		$('#nextbutton').off("click").on("click",function(){
			show_instructions(i+1,texts,urls,callback,start_text);
		});
	}
}


function initialize_task(t,callback){
	trial_infos = t
	bonus = 0
	instructions_text = [
		"In this experiment, you will play a game where you pretend to be a travel planner",
		"On each round, you will plan a trip for a client",
		"You will see a map like this",
		"The client is traveling from the city with the car (Ruby Ridge) to the city with the star (Slowlake)",
		"Each day they can travel from one city to another one",
		"Each day they can travel from one city to another one. Possible steps are indicated by the arrows",
		"Each night they must stay in a hotel, which costs money",
		"The client is on a very tight budget and wants to take the cheapest route",
		"You can look up the price of the cheapest hotel in a city by typing the city name in a text box and clicking Reveal",
		(PARAMS.autocomplete ? "<b>Tip:</b> You can save time by using autocomplete. Press <code>tab</code> to autocomplete and <code>enter</code> to search the city without moving the mouse." : null),
		"The price of the cheapest available hotel is always $25, $35, $50 or $100, and it is equally likely to be any of these",
		"When you look up a city, its price is revealed on the map",
		"At any time, you can select parts of the client's route by clicking on the arrows",
		"If you change your mind, you can unselect arrows by clicking them again",
		"When you have finalized your route, click Submit",
		"When you submit, the total price of the route will be shown",
		"For each client, you start with a budget of $300",
		"For each client, you start with a budget of $300. We will add one cent to your bonus for this study for every $10 left in the budget after paying for the trip.",
		"For each client, you start with a budget of $300. We will add one cent to your bonus for this study for every $10 left in the budget after paying for the trip. For example, if the route costs $100, there is $200 left in the budget so your bonus increases by $0.20.",
		"You do not need to check the prices of every city on the route before submitting",
		"You do not need to check the prices of every city on the route before submitting. In that case, the prices will be revealed when you submit.",
		"Before starting the task, please answer four questions on the next page to make sure you understand the instructions"
	].filter(x => x != null)
	instructions_urls = [
		"",
		"",
		"Instructions-screenshot-map-only",
		"Instructions-screenshot-with-car",
		"Instructions-screenshot-with-car",
		"Instructions-screenshot-with-car",
		"Instructions-screenshot-with-car",
		"Instructions-screenshot-with-car",
		"Instructions-screenshot-with-city-name",
		(PARAMS.autocomplete ? "Instructions-screenshot-with-city-name" : null),
		"Instructions-screenshot-with-city-name",
		"Instructions-screenshot-with-price",
		"Instructions-screenshot-with-selection",
		"Instructions-screenshot-with-unselection",
		"Instructions-screenshot-with-submit",
		"Instructions-screenshot-with-route-price",
		"Instructions-screenshot-with-route-price",
		"Instructions-screenshot-with-route-price",
		"Instructions-screenshot-with-route-price",
		"Instructions-screenshot-with-other-route",
		"Instructions-screenshot-with-other-route-price",
		""
	].filter(x => x != null)

	if(num_practice_trials==0){
		instructions_text_pass_quiz = ["Thank you! You answered all questions correctly",
									   "You will now complete " + trial_infos.length + " rounds",
									   "Click start to begin"]
		instructions_urls_pass_quiz = ["",
									   "",
									   ""]
	}
	else if (num_practice_trials==1){
		instructions_text_pass_quiz = ["Thank you! You answered all questions correctly",
									   "You will now complete " + trial_infos.length + " rounds",
									   "The first is a practice round which does not count towards your bonus",
									   "Click start to begin"]
		instructions_urls_pass_quiz = ["",
									   "",
									   "",
									   ""]
	}
	else{
		instructions_text_pass_quiz = ["Thank you! You answered all questions correctly",
									   "You will now complete " + trial_infos.length + " rounds",
									   "The first " + num_practice_trials + " are practice rounds which do not count towards your bonus",
									   "Click start to begin"]
		instructions_urls_pass_quiz = ["",
									   "",
									   "",
									   ""]
	}

	instructions_text_fail_quiz = ["You answered at least one question incorrectly. Here is a short review of the instructions.",
								   "The price of the cheapest available hotel is always $25, $35, $50 or $100, and it is equally likely to be any of these",
								   "On each round, you start with a budget of $300. We will add one cent to your bonus for this study for every $10 left in the budget after paying for the trip. Thus, the more expensive the route, the lower your bounus.",
								   "You do not need to check the prices of every city on the route before submitting. In that case, the prices will be revealed when you submit",
								   "Please answer the four questions again to start"]
	instructions_urls_fail_quiz = ["",
								   "",
								   "",
								   "",
								   ""]


	instructions_text_after_practice = ["You finished all practice rounds",
										"You will now complete " + (trial_infos.length-num_practice_trials) + " rounds",
										"Click start to begin"]

	instructions_urls_after_practice = ["",
								   "",
								   ""]

	instructions_text_finished = ["Thanks for taking our experiment! Click Finish to save your data and see the completion code."]
	instructions_urls_finished = [""]

	enter_comments_text = "Was everything clear in the experiment? If you have any other comments or suggestions, please enter them here."

	quiz_content = [{
			"question" : "What are the possible values of the hotel prices?",
			"answers" : ["$25, $35, $50 or $100",
						 "$250, $350, $500 or $1000",
						 "$25, $40, $60 or $100"
			],
			"correct_answer" : "$25, $35, $50 or $100"
		},{
			"question" : "Which hotel price is most likely?",
			"answers" : ["$25",
						 "$35",
						 "$50",
						 "$100",
						 "All hotel prices are equally likely"
			],
			"correct_answer" : "All hotel prices are equally likely"
		},{
			"question" : "True or False: you must check the price of all cities on the route before submitting it",
			"answers" : ["True",
						 "False"
			],
			"correct_answer" : "False"
		},
		{
			"question" : "How is your bonus determined?",
			"answers" : [
					"I will earn more money if I choose MORE expensive routes",
					"I will earn more money if I choose LESS expensive routes",
			],
			"correct_answer" : "I will earn more money if I choose LESS expensive routes"
		}
	]
	preload_images()
	callback()
}

function preload_img(imgs_to_preload, i){
	if(i<imgs_to_preload.length){
		if(imgs_to_preload[i]==""){
			preload_img(imgs_to_preload, i + 1);
		}
		else{
			image_array[i]=new Image();
			img = imgs_to_preload[i]
			if(img.startsWith("Instructions")){
				img=img + "-crop.png"
			}
			image_array[i].onload=function(){
				$("<img />").attr("src",get_image_path(img)).appendTo("#preload_images");
				preload_img(imgs_to_preload, i + 1);
			}
			image_array[i].src=get_image_path(img);
		}
	}
	else{
		log_data({"event_type": "preloading complete", "event_info" : {}})
	}
}

function preload_images(){
	log_data({"event_type": "preloading images", "event_info" : {}})
	map_imgs = _.map(Object.values(trial_infos),function(x){return x['map']})
	imgs_to_preload = [].concat.apply([],[instructions_urls,instructions_urls_fail_quiz,instructions_urls_pass_quiz,instructions_urls_after_practice,map_imgs])
	image_array = new Array(imgs_to_preload.length)
	preload_img(imgs_to_preload,0)
}

function start_experiment(){
	console.log('START EXPERIMENT')
	log_data({"event_type": "Start experiment", "event_info" : {}})
	trial_order = _.shuffle(_.range(trial_infos.length))
	searchParams = new URLSearchParams(location.search)
	if (searchParams.get('skip') == 'true') {
		console.log('YES')
		do_trial(0)
	}
	else {
		show_instructions(0,instructions_text,instructions_urls,function(){
			do_quiz(0)
		},"Next");
	}
	overlayed_was_on = true
	$(window).off('resize').on('resize', function(params){
		check_screen_size()
	});
	$(window).resize()
}