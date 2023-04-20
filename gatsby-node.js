

const path = require('path')

exports.createPages = async ({ graphql, actions, reporter, getNode }) => {
  const { createPage, createNode } = actions;
  const result = await graphql(`
    query {
      allBlogpost {
        nodes {
          childMdx {
            id
            markdownImageList {
              childImageSharp {
                gatsbyImageData
              }
              publicURL
            }
            imageList {
              childImageSharp {
                gatsbyImageData
              }
              publicURL
            }
            parent {
              id
            }
            internal {
              contentFilePath
            }
            frontmatter {
              slug
              imageList
              title
            }
          }
        }
      }
    }
  `);

  result.data.allBlogpost.nodes.map(node => node.childMdx).forEach(node => {
    const postTemplate = path.resolve(`./src/layouts/page.jsx`);

    createPage({
      path: `/${(node?.frontmatter).slug}`,
      component: `${postTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      // component: path.resolve(`./src/layouts/page.jsx?__contentFilePath=${node?.internal.contentFilePath}`),
      // component: node?.internal.contentFilePath,
      // Random owner Node ID name
      ownerNodeId: node.id,
      // The context is passed as props to the component as well
      // as into the component's GraphQL query.
      context: {
        ...node,
      },
    });
  })
};
