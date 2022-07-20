let draggleMon
let embyMon
let renderedSprites
let queue

function initbattle() {
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#attacksBox').replaceChildren()

    draggleMon = new Monster(monsters.draggle)
    embyMon = new Monster(monsters.emby)
    renderedSprites = [draggleMon, embyMon]
    queue = []

    console.log({draggleMon})

    embyMon.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacksBox').append(button)
    })

    //event listener for attacks
    document.querySelectorAll('button').forEach((button) => {

        button.addEventListener('click', (e) => {
            currentAttack = attacks[e.currentTarget.innerHTML]

            embyMon.attack({
                attack: currentAttack,
                recipient: draggleMon,
                renderedSprites
            })

            if (draggleMon.health <= 0) {
                queue.push(() => {
                  draggleMon.faint()
                })
                queue.push(() => {
                  // fade back to black
                  gsap.to('#overlappingDiv', {
                    opacity: 1,
                    onComplete: () => {
                      cancelAnimationFrame(battleAnimationId)
                      animate()
                      document.querySelector('#userInterface').style.display = 'none'
        
                      gsap.to('#overlappingDiv', {
                        opacity: 0
                      })
        
                      battle.initiated = false
                      audio.victory.stop()
                      audio.Map.play()
                    }
                  })
                })
              }

            const randomAttack = draggleMon.attacks[Math.floor(Math.random() * draggleMon.attacks.length)]

            queue.push(() => {
                draggleMon.attack({
                    attack: randomAttack,
                    recipient: embyMon,
                    renderedSprites
                })
            })

            if (embyMon.health <= 0) {
                queue.push(() => {
                    embyMon.faint()
                })

                queue.push(() => {
                    // fade back to black
                    console.log('emby fading')
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'
                            gsap.to('#overlappingDiv', {
                                opacity: 0
                            })

                            battle.initiated = false
                            audio.victory.stop()
                            audio.Map.play()
                        }
                    })
                })
            }



        })
        button.addEventListener('mouseenter', (e) => {
            currentAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML = currentAttack.type
            document.querySelector('#attackType').style.color = currentAttack.color

        })
    })
}

//Draws battle animations via loop
let battleAnimationId
function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    BattleWindow.draw()
    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}

animate();
// initbattle();
// animateBattle();



document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'
})