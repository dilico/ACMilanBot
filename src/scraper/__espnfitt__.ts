import axios from "axios";

export default async function (page: string) {
  const URL = `https://www.espn.com/${page}`;

  const response = await axios.get(URL);

  const html = response.data;

  function findLastClosingBracketPosition(
    input: string,
    startingPosition: number
  ): number {
    let counter = 0;
    for (let i = startingPosition; i < input.length; i++) {
      if (input[i] === "{") {
        counter++;
      } else if (input[i] === "}") {
        counter--;
        if (counter === 0) {
          return i;
        }
      }
    }
    return -1; // If no matching closing bracket is found
  }

  const startingIndex = html.indexOf("window['__espnfitt__']={");
  const length = "window['__espnfitt__']=".length;

  const newIndex = startingIndex + length;

  const closingBracketPosition = findLastClosingBracketPosition(html, newIndex);

  const contents = html
    .substring(newIndex, closingBracketPosition + 1)
    .replace(/\n/g, " ");

  return JSON.parse(contents);
}
