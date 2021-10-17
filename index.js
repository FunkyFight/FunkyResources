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
console.log(__dirname)
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
                    fs.mkdirSync(`./${r.name}/assets/minecraft/textures/gui_font`)
                    fs.mkdirSync(`./${r.name}/assets/minecraft/textures/font`)
                    fs.mkdirSync(`./${r.name}/assets/minecraft/models`)
                    fs.mkdirSync(`./${r.name}/assets/minecraft/models/item`)
                    fs.mkdirSync(`./${r.name}/assets/minecraft/font`)
                    fs.mkdirSync(`./${r.name}/assets/minecraft/lang`)
                    console.log(chalk.blueBright("Création des répertoires terminée"))
                }

                

                ///// ITEMS
                console.log(chalk.blueBright("Génération des items..."))
                var models_items = new Map()
                var models = new Map()

                var UNICODE_INDEX = -1

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
     

                    //Generating each model
        
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
               
                    
                    //Copying texture to dest
                    fs.copyFileSync(data.assets[asset].items[a].image, `./${r.name}/assets/minecraft/textures/item/${data.assets[asset].items[a].name}.png`)

                    
                }
                    //Creating models files
                    for(const [k, v] of models_items.entries()) {
                        fs.writeFileSync(`./${r.name}/assets/minecraft/models/item/${k}.json`, JSON.stringify(v), {flag: "w"})
                    }

                    for(const [k, v] of models.entries()) {
                        fs.writeFileSync(`./${r.name}/assets/minecraft/models/item/${v.funkyres_item}/${k}.json`, JSON.stringify(v), {flag: "w"})
                    }
                    console.log(chalk.blueBright("Items générés avec succès !"))
            
                var defaultjson = {
                        providers: [
                            
                        ]
                }
                ///Guis
                if(data.assets[asset].gui.length > 0) {
                    
                    console.log(chalk.blueBright("Génération des GUIs"))

                    //default.json
                    

                    ///// GUIs
                    for(var a in data.assets[asset].gui) {
                        UNICODE_INDEX++
                        current_gui = data.assets[asset].gui[a]
                        defaultjson.providers.push({
                            type: "bitmap",
                            file: "minecraft:gui_font/" + current_gui.name.toLowerCase() + ".png",
                            ascent: data.assets[asset].gui[a].ascent,
                            height: data.assets[asset].gui[a].height,
                            chars: [utils.getUnicodeIndex(UNICODE_INDEX)]
                        })

                        
                        fs.copyFile(current_gui.image, `./${r.name}/assets/minecraft/textures/gui_font/${current_gui.name.toLowerCase()}.png`, (err) => {
                            if(err) console.log(err)
                        })

                        
                    }

                   
                    
                    // Déplacement
                }

                // Unicode Characters
                if(data.assets[asset].font.length > 0) {
                    for(var a of data.assets[asset].font) {
                        UNICODE_INDEX++
                        defaultjson.providers.push({
                            type: "bitmap",
                            file: "minecraft:font/" + a.name.toLowerCase() + ".png",
                            ascent: a.ascent,
                            height: a.height,
                            chars: [utils.getUnicodeIndex(UNICODE_INDEX)]
                        })
                        fs.copyFile(a.image, `./${r.name}/assets/minecraft/textures/font/${a.name.toLowerCase()}.png`, (err) => {
                            if(err) console.log(err)
                        })
                    }
                }
            }

            //Negative space
            console.log(chalk.blueBright("Implémentation des espaces négatifs"))
            const negative_spaces = require("./font_data/negative_spaces.json")
            for(var a of negative_spaces) {
                defaultjson.providers.push(a)
            }

            utils.copyFolderRecursiveSync(`node_modules\\funkyresources\\font_data\\font`, `./${r.name}/assets/minecraft/textures`)

            fs.writeFileSync(`./${r.name}/assets/minecraft/font/default.json`, JSON.stringify(defaultjson, null, 4))

            fs.copyFile("node_modules\\funkyresources\\font_data\\en_us.json", `./${r.name}/assets/minecraft/lang/en_us.json`, (err) => {
                if(err) console.log(err)
            })

        } else {
            console.log(chalk.redBright("Le dossier demandé n'existe pas"))
        }
    }
}



run()
