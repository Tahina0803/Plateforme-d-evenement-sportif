const bcrypt = require('bcrypt');

bcrypt.hash('1234', 10, function(err, hash) {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Mot de passe crypté :", hash);
});
