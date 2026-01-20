const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  // Passthrough copy for assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  // Watch targets
  eleventyConfig.addWatchTarget("src/assets/");

  // Collections: All posts sorted by date (newest first)
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/**/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  // Collection: Categories - creates a collection for each unique category
  eleventyConfig.addCollection("categories", function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob("src/posts/**/*.md");
    const categories = {};

    posts.forEach(post => {
      const postCategories = post.data.categories || [];
      postCategories.forEach(category => {
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(post);
      });
    });

    // Sort posts within each category by date (newest first)
    Object.keys(categories).forEach(category => {
      categories[category].sort((a, b) => b.date - a.date);
    });

    return categories;
  });

  // Collection: Get list of all unique categories
  eleventyConfig.addCollection("categoryList", function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob("src/posts/**/*.md");
    const categorySet = new Set();

    posts.forEach(post => {
      const postCategories = post.data.categories || [];
      postCategories.forEach(category => categorySet.add(category));
    });

    return [...categorySet].sort();
  });

  // Collection: All tags
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob("src/posts/**/*.md");
    const tagSet = new Set();

    posts.forEach(post => {
      const postTags = post.data.tags || [];
      postTags.forEach(tag => {
        if (tag !== "posts") tagSet.add(tag);
      });
    });

    return [...tagSet].sort();
  });

  // Filters
  eleventyConfig.addFilter("dateDisplay", function(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  eleventyConfig.addFilter("dateISO", function(date) {
    return new Date(date).toISOString();
  });

  eleventyConfig.addFilter("dateRFC2822", function(date) {
    return new Date(date).toUTCString();
  });

  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });

  eleventyConfig.addFilter("excerpt", function(content, length = 200) {
    if (!content) return "";
    // Strip HTML tags and get plain text
    const plainText = content.replace(/<[^>]+>/g, '').replace(/\n+/g, ' ').trim();
    if (plainText.length <= length) return plainText;
    return plainText.substring(0, length).trim() + '...';
  });

  // Slugify filter for category URLs
  eleventyConfig.addFilter("slugify", function(str) {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  });

  // Get posts by category
  eleventyConfig.addFilter("getPostsByCategory", function(posts, category) {
    return posts.filter(post => {
      const categories = post.data.categories || [];
      return categories.includes(category);
    });
  });

  // Shortcodes
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Markdown options
  const markdownIt = require("markdown-it");
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });
  eleventyConfig.setLibrary("md", md);

  // Browser sync config
  eleventyConfig.setBrowserSyncConfig({
    files: ['_site/**/*'],
    open: true
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
