export function isEnglish(str: string): boolean {
  const enRegex = new RegExp(/^[a-zA-Z'"\s]+$/, "g");
  if (enRegex.test(str)) {
    return true;
  }
  return false;
}

export const isStringLengthSimilar = function (
  strings: string[],
  tolerance: number
): boolean {
  const lengths = strings.map((s) => s.length);
  const avg = lengths.reduce((acc, curr) => acc + curr, 0) / lengths.length;
  const maxDiff = avg * tolerance;
  const max = Math.max(...lengths);
  const min = Math.min(...lengths);
  return max - min <= maxDiff;
};

export const createEqualLengthStrArray = function (
  words: string,
  exSplitCount: number
): string[] {
  var regex = /「.*?」/;
  var matchWords = words.match(regex);
  if (matchWords) {
    for (const matchWord of matchWords) {
      words = words.replace(regex, matchWord.replaceAll(" ", ""));
    }
  }
  var regex = /「.*?$/;
  var matchWords = words.match(regex);
  if (matchWords) {
    for (const matchWord of matchWords) {
      words = words.replace(regex, matchWord.replaceAll(" ", ""));
    }
  }
  var regex = /^.*?」/;
  var matchWords = words.match(regex);
  if (matchWords) {
    for (const matchWord of matchWords) {
      words = words.replace(regex, matchWord.replaceAll(" ", ""));
    }
  }
  const length = words.length / exSplitCount;
  const wordsArr = words.split(" ");
  const result: string[] = [];
  let currentStr = "";
  let currentLength = 0;

  for (let i = 0; i < wordsArr.length; i++) {
    const word = wordsArr[i];
    if (currentLength + word.length > length && currentStr.length !== 1) {
      if (currentStr.trim().padEnd(length, "") !== "") {
        result.push(currentStr.trim().padEnd(length, ""));
      }
      currentStr = "";
      currentLength = 0;
    }

    if (isEnglish(word)) {
      currentStr += word + " ";
    } else {
      currentStr += word;
    }
    currentLength += word.length + 1;
  }

  if (currentStr.trim().length > 0) {
    if (currentStr.trim().padEnd(length, "").length === 1) {
      result[result.length - 1] = result[result.length - 1].concat(
        currentStr.trim().padEnd(length, "")
      );
    } else if (currentStr.trim().padEnd(length, "") !== "") {
      result.push(currentStr.trim().padEnd(length, ""));
    }
  }
  return result;
};
