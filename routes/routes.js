// import express from "express";
const express = require("express");
const signup = require("../controllers/user/signup.js")
const signin = require("../controllers/user/signin.js")
// import {signup} from "../controllers/user/signup.js";
// import signin from "../controllers/user/signin.js";

const Route = express.Router();

Route.get("/signin", signin)
Route.post("/signup", signup)

module.exports = Route
