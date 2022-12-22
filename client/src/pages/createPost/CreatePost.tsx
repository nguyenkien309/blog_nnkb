import React, { FC, useEffect, useState } from 'react';
import './createpost.scss';
import FormGroup from '../../components/common/formGroup/FormGroup';
import FileUpload from '../../components/fileUpload/FileUpload';
import Button from '../../components/common/button/Button';
import { Editor } from 'react-draft-wysiwyg';
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useForm } from 'react-hook-form';
import PostService from '../../services/post-service';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useAppSelector, useTitle } from '../../hooks';
import { IPost } from '../../types/post-type';
import draftToHtml from 'draftjs-to-html';
import NotFound from '../404/NotFound';
import TagsSelect from '../../components/tagsSelect/TagsSelect';
import { ITag } from '../../types/tag-type';
import { current } from '@reduxjs/toolkit';
import axios from 'axios';
const CreatePost: FC = () => {
  const { postId } = useParams();
  const [file, setFile] = useState<any>(null);
  const { user, isAuth } = useAppSelector((state) => state.auth);
  const [currentPost, setCurrentPost] = useState<IPost>({} as any);
  const [currentPostTest, setCurrentPostTest] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);
  const navigate = useNavigate();
  useTitle(postId ? 'Edit' : 'Create');

  useEffect(() => {
    if (postId) {
      PostService.getById(Number(postId))
        .then(async (response) => {
          if (isAuth && response.data.user.id !== user.id) {
            setNotFound(true);
            return;
          }
          console.log('response.data.user.id ', response.data.user.id);
          console.log('user.id', user.id);
          setIsLoading(true);

          await setCurrentPost(response?.data);
          await setSelectedTags(response?.data?.tags);
          console.log('currentPost', currentPost);
          // console.log('isAuth', isAuth);
          // console.log('postId', postId);

          // console.log('currentPost RES DATA', response.data);
          // console.log('currentPost', currentPost);
          // console.log('selectedTags', selectedTags);
          // console.log('ditmemay', Object.keys(currentPost).length);

          setEditorState(
            EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(response?.data?.content).contentBlocks
              )
            )
          );
        })
        .catch((err) => setNotFound(true));
    }
    // console.log('currentPost', currentPost);
    // console.log('currentPost', currentPost);
  }, [postId, user, isAuth, isLoading]);

  const onSubmit = async (data: any) => {
    let response;
    const stringFromHtml = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    setIsLoading(true);
    try {
      if (postId) {
        response = await PostService.updatePost(
          data['Title'] === '' ? currentPost?.title : data['Title'],
          stringFromHtml,
          currentPost.id,
          file,
          selectedTags
        );
      } else {
        response = await PostService.createPost(
          file,
          data['Title'],
          stringFromHtml,
          user.id,
          selectedTags
        );
      }
      navigate(`/posts/${response.data.body.id}`);
      console.log('postsID CREATED', response.data);

      // navigate(`/v1/blog/${response.data.body.id}`);
      //   console.log('response', response.data.body.id);
    } catch (e: any) {
      const response = e.response?.data.message;
      if (Array.isArray(response)) setError(response[0]);
      else setError(response);
    } finally {
      setIsLoading(false);
    }
  };

  if (notFound) {
    return <NotFound />;
  }

  return (
    <div className={'createPost'}>
      <div className={'postInner'}>
        <h2>{postId ? 'Edit post' : 'Create new post'}</h2>
        <FileUpload
          defaultImageURL={
            Object.keys(currentPost).length > 0 ? currentPost?.blogImage : null
          }
          displayImage={true}
          handleFile={(file: File | undefined) => setFile(file)}
        />
        <FormGroup
          fieldName={'Title'}
          register={register}
          errors={errors}
          placeholder={'Enter title...'}
          isRequired={!postId}
          defaultValue={
            Object.keys(currentPost).length > 0 ? currentPost?.title : null
          }
        />
        <div className={'editor'}>
          <Editor
            editorState={editorState}
            toolbarClassName={'toolbarClassName'}
            wrapperClassName={'wrapperClassName'}
            editorClassName={'editorClassName'}
            onEditorStateChange={(state: any) => setEditorState(state)}
          />
        </div>
        {currentPost?.tags && (
          <TagsSelect tagsEdit={currentPost?.tags} setTags={setSelectedTags} />
        )}
        {!postId && <TagsSelect setTags={setSelectedTags} />}
        <div className={'createBottom'}>
          <div className={'createButton'}>
            <Button
              handleClick={handleSubmit(onSubmit)}
              text={postId ? 'Save' : 'Create'}
              progress={
                isLoading && (
                  <CircularProgress style={{ color: 'white' }} size={20} />
                )
              }
            />
          </div>
          {error && <div className={'alert danger'}>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
