const express = require("express")
const app = express()

app.use(express.static("public"))

app.set("view engine", "ejs")

app.get('/', (req, res) => {
    res.render("index")
})

app.get('/hotspot/:id', (req, res) => {
    res.render("hotspot-" + req.params.id)
})

app.listen(process.env.PORT || 3000)