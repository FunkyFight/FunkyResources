# FunkyResources
## Description

FunkyResources est un moyen complètement nouveau de créer ses propres items avec ses propres textures personnalisées.

Mais, il va au delà d'un simple générateur de pack de ressources. Il a été pensé pour être complémentaire avec n'importe quel plugin qui voudrait manipuler les items personnalisés du pack de ressource généré par FunkyResources.

Importer le module :

```
npm install funkyresources
```

## Initialisation du pack de ressource

Pour initialiser le pack de ressource, utilisez tout simplement le CLI.
Entrez 1, puis toutes les informations demandées
```
node node_modules/funkyresources/index.js
```

Un répertoire devrait être crée.
**Un fichier "data.funkyresources" sera crée. Ne le touchez jamais manuellement sauf si vous pensez être assez doué pour le faire.**
**FunkyResources a été pensé pour être utilisé via instructions Javascript. Tout problème reporté sur un problème causé par la modification manuelle du fichier sera rejeté !**

## Utilisation
### Index.js

Créez un fichier index.js et importez l'API.
Puis, initialisez le resource pack en mettant **le même nom de pack de ressource** en premier paramètre que le nom de resource pack entré dans le CLI
```javascript
const api = require("funkyresources/api")
const pack = new api.resourcepack("my_resource_pack_name")
```

### Ajouter un Item

Pour ajouter un item, vous devez récupérer les assets de votre pack de ressource puis accéder ou créer à la catégorie du nom de votre choix.
La catégorie représente la catégorie de l'objet (Pierres magiques (feu, glace, eau, terre...), de la nourriture, des armes, ce que vous voulez).
Les catégories sont particulièrement utiles pour exporter tout ce que vous avez fait sous .csv (ou autre ?) afin de manipuler les nouveaux items grâce à un plugin.

```javascript
// index.js
pack.getAssets().accessOrCreateCategory("testcategory").addItem("test", "brick", "neptunite_ingot.png", api.item_type_enum.generated, null) //null = modèle par défaut
```

### Types de modèles d'items

Les modèles d'items varient selon l'item.
|    Type   |                       Utilisation                      |
|:---------:|:------------------------------------------------------:|
| generated | Objets communs et lambda comme une pomme ou une brique |
|  handheld |           Outils (armes/pioches/haches, etc.)          |

### Sauvegarder le pack

Toutes les modifications demandées via instructions Javascript seront enregistrées dans **data.funkyresources**. Attention, le pack n'est pas encore exporté et donc utilisable !
```javascript
// index.js
pack.save()
```

### Exportation

Retournez dans le cli et sélectionnez 2. Donnez le nom de votre pack. Le pack est désormais prêt !
***Gardez bien le fichier data.funkyresources pour pouvoir éditer le pack dans le futur !***
```
node node_modules/funkyresources/index.js
```
