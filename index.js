const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
console.log(gsap)


canvas.height = 576;
canvas.width = 1024;

const collisionsMap = []
for (let i = 0; i < collisions.length; i+=70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i+=70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

const boundaries = []
const offset = {
    x: -1025, 
    y: -570
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 1025)
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y
            }
          })
        )
    })
  })

const battleZones = []
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 1025)
        battleZones.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y
            }
          })
        )
    })
  })

console.log(battleZones)

const image = new Image;
image.src = './Images/Pokemon Game Map.png';

const imageBack = new Image;
imageBack.src = './Images/pokemonGameMapOverlap.png'

const playerDownImage = new Image;
playerDownImage.src = './Images/playerDown.png'

const playerUpImage = new Image;
playerUpImage.src = './Images/playerUp.png'

const playerLeftImage = new Image;
playerLeftImage.src = './Images/playerLeft.png'

const playerRightImage = new Image;
playerRightImage.src = './Images/playerRight.png'

const battleBackgroundImage = new Image;
battleBackgroundImage.src = './Images/battleBackground.png'



const player = new Sprite({
    position: {
      x: canvas.width / 2 - 192 / 4 / 2,
      y: canvas.height / 2 - -30 / 2
    },
    image: playerDownImage,
    frames: {
    max: 4,
    hold: 10
    },
    sprites: {
        up:playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: imageBack
})

const BattleWindow = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

const keys = {
    w: {pressed: false},

    a: {pressed: false},
    
    s: {pressed: false},

    d: {pressed: false}
}

const moveables = [background, ...boundaries, foreground, ...battleZones]

function rectangularCollision ({ rectangle1, rectangle2}) {

    return(
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width && 
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height && 
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
} 
const battle = {
    initiated: false
}
function animate () {
    const animationID = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw();

        if(rectangularCollision({
            rectangle1: player,
            rectangle2: boundary
        })) {console.log('colliding')}
    })

    battleZones.forEach(battleZone => {
        battleZone.draw()
    })
    player.draw()
    foreground.draw()

    let moving = true
    player.animate = false

    if (battle.initiated) return
    //battle activation below
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            
            const overlappingArea = (Math.min(
                player.position.x + player.width,
                battleZone.position.x + battleZone.width
            ) -
                Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(
                    player.position.y + player.height,
                    battleZone.position.y + battleZone.height
                ) -
                    Math.max(player.position.y, battleZone.position.y))

            if(rectangularCollision({
                rectangle1: player,
                rectangle2: battleZone
            }) && overlappingArea > player.width * player.height / 2 && 
            Math.random() < 0.02 ) {
                console.log('activate battle')

                // deactivate other animation
                window.cancelAnimationFrame(animationID)

                audio.Map.stop()
                audio.initBattle.play()
                audio.battle.play()

                battle.initiated = true
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                initbattle()
                                animateBattle()
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.4,
                                })
                            }
                        })
                        
                        
                    }
                })
                break
            }
        }
    }


    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true
        player.image = player.sprites.up

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]

            if(rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 3
                }}
            })) {
                console.log('colliding')
                moving = false
                break
            }
        }

        if(moving)
        moveables.forEach(moveable => {moveable.position.y += 3})
    }
    else if (keys.a.pressed && lastKey === 'a') {
        player.animate = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]

            if(rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x + 3,
                    y: boundary.position.y
                }}
            })) {
                console.log('colliding')
                moving = false
                break
            }
        }
        if(moving)
        moveables.forEach(moveable => {moveable.position.x += 3})
    }
    else if (keys.s.pressed && lastKey === 's') {
        player.animate = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]

            if(rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 3
                }}
            })) {
                console.log('colliding')
                moving = false
                break
            }
        }
        if(moving)
        moveables.forEach(moveable => {moveable.position.y -= 3})
    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]

            if(rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x - 3,
                    y: boundary.position.y
                }}
            })) {
                console.log('colliding')
                moving = false
                break
            }
        }
        if(moving)
        moveables.forEach(moveable => {moveable.position.x -= 3})
    }
};




// animate();


let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch (e.key) {
    case 'w':
        keys.w.pressed = true;
        lastKey = 'w'
    break;
}
    switch (e.key) {
    case 'a':
        keys.a.pressed = true;
        lastKey = 'a'
    break;
}
    switch (e.key) {
    case 's':
        keys.s.pressed = true;
        lastKey = 's'
    break;
}
    switch (e.key) {
    case 'd':
        keys.d.pressed = true;
        lastKey = 'd'
    break;
}
})


window.addEventListener('keyup', (e) => {
    switch (e.key) {
    case 'w':
        keys.w.pressed = false;       
    break;
}
    switch (e.key) {
    case 'a':
        keys.a.pressed = false;       
    break;
}
    switch (e.key) {
    case 's':
        keys.s.pressed = false;        
    break;
}
    switch (e.key) {
    case 'd':
        keys.d.pressed = false;      
    break;
}
})

let clicked = false
addEventListener('click', () => {
    if(!clicked) {
        audio.Map.play()
        clicked = true
    }

})
