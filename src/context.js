import { readFileSync, existsSync, writeFileSync } from "fs";


const SAVEFILE = "./data/context.json";


// LOAD CONTEXT
let text = "";
if (existsSync(SAVEFILE)) {
	text = readFileSync(SAVEFILE);
}


/**
 * @type {{
 *	warns:{[key:string]: {value: string, date: string}[]}
 * }}
 */
export const context = (text && JSON.parse(text)) || {
	warns: {

	}
};
console.log(context);
export async function saveContext() {
	const text = JSON.stringify(context);
	writeFileSync(SAVEFILE, text);
}