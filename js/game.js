                                            // MY SOFTWARE PROJECT GAME CA1 //
                                            // student no. N00173465 //

//------------------------------------------------------------------------------------------------------------------------------------//

//Configurate our game scene
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 543,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            debug: false
        }
    },
    scene:

    {
        preload: preload,
        create: create,
        update: update

    }

};


//creates new game scene
let gameScene = new Phaser.Game(config);


//set the score counter to 0
var score = 0;




//setting up the restart buttons
let isRestarting = false;

//<------------------------------------------------------------------------------------------------------->
                                            //PRELOAD FUNCTION//

// load assets
function preload() {
    
    
    // load images
    this.load.image('tester', 'assets/tester.png');
    this.load.image('retro2', 'assets/retro2.png');
    this.load.image('police', 'assets/police.png');
    this.load.image('bank', 'assets/bank.png');
    this.load.image('ground1new', 'assets/ground1new.png');
    this.load.image('ground2new', 'assets/ground2new.png');
    this.load.image('ground3new', 'assets/ground3new.png');
    this.load.image('ground4new', 'assets/ground4new.png');
    this.load.image('ground5', 'assets/ground5.png');
    this.load.image('ground6new', 'assets/ground6new.png');
    this.load.image('bullettest', 'assets/bullettest.png');
    this.load.image('lasertestnew', 'assets/lasertestnew.png');
    this.load.image('gameoverscreen', 'assets/gameoverscreen.png');
    this.load.image('winscreen', 'assets/winscreen.png');
    this.load.image('restartbutton', 'assets/restartbutton.png');
    this.load.image('playagain', 'assets/playagain.png');
    this.load.audio('music', 'audio/music1.mp3');
    this.load.image('audiosymbol', 'assets/audiosymbol.png');
    var scoreText;
};

//<------------------------------------------------------------------------------------------------------->
                                            //CREATE FUNCTION//
                

// called once after the preload ends
function create() {

    
    //create the audio
    let music = this.sound.add('music');
    music.play();

    
    //keyboard input for jumping
    cursors = this.input.keyboard.createCursorKeys();

    
    // create the background 
    let bg = this.add.sprite(0, 0, 'tester');

    
    //create the audio symbol
    sign = this.add.sprite(750, 50, 'audiosymbol');
    sign.setScale(0.4);
    
    sign.setInteractive();
    sign.on('pointerdown', function() {
        music.pause();
    });


    //creating and setting all the ground/floor to one position
    groundGroup = this.physics.add.staticGroup();

    groundGroup.create(110, 465, 'ground1new');
    groundGroup.getChildren()[0].body.immovable = true;


    groundGroup.create(273, 500, 'ground2new');
    groundGroup.getChildren()[1].body.immovable = true;

    groundGroup.create(410, 532, 'ground3new');
    groundGroup.getChildren()[2].body.immovable = true;

    groundGroup.create(549, 500, 'ground4new');
    groundGroup.getChildren()[3].body.immovable = true;

    groundGroup.create(690, 465, 'ground5');
    groundGroup.getChildren()[4].body.immovable = true;

    groundGroup.create(790, 429, 'ground6new');
    groundGroup.getChildren()[5].body.immovable = true;


    // change the origin to the top-left corner
    bg.setOrigin(0, 0);


    // create the player
    player = this.physics.add.sprite(120, this.sys.game.config.height / 1.32, 'retro2');
    player.setCollideWorldBounds(true);
    player.setScale(0.7);

    
    //creates the bank
    treasure = this.physics.add.sprite(782, 349, 'bank');
    this.physics.add.collider(treasure, groundGroup);
    treasure.setScale(0.7);

    
    //adds overlap between player and bank
    this.physics.add.overlap(player, treasure, treasureShot, null, this);
    
    
    //adds collision to the player with the ground and the sides of the groundgroup
    this.physics.add.collider(player, groundGroup, test, test1, test2);


    //create the policeman
    police = this.physics.add.sprite(520, this.sys.game.config.height / 1.24, 'police');
    police.setSize(100, 90, true);
    this.playerSpeed = 1.7;
    police.setCollideWorldBounds(true);
    this.physics.add.collider(police, groundGroup);


    //create group of bullets
    bullets = this.physics.add.group({
        key: 'bullettest',
        repeat: 0,
        setXY: {
            x: 450,
            y: 430,
            stepX: -60,
            stepY: 0
 }
    });

    
    //removes gravity from the bullet group, let's them travel through the scene with collision
    bullets.children.iterate(function (child) {
        child.body.allowGravity = false;

    });


    //adds an overlap between the player and the bullets
    this.physics.add.overlap(player, bullets, playerShot, null, this);



    //create group of lasers
    lasers = this.physics.add.group({
        key: 'lasertestnew',
        repeat: 0,
        setXY: {
            x: 550,
            y: 110,
            stepX: 0,
            stepY: -80

        }
    });

    
    ////removes gravity from the laser group, let's it travel through the scene with collision
    lasers.children.iterate(function (child1) {
        child1.body.allowGravity = false;

    });

    
    //adds an overlap between the player and the laser
    this.physics.add.overlap(player, lasers, laserShot, null, this);


    //Sets the bullet speed and retrieves children bullets
    Phaser.Actions.Call(bullets.getChildren(), function (bullettest) {
        bullettest.speed = 3;
    }, this);

    
    //Sets the laser speed and retrieves children lasers
    Phaser.Actions.Call(lasers.getChildren(), function (lasertestnew) {
        lasertestnew.speed = 2.5;
    }, this);


    //reset effects 
    this.cameras.main.resetFX();
    
    
    this.add.text(50, 60, 'Tap anywhere to jump', {
        fpntSize: '20px',
        fill: '#ffffff'
    });

    
    //displays the score on screen 
    this.scoreText = this.add.text(50, 30, 'Score: 0', {
        fontSize: '20px',
        fill: '#ffffff'
    });

    
    //score timer
    timer = this.time.addEvent({
        delay: 100,
        loop: true,
        callback: scoreCounter,
        callbackScope: this
    });
};

//<------------------------------------------------------------------------------------------------------->
                                            //SCORE FUNCTION//

//adds to the score all the time
function scoreCounter() {
    score++;
}


//<------------------------------------------------------------------------------------------------------->
                                            //UPDATE FUNCTION//

function update() {
    
    player.setVelocityX(70);

    
    //restarts the scene if button is pressed
    if (isRestarting) {
        isRestarting = false;
       
        this.scene.restart();
        return;
    }

    
    //Updates the score
    this.scoreText.setText("Player score: " + score);
    console.log(score);

    
    
    //if the space bar is pressed and the player is touching the floor
    if (this.input.activePointer.isDown && player.body.touching.down) {
    player.setVelocityY(-222);
    }


    let numPolice = police.length;

    for (let i = 0; i < numPolice; i++) {

      
    // 07: enemy collision
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), police[i].getBounds())) {
            gameOver();
            break;
        }
}
   
    
    //bullet loop
    this.bullets = bullets.getChildren();
    let numBullets = this.bullets.length;

    for (let i = 0; i < numBullets; i++) {
        this.bullets[i].x -= this.bullets[i].speed;

        if (this.bullets[i].x == 0) {
            this.bullets[i].x = 450;
            
        }
    }


    //laser loop
    this.lasers = lasers.getChildren();
    let numLasers = this.lasers.length;

    for (let i = 0; i < numLasers; i++) {
        this.lasers[i].y += this.lasers[i].speed;
        if (this.lasers[i].y > 450) {
            this.lasers[i].y = 110;
            this.lasers[i].setVelocityY(0);
        }
    }

    
    //adds a collider between the player and the bullets
    this.physics.add.collider(player, bullets, hitBullet, null, this);

    
    //when the player and bullet collide restart the scene
    function hitBullet(player, bullets) {
        this.scene.restart();
        console.log(player.x);

    }

};




    
//<-------------------------------------------------------------------------------------------------------------------------------->    
    //ALL OF THE GAMEOVER CODE IS HERE BECAUSE WHEN I HAD THE EXACT SAME CODE IN THE GAMEOVER FUNCTION I WAS GETTING UNDEFINED ERRORS
//<-------------------------------------------------------------------------------------------------------------------------------->    
    
//bullet collision
function playerShot(player, bullet) {
    bullet.disableBody(true, true);
    player.setTint(0xff0000);
    
    //load gameover screen and restart button when player collides with bullet 
    gameEnd = this.add.sprite(390, 271, 'gameoverscreen').setInteractive();
    restartbutton = this.add.sprite(390, 450, 'restartbutton').setInteractive();
    
    
    //when mouse is pressed restart scene
    restartbutton.on('pointerdown',
        function (pointer) {
            /* this.gameScene.restart();*/ //DOES NOT WORK!
            isRestarting = true;
            score = 0;
           
            
        })
}


//load gameover screen and restart button when player collides with laser 
function laserShot(player, laser) {
    gameEnd = this.add.sprite(390, 271, 'gameoverscreen').setInteractive();
    restartbutton = this.add.sprite(390, 450, 'restartbutton').setInteractive();

    
    //when mouse is pressed restart scene
    restartbutton.on('pointerdown',
        function (pointer) {
            isRestarting = true;
            score = 0;
            
        })
}

//load win screen and play again button when player collides with bank 
function treasureShot(player, treasure) {
    gameEnd = this.add.sprite(390, 271, 'winscreen').setInteractive();
    restartbutton = this.add.sprite(380, 450, 'playagain').setInteractive();

    
    //when mouse is pressed restart scene
    restartbutton.on('pointerdown',
        function (pointer) {
            isRestarting = true;
            score = 0;
        })
}


//gives the floor solid hitbox so player cannot walk through it.
function test(player, ground) {
    if (ground.texture.key == "ground4new") {
        console.log(ground.texture.key);
        console.log("colliding with ground");
        if (player.y > 445) {
            player.x = player.x - 2;
        }
    }
}


//gives the floor solid hitbox so player cannot walk through it.
function test1(player, ground) {
    if (ground.texture.key == "ground5") {
        console.log(ground.texture.key);
        console.log("colliding with ground");
        if (player.y > 407) {
            player.x = player.x - 2;
        }
    }
}


//gives the floor solid hitbox so player cannot walk through it.
function test2(player, ground) {
    if (ground.texture.key == "ground6new") {
        console.log(ground.texture.key);
        console.log("colliding with ground");
        if (player.y > 374) {
            player.x = player.x - 2;
        }
    }
};
//<-----------------------------------------------------------------------------------------------------------------------------------//
                                                    //END OF CODE//