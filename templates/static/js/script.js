//****** GAME LOOP ********//

var time = new Date();
var deltaTime = 0;

if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(Init, 1);
} else {
    document.addEventListener("DOMContentLoaded", Init);
}

/*Metodo para Iniciar el juego llamando a la 
funcion de start y loop */
function Init() {
    time = new Date();
    Start();
    Loop();
}

/*Metodo  Bucle*/
function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

/****** GAME LOGIC ********/
/**Instanciamiento de variables */
var sueloY = 22;
var velY = 0;
var impulso = 900;
var gravedad = 2500;

var playerPosX = 42;
var playerPosY = sueloY;

var sueloX = 0;
var velEscenario = 1280 / 3;
var gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;

var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];

var tiempoHastaNube = 0.5;
var tiempoNubeMin = 0.7;
var tiempoNubeMax = 2.7;
var maxNubeY = 270;
var minNubeY = 100;
var nubes = [];
var velNube = 0.5;

var contenedor;
var player;
var textoScore;
var suelo;
var gameOver;

/*Metodo start que llamara a las clases de nuestro CSS */
function Start() {
    gameOver = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    player = document.querySelector(".player");
    document.addEventListener("keydown", HandleKeyDown);
}

/*Metodo si el player esta parado iniciara las 
    funciones dentro del metodo */
function Update() {
    if (parado) return;

    MoverPlayer();
    MoverSuelo();
    DecidirCrearObstaculos();
    DecidirCrearNubes();
    MoverObstaculos();
    MoverNubes();
    DetectarColision();

    velY -= gravedad * deltaTime;
}

/*Funcion que detecta el boton para jugar "espacio"
si el boton es presionado la funcion ejecutara el metodo de saltar*/
function HandleKeyDown(ev) {
    if (ev.keyCode == 32) {
        Saltar();
    }
}

/*Funcion que ejecuta el salto del player
    Si la posicion del player es igual a la del suelo
        el player saltara */
function Saltar() {
    if (playerPosY === sueloY) {
        saltando = true;
        velY = impulso;
        player.classList.remove("player-corriendo");
    }
}

/*Funcion que detecta el movimiento del personaje
    Mediante las variables instanciadas
    Si la posicion del player es menor al suelo
        ejecutara la funcion de TocarSuelo */
function MoverPlayer() {
    playerPosY += velY * deltaTime;
    if (playerPosY < sueloY) {

        TocarSuelo();
    }
    player.style.bottom = playerPosY + "px";
}

/*Funcion para detectar si el player ya toco el suelo*/
function TocarSuelo() {
    playerPosY = sueloY;
    velY = 0;
    if (saltando) {
        player.classList.add("player-corriendo");
    }
    saltando = false;
}

/*Funcion que desplazara el suelo hacia la izquierda
    Usara la funcion de CalcularDesplazamiento para
    determinar la velocidad y el tiempo de este */
function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

/*Funcion que retornara el calculo del desplazamiento
    Usando las variables */
function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

/*Funcion que decidira si hay que crear un obstaculo en determinado tiempo
    El tiempo disminuira hasta llegar a 0
    Si el tiempo del obstaculo es igual a 0
        Ejecutara la funcion que creara un onstaculo */
function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if (tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

/*Funcion que decidira si hay que crear una nube en determinado tiempo
    El tiempo disminuira hasta llegar a 0
    Si el tiempo de la nube es igual a 0
        Ejecutara la funcion que creara una nube */
function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime;
    if (tiempoHastaNube <= 0) {
        CrearNube();
    }
}

/*Funcion para crear un obstaculo
    Tomaremos la variable del obstaculo y crearemos un elemento div para contener la variable
    Ubicaremos el obstaculo dentro de nuestro contenedor
    El obstaculo contendra la clase cactus(imagen)
        Si un numero ramdom es menor a 0.5 agregaremos un segundo elemento
        Empujaremos los obstaculos y
        Mediante una operacion obtendremos el tiempo de aparicion del siguiente obstaculo
     */
function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("cactus");
    if (Math.random() > 0.5) obstaculo.classList.add("cactus2");
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth + "px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin) / gameVel;
}

/*Funcion para crear una nube
    Tomaremos la variable nube y crearemos un elemento div para contener la variable
    Ubicaremos la nube dentro de nuestro contenedor
    La nube contendra la clase nube(imagen)
        Obtenemos el posicionamiento de la nube mediante las variables
        Empujaremos los obstaculos y
        Mediante una operacion obtendremos el tiempo de aparicion del siguiente obstaculo
     */
function CrearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth + "px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY - minNubeY) + "px";

    nubes.push(nube);
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax - tiempoNubeMin) / gameVel;
}

/*Funcion para mover los obstaculos
    Mediante un bucle for */
function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        } else {
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX + "px";
        }
    }
}

/*Funcion para mover las nubes
    Mediante un bucle for */
function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if (nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        } else {
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX + "px";
        }
    }
}

/*Funcion que tomara la variable score y sumara 1 punto
    Cada vez que el score llega a cierto puntaje el backgroung
    del contenedor cambia y aumenta la velocidad del juego*/
function GanarPuntos() {
    score++;
    textoScore.innerText = score;
    if (score == 5) {
        gameVel = 1.5;
        contenedor.classList.add("mediodia");
    } else if (score == 10) {
        gameVel = 2;
        contenedor.classList.add("tarde");
    } else if (score == 20) {
        gameVel = 3;
        contenedor.classList.add("noche");
    }
    suelo.style.animationDuration = (3 / gameVel) + "s";
}

/*Funcion que lee la funcion de estrellarse
    Si es asi mostrara el mensaje de game over */
function GameOver() {
    Estrellarse();
    gameOver.style.display = "block";
}

/*Funcion para detectar la colision entre el player y los obstaculos
    si el obstaculo no choca con el player lo contara como evasion
    caso contrario detectara la colision entre el player y el obstaculo */
function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if (obstaculos[i].posX > playerPosX + player.clientWidth) {
            //EVADE
            break; //al estar en orden, no puede chocar con más
        } else {
            if (IsCollision(player, obstaculos[i], 10, 30, 15, 20)) {
                GameOver();
            }
        }
    }
}

/*Funcion para hacer la colision posible entre el player y el obstaculo
    Se instancia el espacio que contendra el objeto de colision */
function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}

/*Funcion pendiente*/
function Reset(){
    document.getElementById("reset").reset();
}
