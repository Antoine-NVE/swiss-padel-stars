# Commandes Utiles au Projet

Ce fichier recense toutes les commandes utiles pour travailler sur ce projet.

## Configuration de l'environnement local

1. **Dupliquer le fichier `.env` en `.env.local`**
   > Ce fichier permet de surcharger les configurations spécifiques à l'environnement local.

2. **Configurer la variable `DATABASE_URL`**
   > Par défaut, cette valeur est déjà configurée pour tourner en local sur le port `3306`, avec le nom de base de données `swiss-padle-stars`.

3. **Modifier la clé `JWT_PASSPHRASE` dans le fichier `.env.local`**
   > Cette clé sera utilisée pour générer et vérifier les tokens JWT.

## Initialisation de la base de données

1. **Créer la base de données (à faire uniquement la première fois)**
   ```bash
   symfony console doctrine:database:create
   ```

2. **Créer une migration (si besoin)**
   > ⚠️ Les migrations sont généralement incluses dans les commits, donc cette commande ne devrait pas être nécessaire en théorie.
   ```bash
   symfony console make:migration
   ```

3. **Exécuter la migration**
   > Cette commande applique toutes les migrations en attente pour mettre à jour la structure de la base de données conformément à la configuration du projet.
   ```bash
   symfony console doctrine:migrations:migrate
   ```

## Gestion des JWT

1. **Générer les clés JWT**

   - Générer la clé privée (remplacez `your_pass_phrase` par la valeur de `JWT_PASSPHRASE` dans votre fichier `.env.local`):
     ```bash
     openssl genrsa -aes256 -passout pass:your_pass_phrase -out config/jwt/private.pem 4096
     ```

   - Générer la clé publique (en utilisant la même passphrase):
     ```bash
     openssl rsa -pubout -passin pass:your_pass_phrase -in config/jwt/private.pem -out config/jwt/public.pem
     ```
