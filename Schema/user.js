const mongoose = require("mongoose");

module.exports = mongoose.model(
    "User",
    new mongoose.Schema({
        id: { type: String },

        iban: { type: String },
        wallet: { type: Number, default: 0 },
        bank: { type: Number, default: 0 },

        coinFlipCount: { type: Number, default: 0 },


        meslek: { type: String, default: "İşsiz" },
        lastCalisTime: { type: Date },
        dailyLastUsed: { type: Date },

        balikEnvanteri: { type: Object, default: {} },

        bio: { type: String, default: "Bio Ayarlanmamış" }
    })
);
