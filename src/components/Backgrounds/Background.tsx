import * as React from 'react';

interface IBackgroundProps {
    image: string;
}

const Background: React.FunctionComponent<IBackgroundProps> = (props) => {
  const { image } = props;
    return <div className=' min-h-screen lg:flex lg:w-2/5 xl:w-2/5 2xwl:w-1/2 bg-contain bg-no-repeat bg-center'
  style={{backgroundImage: `url(${image})`}}></div>;
};

export default Background;
