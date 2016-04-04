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
        this.bolaEnBarra = true;
        this.MAX_SPEED = 250; // pixels/second
        this.ACCELERATION = 750; // pixels/second/second
        this.VIDES = 3;
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
        // fer que no colisioni per la paret de sota del mon
        this.game.physics.arcade.checkCollision.down = false;
        this.crearJugador();
        this.createBarres();
        this.cursor = this.input.keyboard.createCursorKeys();
        this.contadorText = this.game.add.text(400, 35, "Contador:  0 ", { font: "25px Arial", fill: "#ff0044", align: "center" });
        this.vidaText = this.game.add.text(35, 35, "Vides:  " + this.VIDES, { font: "25px Arial", fill: "#ff0044", align: "center" });
        this.introText = this.game.add.text(this.game.world.centerX, 400, '- Click per a Començar -', { font: "40px Arial", fill: "#ff0044", align: "center" });
        this.introText.anchor.setTo(0.5, 0.5);
    };
    mainState.prototype.crearJugador = function () {
        this.barra = this.add.sprite(this.world.centerX, this.world.height - 50, 'barra');
        this.barra.anchor.setTo(0.5, 0.5);
        this.bola = this.add.sprite(this.barra.x, this.barra.y - 26, 'bola');
        this.bola.anchor.setTo(0.5, 0.5);
        this.bola.checkWorldBounds = true;
        this.bola.health = this.VIDES;
        this.bola.y = 300;
        this.add.tween(this.barra).to({ angle: 360 }, 1000, Phaser.Easing.Cubic.In, true);
        this.add.tween(this.bola).to({ y: this.barra.y - 26 }, 1000, Phaser.Easing.Bounce.Out, true);
        this.physics.enable(this.barra, Phaser.Physics.ARCADE); // activar la fisica de la barra
        this.physics.enable(this.bola, Phaser.Physics.ARCADE); // activar la fisica de la bola
        this.bola.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y
        this.bola.body.collideWorldBounds = true;
        this.bola.body.bounce.setTo(1.2);
        this.bola.events.onOutOfBounds.add(this.perdreVida, this);
        this.barra.body.bounce.setTo(1.2);
        this.barra.body.immovable = true;
        this.barra.body.collideWorldBounds = true;
    };
    mainState.prototype.createBarres = function () {
        this.rectangles = this.add.group();
        this.rectangles.enableBody = true;
        this.rectangles.physicsBodyType = Phaser.Physics.ARCADE;
        var colors = [];
        colors.push('gris');
        colors.push('vermell');
        colors.push('blau');
        colors.push('verd');
        for (var i = 0; i < 4; i++) {
            var y = (i * 32 + 32) + 50;
            for (var j = 0; j < 8; j++) {
                var x = j * 63 + 75;
                var rectangle = new Rectangle(this.game, x, y, colors[i]);
                this.rectangles.add(rectangle);
            }
        }
    };
    mainState.prototype.perdreVida = function () {
        this.bola.damage(1);
        if (this.bola.health == 0) {
            this.gameOver();
        }
        else {
            this.bolaEnBarra = true;
            this.bola.x = this.barra.x;
            this.bola.y = this.barra.y - 26;
            this.bola.body.velocity.x = 0;
            this.bola.body.velocity.y = 0;
            this.bola.animations.stop();
            this.vidaText.setText("Vides: " + this.bola.health);
        }
    };
    mainState.prototype.gameOver = function () {
        this.contador = 0;
        this.introText.visible = true;
        this.bolaEnBarra = true;
        this.bola.reset(this.barra.body.x, this.barra.y - 26);
        this.bola.health = this.VIDES;
        this.bola.animations.stop();
        this.vidaText.setText("Vides: " + this.bola.health);
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        this.moureBarra();
        if (this.input.activePointer.isDown && this.bolaEnBarra) {
            this.bola.body.velocity.x = 200;
            this.bola.body.velocity.y = 190;
            this.introText.visible = false;
            this.bolaEnBarra = false;
        }
        if (this.bolaEnBarra) {
            this.bola.body.x = this.barra.x;
        }
        else {
            this.physics.arcade.collide(this.bola, this.barra, this.bolaRebot, null, this);
            this.physics.arcade.collide(this.bola, this.rectangles, this.trencaRectangle, null, this);
        }
    };
    mainState.prototype.bolaRebot = function (bola, barra) {
        var diff = 0;
        if (bola.x < barra.x) {
            // Bola esta a la part esquerra de la barra
            diff = barra.x - bola.x;
            bola.body.velocity.x = (-10 * diff);
        }
        else if (bola.x > barra.x) {
            // Bola esta a la part dreta de la barra
            diff = bola.x - barra.x;
            bola.body.velocity.x = (10 * diff);
        }
        else {
            // Bola esta al centre de la barra
            //  Add a little random X to stop it bouncing straight up!
            bola.body.velocity.x = 2 + Math.random() * 8;
        }
    };
    mainState.prototype.trencaRectangle = function (bola, rectangle) {
        rectangle.kill();
        this.contador += 10;
        this.contadorText.setText("Contador: " + this.contador);
        if (this.rectangles.countLiving() == 0) {
            //  New level starts
            this.introText.setText('- Seguent Nivell -');
            //  Let's move the ball back to the paddle
            this.bolaEnBarra = true;
            this.bola.body.velocity.set(0);
            this.bola.x = this.barra.x;
            this.bola.y = this.barra.y - 26;
            this.bola.animations.stop();
            //  And bring the bricks back from the dead :)
            this.rectangles.callAll('revive');
        }
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
        // evitar que surti del mon i aixi no faci el rebot extrany
        if (this.barra.x < 54) {
            this.barra.x = 54;
        }
        else if (this.barra.x > this.game.width - 54) {
            this.barra.x = this.game.width - 54;
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
        this.alpha = 0.1;
        this.game.add.tween(this).to({ alpha: 1 }, Math.random() * 1000, "Linear", true);
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