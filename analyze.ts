import * as fs from "fs";
import { prependListener } from "cluster";

export default function analyze(filename: string) {

  const file = fs.readFileSync(filename);

  const subjects: any[] = JSON.parse(file.toString());

  const sorted = subjects.sort((pre, after) => {

    // 评分从高到低
    return -(pre.rating.average - after.rating.average);
  })

  sorted.forEach((subject) => {

    console.log(subject.title, subject.rating.average);
  })

}

analyze("xiaojin.txt")
