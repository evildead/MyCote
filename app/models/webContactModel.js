'use strict';

const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose);
const CollectionSchema = require('../utils/collectionSchema');

const mongooseWebContactSchema = new Mongoose.Schema(Joigoose.convert(CollectionSchema.webcontact), { timestamps: true });

module.exports = Mongoose.model('WebContact', mongooseWebContactSchema);
