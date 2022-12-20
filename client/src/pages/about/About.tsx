import React, { FC } from 'react';
import './about.scss';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useTitle } from '../../hooks';

const About: FC = () => {
  useTitle('About');
  return (
    <div className={'aboutWrapper'}>
      <div className={'about'}>
        <h1>About</h1>
      </div>
    </div>
  );
};

export default About;
