import React, { FC, useEffect, useState } from 'react';
import './home.scss';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchPosts } from '../../store/reducers/posts/actionCreators';
import Sidebar from '../../components/sidebar/Sidebar';
import PostList from '../../components/postlist/PostList';
import Loader from '../../components/loader/Loader';
import LatestList from '../../components/latestlist/LatestList';

//
// import './postlist.scss';
import '../../components/postlist/postlist.scss';
import PostItem from '../../components/postlist/postitem/PostItem';
import { IPost } from '../../types/post-type';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
//
const Home: FC = () => {
  const { isLoading, error, posts, postsType, todayPosts } = useAppSelector(
    (state) => state.posts
  );
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [limitBlog, setLimitBlog] = useState(4);
  const [listCurrentPost, setlistCurrentPost] = useState<any>();

  const fetchMoreData = () => {
    setPage((prev: any) => prev + 1);
    console.log('page', page);
    console.log('listCurrentPost', listCurrentPost);

    setTimeout(() => {
      dispatch(fetchPosts({ type: postsType, page: page }));
    }, 500);
  };
  console.log('HOME POST', posts);

  console.log('listCurrentPost', listCurrentPost);
  useEffect(() => {
    dispatch(fetchPosts({ type: postsType, page: page }));
  }, [dispatch, postsType]);

  return (
    <div className={'home'}>
      <Sidebar homePage={true} />
      <div className={'homePosts'}>
        {/* {isLoading ? <Loader /> : <PostList error={error} posts={posts} />} */}
        {isLoading ? (
          <Loader />
        ) : (
          <div className={'postList'}>
            <InfiniteScroll
              dataLength={posts.length}
              next={fetchMoreData}
              hasMore={true}
              loader={<h4>Loading...</h4>}
            >
              {posts.map((post, index) => (
                <PostItem
                  key={post.id}
                  displayImage={index === index}
                  post={post}
                />
              ))}
              {/* {error ? (
              <div className={'errorFetching'}>Error fetching posts</div>
            ) : (
            )} */}
            </InfiniteScroll>
          </div>
        )}
      </div>
      <LatestList todayPosts={todayPosts} />
    </div>
  );
};

export default Home;
