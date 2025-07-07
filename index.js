// Fonction utilitaire pour mettre à jour les éléments de message de manière cohérente
function updateMessage(elementId, message, color = "black") {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerText = message;
        element.style.color = color;
    } else {
        console.error(`Erreur : L'élément avec l'ID '${elementId}' n'a pas été trouvé.`);
    }
}

function ButtonActionYes() {
    updateMessage("Direction", "Alors connectez-vous ci-dessous", "blue");
}

function ButtonActionNo() {
    updateMessage("Directionseconde", "Alors inscrivez-vous !", "blue");
}
 
function buttonActionSave() {
    const inputName = document.getElementById("inputActionID");
    const inputPassword = document.getElementById("inputActionPassword");
    const messageElementId = "Directionseconde"; // ID de l'élément pour les messages

    // Effacer tout message précédent au début de la fonction
    updateMessage(messageElementId, "");

    // Vérification de l'existence des éléments HTML et des valeurs non vides
    if (!inputName || !inputPassword) {
        updateMessage(messageElementId, "Erreur interne : Champs d'entrée introuvables.", "red");
        console.error("Erreur : L'un des éléments d'entrée (nom/mot de passe) n'a pas été trouvé.");
        return null;
    }

    const username = inputName.value.trim();
    const password = inputPassword.value.trim();

    if (!username || !password) {
        updateMessage(messageElementId, "Le nom d'utilisateur et le mot de passe ne peuvent pas être vides.", "red");
        return null;
    }

    // Expressions régulières pour la validation
    // Nom d'utilisateur : pas de caractères spéciaux ni d'espaces
    const usernameDisallowedCharsPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`\s]/; 
    if (usernameDisallowedCharsPattern.test(username)) {
        updateMessage(messageElementId, "Le nom d'utilisateur ne peut pas contenir de caractères spéciaux ou d'espaces.", "red");
        console.warn("Nom d'utilisateur invalide : contient des caractères spéciaux ou des espaces.");
        return null;
    }

    // Mot de passe : au moins un caractère spécial et une longueur minimale (par exemple, 8 caractères)
    const passwordRequiresSpecialCharPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;
    const minPasswordLength = 8; // Vous pouvez ajuster cette valeur

    if (!passwordRequiresSpecialCharPattern.test(password) || password.length < minPasswordLength) {
        updateMessage(messageElementId, `Le mot de passe doit contenir au moins un caractère spécial et avoir au moins ${minPasswordLength} caractères.`, "red");
        console.warn("Mot de passe invalide : ne respecte pas les exigences.");
        return null;
    }

    let allCredentials = [];
    try {
        let storedCredentialsString = localStorage.getItem('credentials'); // Clé corrigée ici !
        if (storedCredentialsString) {
            allCredentials = JSON.parse(storedCredentialsString);
            // S'assurer que ce que nous récupérons est bien un tableau
            if (!Array.isArray(allCredentials)) {
                console.warn("Les identifiants stockés ne sont pas un tableau. Réinitialisation.");
                allCredentials = [];
            }
        }
    } catch (e) {
        console.error("Erreur lors de la lecture ou de l'analyse des identifiants stockés :", e);
        updateMessage(messageElementId, "Erreur lors de la récupération des données stockées.", "red");
        return null;
    }

    // Vérifier si le nom d'utilisateur existe déjà
    if (allCredentials.some(cred => cred.name === username)) {
        updateMessage(messageElementId, "Ce nom d'utilisateur existe déjà. Veuillez en choisir un autre.", "orange");
        return null;
    }
   
    let userCredentials = {
        name: username,
        password: password  
    };

    allCredentials.push(userCredentials);
    localStorage.setItem('credentials', JSON.stringify(allCredentials)); // Enregistrement avec la clé correcte

    updateMessage(messageElementId, "Identifiants enregistrés avec succès !", "green");
    console.log("Identifiants enregistrés :", userCredentials);

    // Vider les champs après un enregistrement réussi
    inputName.value = '';
    inputPassword.value = '';

    return userCredentials; 
}


function buttonActionExecution() {
    const inputExecutionName = document.getElementById("inputExecutionID");
    const inputExecutionPassword = document.getElementById("inputExecutionPassword");
    const responseElementId = "pespons"; // ID de l'élément pour les messages de réponse

    // Effacer tout message précédent au début de la fonction
    updateMessage(responseElementId, "");

    // Vérification de l'existence des éléments HTML
    if (!inputExecutionName || !inputExecutionPassword) {
        updateMessage(responseElementId, "Une erreur interne est survenue. Veuillez réessayer plus tard.", "red");
        console.error("Erreur : Un ou plusieurs éléments d'entrée de connexion n'ont pas été trouvés.");
        return;
    }

    const enteredName = inputExecutionName.value.trim();
    const enteredPassword = inputExecutionPassword.value.trim();

    // Vérification des champs vides
    if (!enteredName || !enteredPassword) {
        updateMessage(responseElementId, "Veuillez entrer votre nom d'utilisateur et votre mot de passe.", "orange");
        console.warn("Tentative de connexion avec des champs vides.");
        return;
    }

    let allStoredCredentials = []; // Devrait être un tableau
    try {
        const storedCredentialsString = localStorage.getItem("credentials"); // Clé corrigée ici !
        if (storedCredentialsString) {
            allStoredCredentials = JSON.parse(storedCredentialsString);
            if (!Array.isArray(allStoredCredentials)) {
                console.warn("Les identifiants stockés ne sont pas un tableau. Réinitialisation.");
                allStoredCredentials = [];
            }
        }
    } catch (e) {
        console.error("Erreur lors de la lecture ou de l'analyse des identifiants stockés :", e);
        updateMessage(responseElementId, "Erreur lors de la récupération des données de connexion. Veuillez réessayer.", "red");
        return;
    }

    // Trouver l'utilisateur correspondant dans le tableau des identifiants
    const foundUser = allStoredCredentials.find(cred => cred.name === enteredName);

    // Vérifier si l'utilisateur a été trouvé ET si le mot de passe correspond
    if (foundUser && foundUser.password === enteredPassword) {
        updateMessage(responseElementId, "Vous avez accès au compte !", "green");
        console.log(`Authentification réussie pour l'utilisateur : ${enteredName}`);

        // Vider les champs après une connexion réussie
        inputExecutionName.value = '';
        inputExecutionPassword.value = '';

    } else {
        // L'utilisateur n'a pas été trouvé ou le mot de passe est incorrect
        updateMessage(responseElementId, "Nom d'utilisateur ou mot de passe incorrect.", "red");
        console.warn(`Tentative de connexion échouée pour l'utilisateur : ${enteredName}`);
    }
}