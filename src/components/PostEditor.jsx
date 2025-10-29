import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import {
  FiBold,
  FiItalic,
  FiList,
  FiCode,
  FiImage,
  FiSave,
  FiDownload,
  FiFileText,
  FiEdit3,
  FiUpload,
} from 'react-icons/fi';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Toolbar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.black};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  flex-grow: 1;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 1rem;
  line-height: 1.6;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    justify-content: center;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;

    ${Button} {
      width: 100%;
      justify-content: center;
    }
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const PostEditor = ({
  content,
  onContentChange,
  onSave,
  onExport,
  onExportMarkdown,
  onImportMarkdown,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingMarkdown, setIsExportingMarkdown] = useState(false);
  const [isImportingMarkdown, setIsImportingMarkdown] = useState(false);
  const fileInputRef = useRef(null);
  const markdownFileInputRef = useRef(null);

  const insertMarkdown = (prefix, suffix = '', defaultText = '') => {
    const textarea = document.getElementById('post-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);
    
    const newText = `${beforeText}${prefix}${selectedText || defaultText}${suffix}${afterText}`;
    const newCursorPos = start + prefix.length + (selectedText ? selectedText.length : defaultText.length);
    
    onContentChange(newText);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        await onSave();
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleExport = async () => {
    if (onExport) {
      setIsExporting(true);
      try {
        await onExport();
      } finally {
        setIsExporting(false);
      }
    }
  };

  const handleExportMarkdown = async () => {
    if (onExportMarkdown) {
      setIsExportingMarkdown(true);
      try {
        await onExportMarkdown();
      } finally {
        setIsExportingMarkdown(false);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a blob URL for the image
    const blobUrl = URL.createObjectURL(file);
    
    // Store blob URL globally so it persists
    window.instaPostBlobUrls = window.instaPostBlobUrls || {};
    window.instaPostBlobUrls[blobUrl] = blobUrl;
    
    // Insert blob URL into markdown
    const textarea = document.getElementById('post-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);
    
    const markdownImage = `\n![image](${blobUrl})\n`;
    const newText = `${beforeText}${markdownImage}${afterText}`;
    
    onContentChange(newText);
    
    // Set cursor position after inserted image
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + markdownImage.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);

    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMarkdownImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImportingMarkdown(true);

    try {
      const text = await file.text();
      if (onImportMarkdown) {
        onImportMarkdown(text);
      } else {
        onContentChange(text);
      }
    } catch (error) {
      console.error('Error importing markdown file:', error);
    } finally {
      setIsImportingMarkdown(false);
      if (markdownFileInputRef.current) {
        markdownFileInputRef.current.value = '';
      }
    }
  };

  return (
    <EditorContainer>
      <Toolbar>
        <Button onClick={() => insertMarkdown('**', '**', 'bold text')}>
          <FiBold />
          <span>Bold</span>
        </Button>
        <Button onClick={() => insertMarkdown('*', '*', 'italic text')}>
          <FiItalic />
          <span>Italic</span>
        </Button>
        <Button onClick={() => insertMarkdown('==', '==', 'highlight')}>
          <FiEdit3 />
          <span>Highlight</span>
        </Button>
        <Button onClick={() => insertMarkdown('1. ', '\n2. Second item', 'First item')}>
          <FiList />
          <span>List</span>
        </Button>
        <Button onClick={() => insertMarkdown('```\n', '\n```', 'code')}>
          <FiCode />
          <span>Code</span>
        </Button>
        <Button onClick={() => fileInputRef.current?.click()}>
          <FiImage />
          <span>Image</span>
        </Button>
      </Toolbar>

      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />

      <HiddenFileInput
        ref={markdownFileInputRef}
        type="file"
        accept=".md,text/markdown"
        onChange={handleMarkdownImport}
      />
      
      <TextArea
        id="post-editor"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Write your Instagram post here..."
      />
      
      <ActionButtons>
        <Button onClick={handleSave} disabled={isSaving}>
          <FiSave />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </Button>
        <Button onClick={handleExportMarkdown} disabled={isExportingMarkdown}>
          <FiFileText />
          <span>{isExportingMarkdown ? 'Exporting...' : 'Export MD'}</span>
        </Button>
        <Button onClick={() => markdownFileInputRef.current?.click()} disabled={isImportingMarkdown}>
          <FiUpload />
          <span>{isImportingMarkdown ? 'Importing...' : 'Import MD'}</span>
        </Button>
        <Button onClick={() => onExport(true)}>
          <FiDownload />
          <span>Export Current (PNG)</span>
        </Button>
        <Button onClick={() => onExport(false)}>
          <FiDownload />
          <span>Export All (PNG)</span>
        </Button>
      </ActionButtons>
    </EditorContainer>
  );
};

export default PostEditor;
