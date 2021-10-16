const api = require("./api")

const pack = new api.resourcepack("test")
pack.getAssets().accessOrCreateCategory("testcategory").addItem("test", "brick", "neptunite_ingot.png", api.item_type_enum.generated, null)
pack.save()