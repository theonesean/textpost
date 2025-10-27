import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Global, ThemeProvider } from '@emotion/react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { FiDownload } from 'react-icons/fi';
import theme from './theme';
import PostEditor from './components/PostEditor';
import PostPreview from './components/PostPreview';

// Import Google Fonts
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.xl};
  font-family: ${({ theme }) => theme.fonts.primary};
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  h1 {
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: ${({ theme }) => theme.spacing.sm} 0 0;
  }
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

const EditorSection = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const PreviewSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const defaultContent = `# Welcome to InstaPost

Create beautiful **Instagram posts** with markdown support!

## Features

- 🎨 **Rich text formatting**
- 💻 Code snippets
- 📝 Lists and more!

\`\`\`js
// Example code
function hello() {
  console.log('Hello, world!');
}
\`\`\`

> Create something amazing!`;

function App() {
  const [content, setContent] = useState(
    localStorage.getItem('instaPostContent') || defaultContent
  );
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const previewRef = useRef(null);

  // Parse posts with metadata
  const parsePost = (postText) => {
    const yamlRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = postText.match(yamlRegex);
    
    if (match) {
      const metadata = {};
      match[1].split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          metadata[key.trim()] = valueParts.join(':').trim();
        }
      });
      return {
        metadata: {
          theme: metadata.theme || 'default',
          imagePosition: metadata.imagePosition || 'top',
          ...metadata
        },
        content: match[2]
      };
    }
    
    return {
      metadata: {
        theme: 'default',
        imagePosition: 'top'
      },
      content: postText
    };
  };

  // Split content by === separator
  const postTexts = content.split(/\n===\n/).filter(post => post.trim());
  const posts = postTexts.map(parsePost);
  const currentPostData = posts[currentPostIndex] || { metadata: { theme: 'default', imagePosition: 'top' }, content: '' };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    localStorage.setItem('instaPostContent', newContent);
  };

  const handleSave = async () => {
    // Save to localStorage is already handled in handleContentChange
    return new Promise((resolve) => {
      setTimeout(resolve, 1000); // Simulate async save
    });
  };

  const getTimestamp = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace(/:/g, '-');
  };

  const themeStyles = {
    default: { background: '#0a192f', text: '#ccd6f6', accent: '#64ffda' },
    dark: { background: '#0d0d0d', text: '#e0e0e0', accent: '#00d9ff' },
    light: { background: '#f5f5f5', text: '#1a1a1a', accent: '#0066cc' },
    forest: { background: '#1a3a2a', text: '#e8f4f0', accent: '#4ade80' },
    sunset: { background: '#2d1b1b', text: '#f5e6d3', accent: '#ff9d5c' },
  };

  const handleExport = async (singleSlide = false) => {
    if (!previewRef.current) return;
    
    try {
      const timestamp = getTimestamp();
      
      // Export single or all posts
      const startIdx = singleSlide ? currentPostIndex : 0;
      const endIdx = singleSlide ? currentPostIndex + 1 : posts.length;
      
      for (let i = startIdx; i < endIdx; i++) {
        // Wait a bit between exports to avoid issues
        if (i > startIdx) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Switch to post
        setCurrentPostIndex(i);
        
        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Get the post's theme background color
        const postTheme = posts[i].metadata.theme || 'default';
        const bgColor = themeStyles[postTheme]?.background || themeStyles.default.background;
        
        // Export - capture only the preview container itself
        const dataUrl = await toPng(previewRef.current, { 
          quality: 1,
          pixelRatio: 2,
          width: 500,
          height: 500,
          backgroundColor: bgColor,
          allowTaint: true,
          useCORS: false
        });
        
        // Download with post number
        const filename = posts.length > 1 
          ? `instagram-post-${timestamp}-${i + 1}.png`
          : `instagram-post-${timestamp}.png`;
        saveAs(dataUrl, filename);
      }
      
      // Reset to first post
      setCurrentPostIndex(0);
      
    } catch (error) {
      console.error('Error exporting image:', error);
    }
  };

  const handleExportMarkdown = async () => {
    try {
      const blob = new Blob([content], { type: 'text/markdown' });
      const timestamp = getTimestamp();
      saveAs(blob, `instagram-post-${timestamp}.md`);
    } catch (error) {
      console.error('Error exporting markdown:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Global
        styles={{
          '*': {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
          },
          'html, body, #root': {
            height: '100%',
          },
          body: {
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            fontFamily: theme.fonts.primary,
            lineHeight: 1.6,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
          'h1, h2, h3, h4, h5, h6': {
            fontWeight: 700,
            lineHeight: 1.2,
            color: theme.colors.white,
          },
          a: {
            color: theme.colors.primary,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
          'button, input, textarea': {
            fontFamily: 'inherit',
          },
        }}
      />
      <AppContainer>
        <Header>
          <h1>textpost</h1>
          <p>Create beautiful Instagram posts with markdown</p>
        </Header>
        
        <MainContent>
          <EditorSection>
            <h2>Editor</h2>
            <PostEditor
              content={content}
              onContentChange={handleContentChange}
              onSave={handleSave}
              onExport={handleExport}
              onExportMarkdown={handleExportMarkdown}
            />
          </EditorSection>
          
          <PreviewSection>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Preview {posts.length > 1 && `(${currentPostIndex + 1}/${posts.length})`}</h2>
                {posts.length > 1 && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => setCurrentPostIndex(Math.max(0, currentPostIndex - 1))}
                      disabled={currentPostIndex === 0}
                      style={{
                        padding: '0.5rem 1rem',
                        background: currentPostIndex === 0 ? '#666' : theme.colors.primary,
                        color: currentPostIndex === 0 ? '#999' : theme.colors.black,
                        border: 'none',
                        borderRadius: '4px',
                        cursor: currentPostIndex === 0 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      ← Prev
                    </button>
                    <button 
                      onClick={() => setCurrentPostIndex(Math.min(posts.length - 1, currentPostIndex + 1))}
                      disabled={currentPostIndex === posts.length - 1}
                      style={{
                        padding: '0.5rem 1rem',
                        background: currentPostIndex === posts.length - 1 ? '#666' : theme.colors.primary,
                        color: currentPostIndex === posts.length - 1 ? '#999' : theme.colors.black,
                        border: 'none',
                        borderRadius: '4px',
                        cursor: currentPostIndex === posts.length - 1 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
              <PostPreview ref={previewRef} content={currentPostData.content || 'Start typing to see the preview...'} metadata={currentPostData.metadata} />
            </div>
          </PreviewSection>
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
