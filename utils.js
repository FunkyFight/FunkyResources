const fs = require("fs")
const chalk = require("chalk");
const inquirer = require("inquirer");
const path = require("path")

module.exports = {
  getData: (name) => {
    return JSON.parse(fs.readFileSync("./" + name + "\\data.funkyresources"));
  },
  saveData: (name, data) => {
      fs.writeFileSync(`./${name}/data.funkyresources`, JSON.stringify(data))
  },
  getUnicodeIndex: (index) => {
    var chr = [14, 0, 0, 0]

    for(var i = 0; i < index; i++) {
        chr[3] += 1
        if(chr[3] > 15) {
            chr[3] = 0;
            chr[2] += 1
        }

        if(chr[2] > 15) {
            chr[2] = 0;
            chr[1] += 1
        }

        if(chr[1] > 15) {
            chr[1] = 0;
            chr[0] += 1
        }

        if(chr[0] > 15) {
            chr[0] = 15;
        }
        
    }
    converted = convertToHex(chr)
    let str = "\u005cu" + converted[0] + converted[1] + converted[2] + converted[3]

    
    return decodeURIComponent(JSON.parse('"' + str.replace(/\"/g, '\\"') + '"'))
  },
  copyFolderRecursiveSync: copyFolderRecursiveSync,
  copyFileSync: copyFileSync
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    // Copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}

function copyFileSync( source, target ) {

    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function convertToHex(d) {
  for(a in d) {
      switch(d[a]) {
          case 10:
              d[a] = "A"
              break;
          case 11:
              d[a] = "B"
              break;
          case 12:
              d[a] = "C"
              break;
          case 13:
              d[a] = "D"
              break;
          case 14:
              d[a] = "E"
              break;
          case 15:
              d[a] = "F"
              break;
      }
  }

  return d;
}