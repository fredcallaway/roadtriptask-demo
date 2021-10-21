var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);
var LOCAL = (mode === "{{ mode }}");

if (LOCAL) {
	SKIP_INSTRUCTIONS = true;
}
// var condition = LOCAL ? 2 : parseInt(condition);
var condition = 1;
var PARAMS = {
	autocomplete: false,
	icelandic: false,
	clickDelay: 3000  // name is for legacy reasons
};
console.log(condition, PARAMS);

function finish_experiment(){
	psiturk.recordUnstructuredData('bonus', bonus);
	show_instructions(0,instructions_text_finished,instructions_urls_finished,submitHit,"Finish");
}

function log_data(data){
	data.event_time = Date.now();
	console.log(data);
	psiturk.recordTrialData(data);
	if (data.event_type == "Pass quiz") {
		psiturk.finishInstructions();
		psiturk.recordUnstructuredData('time_instruct', Date.now());
	}
	if(data.event_type=="Start trial"){
		saveData();
	}
}

function saveData() {
	console.log('saveData');
	return new Promise(function(resolve, reject) {
		var timeout;
		if (LOCAL) {
			resolve('local');
			return;
		}
		timeout = setTimeout(function() {
			console.log('TIMEOUT');
			return reject('timeout');
		}, 5000);
		return psiturk.saveData({
			error: function() {
				clearTimeout(timeout);
				console.log('Error saving data!');
				return reject('error');
			},
			success: function() {
				clearTimeout(timeout);
				console.log('Data saved to psiturk server.');
				return resolve();
			}
		});
	});
}

function get_city_infos(icelandic) {
	if (icelandic) {
		return [
			{"city_info":{"Bildudalur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Akureyri":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Seltjarnarnes":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Faskrudsfjordur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Grenivik":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Varmahlid":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Hofn":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Drangsnes":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Solheimar":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Eyrarbakki":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Hafnir":{"possible_rewards":[25,35,50,100],"actual_reward":50}},"map":"fantasy_map_1560976725599.png","graph":{"edges":[[7,8],[0,2],[2,3],[2,1],[3,5],[3,9],[1,6],[1,9],[5,7],[6,4],[9,7],[5,10],[10,8],[4,8]],"nodes":{"0":{"id":0,"label":"Bildudalur","x":-0.30501089324618735,"y":-0.24695121951219512},"1":{"id":1,"label":"Akureyri","x":-0.1466957153231663,"y":0.06402439024390244},"2":{"id":2,"label":"Seltjarnarnes","x":-0.28685548293391433,"y":-0.004573170731707317},"3":{"id":3,"label":"Faskrudsfjordur","x":-0.1328976034858388,"y":-0.25},"4":{"id":4,"label":"Grenivik","x":0.20697167755991286,"y":0.15396341463414634},"5":{"id":5,"label":"Varmahlid","x":0.03776325344952796,"y":-0.24390243902439024},"6":{"id":6,"label":"Hofn","x":0.025417574437182282,"y":0.09146341463414634},"7":{"id":7,"label":"Drangsnes","x":0.15468409586056645,"y":-0.14634146341463414},"8":{"id":8,"label":"Solheimar","x":0.2534495279593319,"y":-0.025914634146341462},"9":{"id":9,"label":"Eyrarbakki","x":0,"y":-0.0350609756097561},"10":{"id":10,"label":"Hafnir","x":0.3064633260711692,"y":-0.24847560975609756}}},"start_city":"Bildudalur","end_city":"Solheimar"},
			{"city_info":{"Reykholar":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Akranes":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Hrisey":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Hnifsdalur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Hella":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Sudavik":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Kleppjarnsreykir":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Stokkseyri":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Reykholt":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Laugarvatn":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Gardabaer":{"possible_rewards":[25,35,50,100],"actual_reward":50}},"map":"fantasy_map_1560976804519.png","graph":{"edges":[[0,2],[2,1],[0,3],[3,9],[1,6],[5,6],[3,5],[6,4],[6,7],[7,8],[4,8],[9,6],[9,10],[10,7],[1,5]],"nodes":{"0":{"id":0,"label":"Reykholar","x":-0.38198983297022515,"y":0.019817073170731708},"1":{"id":1,"label":"Akranes","x":-0.13217138707334786,"y":0.2073170731707317},"2":{"id":2,"label":"Hrisey","x":-0.24473493100944083,"y":0.2606707317073171},"3":{"id":3,"label":"Hnifsdalur","x":-0.20987654320987653,"y":-0.07621951219512195},"4":{"id":4,"label":"Hella","x":0.23529411764705882,"y":0.04878048780487805},"5":{"id":5,"label":"Sudavik","x":-0.09658678286129267,"y":-0.009146341463414634},"6":{"id":6,"label":"Kleppjarnsreykir","x":0.09731299927378359,"y":0.08384146341463415},"7":{"id":7,"label":"Stokkseyri","x":0.3021060275962237,"y":-0.09146341463414634},"8":{"id":8,"label":"Reykholt","x":0.3485838779956427,"y":0.2728658536585366},"9":{"id":9,"label":"Laugarvatn","x":-0.06172839506172839,"y":-0.23628048780487804},"10":{"id":10,"label":"Gardabaer","x":0.14887436456063907,"y":-0.29573170731707316}}},"start_city":"Reykholar","end_city":"Reykholt"},
			{"city_info":{"Innnes":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Hvolsvollur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Egilsstadir":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Arskogssandur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Svalbardseyri":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Selfoss":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Thorlakshofn":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Gardur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Vopnafjordur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Olafsfjordur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Borg":{"possible_rewards":[25,35,50,100],"actual_reward":50}},"map":"fantasy_map_1560976821363.png","graph":{"edges":[[4,10],[10,8],[7,8],[9,8],[6,8],[5,9],[4,6],[3,7],[0,2],[2,3],[0,1],[1,3],[1,4],[2,5]],"nodes":{"0":{"id":0,"label":"Innnes","x":-0.34713144517066086,"y":0.038109756097560975},"1":{"id":1,"label":"Hvolsvollur","x":-0.19898329702251272,"y":0.2027439024390244},"2":{"id":2,"label":"Egilsstadir","x":-0.1111111111111111,"y":-0.051829268292682924},"3":{"id":3,"label":"Arskogssandur","x":0.03122730573710966,"y":0},"4":{"id":4,"label":"Svalbardseyri","x":0.15250544662309368,"y":0.17682926829268292},"5":{"id":5,"label":"Selfoss","x":0.06027596223674655,"y":-0.2865853658536585},"6":{"id":6,"label":"Thorlakshofn","x":0.26870007262164125,"y":0.11128048780487805},"7":{"id":7,"label":"Gardur","x":0.17429193899782136,"y":0.003048780487804878},"8":{"id":8,"label":"Vopnafjordur","x":0.3405954974582426,"y":0.042682926829268296},"9":{"id":9,"label":"Olafsfjordur","x":0.22730573710965868,"y":-0.0899390243902439},"10":{"id":10,"label":"Borg","x":0.27814088598402326,"y":0.3048780487804878}}},"start_city":"Innnes","end_city":"Vopnafjordur"},
			{"city_info":{"Nesjahverfi":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Hveragerdi":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Dalvik":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Budardalur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Arbaejarhverfi":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Eskifjordur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Laugarbakki":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Fellabaer":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Grundarhverfi":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Flateyri":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Hvammstangi":{"possible_rewards":[25,35,50,100],"actual_reward":50}},"map":"fantasy_map_1560976853546.png","graph":{"edges":[[2,5],[2,9],[6,8],[5,6],[10,8],[0,1],[0,2],[2,3],[1,4],[4,10],[3,10],[3,6],[9,7],[7,8]],"nodes":{"0":{"id":0,"label":"Nesjahverfi","x":-0.22778891115564462,"y":-0.09603658536585366},"1":{"id":1,"label":"Hveragerdi","x":-0.08350033400133601,"y":0.17835365853658536},"2":{"id":2,"label":"Dalvik","x":-0.03674014696058784,"y":-0.26371951219512196},"3":{"id":3,"label":"Budardalur","x":0.012024048096192385,"y":-0.0625},"4":{"id":4,"label":"Arbaejarhverfi","x":0.022712090848363394,"y":0.24085365853658536},"5":{"id":5,"label":"Eskifjordur","x":0.07214428857715431,"y":-0.17073170731707318},"6":{"id":6,"label":"Laugarbakki","x":0.229124916499666,"y":-0.06402439024390244},"7":{"id":7,"label":"Fellabaer","x":0.24248496993987975,"y":-0.2225609756097561},"8":{"id":8,"label":"Grundarhverfi","x":0.3587174348697395,"y":-0.09451219512195122},"9":{"id":9,"label":"Flateyri","x":0.08483633934535738,"y":-0.2972560975609756},"10":{"id":10,"label":"Hvammstangi","x":0.19438877755511022,"y":0.09298780487804878}}},"start_city":"Nesjahverfi","end_city":"Grundarhverfi"},
			{"city_info":{"Arnes":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Olafsvik":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Hvanneyri":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Thingeyri":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Laugaras":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Vik":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Hellissandur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Kopasker":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Saudarkrokur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Hauganes":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Patreksfjordur":{"possible_rewards":[25,35,50,100],"actual_reward":50}},"map":"fantasy_map_1560976873961.png","graph":{"edges":[[0,1],[1,3],[1,4],[3,6],[4,10],[6,9],[10,9],[9,8],[7,8],[0,2],[2,3],[3,5],[5,7],[6,10],[7,6]],"nodes":{"0":{"id":0,"label":"Arnes","x":-0.3346693386773547,"y":0.19817073170731708},"1":{"id":1,"label":"Olafsvik","x":-0.1629926519706079,"y":0.19359756097560976},"2":{"id":2,"label":"Hvanneyri","x":-0.23246492985971945,"y":-0.08231707317073171},"3":{"id":3,"label":"Thingeyri","x":-0.011356045424181697,"y":-0.17835365853658536},"4":{"id":4,"label":"Laugaras","x":0.09018036072144289,"y":0.23628048780487804},"5":{"id":5,"label":"Vik","x":0.10888443553774214,"y":-0.2606707317073171},"6":{"id":6,"label":"Hellissandur","x":0.23112892451569805,"y":0.01676829268292683},"7":{"id":7,"label":"Kopasker","x":0.2237808951235805,"y":-0.17682926829268292},"8":{"id":8,"label":"Saudarkrokur","x":0.34936539746158984,"y":-0.1524390243902439},"9":{"id":9,"label":"Hauganes","x":0.31730126920507684,"y":0.0701219512195122},"10":{"id":10,"label":"Patreksfjordur","x":0.2732130928523714,"y":0.27896341463414637}}},"start_city":"Arnes","end_city":"Saudarkrokur"},
			{"city_info":{"Sudureyri":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Seydisfjordur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Neskaupstadur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Holar":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Holmavik":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Thykkvabaer":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Husavik":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Kristnes":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Raufarhofn":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Reykjahlid":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Bakkafjordur":{"possible_rewards":[25,35,50,100],"actual_reward":50}},"map":"fantasy_map_1560976890783.png","graph":{"edges":[[0,1],[0,2],[1,7],[2,7],[2,3],[7,4],[3,4],[7,10],[10,9],[9,8],[4,6],[6,8],[4,5],[5,8]],"nodes":{"0":{"id":0,"label":"Sudureyri","x":-0.31128924515698064,"y":-0.17378048780487804},"1":{"id":1,"label":"Seydisfjordur","x":-0.1516366065464262,"y":0.16920731707317074},"2":{"id":2,"label":"Neskaupstadur","x":-0.09285237140948564,"y":0.038109756097560975},"3":{"id":3,"label":"Holar","x":-0.011356045424181697,"y":-0.17835365853658536},"4":{"id":4,"label":"Holmavik","x":0.07414829659318638,"y":-0.04725609756097561},"5":{"id":5,"label":"Thykkvabaer","x":0.16165664662658652,"y":0.013719512195121951},"6":{"id":6,"label":"Husavik","x":0.1843687374749499,"y":-0.22560975609756098},"7":{"id":7,"label":"Kristnes","x":-0.04676018704074816,"y":0.12957317073170732},"8":{"id":8,"label":"Raufarhofn","x":0.27788911155644624,"y":-0.06707317073170732},"9":{"id":9,"label":"Reykjahlid","x":0.18704074816299265,"y":0.1600609756097561},"10":{"id":10,"label":"Bakkafjordur","x":0.10688042752171009,"y":0.28810975609756095}}},"start_city":"Sudureyri","end_city":"Raufarhofn"},
			{"city_info":{"Grimsey":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Skagastrond":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Kirkjubaejarklaustur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Kopavogur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Hrafnagil":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Blonduos":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Alftanes":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Vogar":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Djupivogur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Brunahlid":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Hofsos":{"possible_rewards":[25,35,50,100],"actual_reward":50}},"map":"fantasy_map_1560976900330.png","graph":{"edges":[[0,1],[0,2],[2,3],[0,7],[1,10],[3,4],[7,5],[10,9],[9,8],[4,8],[1,5],[5,4],[5,6],[6,8]],"nodes":{"0":{"id":0,"label":"Grimsey","x":-0.3466933867735471,"y":0.10060975609756098},"1":{"id":1,"label":"Skagastrond","x":-0.1843687374749499,"y":0.2728658536585366},"2":{"id":2,"label":"Kirkjubaejarklaustur","x":-0.31596526386105545,"y":-0.12347560975609756},"3":{"id":3,"label":"Kopavogur","x":-0.16967267869071476,"y":-0.15091463414634146},"4":{"id":4,"label":"Hrafnagil","x":0.14896459585838343,"y":-0.14634146341463414},"5":{"id":5,"label":"Blonduos","x":-0.025384101536406144,"y":-0.009146341463414634},"6":{"id":6,"label":"Alftanes","x":0.14562458249833,"y":-0.08},"7":{"id":7,"label":"Vogar","x":-0.19238476953907815,"y":0.009146341463414634},"8":{"id":8,"label":"Djupivogur","x":0.34936539746158984,"y":-0.06402439024390244},"9":{"id":9,"label":"Brunahlid","x":0.18637274549098196,"y":0.2926829268292683},"10":{"id":10,"label":"Hofsos","x":0.022044088176352707,"y":0.17530487804878048}}},"start_city":"Grimsey","end_city":"Djupivogur"},
			{"city_info":{"Reykjanesbaer":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Melahverfi":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Laugar":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Hafnarfjordur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Bifrost":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Brautarholt":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Tjarnabyggd":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Mosfellsbaer":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Raudalaekur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Isafjordur":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Borgarnes":{"possible_rewards":[25,35,50,100],"actual_reward":50}},"map":"fantasy_map_1560977229084.png","graph":{"edges":[[0,2],[0,1],[3,5],[3,4],[9,7],[7,8],[1,3],[2,3],[9,10],[10,8],[4,9],[5,9],[4,6],[6,10]],"nodes":{"0":{"id":0,"label":"Reykjanesbaer","x":-0.3393453573814295,"y":0.007621951219512195},"1":{"id":1,"label":"Melahverfi","x":-0.25985303941215765,"y":0.18140243902439024},"2":{"id":2,"label":"Laugar","x":-0.2511690046760187,"y":-0.09603658536585366},"3":{"id":3,"label":"Hafnarfjordur","x":-0.1629926519706079,"y":0.08231707317073171},"4":{"id":4,"label":"Bifrost","x":0.05744822979291917,"y":-0.01676829268292683},"5":{"id":5,"label":"Brautarholt","x":0.04408817635270541,"y":-0.27896341463414637},"6":{"id":6,"label":"Tjarnabyggd","x":0.12157648630594522,"y":0.16158536585365854},"7":{"id":7,"label":"Mosfellsbaer","x":0.3199732798931196,"y":0.16615853658536586},"8":{"id":8,"label":"Raudalaekur","x":0.16165664662658652,"y":0.3551829268292683},"9":{"id":9,"label":"Isafjordur","x":0.23647294589178355,"y":-0.12652439024390244},"10":{"id":10,"label":"Borgarnes","x":0.21910487641950568,"y":0.20579268292682926}}},"start_city":"Reykjanesbaer","end_city":"Raudalaekur"}
		];
	} else {
		return [
			{"city_info":{"Wolfville":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Rustbluff":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Glumgorge":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Darkstone":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Snakedune":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Stiffbrook":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Blindtooth":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Ragbanks":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Steelcanyon":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Swiftchapel":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Dreadriver":{"possible_rewards":[25,35,50,100],"actual_reward":50}},"map":"fantasy_map_1560976725599.png","graph":{"edges":[[7,8],[0,2],[2,3],[2,1],[3,5],[3,9],[1,6],[1,9],[5,7],[6,4],[9,7],[5,10],[10,8],[4,8]],"nodes":{"0":{"id":0,"label":"Wolfville","x":-0.30501089324618735,"y":-0.24695121951219512},"1":{"id":1,"label":"Rustbluff","x":-0.1466957153231663,"y":0.06402439024390244},"2":{"id":2,"label":"Glumgorge","x":-0.28685548293391433,"y":-0.004573170731707317},"3":{"id":3,"label":"Darkstone","x":-0.1328976034858388,"y":-0.25},"4":{"id":4,"label":"Snakedune","x":0.20697167755991286,"y":0.15396341463414634},"5":{"id":5,"label":"Stiffbrook","x":0.03776325344952796,"y":-0.24390243902439024},"6":{"id":6,"label":"Blindtooth","x":0.025417574437182282,"y":0.09146341463414634},"7":{"id":7,"label":"Ragbanks","x":0.15468409586056645,"y":-0.14634146341463414},"8":{"id":8,"label":"Steelcanyon","x":0.2534495279593319,"y":-0.025914634146341462},"9":{"id":9,"label":"Swiftchapel","x":0,"y":-0.0350609756097561},"10":{"id":10,"label":"Dreadriver","x":0.3064633260711692,"y":-0.24847560975609756}}},"start_city":"Wolfville","end_city":"Steelcanyon"},
			{"city_info":{"Scornvale":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Silentedge":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Wolftrails":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Smoothmountain":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Serpentcrag":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Purestone":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Thornburg":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Wildbend":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Silverstead":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Greedpass":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Sinvale":{"possible_rewards":[25,35,50,100],"actual_reward":50}},"map":"fantasy_map_1560976804519.png","graph":{"edges":[[0,2],[2,1],[0,3],[3,9],[1,6],[5,6],[3,5],[6,4],[6,7],[7,8],[4,8],[9,6],[9,10],[10,7],[1,5]],"nodes":{"0":{"id":0,"label":"Scornvale","x":-0.38198983297022515,"y":0.019817073170731708},"1":{"id":1,"label":"Silentedge","x":-0.13217138707334786,"y":0.2073170731707317},"2":{"id":2,"label":"Wolftrails","x":-0.24473493100944083,"y":0.2606707317073171},"3":{"id":3,"label":"Smoothmountain","x":-0.20987654320987653,"y":-0.07621951219512195},"4":{"id":4,"label":"Serpentcrag","x":0.23529411764705882,"y":0.04878048780487805},"5":{"id":5,"label":"Purestone","x":-0.09658678286129267,"y":-0.009146341463414634},"6":{"id":6,"label":"Thornburg","x":0.09731299927378359,"y":0.08384146341463415},"7":{"id":7,"label":"Wildbend","x":0.3021060275962237,"y":-0.09146341463414634},"8":{"id":8,"label":"Silverstead","x":0.3485838779956427,"y":0.2728658536585366},"9":{"id":9,"label":"Greedpass","x":-0.06172839506172839,"y":-0.23628048780487804},"10":{"id":10,"label":"Sinvale","x":0.14887436456063907,"y":-0.29573170731707316}}},"start_city":"Scornvale","end_city":"Silverstead"},
			{"city_info":{"Goldcreak":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Crazerock":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Tanscar":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Breakroost":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Lightbank":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Slowalley":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Wolfmesa":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Desertglen":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Crookgate":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Blankhallow":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Tuckersnag":{"possible_rewards":[25,35,50,100],"actual_reward":50}},"map":"fantasy_map_1560976821363.png","graph":{"edges":[[4,10],[10,8],[7,8],[9,8],[6,8],[5,9],[4,6],[3,7],[0,2],[2,3],[0,1],[1,3],[1,4],[2,5]],"nodes":{"0":{"id":0,"label":"Goldcreak","x":-0.34713144517066086,"y":0.038109756097560975},"1":{"id":1,"label":"Crazerock","x":-0.19898329702251272,"y":0.2027439024390244},"2":{"id":2,"label":"Tanscar","x":-0.1111111111111111,"y":-0.051829268292682924},"3":{"id":3,"label":"Breakroost","x":0.03122730573710966,"y":0},"4":{"id":4,"label":"Lightbank","x":0.15250544662309368,"y":0.17682926829268292},"5":{"id":5,"label":"Slowalley","x":0.06027596223674655,"y":-0.2865853658536585},"6":{"id":6,"label":"Wolfmesa","x":0.26870007262164125,"y":0.11128048780487805},"7":{"id":7,"label":"Desertglen","x":0.17429193899782136,"y":0.003048780487804878},"8":{"id":8,"label":"Crookgate","x":0.3405954974582426,"y":0.042682926829268296},"9":{"id":9,"label":"Blankhallow","x":0.22730573710965868,"y":-0.0899390243902439},"10":{"id":10,"label":"Tuckersnag","x":0.27814088598402326,"y":0.3048780487804878}}},"start_city":"Goldcreak","end_city":"Crookgate"},
			{"city_info":{"Quickbanks":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Copper Crag":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Scorncreak":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Thinpass":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Defiant Rock":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Bareriver":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Dodgelake":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Dullgulch":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Paleflats":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Idlestream":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Drylanding":{"possible_rewards":[25,35,50,100],"actual_reward":50}},"map":"fantasy_map_1560976853546.png","graph":{"edges":[[2,5],[2,9],[6,8],[5,6],[10,8],[0,1],[0,2],[2,3],[1,4],[4,10],[3,10],[3,6],[9,7],[7,8]],"nodes":{"0":{"id":0,"label":"Quickbanks","x":-0.22778891115564462,"y":-0.09603658536585366},"1":{"id":1,"label":"Copper Crag","x":-0.08350033400133601,"y":0.17835365853658536},"2":{"id":2,"label":"Scorncreak","x":-0.03674014696058784,"y":-0.26371951219512196},"3":{"id":3,"label":"Thinpass","x":0.012024048096192385,"y":-0.0625},"4":{"id":4,"label":"Defiant Rock","x":0.022712090848363394,"y":0.24085365853658536},"5":{"id":5,"label":"Bareriver","x":0.07214428857715431,"y":-0.17073170731707318},"6":{"id":6,"label":"Dodgelake","x":0.229124916499666,"y":-0.06402439024390244},"7":{"id":7,"label":"Dullgulch","x":0.24248496993987975,"y":-0.2225609756097561},"8":{"id":8,"label":"Paleflats","x":0.3587174348697395,"y":-0.09451219512195122},"9":{"id":9,"label":"Idlestream","x":0.08483633934535738,"y":-0.2972560975609756},"10":{"id":10,"label":"Drylanding","x":0.19438877755511022,"y":0.09298780487804878}}},"start_city":"Quickbanks","end_city":"Paleflats"},
			{"city_info":{"Blindridge":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Lordssnag":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Venombutte":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Narrowville":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Leadtrail":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Swifttusk":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Desertburg":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Glumworth":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Thornhollow":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Tuckerdune":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Littlecanyon":{"possible_rewards":[25,35,50,100],"actual_reward":50}},"map":"fantasy_map_1560976873961.png","graph":{"edges":[[0,1],[1,3],[1,4],[3,6],[4,10],[6,9],[10,9],[9,8],[7,8],[0,2],[2,3],[3,5],[5,7],[6,10],[7,6]],"nodes":{"0":{"id":0,"label":"Blindridge","x":-0.3346693386773547,"y":0.19817073170731708},"1":{"id":1,"label":"Lordssnag","x":-0.1629926519706079,"y":0.19359756097560976},"2":{"id":2,"label":"Venombutte","x":-0.23246492985971945,"y":-0.08231707317073171},"3":{"id":3,"label":"Narrowville","x":-0.011356045424181697,"y":-0.17835365853658536},"4":{"id":4,"label":"Leadtrail","x":0.09018036072144289,"y":0.23628048780487804},"5":{"id":5,"label":"Swifttusk","x":0.10888443553774214,"y":-0.2606707317073171},"6":{"id":6,"label":"Desertburg","x":0.23112892451569805,"y":0.01676829268292683},"7":{"id":7,"label":"Glumworth","x":0.2237808951235805,"y":-0.17682926829268292},"8":{"id":8,"label":"Thornhollow","x":0.34936539746158984,"y":-0.1524390243902439},"9":{"id":9,"label":"Tuckerdune","x":0.31730126920507684,"y":0.0701219512195122},"10":{"id":10,"label":"Littlecanyon","x":0.2732130928523714,"y":0.27896341463414637}}},"start_city":"Blindridge","end_city":"Thornhollow"},
			{"city_info":{"Whitecrag":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Numbbanks":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Old Hill":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Snakebank":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Strongcreak":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Grimerock":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Silentcanyon":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Sandy Banks":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Courtdune":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Talonscar":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Clearpoint":{"possible_rewards":[25,35,50,100],"actual_reward":50}},"map":"fantasy_map_1560976890783.png","graph":{"edges":[[0,1],[0,2],[1,7],[2,7],[2,3],[7,4],[3,4],[7,10],[10,9],[9,8],[4,6],[6,8],[4,5],[5,8]],"nodes":{"0":{"id":0,"label":"Whitecrag","x":-0.31128924515698064,"y":-0.17378048780487804},"1":{"id":1,"label":"Numbbanks","x":-0.1516366065464262,"y":0.16920731707317074},"2":{"id":2,"label":"Old Hill","x":-0.09285237140948564,"y":0.038109756097560975},"3":{"id":3,"label":"Snakebank","x":-0.011356045424181697,"y":-0.17835365853658536},"4":{"id":4,"label":"Strongcreak","x":0.07414829659318638,"y":-0.04725609756097561},"5":{"id":5,"label":"Grimerock","x":0.16165664662658652,"y":0.013719512195121951},"6":{"id":6,"label":"Silentcanyon","x":0.1843687374749499,"y":-0.22560975609756098},"7":{"id":7,"label":"Sandy Banks","x":-0.04676018704074816,"y":0.12957317073170732},"8":{"id":8,"label":"Courtdune","x":0.27788911155644624,"y":-0.06707317073170732},"9":{"id":9,"label":"Talonscar","x":0.18704074816299265,"y":0.1600609756097561},"10":{"id":10,"label":"Clearpoint","x":0.10688042752171009,"y":0.28810975609756095}}},"start_city":"Whitecrag","end_city":"Courtdune"},
			{"city_info":{"Meekcreak":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Onyxtrails":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Richport":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Wolfdune":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Longwater":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Bittersprings":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Thornford":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Shady Hallow":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Plainbellow":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Copper Chapel":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Ruby Port":{"possible_rewards":[25,35,50,100],"actual_reward":50}},"map":"fantasy_map_1560976900330.png","graph":{"edges":[[0,1],[0,2],[2,3],[0,7],[1,10],[3,4],[7,5],[10,9],[9,8],[4,8],[1,5],[5,4],[5,6],[6,8]],"nodes":{"0":{"id":0,"label":"Meekcreak","x":-0.3466933867735471,"y":0.10060975609756098},"1":{"id":1,"label":"Onyxtrails","x":-0.1843687374749499,"y":0.2728658536585366},"2":{"id":2,"label":"Richport","x":-0.31596526386105545,"y":-0.12347560975609756},"3":{"id":3,"label":"Wolfdune","x":-0.16967267869071476,"y":-0.15091463414634146},"4":{"id":4,"label":"Longwater","x":0.14896459585838343,"y":-0.14634146341463414},"5":{"id":5,"label":"Bittersprings","x":-0.025384101536406144,"y":-0.009146341463414634},"6":{"id":6,"label":"Thornford","x":0.14562458249833,"y":-0.08},"7":{"id":7,"label":"Shady Hallow","x":-0.19238476953907815,"y":0.009146341463414634},"8":{"id":8,"label":"Plainbellow","x":0.34936539746158984,"y":-0.06402439024390244},"9":{"id":9,"label":"Copper Chapel","x":0.18637274549098196,"y":0.2926829268292683},"10":{"id":10,"label":"Ruby Port","x":0.022044088176352707,"y":0.17530487804878048}}},"start_city":"Meekcreak","end_city":"Plainbellow"},
			{"city_info":{"Bigstand":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Brokenroost":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Grand Mesa":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Wildbank":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Barrendowns":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Gravelburg":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Flatcity":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Goldenhowl":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Tightriver":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Paleville":{"possible_rewards":[25,35,50,100],"actual_reward":50},"Dusty Summit":{"possible_rewards":[25,35,50,100],"actual_reward":50}},"map":"fantasy_map_1560977229084.png","graph":{"edges":[[0,2],[0,1],[3,5],[3,4],[9,7],[7,8],[1,3],[2,3],[9,10],[10,8],[4,9],[5,9],[4,6],[6,10]],"nodes":{"0":{"id":0,"label":"Bigstand","x":-0.3393453573814295,"y":0.007621951219512195},"1":{"id":1,"label":"Brokenroost","x":-0.25985303941215765,"y":0.18140243902439024},"2":{"id":2,"label":"Grand Mesa","x":-0.2511690046760187,"y":-0.09603658536585366},"3":{"id":3,"label":"Wildbank","x":-0.1629926519706079,"y":0.08231707317073171},"4":{"id":4,"label":"Barrendowns","x":0.05744822979291917,"y":-0.01676829268292683},"5":{"id":5,"label":"Gravelburg","x":0.04408817635270541,"y":-0.27896341463414637},"6":{"id":6,"label":"Flatcity","x":0.12157648630594522,"y":0.16158536585365854},"7":{"id":7,"label":"Goldenhowl","x":0.3199732798931196,"y":0.16615853658536586},"8":{"id":8,"label":"Tightriver","x":0.16165664662658652,"y":0.3551829268292683},"9":{"id":9,"label":"Paleville","x":0.23647294589178355,"y":-0.12652439024390244},"10":{"id":10,"label":"Dusty Summit","x":0.21910487641950568,"y":0.20579268292682926}}},"start_city":"Bigstand","end_city":"Tightriver"}
		];
	}
}


$(window).on('load', function() {
	psiturk.recordUnstructuredData('time_start', Date.now());
	psiturk.recordUnstructuredData('params', PARAMS);
	return saveData()
	.then(function() {
		return setTimeout(function(){
			initialize_task(
				get_city_infos(PARAMS.icelandic),
				start_experiment
			);
		},100);
	}).catch(handleError);
});

function submitHit() {
	var promptResubmit, triesLeft;
	console.log('submitHit');
	$("#overlayed").show()
	$("#loading_screen").show()
	triesLeft = 1;
	promptResubmit = function() {
		console.log('promptResubmit');
		if (triesLeft) {
			console.log('try again', triesLeft);
			$("#loading_screen").hide()
			$("#database_error").show()
			$("#database_error p b").text(triesLeft)
			triesLeft -= 1;
			return saveData().catch(promptResubmit);
		} else {
			console.log('GIVE UP');
			$("#loading_screen").hide()
			$("#give_up").show()
			return new Promise(function(resolve) {
				return $('#resubmit').click(function() {
					return resolve('gave up');
				});
			});
		}
	};

	function completeHIT() {
		$(window).off("beforeunload");
		$(document.body).html(`
			<div class='jspsych-display-element'>
				<h1>Study complete</h1>

				<p>
				Your completion code is <b>5CDB1520</b>
				Click this link to submit<br>
				<a href=https://app.prolific.co/submissions/complete?cc=5CDB1520>
						https://app.prolific.co/submissions/complete?cc=5CDB1520
				</a>
				<p>
				If you have problems submitting, please contact 
				<a href="mailto:fredcallaway@princeton.edu">fredcallaway@princeton.edu</a>
			</div>
		`);
	}

	console.log("END OF SUBMITHIT");
	psiturk.recordUnstructuredData('time_end', Date.now());
	return saveData().catch(promptResubmit).then(completeHIT);
};

function handleError(e) {
	var message, msg;
	console.log('Error in experiment', e);
	if (e.stack) {
		msg = e.stack;
	} else if (e.name != null) {
		msg = e.name;
		if (e.message) {
			msg += ': ' + e.message;
		}
	} else {
		msg = e;
	}
	psiturk.recordUnstructuredData('error', msg);
	message = "HitID: " + (typeof hitId !== "undefined" && hitId !== null ? hitId[0] : "N/A") + "\nAssignID: " + (typeof hitId !== "undefined" && hitId !== null ? hitId[0] : "N/A") + "\nWorkerId: " + (typeof workerId !== "undefined" && workerId !== null ? workerId[0] : "N/A") + "\n" + msg
	$("#handle_error p a").attr("href","mailto:cocosci.turk@gmail.com?subject=ERROR in experiment&body=" + encodeURIComponent(message))
	$("#handle_error textarea").text(message)
	$("#handle_error").show()
	return $('#submit_hit').click(submitHit);
};

function get_image_path(filename){
	return "../static/images/" + filename;
}
