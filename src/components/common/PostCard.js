import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import { Tags } from '@tryghost/helpers-gatsby'
import { readingTime as readingTimeHelper } from '@tryghost/helpers'

const PostCard = ({ post }) => {
    const url = `/${post.frontmatter.slug}/`
    const readingTime = readingTimeHelper(post)
    console.log("POSTCARD -> ", post.frontmatter);
    
    return (
        <Link to={url} className="post-card">
            <header className="post-card-header">
                {post.frontmatter.feature_image &&
                    <div className="post-card-image" style={{
                        backgroundImage: `url(${post.frontmatter.feature_image})` ,
                    }}></div>}
                {/* {post.frontmatter.tags && <div className="post-card-tags"> <Tags post={post} visibility="public" autolink={false} /></div>} */}
                {post.frontmatter.featured && <span>Featured</span>}
                <h2 className="post-card-title">{post.frontmatter.title}</h2>
            </header>
            <section className="post-card-excerpt">{post.excerpt}</section>
            <footer className="post-card-footer">
                <div className="post-card-footer-left">
                    <div className="post-card-avatar">
                        {post.frontmatter.author ?
                            <img className="author-profile-image" src={post.frontmatter.author.frontmatter.profile_image} alt={post.frontmatter.author.frontmatter.name}/> :
                            <img className="default-avatar" src="/images/icons/avatar.svg" alt={post.frontmatter.author.frontmatter.name}/>
                        }
                    </div>
                    <span>{ post.frontmatter.author.frontmatter.name }</span>
                </div>
                <div className="post-card-footer-right">
                    <div>{readingTime}</div>
                </div>
            </footer>
        </Link>
    )
}

PostCard.propTypes = {
    post: PropTypes.shape({
        frontmatter : PropTypes.object.isRequired,
    }).isRequired,
}

export default PostCard
