
const mapalayout1=[
		   [0,0,0,0,0,0,0,0],
		   [0,5,0,1,1,0,1,0],
		   [0,1,0,0,1,0,1,0],
		   [0,1,1,0,0,0,0,0],
		   [0,0,0,0,6,1,1,0],
		   [0,1,1,0,0,0,0,0],
		   [0,1,1,0,1,1,5,0],
		   [0,0,0,0,0,0,0,0]
		   ];
const mapalayout2=[
		   [0,0,0,0,0,0,0,1],
		   [0,1,0,5,0,1,0,1],
		   [0,0,0,0,0,0,0,0],
		   [1,0,1,1,6,0,1,1],
		   [0,0,0,0,0,0,0,0],
		   [0,1,1,0,1,1,0,1],
		   [0,5,1,0,0,0,0,0],
		   [0,0,0,0,1,1,0,1]
		   ];
//En el mapa interno irá todo lo que no sea una pared o el suelo.
var mapainterno=[
		   [0,0,0,0,0,0,0,0],
		   [0,0,0,0,0,0,0,0],
		   [0,0,0,0,0,0,0,0],
		   [0,0,0,0,0,0,0,0],
		   [0,0,0,0,0,0,0,0],
		   [0,0,0,0,0,0,0,0],
		   [0,0,0,0,0,0,0,0],
		   [0,0,0,0,0,0,0,0]
		   ];
		   
var ctx = null;
const anchuraCasilla = 50;
const alturaCasilla = 50;
const TIEMPO_ANIMACION = 30;
var acabado = 0;
var empezado = 0;
var enterrador;
var finalizado = 0;
var agujeros = [];
var zombies = [];
var tumbas = [];
var contador = 0;
var movimientozombie = "";
var velocidadzombies = 800;
var audioandar = new Audio('audio/andar.mp3');
var aceptar = new Audio('audio/aceptar.wav');
var myAudio;


class Mapa {
		
	constructor(array,anchura,altura,imagenpared,imagensuelo,imagenzombie,imagenzombiecaido,imagenrespawner,respawnx,respawny){
		this.layout = array;
		this.anchura = anchura;
		this.altura = altura;
		this.pared = imagenpared;
		this.suelo = imagensuelo
		this.imagenzombie = imagenzombie;
		this.imagenzombiecaido = imagenzombiecaido;
		this.imagenrespawner = imagenrespawner;
		this.respawn = [[respawnx,respawny]];
	}
}


var seleccionandoMapa = true;
var selector;
const mapa1 = new Mapa(mapalayout1,8,8,document.getElementById("pared1"),document.getElementById("suelo1"),
document.getElementById("zombie"),document.getElementById("zombiecaido"),document.getElementById("spawner"),4,4);
const mapa2 = new Mapa(mapalayout2,8,8,document.getElementById("pared2"),document.getElementById("suelo2"),
document.getElementById("momia"),document.getElementById("momiacaida"),document.getElementById("spawner2"),4,3);
var mapaactual = mapa1;



var vidas = 3;
var puntos = 0;


function iniciarJuego(){
	document.getElementById("juego").style.display = "block";
	document.getElementById("inicio").style.display = "none";
	ctx = document.getElementById("juego").getContext("2d");
	//nodo();
	SeleccionMapa();


}

function pintarSeleccion(){
	img = document.getElementById("fondo");
	ctx.drawImage(img,0,0);
	ctx.fillStyle = "black";
	ctx.fillRect(25, 75, 160, 160);
	img = document.getElementById("mapa1");
	ctx.drawImage(img,30,80);
	ctx.fillStyle = "black";
	ctx.fillRect(215, 75, 160, 160);
	img = document.getElementById("mapa2");
	ctx.drawImage(img,220,80);
}

function SeleccionMapa(){
	//Musica de fondo-------
		myAudio = new Audio('audio/musicamenu.mp3'); 
		myAudio.addEventListener('ended', function() {
			myAudio.volume = 0.3;
			this.currentTime = 0;
			this.play();
		}, false);
		myAudio.volume = 0.3;
		myAudio.play();
	//-------------------
	pintarSeleccion();
	selector = new Selector(70,250);
	dibujarSelector();
}

function nodo(){

	enterrador = new Enterrador(mapaactual.respawn[0][0],mapaactual.respawn[0][1]);
	mapainterno[enterrador.ymapa][enterrador.xmapa] = 1;
	
	sacarZombie();
	
	myAudio.pause();
	myAudio.currentTime = 0;	
	//Musica de fondo-------
	if(mapaactual == mapa1){
		myAudio = new Audio('audio/musica.mp3'); 
	}else if(mapaactual == mapa2){
		myAudio = new Audio('audio/musica2.mp3'); 
	}	
	myAudio.addEventListener('ended', function() {
		myAudio.volume = 0.3;
		this.currentTime = 0;
		this.play();
	}, false);
	myAudio.volume = 0.3;
	myAudio.play();
	//-------------------

	dibujar();	
	dibujarEnterrador();
	
	movimientozombie = setInterval(function () {
			if(zombies.length > 0){
				for(var i = 0; i<zombies.length;i++){
					moverZombie(zombies[i]);
				}
			}
		}, velocidadzombies);		
		
	var refrescarjuego = setInterval(function () { juego() }, 16,7);
	
}

function juego(){
	
	if(finalizado != 1){
		if(contador == 900){
			if(zombies.length < 10){
				sacarZombie();
			}
			
			if(velocidadzombies > 400){
				velocidadzombies = velocidadzombies - 100;
				clearInterval(movimientozombie);
				movimientozombie = setInterval(function () {
				if(zombies.length > 0){
					for(var i = 0; i<zombies.length;i++){
						moverZombie(zombies[i]);
					}
				}
				}, velocidadzombies);
			}
			contador = 0;
		}else{
			contador++;
		}
		
		
		if(vidas > -1){
			dibujar();
		}else{
			finalizado = 1;
		}
		//FINAL DEL JUEGO
	}else{
		//document.getElementById("juegoentero").style.display = "none";
		document.getElementById("final").style.display = "block";
		
	}	
}



function dibujar(){	
	var img;
	for(var y = 0; y < mapaactual.altura; ++y)
	{
		for(var x = 0; x < mapaactual.anchura; ++x)
		{
			switch(mapaactual.layout[y][x])
			{
				case 0:
					img = mapaactual.suelo;
					ctx.drawImage(img,x*anchuraCasilla,y*alturaCasilla);
					break;
				case 1:
					img = mapaactual.pared;
					ctx.drawImage(img,x*anchuraCasilla,y*alturaCasilla);
					break;
				case 5:
					img = mapaactual.imagenrespawner;
					ctx.drawImage(img,x*anchuraCasilla,y*alturaCasilla);
					break;
				case 6:
					img = document.getElementById("respawn");
					ctx.drawImage(img,x*anchuraCasilla,y*alturaCasilla);
			}
			
			//ctx.strokeRect( x*anchuraCasilla, y*alturaCasilla, anchuraCasilla, alturaCasilla);
			}
	}
		
			dibujarMarcador();
			if(agujeros.length > 0){
				for(var i = 0; i<agujeros.length;i++){
					dibujarAgujero(agujeros[i]);
				}
			}
			if(tumbas.length > 0){
				for(var i = 0; i<tumbas.length;i++){
					dibujarTumba(tumbas[i]);
				}
			}
			if(zombies.length > 0){
				for(var i = 0; i<zombies.length;i++){
					dibujarZombie(zombies[i]);
				}
			}


			insertarEnterrador();
}


function dibujarMarcador(){
	document.getElementById("marcador").innerHTML = "<b>Vidas: "+vidas+"   Puntos: "+puntos+"</b>";
}

function restarVida(){
	var audio = new Audio('audio/golpe.mp3');
	audio.play();
	console.log(vidas);
	console.log("Has recibido daño");
	vidas = vidas-1;
	mapainternoset0();
	enterrador = new Enterrador(mapaactual.respawn[0][0],mapaactual.respawn[0][1]);
}

function sumarPuntos(numero){
	puntos = puntos+numero;
}

function dibujarEnterrador(){
	var ymapa;
	var xmapa;
	
	if(Keys.arriba){
		ymapa = enterrador.ymapa-1;
		xmapa = enterrador.xmapa;
	}else if(Keys.abajo){
		ymapa = enterrador.ymapa+1;
		xmapa = enterrador.xmapa;
	}else if(Keys.derecha){
		ymapa = enterrador.ymapa;
		xmapa = enterrador.xmapa+1;
	}else if(Keys.izquierda){
		ymapa = enterrador.ymapa;
		xmapa = enterrador.xmapa-1;
	}
	
	if (Keys.arriba && ymapa >= 0 ){
		enterrador.imagen = document.getElementById("FosserT");
		if( mapaactual.layout[ymapa][xmapa] == 0){
			if(mapainterno[ymapa][xmapa] == 2 || mapainterno[ymapa][xmapa] == 3){
				restarVida();
			}else{
				mapainternoset0();
				audioandar.play();
				enterrador.y-=alturaCasilla/2;	
				setTimeout(function(){
					enterrador.y-=alturaCasilla/2;
				}, TIEMPO_ANIMACION);
				enterrador.ymapa-=1;
				mapainternoset1();
			}
		}
	}else if (Keys.abajo && ymapa < mapaactual.altura){
		enterrador.imagen = document.getElementById("FosserB");
		if( mapaactual.layout[ymapa][xmapa] == 0){
			if(mapainterno[ymapa][xmapa] == 2 || mapainterno[ymapa][xmapa] == 3){
				restarVida();
			}else{
				mapainternoset0();
				audioandar.play();
				enterrador.y+=alturaCasilla/2;	
				setTimeout(function(){
					enterrador.y+=alturaCasilla/2;
				}, TIEMPO_ANIMACION);
				enterrador.ymapa+=1;
				mapainternoset1();
			}
		}
	}else if (Keys.derecha && xmapa < mapaactual.anchura){
		enterrador.imagen = document.getElementById("FosserR");
		if( mapaactual.layout[ymapa][xmapa] == 0){
			if(mapainterno[ymapa][xmapa] == 2 || mapainterno[ymapa][xmapa] == 3){
				restarVida();
			}else{
				mapainternoset0();
				audioandar.play();
				enterrador.x+=alturaCasilla/2;	
				setTimeout(function(){
					enterrador.x+=alturaCasilla/2;
				}, TIEMPO_ANIMACION);
				enterrador.xmapa+=1;
				mapainternoset1();
			}
		}
	}else if (Keys.izquierda && xmapa >= 0) { 
		enterrador.imagen = document.getElementById("FosserL");
		if (mapaactual.layout[ymapa][xmapa] == 0){
			if(mapainterno[ymapa][xmapa] == 2 || mapainterno[ymapa][xmapa] == 3){
				restarVida();
			}else{
				mapainternoset0();
				audioandar.play();
				enterrador.x-=alturaCasilla/2;	
				setTimeout(function(){
					enterrador.x-=alturaCasilla/2;
				}, TIEMPO_ANIMACION);
				enterrador.xmapa-=1;
				mapainternoset1();
			}
		}
	}
	
	if(Keys.W){
		ymapa = enterrador.ymapa-1;
		xmapa = enterrador.xmapa;
	}else if(Keys.S){
		ymapa = enterrador.ymapa+1;
		xmapa = enterrador.xmapa;
	}else if(Keys.D){
		ymapa = enterrador.ymapa;
		xmapa = enterrador.xmapa+1;
	}else if(Keys.A){
		ymapa = enterrador.ymapa;
		xmapa = enterrador.xmapa-1;
	}
	
	//Agujeros
	if (Keys.W && ymapa >= 0 || Keys.S && ymapa < mapaactual.altura || Keys.D && xmapa < mapaactual.anchura || Keys.A && xmapa >= 0){
		if (Keys.W){
			enterrador.imagen = document.getElementById("FosserT");
		}else if (Keys.S){
			enterrador.imagen = document.getElementById("FosserB");
		}else if (Keys.A){
			enterrador.imagen = document.getElementById("FosserL");
		}else if (Keys.D){
			enterrador.imagen = document.getElementById("FosserR");
		}
		if( mapaactual.layout[ymapa][xmapa] == 0){
			if( mapainterno[ymapa][xmapa] == 0){
				mapainterno[ymapa][xmapa] = 3;
				crearAgujero(ymapa,xmapa);
			}else if( mapainterno[ymapa][xmapa] == 3){
				mapainterno[ymapa][xmapa] = 0;
				var index = conseguirIndexAgujero(ymapa,xmapa);
				if(agujeros[index].zombieDentro == false){
					eliminarAgujero(index);
				}else if(agujeros[index].zombieDentro == true){
					var indexZombie = conseguirIndexZombie(ymapa,xmapa);
					eliminarZombie(indexZombie);
					eliminarAgujero(index);
					crearTumba(ymapa,xmapa);
				}
			}
		}
		Keys.W = false;
		Keys.S = false;
		Keys.A = false;
		Keys.D = false;
	}
}

function insertarEnterrador(){
	
	var img = enterrador.imagen;
	ctx.drawImage(img,enterrador.xmapa*anchuraCasilla, enterrador.ymapa*anchuraCasilla);
	mapainternoset1();
}

function dibujarSelector(){
	var img = selector.imagen;
	ctx.drawImage(img,selector.x,selector.y);
}

function crearAgujero (y, x){
	var cavar = new Audio('audio/cavar.wav');
	cavar.volume = 0.3;
	cavar.play();
	var agujero = new Agujero(y,x);
	agujeros.push(agujero);

}

function crearTumba(y,x){
	var muertezombie = new Audio('audio/muertezombie.mp3');
	muertezombie.volume = 0.4;
	muertezombie.play();
	sumarPuntos(100);
	var tumba = new Tumba(y,x);
	sacarZombie();
	tumbas.push(tumba);
}

function dibujarAgujero(agujero){
	
	mapainterno[agujero.y][agujero.x] = 3;
	var img = agujero.imagen;
	ctx.drawImage(img,agujero.x*alturaCasilla,agujero.y*anchuraCasilla);

}

function dibujarTumba(tumba){
	
	var img = tumba.imagen;
	ctx.drawImage(img,tumba.x*alturaCasilla,tumba.y*anchuraCasilla);
	mapainterno[tumba.y][tumba.x] = 4;
	
}

function conseguirIndexAgujero(y,x){
	
	for(var i = 0; i < agujeros.length ; i++){
		if(agujeros[i].x == x && agujeros[i].y == y){
			
			return i;
		}	
	}
	
}

function conseguirIndexSpawns(){
	var posicionesSpawns = [];
	for(var i = 0; i < 8; i++){
		for(var x = 0; x< 8; x++){
			if(mapaactual.layout[i][x] == 5){	
				posicionesSpawns.push([x,i]);
			}
		}
	}
	return posicionesSpawns;
}

function sacarZombie(){
	var spawns = conseguirIndexSpawns();
	var rand = Math.floor(Math.random()*2);
	if(rand == 0){
		zombie = new Zombie(spawns[0][0],spawns[0][1],mapaactual);
		zombies.push(zombie);
	}else if(rand == 1){
		zombie = new Zombie(spawns[1][0],spawns[1][1],mapaactual);
		zombies.push(zombie);
	}
}

function eliminarAgujero(index){
	var cavar2 = new Audio('audio/cavar2.wav');
	cavar2.volume = 0.8;
	cavar2.play();
	agujeros.splice(index,1);
}

function zombieficarAgujero(index){
	agujeros[index].color = "green";
	agujeros[index].zombieDentro = true;
}

function mapainternoset0(){
	mapainterno[enterrador.ymapa][enterrador.xmapa] = 0;
}

function mapainternoset1(){
	mapainterno[enterrador.ymapa][enterrador.xmapa] = 1;
}

var Keys = {
	
	arriba: false,
	abajo: false,
	izquierda: false,
	derecha: false,
	W: false,
	A: false,
	S: false,
	D: false,
	espacio: false
};

window.onkeydown = function(e) {
	
	var kc = e.keyCode;
	e.preventDefault();
	
	if(seleccionandoMapa){
		if(kc == 37){
			if(mapaactual == mapa2){
				selector.x = 70;
				selector.y = 250;
				this.pintarSeleccion();
				dibujarSelector();
				var menu = new Audio('audio/menu1.mp3');
				menu.play();
				mapaactual = mapa1;
			}
		}else if(kc == 39){
			if(mapaactual == mapa1){
				selector.x = 260;
				selector.y = 250;
				this.pintarSeleccion();
				dibujarSelector();
				var menu = new Audio('audio/menu1.mp3');
				menu.play();
				mapaactual = mapa2;
			}
		}else if(kc == 32){
			if(empezado == 0){
				aceptar.play();
				iniciarJuego();
				empezado = 1;
			}else if(empezado == 1){
				seleccionandoMapa = false;
				aceptar.play();
				nodo();
				empezado = 2;
			}
		}	

	}else{
		if(kc == 37){
			Keys.izquierda = true;
		}else if(kc == 38){
			Keys.arriba = true;
		}else if(kc == 39){
			Keys.derecha = true;
		}else if(kc == 40){
			Keys.abajo = true;
		}else if(kc == 87){
			Keys.W = true;
		}else if(kc == 65){
			Keys.A = true;
		}else if(kc == 83){
			Keys.S = true;
		}else if(kc == 68){
			Keys.D = true;
		}
		dibujarEnterrador();
	}
}

window.onkeyup= function(e) {
	
	var kc = e.keyCode;
	e.preventDefault();
	
	if(kc == 37){
		Keys.izquierda = false;
	}else if(kc == 38){
		Keys.arriba = false;
	}else if(kc == 39){
		Keys.derecha = false;
	}else if(kc == 40){
		Keys.abajo = false;
	}else if(kc == 87){
		Keys.W = false;
	}else if(kc == 65){
		Keys.A = false;
	}else if(kc == 83){
		Keys.S = false;
	}else if(kc == 68){
		Keys.D = false;
	}
	
}	
	
class Enterrador {

	constructor(x,y){
		this.xmapa = x;
		this.ymapa = y;
		this.anchura = 30;
		this.altura = 40;
		this.x = x;
		this.y = y;
		this.imagen = document.getElementById("FosserR");	
	}
}

class Selector{
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.imagen = document.getElementById("selector");
	}
}

class Agujero {
		
	constructor(y,x){
		this.y = y;
		this.x = x;
		this.zombieDentro = false;
		this.imagen = document.getElementById("agujero");
	}
}

class Tumba {
		
	constructor(y,x){
		this.y = y;
		this.x = x;
		this.imagen = document.getElementById("tumba");	
	}
}