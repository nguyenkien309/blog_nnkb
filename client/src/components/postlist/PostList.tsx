import React, { FC, useEffect, useState } from 'react';
import './postlist.scss';
import PostItem from './postitem/PostItem';
import { IPost } from '../../types/post-type';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { fetchPosts } from '../../store/reducers/posts/actionCreators';
import { useAppSelector } from '../../hooks';

interface PostListProps {
  posts: IPost[];
  error: string;
}

const PostList: FC<PostListProps> = ({ posts, error }) => {
  console.log('POSTLIST ', posts);
  const { isLoading, postsType, todayPosts } = useAppSelector(
    (state) => state.posts
  );
  const [size, setSize] = useState<number>(5);
  const [items, setItems] = useState<IPost[]>(posts.slice(0, size));
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [page, setCurrentPage] = useState(0);
  console.log([page]);

  const [limitBlog, setLimitBlog] = useState(3);

  const dispatch = useDispatch();
  // const fetchMoreData = () => {
  //   setTimeout(() => {
  //     if (size >= posts.length) {
  //       setHasMore(false);
  //       return;
  //     }

  //     setItems(items.concat(Array.from({ length: 1 })));
  //     setSize((prev) => prev + 1);
  //   }, 1500);
  // };

  const fetchMoreData = () => {
    setCurrentPage((prev: any) => prev + 1);
    console.log('page', page);
    console.log('limitBlog', limitBlog);

    setTimeout(() => {
      dispatch(fetchPosts({ type: postsType, page: page }));
    }, 1000);
  };

  console.log('items.length', items);
  useEffect(() => {}, [posts]);
  return (
    // <div className={'postList'}>
    //   {error ? (
    //     <div className={'errorFetching'}>Error fetching posts</div>
    //   ) : (
    //     posts.map((post, index) => (
    //       <PostItem key={post.id} displayImage={index === 0} post={post} />
    //     ))
    //   )}
    // </div>
    //

    <InfiniteScroll
      dataLength={posts.length}
      next={fetchMoreData}
      hasMore={true}
      loader={<h4>Loading...</h4>}
    >
      {error ? (
        <div className={'errorFetching'}>Error fetching posts</div>
      ) : (
        posts.map((post, index) => (
          <PostItem key={post.id} displayImage={index === 0} post={post} />
        ))
      )}
    </InfiniteScroll>

    // <div className={'postList'}>
    //   <InfiniteScroll
    //     dataLength={items.length}
    //     next={fetchMoreData}
    //     hasMore={hasMore}
    //     loader={<h4>Loading...</h4>}
    //     scrollableTarget="postList"
    //     style={{ overflow: 'hidden' }}
    //   >
    //     {posts
    //       ?.map((post: any, index) => (
    //         <PostItem key={post?.id} displayImage={index === 0} post={post} />
    //       ))
    //       .slice(0, size)}
    //   </InfiniteScroll>
    //   {!hasMore && <div>END POST</div>}
    // </div>
  );
};

export default PostList;
