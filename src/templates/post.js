import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { Layout } from '../components/common'
import { MetaData } from '../components/common/meta'

/**
* Single post view (/:slug)
*
* This file renders a single post and loads all the content.
*
*/
const Post = ({ data, location }) => {
    console.log("post", data, location);
    const post = data.markdownRemark
    
    return (
        <>
            <MetaData data={data} location={location} type="article" />
            <Layout>
                <div className="container">
                    <article className="content">
                        <header class="post-full-header">
                            <div class="post-full-meta">
                                <time
                                    class="post-full-meta-date"
                                    datetime="2019-01-09"
                                >
                                    9 January 2019
                                </time>
                                <span class="date-divider">/</span>{" "}
                                <a href="/tag/new/">New</a>
                            </div>
                            <h1 class="post-full-title js-foating-header-trigger js-no-widows">
                               {post.frontmatter.title}
                            </h1>
                        </header>
                        {post.frontmatter.feature_image ? (
                            <figure className="post-feature-image">
                                <img
                                    src={post.frontmatter.feature_image}
                                    alt={post.frontmatter.title}
                                />
                            </figure>
                        ) : null}
                        <section className="post-full-content">
                            {/* <h1 className="content-title">
                                {post.frontmatter.title}
                            </h1> */}

                            {/* The main post content */}
                            <section
                                className="content-body load-external-scripts"
                                dangerouslySetInnerHTML={{
                                    __html: post.html
                                }}
                            />
                        </section>
                    </article>
                </div>
            </Layout>
        </>
    );
}

Post.propTypes = {
    data: PropTypes.shape({
        markdownRemark: PropTypes.shape({
            excerpt: PropTypes.string.isRequired
        }).isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
}

export default Post

// export const postQuery = graphql`
//     query($slug: String!) {
//         ghostPost(slug: { eq: $slug }) {
//             ...GhostPostFields
//         }
//     }
// `
export const postQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        feature_image
        author {
            frontmatter {
                name
                profile_image
                twitter
                facebook
                website
            }
        }
        meta_description
        published_at
      }
      excerpt
    }
  }
`