//starting game for the first time
let startGame = false;
//spaceship element
const space_ship = document.getElementById("space-ship")
let stones_side = document.getElementById("stones-side")

//margins declaration
let margin_inline = 0;
let margin_block = 20;
let rotate = 24;
let incrementMarginBlock = false;
let decrementMarginBlock = false;
let rotateSpaceShip = false;

let moveFront = false;
let moveBack = false;

let marginInline = 0;

let shoot_bomb = false;

//sound elements
let spaceShipSound = document.getElementById("space-ship-sound");
let marksAudio = document.getElementById("marks-audio");
let simpleCrush = document.getElementById("simple-crush");


//function to handle the clicked keyboard key event
let playSpaceShip = true;
function handleKeyboardEvent(){
    window.addEventListener("keydown",(event)=>{
        const pressedKey = event.key;
        switch(pressedKey){
            case "ArrowUp":
                incrementMarginBlock = true;
                decrementMarginBlock = false;
                rotateSpaceShip = true;
            break;
            case "ArrowDown":
                decrementMarginBlock = true;
                incrementMarginBlock = false;
                rotateSpaceShip = true;
            break;
            case "ArrowLeft":
                rotateSpaceShip = false;
                incrementMarginBlock = false;
                decrementMarginBlock = false;
                moveBack = true;
                moveFront = false;
            break;
            case "ArrowRight":
                rotateSpaceShip = false;
                decrementMarginBlock = false;
                incrementMarginBlock = false;
                moveFront = true;
                moveBack = false;
            break;
            case "Control":
                shoot_bomb =  true;
            break;
        }
    })
    
    if(incrementMarginBlock && !decrementMarginBlock){
        if(margin_block <= 0){
            margin_block = 0
        }else{
            margin_block-=1
        }
        //rotate the spaceship
        if(rotateSpaceShip){
            if(rotate <= 0){
                rotate=0
            }else{
                rotate-=1.5
            }
        }else{
            rotate = 25
        }
        //switch engine sound
        spaceShipSound.play()
        
    }else if(decrementMarginBlock && !incrementMarginBlock){
        if(margin_block >= 42){
            margin_block = 42
        }else{
            margin_block+=1
        }
        //rotate the spaceship
        if(rotateSpaceShip){
            if(rotate >= 50){
                rotate=50
            }else{
                rotate+=1.5
            }
        }else{
            rotate = 25
        }
        //switch engine sound
        spaceShipSound.play()
    }

    //resume the current stopped spaceship movement
    window.addEventListener("keyup",(event)=>{
        const keyedUp = event.key;

        switch(keyedUp){
            case "ArrowLeft":
                incrementMarginBlock = false;
                decrementMarginBlock = true;
            break;
            case "ArrowRight":
                incrementMarginBlock = false;
                decrementMarginBlock = true;
            break;
            case "Control":
                shoot_bomb = true;
            break;
        }

    })

    //move the spaceship in front or back direction
    if(moveBack && !moveFront){
        if(marginInline <= 0){
            marginInline = 0;
        }else{
            marginInline-=1;
        }
    }else if(moveFront && !moveBack){
        if(marginInline >= 90){
            marginInline = 90;
        }else{
            marginInline += 1;
        }
    }

    //apply move up-down direction to spaceship
    space_ship.style.transitionDuration = "200ms"
    space_ship.style.marginBlock = `${margin_block}%`
    //apply rotation ratio to spaceship
    space_ship.style.transform = `rotate(${rotate}deg)`
    //apply move front-back direction to spaceship
    space_ship.style.marginInline = `${marginInline}%`



    //shooting a bomb
    let bomb_element = document.createElement("img")
    bomb_element.setAttribute("src","./imgs/nuclear_12892276.png")
    bomb_element.setAttribute("class","bomb")
    if(shoot_bomb){
        let space_ship_x_position = space_ship.getBoundingClientRect().left;
        let space_ship_y_position = space_ship.getBoundingClientRect().y;
        stones_side.appendChild(bomb_element)
        bomb_element.style.left = `${marginInline + 3}%`
        bomb_element.style.marginBlock = `${margin_block + 2}%`
        shoot_bomb = false;
    }
}

setInterval(()=>{
    if(startGame){
        if(playSpaceShip){
            handleKeyboardEvent()
        }
    }
},70)


//generate stones
let position_y = 45;
let position_x = 85;
let timeOut = 2000;

let playStoneShooting = true;

function generateStone(){
    if(playStoneShooting){
        let newStone = document.createElement("div")
        newStone.setAttribute("class","stone")
        let random_y_position = Math.random()*position_y;
        newStone.style.marginBlock = `${random_y_position}%`
        stones_side.appendChild(newStone)

    }
}

//function to increase the complexity of game
let seconds = 2000;
function increaseGameComplexity(increment){
        if(increment >=0){
            setTimeout(()=>{
                if(startGame){
                    if(seconds <= 300){
                        seconds = 300;
                    }else{
                        seconds-=50;
                    }
                }
            },30000)
            setTimeout(()=>{
                if(startGame){
                    generateStone();
                }
                    increaseGameComplexity(increment+=1);
            },seconds)
        }
}
increaseGameComplexity(0);

//hold bomb positions
let bomb_position_x = 0;
let bomb_position_y = 0;

//hold stone positions
let stone_position_x = 0;
let stone_position_y = 0;

//marks of shooting
let marks = 0;
let scores_element = document.getElementById("scores");
let red = 0;
let green = 255;
let color_transparent = 100;

function bombPositions(){
    for(let init = 0;init<stones_side.children.length;init++){
        let bombClass = stones_side.children[init].getAttribute("class");
        if(bombClass == "bomb"){
            bomb_position_x = stones_side.children[init].getBoundingClientRect().x;
            bomb_position_y = stones_side.children[init].getBoundingClientRect().y;
            //remove bomb
            if(bomb_position_x >= 1200){
                stones_side.children[init].remove()
            }
        }else{
            stone_position_x = Math.floor(stones_side.children[init].getBoundingClientRect().x);
            stone_position_y = Math.floor(stones_side.children[init].getBoundingClientRect().y);
            for(let stn = 0;stn<stones_side.children.length;stn++){
                let b_cls = stones_side.children[stn].getAttribute("class");
                if(b_cls == "bomb"){
                    if(stone_position_x <= Math.floor((stones_side.children[stn].getBoundingClientRect().x + 45)) && stone_position_x >= Math.floor((stones_side.children[stn].getBoundingClientRect().x - 50))){
                        let lower_bomb_position_y = Math.floor((stones_side.children[stn].getBoundingClientRect().y) - 30);
                        let higher_bomb_position_y= Math.floor((stones_side.children[stn].getBoundingClientRect().y) + 40);
                        if(stone_position_y <=higher_bomb_position_y && stone_position_y >=lower_bomb_position_y){
                            stones_side.children[stn].remove();
                            stones_side.children[init].remove();
                            //play explosion sound effect
                            simpleCrush.currentTime = 0.5;
                            simpleCrush.play();
                            
                            //provide marks
                            marks+=1;
                            scores_element.innerHTML = marks;
                            if(marks%10==0){
                                marksAudio.currentTime = 0;
                                marksAudio.play();
                            }
                        }
                    }
                }
            }
            //remove stone;
            if(stone_position_x<=20){
                stones_side.children[init].remove()
                //show the earth life decrement
                let earth_life = document.getElementsByClassName("earth-life")[0];
                red+=16;
                green-=16;
                color_transparent-=20;
                earth_life.style.background = `linear-gradient(to right,rgb(${red},${green},0)0%,rgb(${red},${green},0)${color_transparent}%,transparent)`
                if(red>=200){
                    let reachedScore = document.getElementsByClassName("reached-scores")[0];
                    if(marks>=500){
                        reachedScore.style.display = "block";
                        reachedScore.innerHTML = `Scores: ${marks}`;
                        reachedScore.style.color = "darkgreen";
                    }else{
                        reachedScore.style.display = "block";
                        reachedScore.innerHTML = `Scores: ${marks}`;
                        reachedScore.style.color = "brown";
                    }
                    //stop the game
                    endGame()
                }
            }
        }
    }
}
setInterval(()=>{
    if(startGame){
        bombPositions();
    }
},100)

//restart the game;
function restartGame(){
    if(startGame){
        //restart shooting again
        stones_side.innerHTML = "";

        //repositioning spaceship
        incrementMarginBlock = false;
        decrementMarginBlock = false;
        rotateSpaceShip = false;
        moveFront = false;
        moveBack = false;
        marginInline = 0;
        margin_block = 20;
        rotate = 25;
        seconds = 2000;

        space_ship.style.marginInline = "0%"
        space_ship.style.marginBlock = "20%"
        spaceShipSound.currentTime = 0;
        spaceShipSound.pause();

        red = 0;
        green = 255;
        color_transparent = 100;

        let earth_life = document.getElementsByClassName("earth-life")[0];
        earth_life.style.background = "linear-gradient(to right,rgb(0, 250, 0)0%,rgb(0, 250, 0)100%,transparent)"

        scores_element.innerHTML = "0e0000"
    }
}

//pause the game;
function pauseAndPlayGame(){
    if(startGame){
        playStoneShooting = !playStoneShooting
        playSpaceShip = !playSpaceShip
        let pauseResumeButton = document.getElementById("pause-resume");
        let allStones = document.querySelectorAll(".stone");
        let allBombs = document.querySelectorAll(".bomb")
        if(playStoneShooting){
            pauseResumeButton.innerHTML = "Pause"
            for(let init = 0;init<allStones.length;init++){
                let eachStone = allStones[init];
                eachStone.style.animationPlayState = "running"
            }
            //resume all shot bombs
            for(let init = 0;init<allBombs.length;init++){
                let eachBomb = allBombs[init]
                eachBomb.style.animationPlayState = "running"
            }

        }else{
            pauseResumeButton.innerHTML = "Resume"
            spaceShipSound.pause();

            //stop the stones moving
            for(let init = 0;init<allStones.length;init++){
                let eachStone = allStones[init];
                eachStone.style.animationPlayState = "paused"
            }

            //stop all shot bombs
            for(let init = 0;init<allBombs.length;init++){
                let eachBomb = allBombs[init]
                eachBomb.style.animationPlayState = "paused"
            }
        }
    }
}

//function start the game for the first time playing;
function startGameFirstTime(){
    startGame = true;
    let game_blocker = document.getElementById("game-blocker");
    game_blocker.style.transitionDuration = "200ms"
    game_blocker.style.transform = "scale(0)";
    game_blocker.style.opacity = "0"
    game_blocker.style.zIndex = "-1"
}

function cancelGame(){
    //reset game first
    restartGame()
    //bring back the game-blocked
    startGame = false;
    let game_blocker = document.getElementById("game-blocker");
    game_blocker.style.transitionDuration = "200ms"
    game_blocker.style.transform = "scale(1)";
    game_blocker.style.opacity = "1"
    game_blocker.style.zIndex = "0"
    space_ship.style.transform = "rotate(25deg)"
    
    let reachedScore = document.getElementsByClassName("reached-scores")[0];
    reachedScore.style.display = "none"

    red = 0;
    green = 255;
    color_transparent = 100;

    let earth_life = document.getElementsByClassName("earth-life")[0];
    earth_life.style.background = "linear-gradient(to right,rgb(0, 250, 0)0%,rgb(0, 250, 0)100%,transparent)"

    scores_element.innerHTML = "00000"
}

//function to display reached scores;
function endGame(){
    //reset game first
    restartGame()
    //bring back the game-blocked
    startGame = false;
    let game_blocker = document.getElementById("game-blocker");
    game_blocker.style.transitionDuration = "200ms"
    game_blocker.style.transform = "scale(1)";
    game_blocker.style.opacity = "1"
    game_blocker.style.zIndex = "0"
    space_ship.style.transform = "rotate(25deg)"

    red = 0;
    green = 255;
    color_transparent = 100;

    let earth_life = document.getElementsByClassName("earth-life")[0];
    earth_life.style.background = "linear-gradient(to right,rgb(0, 250, 0)0%,rgb(0, 250, 0)100%,transparent)"

    scores_element.innerHTML = "0e0000"

}