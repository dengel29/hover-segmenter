const Comlink = importScripts("./node_modules/comlink/dist/umd/comlink.js");
const dict = importScripts(
  "./node_modules/@iamtraction/google-translate/src/index.js"
);

const dictionary = {
  counter: 0,
  findTerm(word) {
    try {
      console.log("hey");
      const pp = dict.getByTraditional(word.trim());
      return pp;
    } catch (e) {
      console.log(e);
    }
  },
};

Comlink.expose(dictionary);
