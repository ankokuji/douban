import searchAllAndSave from "./searchAllAndSave";
import { analyzeFile, analyzeByMemory } from "./analyze";
import { isMainThread } from "worker_threads";

/**
 * Search from douban server and print result.
 *
 * @export
 * @param {string} word
 * @param {string} [filter]
 */
export async function doubanMovie(word: string, filter?: string) {
  const subjects = await searchAllAndSave(word);
  analyzeByMemory(subjects, filter);
}

// Type for the argument structure provided by the "yargs" library.
export interface YArgsv {
  _: string[];
  [key: string]: any;
}

export function main(argv: YArgsv) {
  const args: string[] = argv._;
  let keyword: string;
  let filterWord: string | undefined = undefined;
  if(args.length < 1) {
    console.log("Usage: dbmovie key_word [filter_word]");
    return;
  } else if(args.length == 1) {
    keyword = args[0];
  } else {
    keyword = args[0];
    filterWord = args[1];
  }
  doubanMovie(keyword, filterWord);
}