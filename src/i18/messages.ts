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
                chooseVariety: 'Choisir une variété',
                chooseMonitoringError: 'Vous devez choisir un suivi',
                chooseVarietyError: 'Vous devez choisir une variété',
                noResult: 'Aucune ligne pour le(s) suivi(s) sélectionné(s)',
            }
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
            updateTtile: 'Modification d\'une ligne de suivi',
            createTitle: 'Création d\'une ligne de suivi',
        },
        sowing: {
            label: 'Semis',
            sowingDate: 'Date de semis',
            location: 'Condition',
            year: 'Année'
        },
        button: {
            update: 'Modifier',
            delete: 'Supprimer',
            harvest: 'Récolte',
            register: 'Enregistrer',
            add: 'Ajouter',
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
                chooseVariety: 'Choose a variety',
                chooseMonitoringError: 'You must choose a monitoring',
                chooseVarietyError: 'You must choose a variety',
                noResult: 'No line for selected monitoring(s)',
            },
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
            label: 'Sowing',
            sowingDate: 'Sowing date',
            location: 'Condition',
            year: 'Year'
        },        
        button: {
            update: 'Update',
            delete: 'Delete',
            harvest: 'Harvest',
            register: 'Register',
            add: 'Add',
            create: 'Create',
        }
    }
}