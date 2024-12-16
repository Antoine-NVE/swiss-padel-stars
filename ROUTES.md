# Routes Disponibles

Ce fichier répertorie les différentes routes du projet, avec les méthodes HTTP associées, les chemins et les rôles requis.

## Liste des Routes

| Nom               | Méthode | Chemin             | Description         | Rôle requis      |
|-------------------|---------|--------------------|---------------------|------------------|
| `api_register`    | POST    | `/api/register`    | Inscription         | Aucun            |
| `api_login`       | POST    | `/api/login`       | Connexion           | Aucun            |
| `api_logout`      | POST    | `/api/logout`      | Déconnexion         | ROLE_USER        |
| `api_user`        | GET     | `/api/user`        | Détails utilisateur | ROLE_USER        |
| `app_home`        | GET     | `/{reactRouting}`  | Accueil React       | Aucun            |
| `api_profile`     | GET     | `/api/profile`     | Profil utilisateur  | ROLE_USER        |

## Instructions

- Les colonnes **Rôle requis** sont basées sur les règles d'authentification définies dans le projet.
