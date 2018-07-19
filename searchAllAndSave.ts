const fs = require("fs");
const path = require("path");
const axios = require("axios");

import { axiosConfig } from "./config";

const count = 20;

const apiBase = "https://api.douban.com";

async function search(text, page = 0) {
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
    const {total, subjects} = await search(text, page);

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

async function searchAllAndSave(text: string, filename?: string) {
  if (!filename) {
    filename = text;
  }

  const searchTarget = text;

  const subjects = await getAllItem(searchTarget);

  const json = JSON.stringify(subjects);

  const targetPath = path.resolve("./" + filename + ".txt");

  fs.writeFileSync(targetPath, json);
}

export default searchAllAndSave;
