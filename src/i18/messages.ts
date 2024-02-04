export default {
    fr: {
        message: {
            login: {
                error: 'Email ou mot de passe incorrect',
                emailError: "L'email est obligatoire",
                passwordError: 'Le mot de passe est obligatoire',
                jwtExpiration: 'Votre session a expiré. Merci de vous authentifier à nouveau.'
            },
            signup: {
                success: 'Bienvenue {name} ! Vous pouvez vous authentifier.',
            },
            monitoringLine: {
                chooseMonitoringError: 'Vous devez choisir un suivi',
                noResult: 'Aucune ligne pour le(s) suivi(s) sélectionné(s)',
            },
            sowing: {
                none: 'Vous n\'avez pas encore de semis',
                getError: 'Impossible de récupérer vos semis',
                createError: 'Impossible de créer le semis',
                updateError: 'Impossible de modifier le semis',
                deleteError: 'Impossible de supprimer le semis',
                sowingDateError: 'Vous devez saisir une date de semis',
            },
            chooseVarietyError: 'Vous devez choisir une variété',
            chooseVariety: 'Choisir une variété',
        },
        login: {
            to: 'Connecter',
            title: 'Connexion',            
            email: 'Email',
            password: 'Mot de passe',
            repeatPassword: 'Répéter le mot de passe',
        },
        signup: {
            to: 'Enregistrer',
            title: 'Enregistrement'
        },
        variety: {
            label: 'Variété',
            publish: 'Publier la variété'
        },
        navigation: {
            home: 'Accueil',
            account: 'Compte',
            profile: 'Profil',
            login: 'Se connecter',
            logout: 'Se déconnecter',
            signup: 'Créer un compte',
            workspace: 'Espace de travail',
            monitoring: 'Suivi',
            variety: 'Variétés',
            sowing: 'Semis',
        },
        monitoring: {
            label: 'Suivi',
            types: {
                annual: 'Annuel',
                biAnnual: 'Bi-annuel',
                persistent: 'Pérenne',
                other: 'Autre',
            }
        },
        monitoringLine: {
            plantNumber: 'Nombre de plants',
            description: 'Description',
            ended: 'Terminé ?',
            planting: 'Mise en terre',
            harvest: {
                start: 'Début de la récolte',
                stop: 'Fin de la récolte',
                number: 'Quantité',
                weight: 'Masse (g)',
                addNumber: 'Quantité à ajouter',
                addWeight: 'Masse à ajouter (g)',
                updateTitle: 'Mise à jour de la récolte',
            },
            tooltip: {
                ended: 'Indique si la récolte est terminée pour cette ligne'
            },
            updateTitle: 'Modification d\'une ligne de suivi',
            createTitle: 'Création d\'une ligne de suivi',
        },
        sowing: {
            title: 'Mes semis',
            label: 'Semis',
            sowingDate: 'Date de semis',
            location: 'Condition',
            year: 'Année de production',
            createTitle: 'Création d\'un semis',
            updateTitle: 'Modification d\'un semis',
        },
        location: {
            locationOptions: {
              outside: 'Exterieur',
              greenhouse: 'Serre',
              tunnel: 'Tunnel',
              other: 'Autre',
            },
        },
        button: {
            update: 'Modifier',
            delete: 'Supprimer',
            harvest: 'Récolte',
            register: 'Enregistrer',
            add: 'Ajouter',
            addSowing: 'Ajouter un semis',
            create: 'Créer',
        }
    },
    en: {
        message: {
            login: {
                error: 'Incorrect email or password',
                emailError: 'Email is required',
                passwordError: 'Password is required',
                jwtExpiration: 'Your session has expired. Please authenticate again.'
            },
            signup: {
                success: 'Welcome {name} ! You can authenticate.',
            },
            monitoringLine: {
                chooseMonitoringError: 'You must choose a monitoring',
                chooseVarietyError: 'You must choose a variety',
                noResult: 'No line for selected monitoring(s)',
            },
            sowing: {
                none: 'You don\'t have any sowing get',
                getError: 'Impossible to get your sowings',
                createError: 'Impossible to create this sowing',
                updateError: 'Impossible to update this sowing',
                deleteError: 'Impossible to delete the sowing',
                sowingDateError: 'You must set a sowing date',
            },
            chooseVarietyError: 'You must choose a variety',
            chooseVariety: 'Choose a variety',
        },
        login: {
            to: 'Log-in',
            title: 'Log-in',
            email: 'Email',
            password: 'Password',
            repeatPassword: 'Repeat password',
        },
        signup: {
            to: 'Sign-up',
            title: 'Sign-up'
        },
        variety: {
            publish: 'Publish the variety'
        },
        navigation: {
            home: 'Home',
            account: 'Account',
            profile: 'Profile',
            login: 'Log-in',
            logout: 'Log-out',
            signup: 'Sign-up',
            workspace: 'Workspace',
            monitoring: 'Monitoring',
            variety: 'Varieties',
            sowing: 'Sowing',
        },
        monitoring: {
            label: 'Monitoring',
            types: {
                annual: 'Annual',
                biAnnual: 'Bi-annual',
                persistent: 'Persistent',
                other: 'Other',
            }
        },
        monitoringLine: {
            plantNumber: 'Plants number',
            description: 'Description',
            ended: 'End ?',
            planting: 'Planting',
            harvest: {
                start: 'Harvest start',
                stop: 'Harvest end',
                number: 'Quantity',
                weight: 'Mass (g)',
                addNumber: 'Quantity to add',
                addWeight: 'Mass to add (g)',
                updateTitle: 'Harvest update',
            },
            tooltip: {
                ended: 'Indicates whether harvesting is complete for this row'
            },
            updateTtile: 'Update a monitoring line',
            createTitle: 'Create a monitoring line',
        },
        sowing: {
            title: 'My sowings',
            label: 'Sowing',
            sowingDate: 'Sowing date',
            location: 'Condition',
            year: 'Year',
            createTitle: 'Creation of a sowing',
            updateTitle: 'Update of a sowing',
        },       
        location: {
            locationOptions: {
              outside: 'Outside',
              greenhouse: 'Greenhouse',
              tunnel: 'Tunnel',
              other: 'Other',
            },
        }, 
        button: {
            update: 'Update',
            delete: 'Delete',
            harvest: 'Harvest',
            register: 'Register',
            add: 'Add',
            addSowing: 'Add a sowing',
            create: 'Create',
        }
    }
}