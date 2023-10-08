module.exports = {
    bot: {
        token: "MTE1NTk2MjMxNjc5ODU3NDYzMg.Gkgz1o.R_Ywz2wYkba497zAUkONlQxWvdCBx1uIn0fpHs", //botun tokeni
        prefix: ".", //botun prefixi
        mongoDb: "mongodb+srv://fr3zycode123:fr3zycode123@cluster0.qrhvvwa.mongodb.net/?retryWrites=true&w=majority" //MongoDB Url. Youtubede araştırarak nasıl alınacagını öürenebilirsiniz
    },
    coinflip: {
        coinFlipMax: 250000, //Coinflip en fazla oynayabilecekleri para
    },
    meslek: {
        doktorMaas: 50000, //Doktor Maaşı
        yazilimciMaas: 25000, //Yazilimci maaşı
        ogretmenMaas: 20000, //Öğretmen maaşı
    },
    daily: {
        min: 1000, //Günlük Ödül minimum gelecek para
        max: 10000, //Günlük Ödül maximum gelecek para
    },
}