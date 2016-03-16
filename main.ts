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
    private primerClick = true;

    private MAX_SPEED = 250; // pixels/second
    private ACCELERATION = 750; // pixels/second/second

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
    }

    private crearJugador(){
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
                var x = j*63+63;
                var rectangle = new Rectangle (this.game, x, y, colors[i]);
                this.rectangles.add(rectangle);
            }

        }
    }

    update():void {
        super.update();

        this.moureBarra();


        if(this.input.activePointer.isDown && this.primerClick){
            this.primerClick = false;
            this.bola.body.velocity.x= 200;
            this.bola.body.velocity.y= 190;
            this.introText.setText("");
        }

        this.physics.arcade.collide(this.bola, this.barra);
        this.physics.arcade.collide(this.bola, this.rectangles, this.trencaRectangle, null, this);
    }

    private trencaRectangle(bola:Phaser.Sprite,rectangle:Rectangle){
        rectangle.kill();
        this.contador++;
        this.contadorText.setText("Contador  " + this.contador);

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
