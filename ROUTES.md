# Routes Disponibles

Ce fichier répertorie les différentes routes du projet, avec les méthodes HTTP associées, les chemins et les rôles requis.

## Liste des Routes

| Nom                | Méthode | Chemin               | Description          | Rôle requis  |
|--------------------|---------|----------------------|----------------------|--------------|
| `app_home`         | GET     | `/{reactRouting}`    | Accueil React        | Aucun        |
| `api_auth_register`| POST    | `/api/auth/register` | Inscription          | Aucun        |
| `api_auth_login`   | POST    | `/api/auth/login`    | Connexion            | Aucun        |
| `api_auth_refresh` | POST    | `/api/auth/refresh`  | Refresh du token     | Aucun        |
| `api_auth_logout`  | POST    | `/api/auth/logout`   | Déconnexion          | Aucun        |
| `api_profile_user` | GET     | `/api/profile/user`  | Données utilisateur  | ROLE_USER    |

## Instructions

- Les colonnes **Rôle requis** sont basées sur les règles d'authentification définies dans le projet.
