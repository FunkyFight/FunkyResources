const utils = require("./utils")
const api = require("./api");
const chalk = require("chalk");
const fs = require("fs");
const figlet = require("figlet")



class ResourcePack {
  
    constructor(resourcepack_name) {
        this.rpack_name = resourcepack_name;
        this.assets = new Assets(this)
        this.data = utils.getData(resourcepack_name)

        console.log(chalk.greenBright("Ressource Pack initialisé."))
    }

    getAssets() {
        return this.assets
    }

    printAssets() {
        console.log(JSON.stringify(this.data))
    }

    save() {
        fs.writeFileSync(`./${this.rpack_name}/data.funkyresources`, JSON.stringify(this.data, null, 4))
    }
        
}

class Assets {

    /**
    * Asset class of the resource pack
    * @param {ResourcePack} resourcepack 
    */
     constructor(resourcepack) {
        this.resourcepack = resourcepack
    }

    accessOrCreateCategory(catname) {
      //var categories = this.resourcepack.data.assets.filter(x => x.name === catname);
      console.log(chalk.greenBright("  ↳ Initialisation de la catégorie " + catname))
      return new Category(this.resourcepack, catname)
      
    }
    
}

class Category {
    /**
     * 
     * @param {ResourcePack} resourcepack 
     * @param {String} categoryname 
     */
  constructor(resourcepack, categoryname) {
    this.resourcepack = resourcepack
    this.categoryname = categoryname
    this.data = null

    for(var e in resourcepack.data.assets) {
        if(resourcepack.data.assets[e].name == categoryname) {
            this.data = resourcepack.data.assets[e]
            console.log(chalk.greenBright("    ↳ La catégorie a bien été initialisée"))
            return;
        }
    }

    console.log(chalk.redBright("    ↳ La catégorie n'existe pas. Création."))
    this.resourcepack.data.assets.push({
        name: categoryname,
        items: [],
        blocks: [],
        entity: [],
        gui: []
    })

    this.data = this.resourcepack.data.assets.filter(e => e.name === categoryname)[0]
    
    
    console.log(chalk.greenBright("    ↳ La catégorie a bien été initialisée"))
  }






  addItem(item_name, minecraft_item, path_to_image_file, type, custom_model) {

    for(var it in this.data.items) {
        if(this.data.items[it].name == item_name && this.data.items[it].mc_item == minecraft_item) {
            this.data.items[it] = {
                name: item_name,
                mc_item: minecraft_item,
                image: path_to_image_file,
                type: type
            }
            console.log(chalk.greenBright(`      ↳ Item ${item_name} (=> ${minecraft_item}) modifié !`))
            return this
        }
    }
    this.data.items.push({
        name: item_name,
        mc_item: minecraft_item,
        image: path_to_image_file,
        type: type,
        custom_model: custom_model
    })
    console.log(chalk.greenBright(`      ↳ Item ${item_name} (=> ${minecraft_item}) crée !`))
    return this
  }

  addGUI(guiname, image_path, ascent, height) {
    this.data.gui = []

    this.data.gui.push({
        name: guiname,
        image: image_path,
        ascent: ascent,
        height: height
    })
    console.log(chalk.greenBright(`      ↳ GUI ${guiname} (Img = ${image_path}) crée !`))
    return this
  }
}

const item_type_enum = Object.freeze({
    handheld: "item/handheld",
    generated: "item/generated"
})


module.exports = {
    

    resourcepack: ResourcePack,
    assets: Assets,
    category: Category,
    item_type_enum: item_type_enum
    
}