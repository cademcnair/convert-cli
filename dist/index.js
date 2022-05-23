#! /usr/bin/env node
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
const path_1 = require("path");
const process_1 = require("process");
const fs_1 = require("fs");
const os_1 = require("os");
const figlet_1 = __importDefault(require("figlet"));
const gradient_string_1 = require("gradient-string");
const convert_1 = __importDefault(require("./convert"));
let args = process_1.argv.slice(2);
if (args[0] == `-c`) {
    // set api key
    if (!args[1]) {
        console.error(`Missing API key`);
        process.exit(1);
    }
    else {
        const apiKey = args[1];
        const configPath = `${(0, os_1.homedir)()}/.convert-cli-api-key`;
        (0, fs_1.writeFileSync)(configPath, apiKey);
        console.log(`API key saved to ${configPath}`);
        process.exit(0);
    }
}
else {
    console.clear();
    (0, figlet_1.default)(`convert-cli\n`, (err, data) => {
        // print rainbow text
        console.log(gradient_string_1.pastel.multiline(data));
        const to = args.pop();
        const files = args.map(arg => (0, path_1.join)((0, process_1.cwd)(), arg));
        const apikey = (0, fs_1.readFileSync)(`${(0, os_1.homedir)()}/.convert-cli-api-key`).toString();
        files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
            // convert all files
            yield (0, convert_1.default)((0, fs_1.readFileSync)(file).toString('base64url'), file, to, apikey);
        }));
    });
}
