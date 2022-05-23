"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const mime_types_1 = require("mime-types");
const fs_1 = require("fs");
function default_1(file, filename, to, apikey) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let importFilename = filename.split("/").pop();
        let exportFilename = `${importFilename.split('.').slice(0, -1).join('.')}.${to}`;
        // create job
        let task = JSON.stringify({
            tag: "convert-cli",
            tasks: {
                uploadCLI: {
                    operation: "import/base64",
                    file: `data:${(0, mime_types_1.lookup)(importFilename.split('.').pop())};base64,${file}`,
                    filename: importFilename
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
        });
        // auth headers
        let headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${apikey}`
        };
        // send job
        let data = yield (0, node_fetch_1.default)(`https://api.freeconvert.com/v1/process/jobs`, {
            method: "POST",
            headers: headers,
            body: task,
        });
        // get id
        let result = yield data.json();
        let id = result.id;
        let exportID = result.tasks[2].id;
        headers = {
            Authorization: `Bearer ${apikey}`
        };
        // wait for job
        yield (0, node_fetch_1.default)(`https://api.freeconvert.com/v1/process/jobs/${id}/wait`, {
            method: "GET",
            headers: headers,
        });
        headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + apikey
        };
        let download = yield (0, node_fetch_1.default)(`https://api.freeconvert.com/v1/process/tasks/${exportID}`, {
            method: "GET",
            headers: headers,
        });
        let downloadURL = (yield download.json()).result.url;
        // download file
        let fileData = yield (0, node_fetch_1.default)(downloadURL);
        let fileBuffer = yield fileData.buffer();
        // write file
        let filePath = filename.split("/");
        filePath.pop();
        (0, fs_1.writeFileSync)(`${filePath.join("/")}/${exportFilename}`, fileBuffer);
        resolve();
    }));
}
exports.default = default_1;
