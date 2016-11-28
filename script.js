//window.localStorage.setItem('highscore','0');	

var tapClick = '';
var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
if(isAndroid) {
  tapClick = 'touchstart';
} else {
	tapClick = 'touchstart click';
}


var tilesN = 0;
var nextLevel = 0;
var rNbrs = 0;
var tTotal = 0;
console.log(tilesN);


function createNewGrid() {
	$('.rBox').text('0');
	console.log(tilesN);
	$('.gamesflow').html('');
	createGrid(50);
	
}

function createGrid(rows) {
	
	rNbrs = rows;
	
	function step1(){
		$(".loader").show();	
       return false;
    }
    function step2(){
		
		$('.gamesflow').html('');
		
		
		console.log('new grid', tilesN);
	var i = parseInt(tilesN) + 1;
	console.log(i);
	var randRow1 = Math.floor((Math.random() * rows) + 1) + tilesN;
	
	for (; i<=(tilesN + rows); i++) {
		console.log('i', i);
		$('.gamesflow').prepend('' +
			'<div class="row d' + i + '">' + 
				'<div class="box normal r' + i + '" data-rand="1"></div>' +
				'<div class="box normal r' + i + '" data-rand="2"></div>' +
				'<div class="box normal r' + i + '" data-rand="3"></div>' +
				'<div class="box normal r' + i + '" data-rand="4"></div>' +
			'</div>' 
		);
		
		var rand = Math.floor((Math.random() * 4) + 1);
		var id = '.d' + i + ' .box[data-rand=' + rand + ']';
		$(id).removeClass('normal').addClass('live').fadeIn();
		
		if (i==randRow1) {
				var randBox = Math.floor((Math.random() * 4) + 1);
				var id = '.d' + i + ' .box[data-rand=' + randBox + ']';
				
				var randNum = Math.floor((Math.random() * 3) + 1) * 25;
				$(id).removeClass('normal').addClass('nextLevel').addClass('l' + randNum).attr('data-nbr', randNum).html('+<br>' + randNum + '<br>rows').fadeIn();
		}
	}   
	
		$('.gamesflow').transition( { y :  '-' + (($('.row').height() * rows) - ($(window).height() - 160)) }, 0);
	
	$('.rBox').text((parseInt($('.rBox').text()) + rows));
	tilesN = tilesN + rows;
	console.log('n', tilesN);
		
	nextLevel = 0;
		
    }
    function step3(){
		$(".loader").hide();
    }
	
	
    $.when(step1()).done(step2()).done(step3());
	
	
}


function showResult(next) {
	stoptimer();
	$('.result').transition({ y : 0});
	$('.btn').transition({ y : 0 });
	
	if (next == 'gagne') {
		gagne();
	} 
	if (next == 'lose')  {
		lose();
	}
}

function gagne() {
	var tile = tilesN;
	var score = Math.round((tile / $('.t1').text()) * 1000) + (tile * 10);
	$('.score').text(score).show();
	if (localStorage)	{
		if (parseInt(window.localStorage.getItem('highscore')) <= parseInt(score)) {	
			window.localStorage.setItem('highscore', score);
			$('.highscore').text('New highscore: ' + score + '!').show();			
		} else {
			$('.highscore').text('Highscore: ' + window.localStorage.getItem('highscore')).show();
		}
	}
	$('.bigtitle').text('Good job!');
	$('.timeR').show();
	$('.tiles').text(tile);
	console.log(score);
	$('.tLink').attr('href', 'https://twitter.com/home?status=I%20just%20tapped%20' + tilesN + '%20tile%20in%20' + $('.t1').text() + '%20seconds%20@tapthetiles%20http://bit.ly/tapthetiles');
}

function lose() {
	$('.bigtitle').text('Try again :(');
	$('.highscore').show();
	$('.timeR, .score').hide();
	$('.tLink').attr('href', 'https://twitter.com/home?status=I%20love%20the%20new%20game%20Tap%20the%20Tiles%20@tapthetiles%20http://bit.ly/tapthetiles');
}

function showShare() {
	$('.shareModal').show();
	$('.shareModal').transition({ y : 0 });
}

function hideShare() {
	$('.shareModal').transition({ y : '160px' });
}

$(document).ready(function(e) {
	hideShare();
	if (localStorage)	{
		if (window.localStorage.getItem('highscore') == null) {	
			window.localStorage.setItem('highscore','0');			
		} 
	}
});

$(document).on('touchstart click', '.replay', function(e){
	e.stopPropagation(); e.preventDefault();
	$('.rBox').text('0');
	tilesN = 0;
	createNewGrid();
	r = 1;
	tTotal = 0;
	$('.result').transition({ y : '-100%'});
	$('.btn').transition({ y : 60 });
	hideShare();
	
});



$(document).on('touchstart click', '.play', function(e){
	e.stopPropagation(); e.preventDefault();
	$('.replay').text('Replay');
	$('.intro').remove();
	$('.timeR, .score, .highscore').show();
	$(this).removeClass('play');
});

$(document).on('touchstart click', '.share', function(e){
	e.stopPropagation(); e.preventDefault();
	return (this.tog = !this.tog) ? showShare() : hideShare();
});




		var r = 1;
	
	$(document).on('touchstart mousedown', '.live, .nextLevel', function(e){
		
		console.log(r, tilesN);
		
		e.stopPropagation(); e.preventDefault();
		if ($(this).hasClass('r' + r) == true) {
			
			$(this).css({'opacity':'0.6'});
			
			if ($(this).hasClass('nextLevel') == true) {
				nextLevel = nextLevel + parseInt($(this).attr('data-nbr'));
				$(this).transition({ scale: '1.5', opacity: 0}, 180);
				console.log('next level', nextLevel);
			}
			
			
			if (r == (tilesN - rNbrs + 1)) { starttimer(); console.log('timer started'); }
			
			
			if($('.rBox').text() > -1) {
				var rowH = '+=' + $('.row').height();
				$('.gamesflow').transition( { y :  rowH  }, 0);
				$('.rBox').text(($('.rBox').text()-1));
			} 
			
			if (r == tilesN) {  
					r += 1;
					if (nextLevel == 0) {
						showResult('gagne');
					} else {
						stoptimer(); 
						createGrid(nextLevel);
						tTotal = $('.t1').text() * 10;
					}
			} else {
				r += 1;
			}
		}
	});
	
	$(document).on('touchstart mousedown', '.normal', function(e){
		e.stopPropagation(); e.preventDefault();
			$(this).css({'background-color':'#ff0000'});
			showResult('lose');
	});
	
	
	
var interval;
	
function starttimer() {
	var time = 0,
	elapsed = '0.0';
	var start = new Date().getTime();
	
	instance();
 
 	function instance(){
		time += 100;
	
		elapsed = Math.floor(time / 100) / 10;
		if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
	
		$('.time').text(((elapsed * 10) + (tTotal)) / 10);
	
		var diff = (new Date().getTime() - start) - time;
		interval = window.setTimeout(instance, (100 - diff));
		
		
	}
	
}

function stoptimer() {
	window.clearTimeout(interval);
}
	
	
	
$(document).on('keydown', function(e) {
	
	console.log('keydown');
	
	var code = e.keyCode || e.which;
 	if(code == 86 || code == 65|| code == 37) {
   		keydown('1');
 	} else if (code == 66|| code == 83|| code == 38) {
   		keydown('2');
 	} else if (code == 78|| code == 68|| code == 39) {
   		keydown('3');
 	} else if (code == 77|| code == 70|| code == 40) {
   		keydown('4')
 	}
});

function keydown(nb) {
	
	console.log('keydown 2');
	
	var r2 = r;
	
	console.log(r2, nb);
	
	var id = '.r' + r2 + '[data-rand=' + parseInt(nb) + ']';
	
	console.log(id);
	
	$(id).mousedown();
}
	
	
