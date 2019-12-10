
class Zombie {

	constructor(xmapa,ymapa,mapa){
		this.xmapa = xmapa;
		this.ymapa = ymapa;
		this.anchura = 30;
		this.altura = 40;
		this.x = xmapa*anchuraCasilla;
		this.y = ymapa*anchuraCasilla;
		this.mapa = mapa;
		mapainterno[this.ymapa][this.xmapa] = 2;
		this.imagen = mapaactual.imagenzombie;
		this.contadorAturdido = 0;
		this.aturdido = false;
		this.aturdimiento = "";
		
		var direccion = "arriba";	
	}
}

function dibujarZombie(zombie){
	var img = zombie.imagen;
	ctx.drawImage(img,zombie.x, zombie.y);
}

function moverZombie(zombie){
	var caminosPosibles = []; 
	if(zombie.aturdido == false){
		if(zombie.xmapa-1 >= 0){
			if(zombie.mapa.layout[zombie.ymapa][zombie.xmapa-1] == 0){
				caminosPosibles.push("izquierda");
			}
		}
		if(zombie.xmapa+1 < zombie.mapa.anchura){
			if(zombie.mapa.layout[zombie.ymapa][zombie.xmapa+1] == 0){
				caminosPosibles.push("derecha");
			}
		}
		if(zombie.ymapa-1 >= 0){
			if(zombie.mapa.layout[zombie.ymapa-1][zombie.xmapa] == 0){
				caminosPosibles.push("arriba");
			}
		}
		if(zombie.ymapa+1 < zombie.mapa.altura){
			if(zombie.mapa.layout[zombie.ymapa+1][zombie.xmapa] == 0){
				caminosPosibles.push("abajo");
			}
		}
		
		
		
		if(caminosPosibles.length > 0){
			mapainterno[zombie.ymapa][zombie.xmapa] = 0;
			if(caminosPosibles.includes("abajo") && zombie.direccion == "arriba"){
				var index = caminosPosibles.indexOf("abajo");
				caminosPosibles.splice(index,1);
			}
			if(caminosPosibles.includes("arriba") && zombie.direccion == "abajo"){
				var index = caminosPosibles.indexOf("arriba");
				caminosPosibles.splice(index,1);
			}
			if(caminosPosibles.includes("derecha") && zombie.direccion == "izquierda"){
				var index = caminosPosibles.indexOf("derecha");
				caminosPosibles.splice(index,1);
			}
			if(caminosPosibles.includes("izquierda") && zombie.direccion == "derecha"){
				var index = caminosPosibles.indexOf("izquierda");
				caminosPosibles.splice(index,1);
			}
			
			if(caminosPosibles.length == 1){
				zombie.direccion = caminosPosibles[0];	
			}else{

				var rand = Math.floor(Math.random()*caminosPosibles.length);			
				zombie.direccion = caminosPosibles[rand];
			}
			
		}
		
		if(zombie.direccion == "arriba"){
			if(mapainterno[zombie.ymapa-1][zombie.xmapa] == 1){
				restarVida();
			}
			zombie.y-=alturaCasilla/2;
			setTimeout(function(){
				zombie.y-=alturaCasilla/2;
			}, 30);
			zombie.ymapa-=1;
		}else if(zombie.direccion == "abajo"){
			if(mapainterno[zombie.ymapa+1][zombie.xmapa] == 1){
				restarVida();
			}
			zombie.y+=alturaCasilla/2;	
			setTimeout(function(){
				zombie.y+=alturaCasilla/2;
			}, 30);
			zombie.ymapa+=1;

		}else if(zombie.direccion == "izquierda"){
			if(mapainterno[zombie.ymapa][zombie.xmapa-1] == 1){
				restarVida();
			}
			zombie.x-=alturaCasilla/2;	
			setTimeout(function(){
				zombie.x-=alturaCasilla/2;
			}, 30);
			zombie.xmapa-=1;
		}else if(zombie.direccion == "derecha"){
			if(mapainterno[zombie.ymapa][zombie.xmapa+1] == 1){
				restarVida();
			}
			zombie.x+=alturaCasilla/2;	
			setTimeout(function(){
				zombie.x+=alturaCasilla/2;
			}, 30);
			zombie.xmapa+=1;
		}
		
		//Comprobamos si ha caído en un agujero o no
		if(mapainterno[zombie.ymapa][zombie.xmapa] == 3){
			var index = conseguirIndexAgujero(zombie.ymapa,zombie.xmapa);
			if(agujeros[index].zombieDentro == false){
				zombieficarAgujero(index);
				enAgujero(zombie);
			}
		}else{
			mapainterno[zombie.ymapa][zombie.xmapa] = 2;
		}
	}
}

function animacion(zombie,posicion,operador){


}

function enAgujero(zombie){
	zombie.aturdido = true;
	zombie.imagen = mapaactual.imagenzombiecaido;
	zombie.aturdimiento = setInterval(function () {
		if(zombie.contadorAturdido < 5 && zombie.aturdido != false){
			zombie.aturdido = true;
			zombie.contadorAturdido++;
		}else{
			zombie.contadorAturdido = 0;
			zombie.imagen = mapaactual.imagenzombie;
			clearInterval(zombie.aturdimiento);
			zombie.aturdido = false;
			var indice = conseguirIndexAgujero(zombie.ymapa,zombie.xmapa);
			agujeros[indice].zombieDentro = false;
		}
	}, 1000);
}

function conseguirIndexZombie(y,x){
	
	for(var i = 0; i < zombies.length ; i++){
		if(zombies[i].xmapa == x && zombies[i].ymapa == y){	
			return i;
		}	
	}
	
}

function eliminarZombie(index){
	zombies.splice(index,1);
}