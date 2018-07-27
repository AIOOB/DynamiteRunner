const express = require('express')
const fileUpload = require('express-fileupload')
const runner = require('./runner');
const app = express()

app.get('/', (req, res) => {
    const bots = runner.getBots();
    res.send(`
<a href="/upload.html">Upload bot</a>
<table>
<tr>
    <td>row - col</td>
    <th scope="col">${bots.join('</th><th scope="col">')}</th>
</tr>
${bots.map(botRow => `
<tr>
    <th scope="row">${botRow}</th>
    ${bots.map(botCol => `<td>${runner.getLatestResults(botRow, botCol)}</td>`).join('')}
</tr>
`).join('')}
</table>
<form ref='runForm' id='runForm' action='/run' method='post'>
<input type='submit' value='Run!' />
</form>
`)})

app.use(fileUpload());

app.use("/", express.static('./static'))

app.post('/run', function (req, res) {
    runner.runTournament();
});

app.post('/upload', function (req, res) {
    if (!req.files) {
        return res.status(400).send('No files were uploaded.')
    }

    let botFile = req.files.bot;

    // Use the mv() method to place the file somewhere on your server
    botFile.mv(`./bots/${botFile.name}`, function (err) {
        if (err) {
            return res.status(500).send(err)
        }
        console.log(`Bot ${botFile.name} added`);
        runner.changeBot(botFile.name);

        res.send('File uploaded! <a href="/">Go back</a>')
    })
})

app.listen(80, () => console.log('Example app listening on port 80!'))