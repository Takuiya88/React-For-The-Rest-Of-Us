import React, { useEffect, useState } from 'react';
import Page from './Page';
import { useParams, Link } from 'react-router-dom';
import Axios from 'axios';
import LoadingDotsIcon from './LoadingDotsIcon';
import ReactMarkdown from 'react-markdown';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import NotFound from './NotFound';

function ViewSinglePost() {
	const { id } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [post, setPost] = useState();
	console.log(post, 'this is post');

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();

		async function fetchPost() {
			try {
				const response = await Axios.get(`/post/${id}`, {
					cancelToken: ourRequest.token
				});
				setPost(response.data);
				console.table(response.data);
				setIsLoading(false);
			} catch (e) {
				console.log('There was a problem or the request was cancelled.');
			}
		}

		fetchPost();
		return () => {
			ourRequest.cancel();
		};
	}, []);

	if (!isLoading && !post) {
		return <NotFound />;
	}

	if (isLoading)
		return (
			<Page title="...">
				<LoadingDotsIcon />
			</Page>
		);

	const date = new Date(post.createdDate);
	const dateFormatted = `${
		date.getMonth() + 1
	}/${date.getDate()}/${date.getFullYear()}`;

	return (
		<Page title={post.title}>
			<div className="container container--narrow py-md-5">
				<div className="d-flex justify-content-between">
					<h2>{post.title}</h2>
					<span className="pt-2">
						<Link
							to={`/post/${post._id}/edit`}
							data-tooltip-content="Edit"
							data-tooltip-id="edit"
							className="text-primary mr-2"
						>
							<i className="fas fa-edit"></i>
						</Link>
						<ReactTooltip id="edit" className="tooltip" />{' '}
						<a
							data-tooltip-content="Delete"
							data-tooltip-id="delete"
							className="delete-post-button text-danger"
						>
							<i className="fas fa-trash"></i>
						</a>
						<ReactTooltip id="delete" className="custom-tooltip" />
					</span>
				</div>

				<p className="text-muted small mb-4">
					<Link to={`/profile/${post.author.username}`}>
						<img className="avatar-tiny" src={post.author.avatar} />
					</Link>
					Posted by{' '}
					<Link to={`/profile/${post.author.username}`}>
						${post.author.username}
					</Link>{' '}
					{dateFormatted}
				</p>

				<div className="body-content">
					<ReactMarkdown
						children={post.body}
						allowedElements={[
							'p',
							'br',
							'strong',
							'em',
							'h1',
							'h2',
							'h3',
							'h4',
							'h5',
							'h6',
							'ul',
							'ol',
							'li'
						]}
					/>
				</div>
			</div>
		</Page>
	);
}

export default ViewSinglePost;
