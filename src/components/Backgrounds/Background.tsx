import * as React from 'react';

interface IBackgroundProps {
}

const Background: React.FunctionComponent<IBackgroundProps> = (props) => {
  return <div className=' min-h-screen lg:flex lg:w-1/2 xl:w-2/3 2xwl:w-3/4 bg-contain bg-no-repeat bg-center'
  style={{backgroundImage: `url("../public/favicon.ico`}}></div>;
};

export default Background;
