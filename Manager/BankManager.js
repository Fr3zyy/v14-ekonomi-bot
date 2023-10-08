// bankmanager.js

const ecoSchema = require("../Schema/user");

// Kullanıcıya banka hesabına belirli bir miktar para eklemek için bu fonksiyonu kullanabilirsiniz.
async function add(userId, amount, reason = null) {
    if (amount <= 0) {
        return "Geçersiz para miktarı. Lütfen pozitif bir miktar girin.";
    }

    const userData = await ecoSchema.findOne({ id: userId });

    if (!userData) {
        return "Belirtilen kullanıcı veritabanında bulunamadı.";
    }

    userData.bank += amount;
    await userData.save();

    return `${amount} para, kullanıcının banka hesabına eklendi. Neden: ${reason || "Belirtilmedi"}`;
}

// Kullanıcıdan banka hesabından belirli bir miktar para çekmek için bu fonksiyonu kullanabilirsiniz.
async function withdraw(userId, amount, reason = null) {
    if (amount <= 0) {
        return "Geçersiz para miktarı. Lütfen pozitif bir miktar girin.";
    }

    const userData = await ecoSchema.findOne({ id: userId });

    if (!userData) {
        return "Belirtilen kullanıcı veritabanında bulunamadı.";
    }

    if (userData.bank < amount) {
        return "Yetersiz bakiye. Banka hesabınızda yeterli para yok.";
    }

    userData.bank -= amount;
    await userData.save();

    return `${amount} para, banka hesabından çekildi. Neden: ${reason || "Belirtilmedi"}`;
}

// Kullanıcının banka hesabını kontrol etmek için bu fonksiyonu kullanabilirsiniz.
async function check(userId) {
    const data = await ecoSchema.findOne({ id: userId });

    if (!userData) {
        return false
    }

    return true;
}

module.exports = {
    add,
    withdraw,
    check,
};
