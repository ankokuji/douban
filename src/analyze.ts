/// <reference path="../types/index.d.ts" />

import * as fs from "fs";
import * as path from "path";
import Immutable from "immutable";
import Table from "cli-table2";
import { prependListener } from "cluster";
import { STORAGE_PATH } from "./config";

const cuttedLength = 30;

/**
 * Read file and analyze content.
 *
 * @export
 * @param {string} filename
 * @param {string} [filterText]
 */
export function analyzeFile(filename: string, filterText?: string) {
  const file = fs.readFileSync(path.join(STORAGE_PATH, filename));
  const subjects: IDoubanSubjects[] = JSON.parse(file.toString());
  analyzeByMemory(subjects, filterText);
}


/**
 * Process data from douban in memory and print.
 *
 * @export
 * @param {IDoubanSubjects[]} subjects
 * @param {(string | undefined)} [filterText]
 */
export function analyzeByMemory(subjects: IDoubanSubjects[], filterText?: string | undefined) {
  const table = new Table({
    head: ["title", "rating", "year", "link"]
  });

  const sorted = subjects
    .filter(subject => {
      if (filterText) {
        return (subject.title as string).indexOf(filterText) >= 0;
      }
      else {
        return true;
      }
    })
    .map((subject) => {
      subject.original_title = getCuttedString(subject.original_title, cuttedLength);
      return subject;
    })
    .sort((pre, after) => {
      // 评分从高到低
      return -(pre.rating.average - after.rating.average);
    });
  sorted.forEach(subject => {
    // console.log(subject.title, subject.rating.average, subject.year);
    // console.log(subject.alt);
    table.push([
      subject.original_title,
      subject.rating.average,
      subject.year,
      subject.alt
    ]);
  });
  console.log(table.toString());
}

function getByteLen(val: string): number {
  var len = 0;
  for (var i = 0; i < val.length; i++) {
    var a = val.charAt(i);
    if (a.match(/[^\x00-\xff]/ig) != null) {
      len += 2;
    }
    else {
      len += 1;
    }
  }
  return len;
}

function getCuttedString(val: string, cuttedLength: number): string {
  var len = 0;
  for (var i = 0; i < val.length; i++) {
    var a = val.charAt(i);
    if (a.match(/[^\x00-\xff]/gi) != null) {
      len += 2;
    } else {
      len += 1;
    }

    if (len > cuttedLength) {
      val = val.slice(0, i + 1) + "...";
      break;
    }
  }
  return val;
}
