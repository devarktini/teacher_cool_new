import React, { Dispatch, SetStateAction } from 'react';
import * as commands from '@uiw/react-md-editor/commands';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { FiX } from 'react-icons/fi';

interface BlogEditorProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  fullscreen?: boolean;
  setFullscreen?: Dispatch<SetStateAction<boolean>>;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({ 
  content, 
  setContent, 
  fullscreen = false, 
  setFullscreen 
}) => {
  return (
    <div 
      className={fullscreen ? "fixed inset-0 z-50 bg-white p-4" : ""}
      data-color-mode="light"
    >
      {fullscreen && setFullscreen && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Editor</h3>
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
      )}
      <MDEditor
        value={content}
        onChange={(value) => setContent(value || '')}
        height={fullscreen ? 'calc(100vh - 150px)' : 500}
        preview="live"
        visibleDragbar={true}
        enableScroll={true}
        textareaProps={{
          placeholder: "Write your blog content here using Markdown...",
        }}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
        commands={[
          commands.title1,
          commands.title2,
          commands.title3,
          commands.title4,
          commands.title5,
          commands.title6,
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.divider,
          commands.link,
          commands.quote,
          commands.code,
          commands.codeBlock,
          commands.divider,
          commands.unorderedListCommand,
          commands.orderedListCommand,
          commands.checkedListCommand,
          commands.divider,
          commands.image,
          commands.table,
          commands.divider,
          commands.fullscreen,
        ]}
        className="bg-white"
      />
    </div>
  );
};
