const Options = Object.freeze({
    ROCK: 'R',
    PAPER: 'P',
    SCISSORS: 'S',
    DYNAMITE: 'D',
    WATER: 'W',
});

const beats = {
    'R': ['S', 'W'],
    'P': ['R', 'W'],
    'S': ['P', 'W'],
    'D': ['R', 'P', 'S'],
    'W': ['D'],
};

function runMatches(bot1, bot2, matches) {
    const bots = [bot1, bot2];
    let matchWins = [0, 0, 0];
    for (let i = 0; i < matches; i++) {
        let gamestate = [{
            dynamite: [100, 100],
            rounds: []
        }, {
            dynamite: [100, 100],
            rounds: []
        }];
        let botWins = [0, 0];
        let roundPoints = 1;
        while (gamestate[0].rounds.length < 2500 && botWins[0] < 1000 & botWins[1] < 1000) {
            const botPlays = bots.map((bot, i) => bot.makeMove(gamestate[i]));
            botPlays.forEach((play, bot) => {
                if (!Object.keys(beats).includes(play)) {
                    throw `p${bot + 1} returned an incorrect value.`
                }
            });
            gamestate[0].rounds.push({
                p1: botPlays[0],
                p2: botPlays[1],
            });
            gamestate[1].rounds.push({
                p1: botPlays[1],
                p2: botPlays[0],
            });
            botPlays.forEach((play, bot) => {
                if (play === 'D') {
                    if (gamestate[0].dynamite[bot] <= 0) {
                        throw `p${bot + 1} used too much dynamite!`;
                    } else {
                        gamestate[0].dynamite[bot] -= 1;
                        gamestate[1].dynamite[1 - bot] -= 1;
                    }
                }
            });
            if (beats[botPlays[0]].includes(botPlays[1])) {
                botWins[0] += roundPoints;
                roundPoints = 1;
            } else if (beats[botPlays[1]].includes(botPlays[0])) {
                botWins[1] += roundPoints;
                roundPoints = 1;
            } else {
                roundPoints += 1;
            }
        }
        if (gamestate[0].rounds.length === 2500) {
            matchWins[2] += 1
        } else if (botWins[0] >= 1000) {
            matchWins[0] += 1;
        } else {
            matchWins[1] += 1;
        }
    }

    return matchWins;
}

module.exports = {
    runMatches
}