'use strict';
// import fs from "fs";
// import path from "path";
// import Sequelize from "sequelize";
const Sequelize = require("sequelize")
const env = process.env.NODE_ENV || 'development';
// import Config from "../config/config.json"
const Config = require("../config/config.json");
const db = {};
const config = Config[env]
// import User from './user.js'
const User = require("./user")
// import Course from './course.js'
// import Video from './video.js'
const Course = require("./course")
const Video = require("./video")
// import Enroled_courses from './enroled_courses.js'
// index.js
const Enroled_courses = require('./enroled_courses');


let sequelize;
console.log(config)
try {
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }
} catch (error) {
  console.error('Unable to connect to the database:', error.message);
  process.exit(1);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = User(sequelize, Sequelize)
db.courses = Course(sequelize, Sequelize)
db.videos = Video(sequelize, Sequelize)
db.enroled_courses = Enroled_courses(sequelize, Sequelize)

// hasMany relationshipt with user and course
db.users.hasMany(db.courses, { 
  as: 'courses',
  foreignKey: 'userId'
})
db.courses.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user'
})

// hasMany relationshipt with course and videos
db.courses.hasMany(db.videos, { 
  foreignKey: 'courseId',
  as: 'videos'
})
db.videos.belongsTo(db.courses, {
  foreignKey: 'courseId',
  as: 'course'
})

// hasMany relationshipt with user and videos
db.users.hasMany(db.videos, { 
  foreignKey: 'userId',
  as: 'videos'
})
db.videos.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user'
})

// hasMany relationshipt with course and enroled
db.courses.hasMany(db.enroled_courses, { 
  as: 'enroled_courses',
  foreignKey: 'courseId'
})
db.enroled_courses.belongsTo(db.courses, {
  foreignKey: 'courseId',
  as: 'course'
})

// hasMany relationshipt with user and enroled
db.users.hasMany(db.enroled_courses, { 
  as: 'enroled_courses',
  foreignKey: 'userId'
})
db.enroled_courses.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user'
})

// console.log("12345678", db)

module.exports = db
