
//Layout de los mapas
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

//Creamos las constantes del juego
const anchuraCasilla = 50;
const alturaCasilla = 50;
const TIEMPO_ANIMACION = 30;
const LIMITE_VELOCIDAD = 400;
const DEINCREMENTO_VELOCIDAD = 100;
const TIEMPO_AUMENTO_DIFICULTAD = 900;
const LIMITE_ZOMBIES = 10;

//Definimos las diferentes variables globales que nos servirán para controlar todo el juego.
var acabado = 0;
var empezado = 0;
var finalizado = 0;
//Estos arrays controlarán los zombies agujeros y tumbas del mapa para poder re pintarlos luego
var agujeros = [];
var zombies = [];
var tumbas = [];
var contador = 0;
var movimientozombie = "";
var velocidadzombies = 800;
var enterrador;
var refrescarjuego;
var jugador;

var vidas = 3;
var puntos = 0;

var aceptar = new Audio('audio/aceptar.wav');
var myAudio;

//Este es el constructor del mapa, el cual con una matriz de numeros y diferentes variables crea el mapa que sea.
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

//Constantes con las variables de los mapas, que incluyen el sprite del suelo, del zombie, el layout...
const mapa1 = new Mapa(mapalayout1,8,8,document.getElementById("pared1"),document.getElementById("suelo1"),
document.getElementById("zombie"),document.getElementById("zombiecaido"),document.getElementById("spawner"),4,4);
const mapa2 = new Mapa(mapalayout2,8,8,document.getElementById("pared2"),document.getElementById("suelo2"),
document.getElementById("momia"),document.getElementById("momiacaida"),document.getElementById("spawner2"),4,3);


//Ponemos por defecto el mapa 1
var mapaactual = mapa1;

//Esta función se inicia cada vez que empieza el juego, ya sea reiniciandolo o la primera vez que se inicia.
function iniciarJuego(){

	var nombre = prompt("Introduce tu nombre!", "Sombo");	//Se pide un nombre hasta que se introduzca.
	while(nombre == ""){
		nombre = prompt("Introduce tu nombre!", "Sombo");
	}

	jugador = new Jugador(nombre);
	reiniciarVariables();	//Antes de empezar lo reiniciamos todo, en caso de que no sea la primera vez que se inicia.
	document.getElementById("juego").style.display = "block";
	document.getElementById("inicio").style.display = "none";
	ctx = document.getElementById("juego").getContext("2d");	//Y cogemos el canvas
	SeleccionMapa();	//Lo primero que hace el juego es ir a la pantalla de selección de mapa.
	
}

function reiniciarVariables(){	//Reinicia todas las variables del juego.
	mapainterno=[
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0]
			];
			
	ctx = null;
	acabado = 0;
	empezado = 1;
	finalizado = 0;
	agujeros = [];
	zombies = [];
	tumbas = [];
	contador = 0;
	velocidadzombies = 800;
	vidas = 3;
	puntos = 0;
	seleccionandoMapa = true;
	mapaactual = mapa1;
	if(myAudio){
		myAudio.pause();
		myAudio.currentTime = 0;	
	}
	if(refrescarjuego){
		console.log("He limpiado el juego");
		clearInterval(refrescarjuego);
	}
	clearInterval(movimientozombie);
	console.log(velocidadzombies);
	document.getElementById("marcador").style.display = "none";
	document.getElementById("final").style.display = "none";
	document.getElementById("ranking").style.display = "none";
}

function pintarSeleccion(){		//Pinta la pantalla de selección de mapas.
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

function SeleccionMapa(){	//Función que se repite cada vez que nos movamos por la selección de mapa.
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
	pintarSeleccion();	//Pinta los mapas
	selector = new Selector(70,250);
	dibujarSelector();	//Y pinta el cursor selector
}

function nodo(){	//La función nodo es la función que inicia el juego como tal y el intervalo de juego.

	enterrador = new Enterrador(mapaactual.respawn[0][0],mapaactual.respawn[0][1]);	//Creamos al enterrador en su sitio de spawn
	mapainterno[enterrador.ymapa][enterrador.xmapa] = 1;
	document.getElementById("marcador").style.display = "block";

	sacarZombie();
	
	myAudio.pause();
	myAudio.currentTime = 0;	
	//Musica de fondo-------
	if(mapaactual == mapa1){		//Se selecciona la musica dependiendo del mapa
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

	dibujar();	//Se dibujan INICIALMENTE el mapa y el enterrador una sola vez
	dibujarEnterrador();
	
	movimientozombie = setInterval(function () {	//Se le asigna un intervalo de movimiento al zombie inicial.
			if(zombies.length > 0){
				for(var i = 0; i<zombies.length;i++){
					moverZombie(zombies[i]);
				}
			}
		}, velocidadzombies);		
		
	refrescarjuego = setInterval(function () { juego() }, 16,7); //Y empieza el intervalo del juego, que se repetirá hasta que acabe.
	
}

function juego(){ //Función que se repetirá con cada frame del juego.
	
	if(finalizado != 1){
		if(contador == TIEMPO_AUMENTO_DIFICULTAD){	//Cada X veces que se ejecute esta función aumentará la dificultad un poco.
			if(zombies.length < LIMITE_ZOMBIES){	//Además de que se agregará un zombie extra.
				sacarZombie();
			}
			
			if(velocidadzombies > LIMITE_VELOCIDAD){	//Si puede ir mas rapido, irá mas rapido hasta llegar al limite.
				velocidadzombies-= DEINCREMENTO_VELOCIDAD;
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
			dibujar();	//Y si aún quedan vidas lo dibuja todo de nuevo.
		}else{
			finalizado = 1; //Si no, acaba el juego.
		}
	}else{
		//FINAL DEL JUEGO: Se limpia el intervalo de juego y se muestra el ranking.
		clearInterval(refrescarjuego);
		document.getElementById("final").style.display = "block";
		jugador.puntuacionfinal = puntos;

		seleccionandoMapa = true;
		empezado = 2;
		recibirDatos();
		//Guardamos los datos con localstorage
		
	}	
}

//Local storage
function recibirDatos(){
	var arrayStorage = JSON.parse(window.localStorage.getItem('jugadores'));
	if(arrayStorage == null){
		arrayStorage = [];
	}
	arrayStorage.push(jugador);
	localStorage.setItem('jugadores', JSON.stringify(arrayStorage));
	personas  = JSON.parse(window.localStorage.getItem('jugadores'));
	personas.sort(compare);
	var output = "<ol><h1>RANKINGS</h1>"
	//El ranking solo mostrará a los 10 primeros + la última partida.
	for(var i = 0; i<personas.length && i< 10; i++){
		output+= "<li> "+personas[i].nombre + ": <b>"+personas[i].puntuacionfinal+"</b></li>";
	}
	output+="-. "+jugador.nombre + ": <b>"+jugador.puntuacionfinal+"</b>";
	output+="<br><h3>PULSA ESPACIO</h3></ol>";
	console.log(output);
	document.getElementById("ranking").innerHTML = output;
}

//Función para ordenar el ranking dependiendo de los puntos.
function compare( a, b ) {
	if ( a.puntuacionfinal > b.puntuacionfinal ){
		return -1;
	}
	if ( a.puntuacionfinal < b.puntuacionfinal ){
		return 1;
	}
	return 0;
}

//Funcion que dibuja todo el mapa y sus elementos (Agujeros, zombies, tumbas...)
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
			//Opción para que se vean las cuadriculas
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

//Función que se activa al recibir daño
function restarVida(){
	var audio = new Audio('audio/golpe.mp3');
	audio.play();
	console.log(vidas);
	console.log("Has recibido daño");
	vidas = vidas-1;
	mapainternoset0();

	//Y se espera medio segundo a volver a aparecer, para dar tiempo a reaccionar.
	enterrador = "";
	setTimeout(function(){
		enterrador = new Enterrador(mapaactual.respawn[0][0],mapaactual.respawn[0][1]);
	}, 500);
	
}

function sumarPuntos(numero){
	puntos = puntos+numero;
}

//Esta función es de las mas importantes del programa. Re-dibuja EN EL MAPA INTERNO al enterrador y lo mueve dependiendo de la tecla pulsada.
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
	
	//También dibuja los agujeros nuevos.
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

function mapainternoset0(){
	mapainterno[enterrador.ymapa][enterrador.xmapa] = 0;
}

function mapainternoset1(){
	mapainterno[enterrador.ymapa][enterrador.xmapa] = 1;
}

//Dibuja al enterrador de forma visual para que se pueda ver
function insertarEnterrador(){
	var img = enterrador.imagen;
	ctx.drawImage(img,enterrador.xmapa*anchuraCasilla, enterrador.ymapa*anchuraCasilla);
	mapainternoset1();
}

//Dibuja el selector de mapas.
function dibujarSelector(){
	var img = selector.imagen;
	ctx.drawImage(img,selector.x,selector.y);
}

//Se crea un agujero y se agrega al array de agujeros
function crearAgujero (y, x){
	var cavar = new Audio('audio/cavar.wav');
	cavar.volume = 0.3;
	cavar.play();
	var agujero = new Agujero(y,x);
	agujeros.push(agujero);

}

//Se crea una tumba y se agrega al array de tumbas. También se mapa al zombie.
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

//A esta función le pasas las coordenadas de un agujero y te devuelve su posición en el array
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

//Saca un zombie de forma aleatoria en cualquiera de los dos spawners de zombies del mapa.
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
	agujeros[index].zombieDentro = true;
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

//Esta funcións e activa cad< vez que se pulse una tecla
window.onkeydown = function(e) {
	
	var kc = e.keyCode;
	e.preventDefault();
	
	//El modo "seleccionandoMapa es todo lo que no sea el juego, basicamente todos los menús."
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
				//Pantalla de inicio
				aceptar.play();
				iniciarJuego();
				empezado = 1;
			}else if(empezado == 1){
				//Pantalla de selección de mapa
				seleccionandoMapa = false;
				aceptar.play();
				nodo();
				empezado = "";
			}else if(empezado == 2){
				//Confirmación final
				aceptar.play();
				document.getElementById("juego").style.display = "none";
				document.getElementById("final").style.display = "none";
				document.getElementById("marcador").style.display = "none";
				document.getElementById("ranking").style.display = "block";
				empezado = 3;
			}else if(empezado == 3){
				iniciarJuego();
			}
		}	

	}else{
		//Controles del juego.
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

window.onkeyup= function(e) { //Cuando se levanta la tecla, se pone a false de nuevo.
	
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

class Jugador {
	constructor(nombre){
		this.nombre = nombre;
		this.puntuacionfinal = 0;
	}
}