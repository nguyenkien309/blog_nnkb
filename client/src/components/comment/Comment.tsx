import React, { FC } from 'react';
import './comment.scss';
import { IComment } from '../../types/comment-type';
import { formatDate } from '../../helpers';

interface CommentProps {
  comment: IComment;
}

const Comment: FC<CommentProps> = ({ comment }) => {
  console.log('comment data ', comment);

  return (
    <div className={'comment'}>
      <img src={comment?.user?.avatar} alt="avatar" />
      <div className={'commentAuthor'}>
        <span className={'commentAuthorName'}>
          {comment?.user?.name} &emsp;
          {/* {comment.user.firstName} {comment.user.lastName} •{' '} */}
          <span className={'commentDate'}>
            {/* {formatDate(comment.dateAndTimePublish)} */}
            {formatDate(comment?.createdAt)}
          </span>
        </span>
        <div className={'commentText'}>{comment?.context}</div>
      </div>
    </div>
  );
};

export default Comment;
