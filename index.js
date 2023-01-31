// import Express from "express";
const Express = require("express");
const cors = require("cors")
const { Client } = require('pg');
// import cors from "cors";
// import bodyParser from "body-parser";
const bodyParser = require("body-parser")
const Route = require("./routes/routes.js")
// import Route from "./routes/routes.js"

const app = Express();

const PORT = process.env.PORT || 8001;

app.use(cors({ credentials: true, origin:""}));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(Route);

app.listen(PORT, () => {
    console.log(`server listening at http://localhost:${PORT}`);
});
