// keywordAnalyzer.js

const natural = require('natural');
const sw = require('stopword');

function analyzeKeywords(wordList, word, precisionLevel) {
    const filteredWords = sw.removeStopwords(wordList.map(word => word.toLowerCase()), natural.stopwords);

    const resultWords = filteredWords.filter(candidate => natural.JaroWinklerDistance(candidate, word) >= precisionLevel);

    // Filtra las palabras que consisten en más de dos palabras
    const filteredResults = resultWords.filter(result => result.split(' ').length >= 2);

    const uniqueResultWords = [...new Set(filteredResults)];

    return uniqueResultWords;
}
module.exports = { analyzeKeywords };
