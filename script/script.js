//width="800" height="450"
var scoreTxt=document.getElementById("score");
var c=document.getElementById("monCanvas");
c.width  = c.offsetWidth;
c.height = c.offsetHeight;
var ctx=c.getContext("2d");
var etat;
var position;
var obstacleSol;
var obstacleAir;
var aLaMer;
var time;
var random;
var bouer;
var couldownBouer;
var couldownALaMer;
var etatJeu=false;
var run;

var imgCaillou = new Image;
imgCaillou.src = "image/KAYOU1.png";
var imgBato = new Image;
imgBato.src = "image/bato.png";
var imgBouer = new Image;
imgBouer.src = "image/bou-er.png";
var imgMouette = new Image;
imgMouette.src = "image/pi-jon.png";
var imgALaMer = new Image;
imgALaMer.src = "image/white_migran.png";


//stat
var score;
var sauve;
var ignore;
var rate;

var estMobile=false;

document.addEventListener("touchstart", click, false);

document.addEventListener("keydown", keySpace, false);

start();

function click(e) {
	//e.preventDefault();
	if(!estMobile)estMobile=true;
	if (!etatJeu) return;
    if(etat==0) {
        etat=1;
    }
}

function keySpace(e) {
	if (e.key == " " || e.key== "ArrowUp" || e.key=="ArrowDown") {
		e.preventDefault();
	}
	if (!etatJeu) return;
    if((e.key == " " || e.key== "ArrowUp") && etat==0) {
        etat=1;
    }else if(e.key=="ArrowDown" && bouer==0 && couldownBouer==0){
    	bouer=1;
    }else if(e.key=="Escape"){
    	fin();
    }
}

function start(){
	document.getElementById("stat").innerText="";
	etat=0;
	position=0;
	obstacleSol=[];
	obstacleAir=[];
	aLaMer=[];
	time=0;
	random=1;
	bouer=0;
	couldownBouer=0;
	couldownALaMer=100;

	score=0;
	sauve=0;
	ignore=0;
	rate=0;

	etatJeu=true;
	clearInterval(run);
	run=setInterval(main, 1);
}

function drawBateau() {
	ctx.drawImage(imgBato,0,318-position);
}

function drawBouer() {
	ctx.drawImage(imgBouer,0,318-position);
}

function drawALaMer() {
	for(let i=0;i<aLaMer.length;i++){
		ctx.drawImage(imgALaMer,aLaMer[i][0],318);
	}
}

function drawObstacleSol() {
	for(let i=0;i<obstacleSol.length;i++){
		ctx.drawImage(imgCaillou,obstacleSol[i],318);
	}
}

function drawObstacleAir() {
	for(let i=0;i<obstacleAir.length;i++){
		ctx.drawImage(imgMouette,obstacleAir[i],263);
	}
}

function physique(){//25*27

	for(let i=0;i<obstacleSol.length;i++){
		if((obstacleSol[i]<=0 && obstacleSol[i]+20>=0) || (obstacleSol[i]<=25 && obstacleSol[i]+20>=25)){
	    	if(position<21)fin();
		}
	}

	for(let i=0;i<obstacleAir.length;i++){
		if((obstacleAir[i]<=0 && obstacleAir[i]+20>=0) || (obstacleAir[i]<=25 && obstacleAir[i]+20>=25)){
	    	if(position>22)fin();
		}
	}		

	for(let i=0;i<aLaMer.length;i++){
		if((aLaMer[i][0]<=0 && aLaMer[i][0]+20>=0) || (aLaMer[i][0]<=25 && aLaMer[i][0]+20>=25)){
			if(aLaMer[i][1] && position<21){
				if(bouer!=0 || estMobile){
					score+=100;
					sauve++;
					aLaMer.splice(i,1);
					if(estMobile)bouer=1;
				}
    			else{
    				score-=100;
    				ignore++;
    				aLaMer[i][1]=false;
    			}
			}
		}
	}		
}

function main() {
	time++;
	score++;
	random--;
	if (random==0) {
		if (Math.random()<0.5) {
			if(aLaMer.length>0 && aLaMer[aLaMer.length-1]>750)obstacleSol.push(950);
			else obstacleSol.push(850);
			random=parseInt(Math.random()*100+500);
		}else{
			obstacleAir.push(850);
			random=parseInt(Math.random()*100+500);
		}
	}
	couldownALaMer--;
	if (couldownALaMer==0) {
		if(obstacleSol.length>0 && obstacleSol[obstacleSol.length-1]>750)aLaMer.push([950,true]);
		else aLaMer.push([850,true]);
		couldownALaMer=parseInt(Math.random()*100+500);
	}
	if (etat==1 && position<50) {
		position+=0.75;
	}else if(etat==1){
		etat=2;
	}else if (etat==2 && position>0) {
		position-=0.75;
	}else if(etat==2){
		etat=0;
	}
	if (couldownBouer>0) {
		couldownBouer--;
	}else if (bouer!=0 && bouer<100) {
		bouer++;
	}else if (bouer !=0) {
		bouer=0;
		couldownBouer=200;
	}
	for(let i=0;i<obstacleSol.length;i++){
		if (obstacleSol[i]<-49) {
			obstacleSol.splice(i,1);
		}else{
			obstacleSol[i]--;
		}
	}
	for(let i=0;i<obstacleAir.length;i++){
		if (obstacleAir[i]<-49) {
			obstacleAir.splice(i,1);
		}else{
			obstacleAir[i]--;
		}
	}
	for(let i=0;i<aLaMer.length;i++){
		if (aLaMer[i][0]<-15) {
			rate++;
			aLaMer.splice(i,1);
		}else{
			aLaMer[i][0]--;
		}
	}
	physique();
	ctx.clearRect(0, 0, 800, 450);
	drawBateau();
	drawALaMer();
	drawObstacleSol();
	drawObstacleAir();
	if (bouer!=0) {drawBouer()}
	scoreTxt.innerText=score;
}

function fin(){
	clearInterval(run);
    etatJeu=false;
    let stat=document.getElementById("stat");
    stat.innerText="Nombre de personne à la mer sauvées: "+sauve;
    stat.innerText+=" ratées: "+(rate-ignore);
    stat.innerText+=" ignorée: "+ignore;
}