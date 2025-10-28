import React from 'react';
import styled from '@emotion/styled';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkSmartyPants from 'remark-smartypants';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

// Component to handle highlighting
const HighlightedContent = ({ children, accentColor, bgColor }) => {
  if (typeof children !== 'string') return children;
  
  const parts = children.split(/(==.*?==)/);
  return (
    <>
      {parts.map((part, idx) => {
        if (part && part.startsWith('==') && part.endsWith('==')) {
          return (
            <mark key={idx} style={{
              background: accentColor,
              color: bgColor,
              padding: '0.2em 0.4em',
              borderRadius: '3px',
              fontWeight: 600,
            }}>
              {part.slice(2, -2)}
            </mark>
          );
        }
        return part;
      })}
    </>
  );
};

const PreviewWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ bgColor }) => bgColor};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  width: 500px;
  aspect-ratio: 1/1;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const PreviewContent = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  flex-grow: 1;
  overflow: hidden;
  color: ${({ textColor }) => textColor};
  font-family: ${({ theme }) => theme.fonts.primary};
  line-height: 1.6;
  display: flex;
  flex-direction: ${({ imagePosition }) =>
    ['left', 'right'].includes(imagePosition) ? 'row' : 'column'};
  gap: ${({ imagePosition, theme }) =>
    ['left', 'right'].includes(imagePosition) ? theme.spacing.lg : '0.5rem'};
  
  /* Hide scrollbars while keeping scroll functionality */
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.white};
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    line-height: 1.25;
  }
  
  h1 { font-size: 2em; }
  h2 { font-size: 1.75em; }
  h3 { font-size: 1.5em; }
  
  p {
    margin: 1em 0;
  }
  
  ul, ol {
    margin: 1em 0;
    padding-left: 1.5em;
  }
  
  li {
    margin: 0.5em 0;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  
  code {
    background: rgba(100, 255, 218, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: ${({ theme }) => theme.fonts.monospace};
    font-size: 0.9em;
  }
  
  pre {
    background: #1e1e1e !important;
    border-radius: 8px;
    padding: 1em !important;
    margin: 1em 0;
    overflow-x: auto;
    
    code {
      background: none !important;
      padding: 0 !important;
      color: #abb2bf;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    }
  }
  
  blockquote {
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
    margin: 1.5em 0;
    padding: 0.5em 1em;
    background: rgba(100, 255, 218, 0.05);
    color: ${({ theme }) => theme.colors.textSecondary};
    font-style: italic;
  }
  
  img {
    max-width: 100%;
    border-radius: 4px;
    margin: 1em 0;
  }
  
  mark {
    background: ${({ accentColor }) => accentColor};
    color: ${({ bgColor }) => bgColor};
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-weight: 600;
  }
  
  .hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: ${({ imagePosition }) =>
    ['left', 'right'].includes(imagePosition) ? '40%' : '100%'};
  max-width: ${({ imagePosition }) =>
    ['left', 'right'].includes(imagePosition) ? '45%' : '100%'};
  flex-shrink: 0;
  overflow-y: ${({ imagePosition }) =>
    ['left', 'right'].includes(imagePosition) ? 'auto' : 'visible'};
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 4px;
  display: block;
`;

const TextContent = styled.div`
  flex: 1;
  overflow: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: ${({ verticalAlign }) => {
    switch (verticalAlign) {
      case 'middle':
        return 'center';
      case 'bottom':
        return 'flex-end';
      default:
        return 'flex-start';
    }
  }};
  align-items: stretch;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  & > * {
    width: 100%;
  }

  & > *:first-of-type {
    margin-top: 0 !important;
  }

  & > *:last-of-type {
    margin-bottom: 0 !important;
  }
`;

const themeStyles = {
  default: {
    background: '#0a192f',
    text: '#ccd6f6',
    accent: '#64ffda',
  },
  dark: {
    background: '#0d0d0d',
    text: '#e0e0e0',
    accent: '#00d9ff',
  },
  light: {
    background: '#f5f5f5',
    text: '#1a1a1a',
    accent: '#0066cc',
  },
  forest: {
    background: '#1a3a2a',
    text: '#e8f4f0',
    accent: '#4ade80',
  },
  sunset: {
    background: '#2d1b1b',
    text: '#f5e6d3',
    accent: '#ff9d5c',
  },
};

const verticalAlignOptions = ['top', 'middle', 'bottom'];

const PostPreview = React.forwardRef(({ content, metadata = {} }, ref) => {
  const {
    theme = 'default',
    imagePosition = 'top',
    verticalAlign = 'top',
  } = metadata;
  const themeStyle = themeStyles[theme] || themeStyles.default;
  const normalizedVerticalAlign = typeof verticalAlign === 'string'
    ? verticalAlign.toLowerCase()
    : 'top';
  const verticalAlignValue = verticalAlignOptions.includes(normalizedVerticalAlign)
    ? normalizedVerticalAlign
    : 'top';

  // Extract images from markdown manually
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images = [];
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    images.push({
      alt: match[1],
      src: match[2]
    });
  }
  
  // Remove images from content for ReactMarkdown
  const contentWithoutImages = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '');

  return (
    <PreviewWrapper>
      <PreviewContainer ref={ref} bgColor={themeStyle.background}>
        <PreviewContent textColor={themeStyle.text} imagePosition={imagePosition} accentColor={themeStyle.accent} bgColor={themeStyle.background}>
          {/* Render images before content for 'top' and 'left' positions */}
          {['top', 'left'].includes(imagePosition) && images.length > 0 && (
            <ImageSection imagePosition={imagePosition} className="hide-scrollbar">
              {images.map((img, idx) => (
                <StyledImage
                  key={idx}
                  src={img.src}
                  alt={img.alt || 'image'}
                  onError={(e) => {
                    console.error('Image failed to load:', img.src.substring(0, 50));
                    e.target.style.display = 'none';
                  }}
                />
              ))}
            </ImageSection>
          )}

          <TextContent verticalAlign={verticalAlignValue}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkSmartyPants]}
              components={{
                p({ children }) {
                  return <p><HighlightedContent accentColor={themeStyle.accent} bgColor={themeStyle.background}>{children}</HighlightedContent></p>;
                },
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');

                  if (!inline && match) {
                    try {
                      const highlighted = hljs.highlight(codeString, {
                        language: match[1],
                        ignoreIllegals: true
                      }).value;
                      return (
                        <code
                          className={`hljs language-${match[1]}`}
                          dangerouslySetInnerHTML={{ __html: highlighted }}
                          {...props}
                        />
                      );
                    } catch (e) {
                      // Fallback if language not found
                      return <code className={className} {...props}>{codeString}</code>;
                    }
                  }

                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {contentWithoutImages}
            </ReactMarkdown>
          </TextContent>

          {/* Render images after content for 'bottom' and 'right' positions */}
          {['bottom', 'right'].includes(imagePosition) && images.length > 0 && (
            <ImageSection imagePosition={imagePosition} className="hide-scrollbar">
              {images.map((img, idx) => (
                <StyledImage
                  key={idx}
                  src={img.src}
                  alt={img.alt || 'image'}
                  onError={(e) => {
                    console.error('Image failed to load:', img.src.substring(0, 50));
                    e.target.style.display = 'none';
                  }}
                />
              ))}
            </ImageSection>
          )}
        </PreviewContent>
      </PreviewContainer>
    </PreviewWrapper>
  );
});

PostPreview.displayName = 'PostPreview';

export default PostPreview;
