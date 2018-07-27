const fs = require('fs');
const { runMatches } = require('./dynamiteRunner');

const bots = {};
const results = {};

fs.readdirSync('./bots/').forEach(file => bots[file] = require('./bots/' + file))

function changeBot(botName) {
    console.log(`Add ${botName}`)
    delete require.cache[require.resolve('./bots/' + botName)]
    bots[botName] = require('./bots/' + botName)
}

function getBots() {
    return Object.keys(bots)
}

function getLatestResults(bot1, bot2) {
    let result = results[bot1 + '/' + bot2]
    return result ? result : ''
}

function runTournament() {
    const botNames = getBots()
    for (let i = 0; i < botNames.length; i++) {
        const bot1 = botNames[i]
        for (let j = i + 1; j < botNames.length; j++) {
            const bot2 = botNames[j]
            const result = runMatches(bots[bot1], bots[bot2], 100)
            results[bot1 + '/' + bot2] = result
            results[bot2 + '/' + bot1] = [result[1], result[0], result[2]]
        }
    }
    console.log(results);
}


module.exports = {
    getBots,
    getLatestResults,
    runTournament,
    changeBot,
}