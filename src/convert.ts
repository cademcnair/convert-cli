import fetch from "node-fetch"
import { lookup  } from "mime-types"
import { writeFileSync } from "fs"

export default function (file:string, filename:string, to:string, apikey:string) {
  return new Promise<void>(async (resolve, reject)=>{

    let importFilename:string=filename.split("/").pop() as string
    let exportFilename:string=`${importFilename.split('.').slice(0, -1).join('.')}.${to}`

    // create job
    let task=JSON.stringify({
      tag: "convert-cli",
      tasks: {
        uploadCLI: {
          operation: "import/base64",
          file:`data:${lookup(importFilename.split('.').pop() as string)};base64,${file}`,
          filename:importFilename
        },
        convertCLI: {
          operation: "convert",
          input: "uploadCLI",
          output_format: to
        },
        exportCLI: {
          operation: "export/url",
          input: "convertCLI",
          filename: exportFilename
        }
      }
    })

    // auth headers
    let headers:any={
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apikey}`
    }

    // send job
    let data = await fetch(`https://api.freeconvert.com/v1/process/jobs`,{
      method: "POST",
      headers: headers,
      body: task,
    })

    // get id
    let result:any = await data.json()
    let id:string = result.id
    let exportID = result.tasks[2].id
    headers={
      Authorization: `Bearer ${apikey}`
    }

    // wait for job
    await fetch(`https://api.freeconvert.com/v1/process/jobs/${id}/wait`,{
      method: "GET",
      headers: headers,
    })
    headers = {
      'Accept':'application/json',
      'Authorization':'Bearer '+apikey
    };
    let download = await fetch(`https://api.freeconvert.com/v1/process/tasks/${exportID}`,{
      method: "GET",
      headers: headers,
    })
    let downloadURL = (await download.json()).result.url

    // download file
    let fileData = await fetch(downloadURL)
    let fileBuffer = await fileData.buffer()

    // write file
    let filePath = filename.split("/")
    filePath.pop()
    writeFileSync(`${filePath.join("/")}/${exportFilename}`, fileBuffer)
    resolve()
  })
}