#! /usr/bin/env node

import { join } from "path"
import { argv, cwd } from "process"
import { writeFileSync, readFileSync } from "fs"
import { homedir } from "os"
import figlet from "figlet"
import { pastel } from "gradient-string"
import convert from "./convert"

let args:string[]=argv.slice(2)

if(args[0]==`-c`){
  // set api key
  if(!args[1]){
    console.error(`Missing API key`)
    process.exit(1)
  }else{
    const apiKey=args[1]
    const configPath=`${homedir()}/.convert-cli-api-key`
    writeFileSync(configPath, apiKey)
    console.log(`API key saved to ${configPath}`)
    process.exit(0)
  }
}else{
  console.clear();
  figlet(`convert-cli\n`, (err, data)=>{
    // print rainbow text
    console.log(pastel.multiline(data))

    const to:string=args.pop() as string
    const files:string[]=args.map(arg=>join(cwd(), arg))
    const apikey=readFileSync(`${homedir()}/.convert-cli-api-key`).toString()

    files.forEach(async (file)=>{
      // convert all files
      await convert(readFileSync(file).toString('base64url'), file, to, apikey)
    })
  })
}