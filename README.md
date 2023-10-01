# HebergOS

Destiné au club `./insa.sh` pour permettre aux membres de monitorer leurs projets hostés
sur le serveur du club, HebergOS se décompose en deux grandes parties.
- La partie Webapp
- La partie API

## Webapp

*Développé en `PHP` avec [Symfony](https://symfony.com)*

Application à laquelle les membres du club pourront se connecter pour superviser leurs projets,
démarrer leurs application, les arrêter, obtenir différentes statistiques.

Permet également d'accéder aux services via un shell web.

## API

Les actions effectuées par la webapp sont en fait des requêtes à l'API.

Interface entre la webapp et le serveur, l'API rédigée en `GO` permet d'éxécuter les actions sur le serveur (démarrage, arrêt, ...).

## Infrastructure

Les projets hébergés sur le serveur le seront via des Dockers qui seront manipulés par l'API.

Chaque utilisateur auront la main sur son/ses dockers via la webapp et les requêtes API.

---

## Requirements

### Webapp

- PHP >= 8
- Symfony >= 6
- Composer >= 2.6.4
- Doctine >= 2.16.2
- MySQL

### API / Infra

- GoLang
- Docker engine

---

## Startup

### Webapp

Install PHP and symfony dependencies (`symfony check:requirements`) (meet the warnings)

- `php bin/console doctrine:create:database`
- `symfony serve`

### API

- `go mod init`
- `go get .`
- `go run .`