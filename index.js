const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const menu = require("./menu")
const fs = require("fs")
const utils = require("./utils");
const { category_menu } = require('./menu');


///IMPORTANT DATA
const pack_json = {}
var path = ""

console.log(
    chalk.yellow(
        figlet.textSync("FunkyResources", {horizontalLayout: 'full'})
    )
)

const run = async() => {
    const main_menu = await menu.main_menu()
    
    if(main_menu["Main menu"] == "1") {
        const creation_info = await menu.creation_menu()
        if(!fs.existsSync(`./${creation_info.name}`)) {
            path = "./" + creation_info.name
            //Root folder
            fs.mkdir(path, () => {})
            console.log(chalk.greenBright(`Dossier ${creation_info.name} crée avec succès !`))

            //Asset Folder
            fs.mkdir(path + "\\assets", () => {})
            console.log(chalk.greenBright(`Dossier assets crée avec succès !`))
            
            
            //pack.mcmeta
            var mcmeta = {
                pack: {
                    pack_format: 7,
                    description: creation_info.description
                }
            }
            fs.writeFile(path + "\\pack.mcmeta", JSON.stringify(mcmeta), () => {
                console.log(chalk.greenBright(`Fichier pack.mcmeta initialisé.`))
                console.log(" ")
            })

            //data.funkyresources
            var fres = {
                assets: []
            }

            fs.writeFile(path + "\\data.funkyresources", JSON.stringify(fres), async() => {
                console.log(chalk.greenBright(`Fichier data.funkyresources initialisé.`))
                
            })

           


        }
    } else if(main_menu["Main menu"] == "2") { //Exportation

        console.log(chalk.red(figlet.textSync("Exportation", {horizontalLayout: 'full'})))

        var r = await menu.export_menu()
        if(fs.existsSync("./" + r.name)) {
            
            var data = JSON.parse(fs.readFileSync(`./${r.name}/data.funkyresources`))

            //Creating directories / Categories
            for(var asset in data.assets) {
                if(!fs.existsSync(`./${r.name}/assets/minecraft`)) {
                    console.log(chalk.blueBright("Création des répertoires"))
                    fs.mkdirSync(`./${r.name}/assets/minecraft`)
                    fs.mkdirSync(`./${r.name}/assets/minecraft/textures/`)
                    fs.mkdirSync(`./${r.name}/assets/minecraft/textures/item`)
                    fs.mkdirSync(`./${r.name}/assets/minecraft/models`)
                    fs.mkdirSync(`./${r.name}/assets/minecraft/models/item`)
                    console.log(chalk.blueBright("Création des répertoires terminée"))
                }

                //Generating models
                console.log(chalk.blueBright("Génération des modèles"))
                var models_items = new Map()
                var models = new Map()
                for(var a in data.assets[asset].items) {
                    if(!models_items.has(data.assets[asset].items[a].mc_item.toLowerCase())) {
                        models_items.set(data.assets[asset].items[a].mc_item.toLowerCase(), {
                            parent: data.assets[asset].items[a].type,
                            textures: {
                                layer0: "item/" + data.assets[asset].items[a].mc_item.toLowerCase()
                            },
                            overrides: [
                                {
                                    predicate: {
                                        custom_model_data: 1
                                    },
                                    model: "item/" + data.assets[asset].items[a].mc_item.toLowerCase() + "/" + data.assets[asset].items[a].name
                                }
                            ]
                        })
                    } else {
                        models_items.get(data.assets[asset].items[a].mc_item.toLowerCase()).overrides.push({
                                predicate: {
                                    custom_model_data: models_items.get(data.assets[asset].items[a].mc_item.toLowerCase()).overrides.length + 1
                                },
                                model: "item/" + data.assets[asset].items[a].mc_item.toLowerCase() + "/" + data.assets[asset].items[a].name   
                        })
                    }
                    

                    if(!fs.existsSync(`./${r.name}/assets/minecraft/models/item/${data.assets[asset].items[a].mc_item.toLowerCase()}`)) fs.mkdirSync(`./${r.name}/assets/minecraft/models/item/${data.assets[asset].items[a].mc_item.toLowerCase()}`)
                    console.log(chalk.blueBright("Génération des modèles terminées"))

                    //Generating each model
                    console.log(chalk.blueBright("Génération des autres modèles"))
                    if(data.assets[asset].items[a].custom_model == null) {

                        

                        models.set(data.assets[asset].items[a].name, {
                            "parent": data.assets[asset].items[a].type,
                            "funkyres_item": data.assets[asset].items[a].mc_item,
                            "textures": {
                                "layer0": "item/"+data.assets[asset].items[a].name
                            }
                        }
                        )
                    }
                    console.log(chalk.blueBright("Génération des autres modèles terminée"))
                    
                    //Copying texture to dest
                    fs.copyFileSync(data.assets[asset].items[a].image, `./${r.name}/assets/minecraft/textures/item/${data.assets[asset].items[a].name}.png`)
                    console.log(chalk.blueBright("Transfert des images"))

                    
                }

                //Creating models files
                console.log(chalk.blueBright("Génération des fichiers"))
                for(const [k, v] of models_items.entries()) {
                    fs.writeFileSync(`./${r.name}/assets/minecraft/models/item/${k}.json`, JSON.stringify(v), {flag: "w"})
                }

                for(const [k, v] of models.entries()) {
                    fs.writeFileSync(`./${r.name}/assets/minecraft/models/item/${v.funkyres_item}/${k}.json`, JSON.stringify(v), {flag: "w"})
                }
                
                console.log(chalk.blueBright("Génération des fichiers terminée"))

                
            }
        } else {
            console.log(chalk.redBright("Le dossier demandé n'existe pas"))
        }
    }
}



run()
