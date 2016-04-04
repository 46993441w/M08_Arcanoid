/// <reference path="phaser/phaser.d.ts"/>

import Point = Phaser.Point;
class mainState extends Phaser.State {
    game: Phaser.Game;

    private barra:Phaser.Sprite;
    private bola:Phaser.Sprite;
    private rectangles:Phaser.Group;
    private cursor:Phaser.CursorKeys;
    private contadorText:Phaser.Text;
    private introText:Phaser.Text;
    private contador = 0;
    private bolaEnBarra = true;

    private MAX_SPEED = 250; // pixels/second
    private ACCELERATION = 750; // pixels/second/second
    private VIDES = 3;

    preload():void {
        super.preload();

        this.load.image('barra', 'assets/paddleBlu.png');
        this.load.image('blau', 'assets/element_blue_rectangle.png');
        this.load.image('vermell', 'assets/element_red_rectangle.png');
        this.load.image('verd', 'assets/element_green_rectangle.png');
        this.load.image('gris', 'assets/element_grey_rectangle.png');
        this.load.image('bola', 'assets/ballBlue.png');

        this.physics.startSystem(Phaser.Physics.ARCADE);
    }

    create():void {
        super.create();

        // fer que no colisioni per la paret de sota del mon
        this.game.physics.arcade.checkCollision.down = false;

        this.crearJugador();
        this.createBarres();

        this.cursor = this.input.keyboard.createCursorKeys();

        this.contadorText = this.game.add.text(400, 35, "Contador:  0 ", {
            font: "25px Arial",
            fill: "#ff0044",
            align: "center"
        });
        this.introText = this.game.add.text(this.game.world.centerX, 400, '- Click per a Començar -', { font: "40px Arial", fill: "#ff0044", align: "center" });
        this.introText.anchor.setTo(0.5, 0.5);
    }

    private crearJugador(){
        this.bola = this.add.sprite(this.world.centerX, this.world.height - 100, 'bola');
        this.bola.anchor.setTo(0.5, 0.5);
        this.bola.checkWorldBounds = true;
        this.bola.health = this.VIDES;

        this.barra = this.add.sprite(this.world.centerX, this.world.height - 50, 'barra');
        this.barra.anchor.setTo(0.5, 0.5);


        this.physics.enable(this.barra, Phaser.Physics.ARCADE); // activar la fisica de la barra
        this.physics.enable(this.bola, Phaser.Physics.ARCADE); // activar la fisica de la bola

        this.bola.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y
        this.bola.body.collideWorldBounds = true;
        this.bola.body.bounce.setTo(1.2);
        this.bola.events.onOutOfBounds.add(this.perdreVida, this);

        this.barra.body.bounce.setTo(1.2);
        this.barra.body.immovable = true;
        this.barra.body.collideWorldBounds = true;
    }

    private createBarres():void {
        this.rectangles = this.add.group();
        this.rectangles.enableBody = true;
        this.rectangles.physicsBodyType = Phaser.Physics.ARCADE;

        var colors = [];
        colors.push('gris');
        colors.push('vermell');
        colors.push('blau');
        colors.push('verd');


        for(var i = 0; i < 4; i++){
            var y = (i*32+32)+50;
            for(var j = 0; j < 8; j++){
                var x = j*63+75;
                var rectangle = new Rectangle (this.game, x, y, colors[i]);
                this.rectangles.add(rectangle);
            }

        }
    }

    private perdreVida():void {
        this.bola.damage(1);
        if (this.bola.health == 0) {
            //gameOver();
        } else {
            this.bolaEnBarra = true;
            this.bola.reset(this.barra.body.x, this.barra.y - 26);
            this.bola.animations.stop();
        }

    }

    update():void {
        super.update();

        this.moureBarra();


        if(this.input.activePointer.isDown && this.bolaEnBarra){
            this.bola.body.velocity.x= 200;
            this.bola.body.velocity.y= 190;
            this.introText.setText("");
            this.bolaEnBarra = false;
        }

        if (this.bolaEnBarra) {
            this.bola.body.x = this.barra.x;
        } else {
            this.physics.arcade.collide(this.bola, this.barra, this.bolaRebot, null, this);
            this.physics.arcade.collide(this.bola, this.rectangles, this.trencaRectangle, null, this);
        }
    }

    private bolaRebot(bola:Phaser.Sprite, barra:Phaser.Sprite) {

        var diff = 0;

        if (bola.x < barra.x) {
            // Bola esta a la part esquerra de la barra
            diff = barra.x - bola.x;
            bola.body.velocity.x = (-10 * diff);
        } else if (bola.x > barra.x) {
            // Bola esta a la part dreta de la barra
            diff = bola.x - barra.x;
            bola.body.velocity.x = (10 * diff);
        }
        else {
            // Bola esta al centre de la barra
            //  Add a little random X to stop it bouncing straight up!
            bola.body.velocity.x = 2 + Math.random() * 8;
        }
    }

    private trencaRectangle(bola:Phaser.Sprite, rectangle:Rectangle){
        rectangle.kill();
        this.contador++;
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
    }

    private moureBarra(){
        if (this.cursor.left.isDown){
            this.barra.body.velocity.x = -this.ACCELERATION;
        } else if (this.cursor.right.isDown){
            this.barra.body.velocity.x = this.ACCELERATION;
        } else {
            this.barra.body.velocity.x = 0;
        }

        // fer que funcioni amb el ratolí
        if (this.input.activePointer.active) {
            this.barra.x = this.input.x;
        }

        // evitar que surti del mon i aixi no faci el rebot extrany
        if (this.barra.x < 54) {
            this.barra.x = 54;
        } else if (this.barra.x > this.game.width - 54) {
            this.barra.x = this.game.width - 54;
        }
    }
}

class Rectangle extends Phaser.Sprite {

    constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture) {
        super(game, x, y, key);
        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE); // activar la fisica de cada rectangle
        this.body.bounce.setTo(1.2);
        this.body.immovable = true;

    }

    update():void {
        super.update();
    }
}

class SimpleGame {
    game:Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(600, 600, Phaser.AUTO, 'gameDiv');

        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}

window.onload = () => {
    var game = new SimpleGame();
};
