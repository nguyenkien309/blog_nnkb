import React, { useEffect, useState } from 'react';
import './post.scss';
import LatestList from '../../components/latestlist/LatestList';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Comment from '../../components/comment/Comment';
import CommentForm from '../../components/commentForm/CommentForm';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useAppSelector, useTitle } from '../../hooks';
import { formatDate } from '../../helpers';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModalWindow from '../../components/modalWindow/ModalWindow';
import LazyLoad from 'react-lazyload';
import { IPost } from '../../types/post-type';
import PostService from '../../services/post-service';
import NotFound from '../404/NotFound';
import { IComment } from '../../types/comment-type';
import Loader from '../../components/loader/Loader';
import EditPostButtons from '../../components/editPostButtonGroup/EditPostButtons';
import TagChip from '../../components/tagChip/tagChip';

const Post = () => {
  const [fetchedTodayPosts, setFetchedTodayPosts] = useState<IPost[]>([]);
  const [post, setPost] = useState<IPost>({} as IPost);
  const [error, setError] = useState('');
  const { todayPosts } = useAppSelector((state) => state.posts);
  const { user, isAuth } = useAppSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const { postId } = useParams();
  const [likedPost, setLikedPost] = useState(Boolean);
  useTitle(post.title);

  useEffect(() => {
    // console.log('user', user.id);

    const getPost = async () => {
      try {
        const fetchedPost = await PostService.getById(Number(postId));
        const getUserLike = await PostService.getUserLikeBlog(user.id, post.id);
        console.log('getUserLikeBlog', getUserLike.data);
        if (getUserLike.data == true) {
          setLikedPost(true);
        } else {
          setLikedPost(false);
        }
        // const response = await PostService.likePost(user.id, post.id);
        // console.log('POST NUMLKIKE', fetchedPost.data.numLike);

        if (todayPosts.length === 0) {
          const posts = await PostService.getPosts('blogs-lastest');
          setFetchedTodayPosts(posts.data.slice(0, 5));
        }
        setPost(fetchedPost.data);
      } catch (e: any) {
        setError(e.response.data.message);
      }
    };
    getPost();
  }, [postId, todayPosts.length, likedPost]);

  const addComment = (comment: IComment) => {
    setPost((prev) => ({
      ...prev,
      comments: [comment].concat(prev.comments),
    }));
  };

  const likePost = async () => {
    if (!isAuth) {
      setShowModal(true);
      return;
    }
    try {
      const response = await PostService.likePost(user.id, post.id);

      if (response.data.like == true) {
        console.log('LIKED');
        setLikedPost(response.data.like);
      } else {
        console.log('UNLIKED');
        setLikedPost(response.data.like);
        setPost((prev) => ({
          ...prev,
          userLikes: prev.userLikes.concat([response.data]),
        }));
        console.log('POST HERE', post);
      }
    } catch (e: any) {
      console.log('Error liking post', e);
    }
  };
  // const likePost = async () => {
  //   if (!isAuth) {
  //     setShowModal(true);
  //     return;
  //   }
  //   try {
  //     const response = await PostService.likePost(user?.id, post?.id);
  //     if (response.data.like == false) {
  //       setPost((prev) => ({
  //         ...prev,
  //         userLikes: prev.userLikes.concat([response.data]),
  //         likedPost: true,
  //       }));
  //     } else {
  //       setPost((prev) => ({
  //         ...prev,
  //         userLikes: prev.userLikes.concat([response.data]),
  //       }));
  //     }

  //     const test = post.userLikes.find((like) => like?.user?.id === 7);
  //     console.log('USER LIKED ID', test);
  //     console.log('GET CURRENT USER ', user.id);

  //     console.log('response from postLike', response.data.like);
  //     console.log('post from postLike', post);
  //   } catch (e: any) {
  //     console.log('Error liking post', e);
  //   }
  // };

  if (error) {
    return <NotFound />;
  }

  if (Object.keys(post).length === 0) {
    return <Loader />;
  }

  return (
    <div className={'postWrapper'}>
      <ModalWindow showModal={showModal} setShowModal={setShowModal} />
      <div className={'postInner'}>
        <div className={'postDescription'}>
          <img src={`${post.blogImage}`} alt="postPicture" />
          <Link to={'/'} className={'link'}>
            <button className={'back'}>
              <KeyboardBackspaceIcon className={'backIcon'} />
              <span>Home</span>
            </button>
          </Link>
          <div className={'postInfo'}>
            <div className={'postInfoWrapper'}>
              <div className={'author'}>
                <LazyLoad>
                  <img src={post?.user.avatar} alt="postPicture" />
                </LazyLoad>

                <div className={'authorDetails'}>
                  <span className={'name'}>
                    {post?.user?.name}
                    {/* {post?.user?.firstName} {post.user.lastName} */}
                  </span>
                  <span className={'date'}>
                    {formatDate(post.dateAndTimePublish)}
                  </span>
                </div>
              </div>
              {user?.id === post.user.id && (
                <EditPostButtons postPage={true} post={post} />
              )}
            </div>

            <h1>{post.title}</h1>
          </div>
          <div className={'postPageTags'}>
            {post.tags.map((tag) => (
              <TagChip key={tag.id} tag={tag} />
            ))}
          </div>
          <div
            className={'postText'}
            dangerouslySetInnerHTML={{
              __html: post?.content?.replace(/\n/g, '<br />'),
            }}
          />
          <div className={'postActionsInfo'}>
            <div className={'postLike'}>
              {/* like POST */}
              {/* {post.user} */}
              {/* {post.userLikes.find((like) => like.user.id === user.id) ? (
                <FavoriteIcon onClick={likePost} className={'liked'} />
              ) : (
                <FavoriteBorderIcon
                  onClick={likePost}
                  className={'postActionsIcon like'}
                />
              )} */}
              {likedPost && (
                <div>
                  <FavoriteIcon onClick={likePost} className={'liked'} />
                </div>
              )}
              {!likedPost && (
                <FavoriteBorderIcon
                  onClick={likePost}
                  className={'postActionsIcon like'}
                />
              )}
              {/* {post.userLikes.find((like) => like?.user?.id === user?.id) ? (
                <FavoriteIcon onClick={likePost} className={'liked'} />
              ) : (
                <FavoriteBorderIcon
                  onClick={likePost}
                  className={'postActionsIcon like'}
                />
              )} */}

              {/* <span>{post.userLikes.length}</span> */}
              <span>{post.numLike}</span>
            </div>
            <div className={'postLike'}>
              <ChatBubbleOutlineIcon className={'postActionsIcon'} />
              <span>{post.comments.length}</span>
            </div>
          </div>
        </div>
        <div className={'postComments'}>
          <h2>Comments</h2>
          <CommentForm addComment={addComment} postId={post.id} />
          <div className={'commentsList'}>
            {post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))
            ) : (
              <div className={'noComments'}>No comments yet</div>
            )}
          </div>
        </div>
      </div>
      <LatestList
        todayPosts={todayPosts.length > 0 ? todayPosts : fetchedTodayPosts}
      />
    </div>
  );
};
export default Post;
