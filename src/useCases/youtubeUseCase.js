// videoSearch.js

const { youtube } = require('scrape-youtube');
const scrapeYt = require("scrape-yt");
const nlp = require('compromise');
const { openaiUseCase } = require("../useCases/openAIUseCase")
const { analyzeKeywords } = require('../useCases/keywordAnalyzer');
async function searchVideos(query, precisionLevel) {
  try {
    const filteredTags = await getFilteredTags(query, precisionLevel);
    return filteredTags;
  } catch (error) {
    console.error('Error during search:', error.message);
    return [];
  }
}

async function getFilteredTags(query, precisionLevel) {
  const searchResults = await getSearchResults(query);
  const topVideos = getTopVideos(searchResults, searchResults.length);

  const titles = topVideos.map(video => video.title);

  const videoInfoList = await getVideoInformation(topVideos);

  const allTags = getAllTags(videoInfoList);
  const uniqueTags = getUniqueTags(allTags);

  const personNames = getPersonNames(uniqueTags);

  const keywords = filterPersonNames(uniqueTags, personNames);
  const keys = analyzeKeywords(keywords, query, precisionLevel);
  const tts = analyzeKeywords(titles, query, precisionLevel);

  return {
    keywords: keys,
    titles: tts
  };
}

async function getSearchResults(query) {
  const results = await youtube.search(query);

  return results;
}

function getTopVideos(searchResults, count) {
  const sortedVideos = searchResults.videos.sort((videoA, videoB) => videoB.views - videoA.views);
  return sortedVideos.slice(0, count);
}

async function getVideoInformation(videos) {
  return Promise.all(videos.map(async (video) => {
    return await getSingleVideoInformation(video.id);
  }));
}

function getAllTags(videos) {
  return videos.reduce((accumulator, video) => {
    if (video && video.tags) {
      accumulator.push(...video.tags);
    }
    return accumulator;
  }, []);
}

function getUniqueTags(allTags) {
  const uniqueTagsMap = {};
  return allTags.filter((tag) => {
    if (!uniqueTagsMap[tag]) {
      uniqueTagsMap[tag] = true;
      return true;
    }
    return false;
  });
}

function getPersonNames(tags) {
  return tags.filter(tag => isPersonName(tag));
}

function filterPersonNames(uniqueTags, personNames) {
  return uniqueTags.filter(tag => !personNames.includes(tag));
}

async function getSingleVideoInformation(videoId) {
  try {
    const videoInfo = await scrapeYt.getVideo(videoId);
    return videoInfo;
  } catch (error) {
    console.error('Error getting video information:', error);
    return null;
  }
}

function isPersonName(word) {
  const doc = nlp(word);
  return doc.people().out('array').length > 0;
}

module.exports = { searchVideos };
