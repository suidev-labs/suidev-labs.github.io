module.exports = {
  layout: "post.njk",
  tags: "posts",
  eleventyComputed: {
    permalink: data => {
      const date = new Date(data.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const slug = data.page.fileSlug;
      return `/${year}/${month}/${slug}/`;
    }
  }
};
