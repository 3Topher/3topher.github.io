const monsters = {
    emby: {
        position: {
            x: 280,
            y: 325
        },
        image: {
            src:'./Images/embySprite.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        isEnemy: false,
        name: 'Emby',
        attacks: [attacks.Tackle, attacks.Fireball]
    },
    draggle: {
        position: {
            x: 800,
            y: 100
        },
        image: {
            src: './Images/draggleSprite.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        isEnemy: true,
        name: 'Draggle',
        attacks: [attacks.Tackle, attacks.Fireball]
    }
}