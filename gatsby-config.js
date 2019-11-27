const path = require(`path`)
const proxy = require("http-proxy-middleware")

const config = require(`./src/utils/siteConfig`)
const generateRSSFeed = require(`./src/utils/rss/generate-feed`)

let ghostConfig

try {
    ghostConfig = require(`./.ghost`)
} catch (e) {
    ghostConfig = {
        production: {
            apiUrl: process.env.GHOST_API_URL,
            contentApiKey: process.env.GHOST_CONTENT_API_KEY,
        },
    }
} finally {
    const { apiUrl, contentApiKey } = process.env.NODE_ENV === `development` ? ghostConfig.development : ghostConfig.production

    if (!apiUrl || !contentApiKey || contentApiKey.match(/<key>/)) {
        throw new Error(`GHOST_API_URL and GHOST_CONTENT_API_KEY are required to build. Check the README.`) // eslint-disable-line
    }
}

/**
* This is the place where you can tell Gatsby which plugins to use
* and set them up the way you want.
*
* Further info 👉🏼 https://www.gatsbyjs.org/docs/gatsby-config/
*
*/
module.exports = {
    siteMetadata: {
        siteUrl: config.siteUrl,
        title: config.siteTitleMeta,
        description: config.siteDescriptionMeta,
    },
    mapping: {
        "MarkdownRemark.frontmatter.tags": `MarkdownRemark.frontmatter.tag_id`,
        "MarkdownRemark.frontmatter.author": `MarkdownRemark.frontmatter.author_id`,
    },
    plugins: [
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `posts`),
                name: `posts`,
            },
        },
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 740,
                            quality: 90,
                            withWebp: true,
                        },
                    },
                    {
                        resolve: `gatsby-remark-prismjs`,
                        options: {
                            classPrefix: `language-`,
                            inlineCodeMarker: null,
                            aliases: {},
                            showLineNumbers: false,
                            noInlineHighlight: false,
                        },
                    },
                    {
                        resolve: `gatsby-remark-external-links`,
                        options: {
                            target: `_blank`,
                            rel: null,
                        },
                    },
                ],
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `tags`),
                name: `tags`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `authors`),
                name: `authors`,
            },
        },
        /**
         *  Content Plugins
         */
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `pages`),
                name: `pages`,
            },
        },
        // Setup for optimised images.
        // See https://www.gatsbyjs.org/packages/gatsby-image/
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `images`),
                name: `images`,
            },
        },
        {
            resolve: `gatsby-source-ghost`,
            options:
                process.env.NODE_ENV === `development`
                    ? ghostConfig.development
                    : ghostConfig.production,
        },
        /**
         *  Utility Plugins
         */
        {
            resolve: `gatsby-plugin-ghost-manifest`,
            options: {
                short_name: config.shortTitle,
                start_url: `/`,
                background_color: config.backgroundColor,
                theme_color: config.themeColor,
                display: `minimal-ui`,
                icon: `static/${config.siteIcon}`,
                name: config.siteTitleMeta,
                description: config.siteDescriptionMeta,
            },
        },
        {
            resolve: `gatsby-plugin-feed`,
            options: {
                query: `
                {
                    site {
                      siteMetadata {
                        title
                        description
                        siteUrl
                        site_url: siteUrl
                      }
                    }
                  }
              `,
                feeds: [generateRSSFeed(config)],
            },
        },
        {
            resolve: `gatsby-plugin-advanced-sitemap`,
            options: {
                query: `
                {
                    allPosts: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/posts/"}}) {
                      edges: nodes {
                        node: frontmatter {
                          slug
                          updated_at
                          id:slug
                        }
                      }
                    }
                    allAuthors: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/authors/"}}) {
                      edges: nodes {
                        id
                        node: frontmatter {
                          slug
                          updated_at
                          id:slug
                        }
                      }
                    }
                    allTags: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/tags/"}}) {
                      edges: nodes {
                        id
                        node: frontmatter {
                          slug
                          updated_at
                          id:slug
                        }
                      }
                    }
                  }
                  `,
                mapping: {
                    allPosts: {
                        sitemap: `posts`,
                    },
                    allAuthors: {
                        sitemap: `authors`,
                    },
                    allTags: {
                        sitemap: `tags`,
                    },
                },
                exclude: [
                    `/dev-404-page`,
                    `/404`,
                    `/404.html`,
                    `/offline-plugin-app-shell-fallback`,
                ],
                createLinkInHead: true,
            },
        },
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                trackingId: "UA-151385213-1",
            }
        },
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-force-trailing-slashes`,
    ],
    developMiddleware: app => {
        app.use(
            "/.netlify/functions/",
            proxy({
                target: "http://localhost:9000",
                pathRewrite: {
                    "/.netlify/functions/": "",
                },
            })
        )
    },
}
