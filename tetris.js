// Autor: Aingeru Sanchez
// Fecha de creación: 19/05/2015
// Script para implementar la esencia de juego de Tetris

// Variable global del juego
var main;
// ============== Point =======================
function Point(x, y) {
    this.x = x;
    this.y = y;    
}

// ============== Rectangle ====================
function Rectangle() {}

Rectangle.prototype.init = function(p1,p2) {
    this.px = p1.x;
    this.py = p1.y;
    this.x = this.px/Block.BLOCK_SIZE;
    this.y = this.py/Block.BLOCK_SIZE;
    this.width = p2.x - p1.x;
    this.height = p2.y - p1.y;
    this.lineWidth= 1;
    this.color = 'black';
}

Rectangle.prototype.draw = function() {
    /*   -HECHO-TU CÓDIGO AQUÍ: pinta un rectángulo del color actual en pantalla 
     en la posición px,py, con la anchura y altura actual y una linea
     de anchura=lineWidth. Observa que en este ejemplo, ctx es el nombre
     de la variable global contexto */
    ctx.beginPath();
    ctx.moveTo(this.px, this.py);                           //punto de inicio (px,py)
    ctx.lineTo(this.px+this.width, this.py);                //linea superior
    ctx.lineTo(this.px+this.width, this.py+this.height);    //linea derecha
    ctx.lineTo(this.px,this.py+this.height);                //linea inferior
    ctx.closePath();                                        //linea izquierda
    ctx.lineWidth = this.lineWidth;     //anchura de linea
    ctx.fillStyle = this.color;         //definir color de relleno
    ctx.fill();                         //rellenar rectangulo
    ctx.strokeStyle = 'black';          //definir color de las lineas de contorno
    ctx.stroke();                       //pintar las lineas definidas
};

Rectangle.prototype.drawNS = function() {
    ctxNS.beginPath();
    ctxNS.moveTo(this.px, this.py);                           //punto de inicio (px,py)
    ctxNS.lineTo(this.px+this.width, this.py);                //linea superior
    ctxNS.lineTo(this.px+this.width, this.py+this.height);    //linea derecha
    ctxNS.lineTo(this.px,this.py+this.height);                //linea inferior
    ctxNS.closePath();                                        //linea izquierda
    ctxNS.lineWidth = this.lineWidth;     //anchura de linea
    ctxNS.fillStyle = this.color;         //definir color de relleno
    ctxNS.fill();                         //rellenar rectangulo
    ctxNS.strokeStyle = 'black';          //definir color de las lineas de contorno
    ctxNS.stroke();                       //pintar las lineas definidas
};

// ESTE CÓDIGO VIENE DADO
Rectangle.prototype.move = function(x,y){
    this.px += x;
    this.py += y;
    this.draw();
}

// ESTE CÓDIGO VIENE DADO
Rectangle.prototype.erase = function(){
    ctx.beginPath();
    // probablemente en el juego sea mejor un lineWidth+2 
    // para no eliminar trocitos de las piezas que ya 
    // estén en el tablero
    ctx.lineWidth = this.lineWidth+2;
    ctx.strokeStyle = Tetris.BOARD_COLOR;
    ctx.rect(this.px, this.py, this.width, this.height);
    ctx.stroke();
    ctx.fillStyle = Tetris.BOARD_COLOR;
    ctx.fill();

}

Rectangle.prototype.setLineWidth = function(width) { this.lineWidth=width}
Rectangle.prototype.setFill = function(color) { this.color = color}

// ============== Block ===============================

function Block (pos, color) {
    /* -HECHO-TU CÓDIGO AQUÍ: constructor de la clase Block
   pos en coordenadas del tablero. color = color con el que pintar el bloque
   Internamente genera dos puntos (en coordenadas pixel) y llama al
   método init de Rectangle, pasándole estos 2 puntos como parámetros
   Sería interesante que usaras las constantes Block.BLOCK_SIZE y Block.OUTLINE_WIDTH
   para establecer el ancho del bloque y de la línea de contorno respectivamente. */

    var p1 = new Point(pos.x*Block.BLOCK_SIZE, pos.y*Block.BLOCK_SIZE); //punto superior izquierdo
    var p2 = new Point(p1.x+Block.BLOCK_SIZE, p1.y+Block.BLOCK_SIZE);   //punto inferior derecho
    this.init(p1,p2);   //coordenadas del pixel superior izquierdo, anchura, altura, ancho de linea y color de relleno
    this.setLineWidth(Block.OUTLINE_WIDTH);
    this.setFill(color);
};

// -HECHO-TU CÓDIGO AQUÍ: patrón de herencia (Block es un Rectangle)
Block.prototype = new Rectangle();
Block.prototype.constructor = Block;
//// He cambiado la localización del patrón de herencia, puesto que en el foro pone que las funciones entre este y la función Block no las tiene en cuenta


Block.prototype.can_move = function(board, dx, dy) {
    // -HECHO-TU CÓDIGO AQUÍ: toma como parámetro un incremento (dx,dy)
    // e indica si es posible mover el bloque actual al 
    // incrementar su posición en ese valor
    // (hace uso de board.can_move)

    if(board.can_move.call(board, dx/Block.BLOCK_SIZE, dy/Block.BLOCK_SIZE)) {
        return true;
    } else {
        return false;
    }
};

// ESTE CÓDIGO VIENE YA PROGRAMADO
Block.prototype.move = function(dx, dy) {
    this.x += dx;
    this.y += dy;

    Rectangle.prototype.move.call(this, dx * Block.BLOCK_SIZE, dy * Block.BLOCK_SIZE);
};

Block.BLOCK_SIZE = 30;
Block.OUTLINE_WIDTH = 2;

// ============== Shape =====================================
function Shape() {}

Shape.prototype.init = function(coords, color) {
    // -HECHO-TU CÓDIGO: método de inicialización de una Pieza del tablero
    // Toma como parámetros: coords, un array de posiciones de los bloques
    // que forman la Pieza y color, un string que indica el color de los bloques
    // Post: para cada coordenada, genera un bloque de ese color
    // y lo guarda en un array interno de bloques
    // hemos añadido este atributo
    this.rotation_dir = 1;
    // Array de bloques de la pieza
    this.blocks = [];
    for(var i=0; i<coords.length; i++) {
        this.blocks.push(new Block(coords[i], color));
    }
};


Shape.prototype.draw = function() {
    // -HECHO-TU CÓDIGO AQUÍ: método que debe pintar en pantalla todos los bloques
    // que forman la Pieza
    for(var i=0; i<this.blocks.length; i++) {
        this.blocks[i].draw();
    }
};

Shape.prototype.drawNS = function() {
    for(var i=0; i<this.blocks.length; i++) {
        this.blocks[i].drawNS();
    }
};


Shape.prototype.can_move = function(board,dx,dy) {
    // -HECHO-TU CÓDIGO AQUÍ: comprobar límites para cada bloque de la pieza
    // (hace uso de Block.can_move)

    var resultado = true;
    for (block of this.blocks) {
        if(!Block.prototype.can_move(board, block.px+Block.BLOCK_SIZE*dx, block.py+Block.BLOCK_SIZE*dy)) {
            resultado = false;
        }
    }
    return resultado;
};

Shape.prototype.can_rotate = function(board) {
    // -HECHO-TU CÓDIGO AQUÍ: calcula la fórmula de rotación para cada uno de los bloques de
    // la pieza. Si alguno de los bloques no se pudiera mover a la nueva posición,
    // devolver false. En caso contrario, true.
    if(!(this.constructor.name == "O_Shape")) {
        var center = this.center_block;
        var dir = this.rotation_dir;
        var resul = true;
        for (block of this.blocks) {
            var x = center.px - dir*center.py + dir*block.py;
            var y = center.py + dir*center.px - dir*block.px;
            if (!Block.prototype.can_move(board, x, y)) {
                resul = false;
            }
        }
        return resul; 
    } else {
        return false;
    }
};


// ESTE CÓDIGO VIENE YA PROGRAMADO
Shape.prototype.move = function(dx, dy) {
    for (block of this.blocks) {
        block.erase();
    }

    for (block of this.blocks) {
        block.move(dx,dy);
    }
};

Shape.prototype.rotate = function() {

    // -HECHO-TU CÓDIGO AQUÍ:  básicamente tienes que aplicar la fórmula de rotación
    // (que se muestra en el enunciado de la práctica) a todos los bloques de la pieza 
    // y moverlos a sus nuevas posiciones rotadas
    // (seguramente tengas que borrar las posiciones anteriores...)
    if (!(this.constructor.name == "O_Shape")) {
        for (block of this.blocks) {
            block.erase();
        }

        var center = this.center_block;
        var dir = this.rotation_dir;
        for (block of this.blocks) {
            var dx = center.px - dir*center.py + dir*block.py;
            var dy = center.py + dir*center.px - dir*block.px;
            block.move((dx-block.px)/Block.BLOCK_SIZE,(dy-block.py)/Block.BLOCK_SIZE);
            // Efecto de sonido al girar
            document.getElementById("giro").play();
        }

        /* Deja este código al final. Por defecto las piezas deben oscilar en su
         movimiento, aunque no siempre es así (de ahí que haya que comprobarlo) */
        if (this.shift_rotation_dir)
            this.rotation_dir *= -1
    }
};


// ============= I_Shape ================================
function I_Shape(center) {
    var coords = [new Point(center.x - 2, center.y),
                  new Point(center.x - 1, center.y),
                  new Point(center.x , center.y),
                  new Point(center.x + 1, center.y)];

    Shape.prototype.init.call(this, coords, "blue");   

    // OBSERVA que en cada tipo de pieza deberás decidir
    // el valor de estos dos nuevos atributos
    this.shift_rotation_dir = true;
    this.center_block = this.blocks[1];
};

// TU CÓDIGO: I_Shape hereda de Shape
I_Shape.prototype = new Shape();
I_Shape.prototype.constructor = I_Shape;

// =============== J_Shape =============================
function J_Shape(center) {
    // -HECHO-TU CÓDIGO: para J_Shape... básate en I_Shape
    var coords = [ new Point(center.x - 1, center.y),
                  new Point(center.x , center.y),
                  new Point(center.x + 1, center.y),
                  new Point(center.x + 1, center.y + 1)];

    Shape.prototype.init.call(this, coords, "orange");

    // OBSERVA que en cada tipo de pieza deberás decidir
    // el valor de estos dos nuevos atributos
    this.shift_rotation_dir = false;
    this.center_block = this.blocks[1];

};
// -HECHO-TU CÓDIGO: J_Shape hereda de Shape
J_Shape.prototype = new Shape();
J_Shape.prototype.constructor = J_Shape;


// ============ L Shape ===========================
function L_Shape(center) {
    // -HECHO-TU CÓDIGO: para L_Shape... básate en I_Shape
    var coords = [ new Point(center.x - 1, center.y + 1),
                  new Point(center.x, center.y),
                  new Point(center.x - 1, center.y),
                  new Point(center.x + 1, center.y)];

    Shape.prototype.init.call(this, coords, "cyan");

    // OBSERVA que en cada tipo de pieza deberás decidir
    // el valor de estos dos nuevos atributos
    this.shift_rotation_dir = false;
    this.center_block = this.blocks[1];
};
// -HECHO-TU CÓDIGO: L_Shape hereda de Shape
L_Shape.prototype = new Shape();
L_Shape.prototype.constructor = L_Shape;


// ============ O Shape ===========================
function O_Shape(center) {
    // -HECHO-TU CÓDIGO: O_Shape... básate en I_Shape
    var coords = [ new Point(center.x - 1, center.y),
                  new Point(center.x , center.y),
                  new Point(center.x, center.y + 1),
                  new Point(center.x - 1, center.y + 1)];

    Shape.prototype.init.call(this, coords, "red"); 

    // OBSERVA que en cada tipo de pieza deberás decidir
    // el valor de estos dos nuevos atributos
    this.shift_rotation_dir = true;
    this.center_block = this.blocks[1];
    // Esta pieza no tiene centro
};
// -HECHO-TU CÓDIGO: O_Shape hereda de Shape
O_Shape.prototype = new Shape();
O_Shape.prototype.constructor = O_Shape;

// ============ S Shape ===========================
function S_Shape(center) {
    // -HECHO-TU CÓDIGO: S_Shape... básate en I_Shape
    var coords = [ new Point(center.x - 1, center.y + 1),
                  new Point(center.x, center.y),
                  new Point(center.x , center.y + 1),
                  new Point(center.x + 1, center.y)];

    Shape.prototype.init.call(this, coords, "green"); 

    // OBSERVA que en cada tipo de pieza deberás decidir
    // el valor de estos dos nuevos atributos
    this.shift_rotation_dir = true;
    this.center_block = this.blocks[1];
};
// -HECHO-TU CÓDIGO: S_Shape hereda de Shape
S_Shape.prototype = new Shape();
S_Shape.prototype.constructor = S_Shape;

// ============ T Shape ===========================
function T_Shape(center) {
    // -HECHO-TU CÓDIGO: T_Shape... básate en I_Shape
    var coords = [ new Point(center.x - 1, center.y),
                  new Point(center.x , center.y),
                  new Point(center.x, center.y + 1),
                  new Point(center.x + 1, center.y)];

    Shape.prototype.init.call(this, coords, "yellow"); 

    // OBSERVA que en cada tipo de pieza deberás decidir
    // el valor de estos dos nuevos atributos
    this.shift_rotation_dir = false;
    this.center_block = this.blocks[1];
};
// -HECHO-TU CÓDIGO: T_Shape hereda de Shape
T_Shape.prototype = new Shape();
T_Shape.prototype.constructor = T_Shape;


// ============ Z Shape ===========================
function Z_Shape(center) {
    // -HECHO-TU CÓDIGO: Z_Shape... básate en I_Shape

    var coords = [ new Point(center.x - 1, center.y),
                  new Point(center.x , center.y),
                  new Point(center.x, center.y + 1),
                  new Point(center.x + 1, center.y + 1)];

    Shape.prototype.init.call(this, coords, "magenta");

    // OBSERVA que en cada tipo de pieza deberás decidir
    // el valor de estos dos nuevos atributos
    this.shift_rotation_dir = true;
    this.center_block = this.blocks[1];
};
// -HECHO-TU CÓDIGO: Z_Shape hereda de Shape
Z_Shape.prototype = new Shape();
Z_Shape.prototype.constructor = Z_Shape;

// ====================== BOARD ================
function Board(width, height) {
    this.width = width;
    this.height = height;
    // NUEVO ATRIBUTO  
    this.grid = {};

}

Board.prototype.add_shape = function(shape){
    // -HECHO-TU CÓDIGO AQUÍ
    // Toma como parámetro una pieza y para cada bloque de esa pieza
    // la añade al diccionario grid
    // Por ejemplo, si la pieza tiene el bloqueA en 5,6
    // grid["5,6"] = bloqueA
    for (block of shape.blocks) {
        coordenadas = block.px/Block.BLOCK_SIZE + "," + block.py/Block.BLOCK_SIZE;
        this.board.grid[coordenadas] = block;
    }
};

Board.prototype.draw_shape = function(shape){
    // Si la pieza puede moverse a la posición actual (es decir, con un desplazamiento de 0,0),
    //  dibujarla y devolver true. En caso contrario, devolver false.

    if(Shape.prototype.can_move.call(this.current_shape, this.board, 0, 0)) { 
        // Si puede pintarse en la posición inicial --> desplazamiento 0,0
        // Dibujar pieza --> Shape.init(cual de las 7 piezas, Coordenadas del tablero donde crear la pieza, color de la pieza)
        shape.draw();

        return true;
    } else {
        return false;
    }
};

Board.prototype.draw_nextShape = function(shape) {
    shape.drawNS();
};

// -HECHO-TU CÓDIGO AQUÍ: comprobar si el movimiento a x,y es posible
Board.prototype.can_move = function(x,y){

    if ((0<=x && x<=(this.width-1)) && (0<=y && y<=(this.height-1))) {
        //    if ((0<=x && x<=(Tetris.BOARD_WIDTH-1)) && (0<=y && y<=(Tetris.BOARD_HEIGHT-1))) {
        //PARTE 6: Condición para que pare cuando choca contra otro bloque de Board.grid
        // TU CÓDIGO AQUÍ: modifica el método can_move para saber si 
        // la posición x,y está libre en el grid. Devuelve true si 
        // está libre. False en caso contrario.
        // (es decir, mantén el código que ya tuvieras programado, pero añade la 
        // comprobación que se indica) 
        coordenadas = Math.floor(x) + "," + Math.floor(y);
        if ( coordenadas in this.grid ) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};

Board.prototype.is_row_complete = function(y){
    // -HECHO-TU CÓDIGO AQUÍ: comprueba si la línea que se le pasa como parámetro
    // es completa (en cuyo caso, devuelve true) o no (en cuyo caso, devuelve false). Para ello, se busca que esa línea del grid tenga bloques en todas las casillas.
    var resultado = true;

    for (var i = 0; i < this.width; i++) {
        coordenadas = i + "," + y;
        if (!( coordenadas in this.grid )) {
            resultado = false;
        }
    }
    return resultado;
};

Board.prototype.move_down_rows = function(y_start){
    // -HECHO-TU CÓDIGO AQUÍ:
    var bloque;
    //  empezando en la fila y_start y hasta la fila 0
    for ( var fila = y_start; fila >= 0; fila-- ) {
        // para todas las casillas de esa fila
        for (var i = 0; i < this.width; i++) {
            // si la casilla está en el grid  (hay bloque en esa casilla)
            coordenadas = i + "," + fila;
            if ( coordenadas in this.grid ) {
                bloque = this.grid[coordenadas];
                // borrar el bloque del grid
                delete this.grid[coordenadas];
                // mientras se pueda mover el bloque hacia abajo
                if(bloque.can_move(this,Tetris.DIRECTION['Down'][0], Tetris.DIRECTION['Down'][1])){
                    // mover el bloque hacia abajo
                    bloque.erase();
                    bloque.move(Tetris.DIRECTION['Down'][0], Tetris.DIRECTION['Down'][1]);
                }
                // meter el bloque en la nueva posición del grid
                coordenadas = i + "," + bloque.py/Block.BLOCK_SIZE;
                this.grid[coordenadas] = bloque;
            }
        }
    }
};

Board.prototype.delete_row = function(y){
    // -HECHO-TU CÓDIGO AQUÍ: Borra del grid y de pantalla todos los 
    // bloques de la fila y que le llega como parámetro
    var bloque;
    for (var i = 0; i < this.width; i++) {
        coordenadas = i + "," + y;
        bloque = this.grid[coordenadas];
        // Borrar linea de board.grid
        delete this.grid[coordenadas];
        // Borrar linea 'y' de la pantalla ("tablero")
        bloque.erase();
    }
};

var puntuacion = 0;
Board.prototype.remove_complete_rows = function(){
    var cont = 0;
    var acum = 0;
    // -HECHO-TU CÓDIGO AQUÍ:
    // Para toda fila del tablero
    for ( var fila = this.height-1; fila >= 0; fila-- ) {
        // si la fila y está completa
        if ( this.is_row_complete(fila) ) {
            // borrar fila
            this.delete_row(fila);
            document.getElementById("linea").play();
            acum += 100;
            cont++;
            // y mover hacia abajo las filas superiores (es decir, move_down_rows(y-1) )
            this.move_down_rows(fila-1);
            // si la fila ha sido eliminada, no pasar a comprobar la siguiente,
            // comprobar de nuevo la misma
            fila++;
        }
    }
    puntuacion += acum*cont;
    // Limpiar resultado anterior y repintar el fondo dependiendo de la puntuación
    if(0<=puntuacion && puntuacion<500) {
        ctxPuntos.fillStyle = 'yellow';
    } else if (500<=puntuacion && puntuacion<1000) {
        ctxPuntos.fillStyle = 'orange';
        clearInterval(movimiento);
        movimiento = setInterval(Tetris.prototype.do_move.bind(juego,'Down'), 800);
    } else if (1000<=puntuacion && puntuacion<2500) {
        ctxPuntos.fillStyle = 'red';
        clearInterval(movimiento);
        movimiento = setInterval(Tetris.prototype.do_move.bind(juego,'Down'), 600);
    } else if (2500<=puntuacion && puntuacion<5000) {
        ctxPuntos.fillStyle = 'magenta';
        clearInterval(movimiento);
        movimiento = setInterval(Tetris.prototype.do_move.bind(juego,'Down'), 400);
    } else if (5000<=puntuacion && puntuacion<10000) {
        ctxPuntos.fillStyle = 'cyan';
        clearInterval(movimiento);
        movimiento = setInterval(Tetris.prototype.do_move.bind(juego,'Down'), 200);
    } else {
        ctxPuntos.fillStyle = 'green';
        clearInterval(movimiento);
        movimiento = setInterval(Tetris.prototype.do_move.bind(juego,'Down'), 100);
    }
//    ctxPuntos.fillStyle = 'white';
    ctxPuntos.fillRect(0,0,canvas.width,canvas.height);
    // Pintar nuevo resultado
    ctxPuntos.fillStyle = "black";
    ctxPuntos.font= "bold 40px Tetris Regular";
    ctxPuntos.fillText(puntuacion, 5, 40);
};
// Metodo para mostrar mensaje de PAUSA en el canvas
//Board.prototype.pause = function() {
//    // Pintar capa transparente
//    ctx.fillStyle = "rgba(167, 167, 167, 0.3)"
//    ctx.fillRect(0, 0, canvas.width, canvas.height);
//    // Recuadro negro para PAUSA
//    ctx.fillStyle="#000000";
//    ctx.fillRect(0,canvas.height/2-Block.BLOCK_SIZE*2-1,canvas.width,Block.BLOCK_SIZE*3+1);
//    // Mostrar PAUSA en el canvas
//    // Create gradient
//    var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
//    gradient.addColorStop("0", "blue");
//    gradient.addColorStop("0.14", "orange");
//    gradient.addColorStop("0.28", "cyan");
//    gradient.addColorStop("0.42", "red");
//    gradient.addColorStop("0.56", "green");
//    gradient.addColorStop("0.7", "yellow");
//    gradient.addColorStop("0.84", "magenta");
//    // Fill with gradient
//    ctx.fillStyle = gradient;
//    ctx.font="bold 50px Tetris Regular";
//    ctx.fillText("PAUSA", 60, canvas.height/2);
//};

var gameOver = false;
Board.prototype.game_over = function() {
    // Audio de game-over
    document.getElementById("game-over").play();
    setTimeout( document.getElementById("risa").play() , 3000);
    // Mostrar el mensaje GAME OVER por pantalla
//    console.log("GAME OVER");
    // Pintar capa transparente
    ctx.fillStyle = "rgba(167, 167, 167, 0.3)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Recuadro negro para GAME OVER
    ctx.fillStyle="#000000";
    // ctx.fillRect(X_inicio,Y_inicio,anchura,altura);
    ctx.fillRect(0,canvas.height/2-Block.BLOCK_SIZE*2-1,canvas.width,Block.BLOCK_SIZE*3+1);
    // Mostrar GAME OVER en el canvas
    // Create gradient
    var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "blue");
    gradient.addColorStop("0.14", "orange");
    gradient.addColorStop("0.28", "cyan");
    gradient.addColorStop("0.42", "red");
    gradient.addColorStop("0.56", "green");
    gradient.addColorStop("0.7", "yellow");
    gradient.addColorStop("0.84", "magenta");
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.font="bold 40px Tetris Regular";
    ctx.fillText("GAME OVER", 25, canvas.height/2);
    // Detener el movimiento automágico
    clearInterval(movimiento);
    // Parar música
    document.getElementById("musica").pause();
    gameOver = true;
    // Guardar puntuacion
    var usuario = prompt("Introduzca nombre de usuario para guardarlo junto a su puntuación (máximo 18 caracteres).\nPulse F5 para jugar una nueva partida.");
    localStorage.setItem(usuario, puntuacion);
};

// ==================== Tetris ==========================

function Tetris() {
    this.board = new Board(Tetris.BOARD_WIDTH, Tetris.BOARD_HEIGHT);
};

Tetris.SHAPES = [I_Shape, J_Shape, L_Shape, O_Shape, S_Shape, T_Shape, Z_Shape];
Tetris.DIRECTION = {'Left':[-1, 0], 'Right':[1, 0], 'Down':[0, 1]};
Tetris.BOARD_WIDTH = 10;
Tetris.BOARD_HEIGHT = 20;
Tetris.BOARD_COLOR='silver';
// variables globales de los mitad horizontal de cada tablero, muestrs las coordenadas del tablero donde apareceran las nuevas piezas
var centro = new Point(Tetris.BOARD_WIDTH/2,0);
var centroNS = new Point(3,0);

Tetris.prototype.create_new_shape = function(centro){
    var pieza = Shape();

    // Obtener un nombre de pieza al azar del array Tetris.SHAPES
    var random = Math.floor(Math.random() * 7);
    var randomShape = Tetris.SHAPES[random];
    // Instanciar una pieza de ese tipo en x= centro del tablero, y = 0
    pieza = new randomShape(centro);

    // devolver una referencia a esa pieza
    return pieza;
};

Tetris.prototype.do_rotate = function(){
    // -HECHO-TU CÓDIGO AQUÍ: si la pieza actual se puede rotar en el tablero,
    // efectuar la rotación.
    if (this.current_shape.can_rotate(this.board)) {
        this.current_shape.rotate();
    }
}

// Variable global de los usuarios que han jugado
var usuarios = [];
// Variable global de los 10 usuarios con mayor puntuación
var usuariosOrdenados = [];
Tetris.prototype.init = function(){
    
    // Inicializar variable global del juego
    juego = this;
    // Reiniciar las listas de usuarios
    usuarios = [];
    usuariosOrdenados = [];
    Tetris.prototype.ranking();
    
    // Comprobar si existe siguiente pieza
    if (this.next_shape == undefined) {
        // Si no existe, crearla junto a la pieza actual
        this.next_shape = this.create_new_shape(centroNS);
        // obtener una nueva pieza al azar y asignarla como pieza actual
        this.current_shape = this.create_new_shape(centro);
    } else {
        // En caso de que exista:
        var pieza = this.next_shape.constructor.name;
        this.current_shape = new pieza();
        this.next_shape = this.create_new_shape(centroNS);
    }
    // Mostrar siguiente pieza
    Board.prototype.draw_nextShape.call(this, this.next_shape);
    // Pintar la pieza actual en el tablero
    Board.prototype.draw_shape.call(this, this.current_shape);
    
    // Comenzar el movimiento automático de la pieza actual
    this.animate_shape();

    // inicializar gestor de eventos de teclado añadiéndole un 
    // callback al método key_pressed
    document.addEventListener("keydown", this.key_pressed.bind(this),false);
};

Tetris.prototype.ranking = function() {
    // Guardar localStorage en un array
    for(var i=0; i<localStorage.length;i++) {
        usuarios.push(localStorage.key(i));
    }
    usuariosTotales = usuarios.slice();
    while(usuariosOrdenados.length<10 && usuarios.length != 0) {
        var maxP = 0;
        var maxU = "";
        for(var usuIndex=0; usuIndex<usuarios.length;usuIndex++) {    // Recorre la lista de usuarios
            userPoints = parseInt(localStorage.getItem(usuarios[usuIndex]));    // Puntuación del usuario actual
            if (userPoints >= maxP) {
                maxP = userPoints;                  // Almacenar la máxima puntuación actual
                maxU = localStorage.key(usuIndex);  // Almacenar el usuario con máxima puntuación actual
                maxIndex = usuIndex;
            }
        }
        nuevoUsu = usuarios.splice(maxIndex,1);
        usuariosOrdenados.push(nuevoUsu[0]);
    }
    // Dibujar clasificación
    ctxRanking.font= "bold 20px Tetris Regular";
    ctxRanking.fillStyle = 'white';
    for(var j=0;j<usuariosOrdenados.length;j++) {
        usuario = usuariosOrdenados[j];
        puntos = localStorage.getItem(usuario);
        // Decidir el color según el nivel alcanzado
        if(0<=puntos && puntos<500) {
            ctxRanking.fillStyle = 'yellow';
        } else if (500<=puntos && puntos<1000) {
            ctxRanking.fillStyle = 'orange';
        } else if (1000<=puntos && puntos<2500) {
            ctxRanking.fillStyle = 'red';
        } else if (2500<=puntos && puntos<5000) {
            ctxRanking.fillStyle = 'magenta';
        } else if (5000<=puntos && puntos<10000) {
            ctxRanking.fillStyle = 'cyan';
        } else {
            ctxRanking.fillStyle = 'green';
        }
        ctxRanking.fillText(j+1 + "- " + usuario, 20, j*20+20);
        ctxRanking.fillText(puntos, 250, j*20+20);
    }
    
    var puntosTotales = 0;
    var media = 0;
    for(var todos=0; todos<localStorage.length; todos++) {
        actual = usuariosTotales[todos];
        puntosActuales = parseInt(localStorage.getItem(actual));
        puntosTotales += puntosActuales;
    }
    media = puntosTotales/localStorage.length;
    // Modificar el valor de 'media' para la primera partida
    if (isNaN(media)) {
        media = 0;
    }
    document.getElementById("media").innerHTML= parseInt(media);
    document.getElementById("partidas").innerHTML= localStorage.length;
};

var enPausa = false;
Tetris.prototype.key_pressed = function(e) {
if(!gameOver) {
    // Variable para mostrar el estado del juego = {PAUSA,REANUDADO}
    var mensaje = document.getElementById("pausa");
    // Si pulsa la P, getionar la pausa del juego
    if(e.keyCode == 80) {
        
        if (!enPausa) {
            // Si pulsa la flecha P --> Pausa el juego
//            console.log("Juego en pausa, vuelva a pulsar 'P' para reanudar");
            // Parar el movimiento automatico
            clearInterval(movimiento);
            // Pausar el control de piezas
            // document.removeEventListener("keydown", this.key_pressed.bind(this), false);
            enPausa = true;
            // Ocultar tablero
            canvas.style.visibility = "hidden";
            var imagen = document.createElement("IMG");
            imagen.src = "imagenes/tetris-logo-n.jpg";
            var imagenPausa = document.getElementById("canvas").appendChild(imagen);
            // Mostrar mensaje de PAUSA
            mensaje.innerHTML = "JUEGO EN PAUSA";
            // Pausar musica
            document.getElementById("musica").pause();
        } else {
//            console.log("Juego reanudado");
            // Reanudar movimiento automático
            this.animate_shape();
            // Reanudar música, si estaba activada antes de la pausa
            if (estadoMusica) {
                document.getElementById("musica").play();
            }
            // Volver a mostrar tablero
            document.getElementById("canvas").style.visibility = "inherit";
            // Quitar mensaje de pausa
            mensaje.innerHTML = '';
            // Quitar pausa
            enPausa = false;
        }
    } else { // Si no es el código P para pausar, gestionar otras interacciones
        if(!enPausa) {
            if(e.keyCode == 32) {
//                console.log("espacio");
                // -HECHO-TU CÓDIGO AQUÍ: Añade a tu código anterior
                // una condición para que si el jugador
                // pulsa la tecla "Espacio", la pieza caiga en picado
                while (this.current_shape.can_move(this.board, Tetris.DIRECTION['Down'][0], Tetris.DIRECTION['Down'][1])) {
                    this.current_shape.move(Tetris.DIRECTION['Down'][0], Tetris.DIRECTION['Down'][1]);
                }
                this.do_move(Object.keys(Tetris.DIRECTION)[2]);
                document.getElementById("soltar-pieza").play();
            } else if(e.keyCode == 37) {
                // Si pulsa la flecha IZQUIERDA desplazar la pieza a la izquierda
//                console.log(Object.keys(Tetris.DIRECTION)[0]);
                this.do_move(Object.keys(Tetris.DIRECTION)[0]);        
            } else if(e.keyCode === 38) {
                // -HECHO-TU CÓDIGO AQUÍ: Añade a tu código anterior
                // una condición para que si el jugador
                // pulsa la tecla "Flecha ARRIBA", la pieza rote
//                console.log("Rotar");
                this.do_rotate();
            } else if(e.keyCode == 39) {
                // Si pulsa la flecha DERECHA desplazar la pieza a la derecha
//                console.log(Object.keys(Tetris.DIRECTION)[1]);
                this.do_move(Object.keys(Tetris.DIRECTION)[1]);
            } else if(e.keyCode == 40) {
                // Si pulsa la flecha ABAJO desplazar la pieza hacia abajo
//                console.log(Object.keys(Tetris.DIRECTION)[2]);
                this.do_move(Object.keys(Tetris.DIRECTION)[2]);
            }
        }
    }
}
};

Tetris.prototype.do_move = function(direction) {

    if(!enPausa) {
        // -HECHO-TU CÓDIGO AQUÍ
        // mantén el código de la sección anterior PERO añade
        // una comprobación: antes de mover la pieza actual a la nueva
        // posición, asegúrate de que dicho movimiento es posible
        //---------------Comentario de jsfiddle-----------------------
        // calcula el desplazamiento dx,dy en función de la flecha pulsada
        // p.ej. si se ha pulsado la flecha izquierda, (direction="Left"), 
        // el array Tetris.DIRECTION indica que dx = -1 , dy = 0  
        // Una vez calculado, llama al método move de la pieza actual

        // -HECHO-TU CÓDIGO AQUÍ. 2ª versión
        // si la pieza que estaba cayendo no puede seguir moviéndose,
        // añadirla al tablero (usando Board.add_shape) 
        // crear una nueva pieza, y dibujarla en la parte superior
        // recuerda que ya tienes métodos que hacen esto

        //    Movimientos:
        //    console.log("Movimiento horizontar: " + Tetris.DIRECTION[direction][0]);
        //    console.log("Movimiento vertical: " + Tetris.DIRECTION[direction][1]);
        if(this.current_shape.can_move(this.board, Tetris.DIRECTION[direction][0], Tetris.DIRECTION[direction][1])) {
            this.current_shape.move(Tetris.DIRECTION[direction][0], Tetris.DIRECTION[direction][1]);
        } else {
//            console.log("la pieza no se puede mover");
            if (direction == "Down") {
                Board.prototype.add_shape.call(this, this.current_shape);
                document.getElementById("addShape").play();
                // -HECHO-TU CÓDIGO AQUÍ. 3ª versión.
                // Añade una llamada a remove_complete_rows() del tablero cuando metas 
                // piezas en el grid 
                this.board.remove_complete_rows();
                // Asignar a 'current_shape' <-- 'next_shape'
                var pieza = this.next_shape.constructor;
                this.current_shape = new pieza(centro);
                // crear nueva pieza y asignarla a 'next_shape'
                this.next_shape = this.create_new_shape(centroNS);
                
                // Comprobar el GAME_OVER
                if (!this.current_shape.can_move(this.board, Tetris.DIRECTION[direction][0], Tetris.DIRECTION[direction][1])) {
                    this.board.game_over();
                }
                // clear the Next Shape canvas
                ctxNS.fillStyle = 'white';
                ctxNS.fillRect(0,0,canvas.width,canvas.height);
                // Dibujar nueva pieza en el tablero
                Board.prototype.draw_shape.call(this, this.current_shape);
                // Dibujar Next Shape en el mini-canvas de 'nextShape'
                Board.prototype.draw_nextShape.call(this, this.next_shape);
            }
        }
    }
};

var movimiento;
Tetris.prototype.animate_shape = function(){
    // -HECHO-TU CÓDIGO AQUÍ: genera un timer que mueva hacia abajo la pieza actual cada segundo. 
    // Recuerda añadir una llamada a esta función desde el método Tetris.init
    movimiento = setInterval(this.do_move.bind(this,'Down'), 1000);
    // Down => Object.keys(Tetris.DIRECTION)[2]
};

// Funciones para gestionar click de botones
var estadoMusica = true;
function onOffMusica() {
    if(!gameOver && !enPausa) {
        if (estadoMusica) {
            // Apagar música
            document.getElementById("musica").pause();
            document.getElementById("imgMusica").src="imagenes/bafleOFF.png";
            estadoMusica = false;
        } else {
            // Reanudar música
            document.getElementById("musica").play();
            document.getElementById("imgMusica").src="imagenes/bafleON.png";
            estadoMusica = true;
        }
    }
};