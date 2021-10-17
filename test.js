const api = require("./api")

const pack = new api.resourcepack("CustomModelData")
pack.getAssets().accessOrCreateCategory("Ingots").addItem("neptunite_ingot", "brick", "image_textures\\neptunite_ingot.png", api.item_type_enum.generated, null)
pack.getAssets().accessOrCreateCategory("GUIs").addGUI("coffre_clacos", "gui_textures\\gui.png")
pack.save()