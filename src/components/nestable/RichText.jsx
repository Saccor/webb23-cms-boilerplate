import Link from 'next/link';
import React from 'react';
import { 
  render, 
  MARK_LINK,
  MARK_CODE,
  NODE_HR, 
  NODE_HEADING, 
  NODE_CODEBLOCK, 
  NODE_LI, 
  NODE_UL, 
  NODE_OL, 
  NODE_PARAGRAPH,
} from 'storyblok-rich-text-react-renderer';

export default function RichTextDefault({ blok }) {
  const { richtext, ...rest } = blok;

  const resolveNodeHeading = (children, props) => {
    return <h1>{children}</h1>;
  }
  
  const resolveNodeUL = (children) => {
    return <ul className="list-disc ml-4">{children}</ul>;
  }
  
  const resolveNodeOL = (children) => {
    return <ol className="list-decimal ml-4">{children}</ol>;
  }
  
  const resolveNodeLI = (children) => {
    return <li className="mb-1">{children}</li>;
  }
  
  const resolveMarkLink = (children, props) => {
    const { linktype, href } = props;
    const linkClassNames = 'font-bold underline';
    
    if (linktype === 'email') {
      return <a className={linkClassNames} href={`mailto:${href}`}>{children}</a>;
    }
    if (href.match(/^(https?:)?\/\//)) {
      return <a className={linkClassNames} href={href} target={'_blank'}>{children}</a>;
    }
    return <Link className={linkClassNames} href={href}>{children}</Link>;
  }
  
  const resolveNodeParagraph = (children) => {
    return <p>{children}</p>;
  }

  const resolveMarkCode = (children) => {
    return <code className="bg-gray-200 px-2 py-1 rounded">{children}</code>;
  }
  
  const resolveNodeCodeBlock = (children) => {
    return <pre className="bg-gray-100 p-4 rounded-md"><code>{children}</code></pre>;
  }

  const resolvers = {
    markResolvers: {
      [MARK_LINK]: resolveMarkLink,
      [MARK_CODE]: resolveMarkCode,
    },
    nodeResolvers: {
      [NODE_HEADING]: resolveNodeHeading,
      [NODE_CODEBLOCK]: resolveNodeCodeBlock,
      [NODE_UL]: resolveNodeUL,
      [NODE_OL]: resolveNodeOL,
      [NODE_LI]: resolveNodeLI,
      [NODE_PARAGRAPH]: resolveNodeParagraph,
      [NODE_HR]: () => <div className="mt-8 mb-8"><hr className="border-t-2 border-t-gray-400" /></div>,
    },
    blokResolvers: {
     //Connect other components here if needed
    },
  };

  const renderedRichText = render(richtext, resolvers);

  return (
    <div {...rest}>
      {renderedRichText}
    </div>
  );
}
