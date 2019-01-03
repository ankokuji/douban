import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import { axiosConfig, STORAGE_PATH } from "./config";

// Global config
const count = 20;
const apiBase = "https://api.douban.com";

/**
 * Fetch douban api.
 *
 * @param {string} text
 * @param {number} [page=0]
 * @returns
 */
async function fetchSearchApi(text: string, page = 0) {
  const searchPath = `/v2/movie/search?q=${text}&start=${page * 20}`;
  const questPath = encodeURI(apiBase + searchPath);
  try {
    const res = await axios.get(questPath, axiosConfig);
    const data = res.data;
    return {
      total: data.total,
      subjects: data.subjects
    };
  } catch (e) {
    debugger;
    return {
      total: 0,
      subjects: []
    };
  }
}

async function getAllItem(text: string) {
  let page = 0;
  let totalCount = 1;
  let res: any[] = [];
  while (page * count < totalCount) {
    const {total, subjects} = await fetchSearchApi(text, page);
    if (totalCount === 1) {
      totalCount = total;
    }
    res = res.concat(subjects);
    page++;
  }

  if (totalCount === res.length) {
    console.log(`获取所有"${text}"搜索结果${totalCount}条成功!!!`);
  } else {
    console.log(
      `所有"${text}"搜索结果有${totalCount}条，获取到${res.length}条`
    );
  }

  return res;
}

/**
 * Search and return all results.
 *
 * @param {string} text Search key word.
 * @param {string} [filename]
 */
async function searchAllAndSave(text: string, filename?: string): Promise<any> {
  const searchTarget = text;
  const subjects = await getAllItem(searchTarget);
  // If filename valid then wirte data to file.
  if(filename) {
    const json = JSON.stringify(subjects);
    const targetPath = path.join(STORAGE_PATH, "./" + filename + ".txt");
    if(!fs.existsSync(STORAGE_PATH)) {
      fs.mkdirSync(STORAGE_PATH);
    }
    fs.writeFileSync(targetPath, json);
  }
  return subjects;
}

export default searchAllAndSave;
