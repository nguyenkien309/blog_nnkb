import React, { FC, useEffect, useState } from 'react';
import './postlist.scss';
import PostItem from './postitem/PostItem';
import { IPost } from '../../types/post-type';
import InfiniteScroll from 'react-infinite-scroll-component';

interface PostListProps {
  posts: IPost[];
  error: string;
}

const PostList: FC<PostListProps> = ({ posts, error }) => {
  console.log('DITME ', posts);

  const [size, setSize] = useState<number>(5);
  const [items, setItems] = useState<IPost[]>(posts.slice(0, size));
  const [hasMore, setHasMore] = useState<boolean>(true);
  const fetchMoreData = () => {
    setTimeout(() => {
      if (size >= posts.length) {
        setHasMore(false);
        return;
      }
      setItems(items.concat(Array.from({ length: 1 })));
      setSize((prev) => prev + 1);
    }, 1500);
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

    <div className={'postList'}>
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        scrollableTarget="postList"
        style={{ overflow: 'hidden' }}
      >
        {posts
          ?.map((post: any, index) => (
            <PostItem key={post?.id} displayImage={index === 0} post={post} />
          ))
          .slice(0, size)}
      </InfiniteScroll>
      {!hasMore && <div>hết post r thg loz </div>}
    </div>

    // <div></div>
  );
};

export default PostList;
