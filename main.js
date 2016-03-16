/// <reference path="phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Point = Phaser.Point;
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
        this.contador = 0;
        this.primerClick = true;
        this.MAX_SPEED = 250; // pixels/second
        this.ACCELERATION = 750; // pixels/second/second
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.image('barra', 'assets/paddleBlu.png');
        this.load.image('blau', 'assets/element_blue_rectangle.png');
        this.load.image('vermell', 'assets/element_red_rectangle.png');
        this.load.image('verd', 'assets/element_green_rectangle.png');
        this.load.image('gris', 'assets/element_grey_rectangle.png');
        this.load.image('bola', 'assets/ballBlue.png');
        this.physics.startSystem(Phaser.Physics.ARCADE);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        // fer que no colisioni per la par de sota del mon
        this.game.physics.arcade.checkCollision.down = false;
        this.crearJugador();
        this.createBarres();
        this.cursor = this.input.keyboard.createCursorKeys();
        this.contadorText = this.game.add.text(400, 35, "Contador  0 ", {
            font: "25px Arial",
            fill: "#ff0044",
            align: "center"
        });
        this.introText = this.game.add.text(this.game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ff0044", align: "center" });
        this.introText.anchor.setTo(0.5, 0.5);
    };
    mainState.prototype.crearJugador = function () {
        this.barra = this.add.sprite(this.world.centerX, this.world.height - 50, 'barra');
        this.bola = this.add.sprite(this.world.centerX, this.world.height - 100, 'bola');
        this.barra.anchor.setTo(0.5, 0.5);
        this.bola.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.barra, Phaser.Physics.ARCADE); // activar la fisica de la barra
        this.physics.enable(this.bola, Phaser.Physics.ARCADE); // activar la fisica de la bola
        this.bola.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y
        this.bola.body.collideWorldBounds = true;
        this.bola.body.bounce.setTo(1.2);
        this.barra.body.bounce.setTo(1.2);
        this.barra.body.immovable = true;
        this.barra.body.collideWorldBounds = true;
    };
    mainState.prototype.createBarres = function () {
        this.rectangles = this.add.group();
        this.rectangles.enableBody = true;
        this.rectangles.physicsBodyType = Phaser.Physics.ARCADE;
        var colors = [];
        colors.push('blau');
        colors.push('vermell');
        colors.push('verd');
        colors.push('gris');
        for (var i = 0; i < 4; i++) {
            var y = (i * 32 + 32) + 50;
            for (var j = 0; j < 8; j++) {
                var x = j * 63 + 63;
                var rectangle = new Rectangle(this.game, x, y, 'blau');
                this.rectangles.add(rectangle);
            }
        }
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        this.moureBarra();
        if (this.input.activePointer.isDown && this.primerClick) {
            this.primerClick = false;
            this.bola.body.velocity.x = 200;
            this.bola.body.velocity.y = 190;
            this.introText.setText("");
        }
        this.physics.arcade.collide(this.bola, this.barra);
        this.physics.arcade.collide(this.bola, this.rectangles, this.trencaRectangle, null, this);
    };
    mainState.prototype.trencaRectangle = function (bola, rectangle) {
        rectangle.kill();
        this.contador++;
        this.contadorText.setText("Contador  " + this.contador);
    };
    mainState.prototype.moureBarra = function () {
        if (this.cursor.left.isDown) {
            this.barra.body.velocity.x = -this.ACCELERATION;
        }
        else if (this.cursor.right.isDown) {
            this.barra.body.velocity.x = this.ACCELERATION;
        }
        else {
            this.barra.body.velocity.x = 0;
        }
        // fer que funcioni amb el ratolí
        if (this.input.activePointer.active) {
            this.barra.x = this.input.x;
        }
    };
    return mainState;
})(Phaser.State);
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(game, x, y, key) {
        _super.call(this, game, x, y, key);
        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE); // activar la fisica de cada rectangle
        this.body.bounce.setTo(1.2);
        this.body.immovable = true;
    }
    Rectangle.prototype.update = function () {
        _super.prototype.update.call(this);
    };
    return Rectangle;
})(Phaser.Sprite);
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(600, 600, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map