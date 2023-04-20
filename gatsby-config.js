/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  plugins: [
    // Sources MDX from DFRNT data products via GraphQL (and from other GraphQL sources like TerminusCMS)
    {
      resolve: "@dfrnt/gatsby-source-graphql-nodes",
      options: {
        url: "https://dfrnt.com/api/hosted/RustyGearsInc/api/graphql/RustyGearsInc/website",
        graphqlConfig: {
          headers: {
            Authorization: `Token ${process.env.DFRNT_TOKEN}`,
          },
        },
        query: `{
          Blogpost {
            _id
            _type
            label
            statement {
              markdown
            }
            frontmatter {
              excerpt
              slug
              title
              publishDate
              updateDate
              imageList
              category {
                label
              }
              author {
                label
                href
                imageUrl
              }
              og {
                image
                title
                type
                url
              }
            }
          }
        }
        `,
    
        typeConfiguration: {
           "Blogpost": {
            typeNameOverride: "Blogpost",
            idField: "_id",
          },
        },
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `layouts`,
        path: `${__dirname}/src/layouts`,
      },
    },
    {
      resolve: `gatsby-mdx-remote`,
      options: {
        mdxNodeTypes: {
          "Blogpost": {
            mdxField: "data.statement.markdown",
            mdxFrontmatterField: "data.frontmatter",
            gatsbyImageClassName: "rounded-md",
            preprocessImages: true,
          }
        },
        frontmatterSharpRemoteImageUrlArrayField: "imageList",
      }
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
            },
          },
        ],
      },
    },
  ],
}
