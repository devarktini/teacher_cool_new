// components/Home/PrompLibrary/MarkdownViewer.tsx
'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface MarkdownViewerProps {
  content: string;
}

const MarkdownViewer = ({ content }: MarkdownViewerProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format the content to preserve exact formatting
  const formatContent = (text: string) => {
    // Replace markdown bold markers with proper bold text
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '**$1**');
    
    // Ensure code blocks are properly formatted
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `\`\`\`${lang || ''}\n${code}\`\`\``;
    });

    return formatted;
  };

  const components = {
    h1: ({ node, ...props }: any) => (
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700" {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3" {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mt-4 mb-2" {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed whitespace-pre-wrap" {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className="list-decimal pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-1" {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className="mb-1" {...props} />
    ),
    strong: ({ node, ...props }: any) => (
      <strong className="font-bold text-gray-900 dark:text-gray-100" {...props} />
    ),
    em: ({ node, ...props }: any) => (
      <em className="italic text-gray-700 dark:text-gray-300" {...props} />
    ),
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      
      if (!inline && match) {
        return (
          <div className="my-4 rounded-lg overflow-hidden">
            <SyntaxHighlighter
              style={mounted && theme === 'dark' ? vscDarkPlus : vs}
              language={match[1]}
              PreTag="div"
              className="!bg-gray-50 dark:!bg-gray-900 !p-4 text-sm"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        );
      }
      
      return (
        <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
    pre: ({ node, ...props }: any) => (
      <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto my-4" {...props} />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 my-4 text-gray-600 dark:text-gray-400 italic" {...props} />
    ),
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
      </div>
    ),
    thead: ({ node, ...props }: any) => (
      <thead className="bg-gray-50 dark:bg-gray-800" {...props} />
    ),
    th: ({ node, ...props }: any) => (
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider" {...props} />
    ),
    td: ({ node, ...props }: any) => (
      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700" {...props} />
    ),
    hr: ({ node, ...props }: any) => (
      <hr className="my-8 border-gray-200 dark:border-gray-700" {...props} />
    ),
  };

  const formattedContent = formatContent(content);

  return (
    <div className="prose prose-sm sm:prose-base max-w-none 
      prose-headings:font-bold prose-headings:tracking-tight
      prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300
      prose-strong:text-gray-900 dark:prose-strong:text-gray-100
      prose-ul:text-gray-700 dark:prose-ul:text-gray-300
      prose-ol:text-gray-700 dark:prose-ol:text-gray-300
      prose-code:text-gray-900 dark:prose-code:text-gray-100
      prose-pre:bg-transparent prose-pre:p-0
      prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
      prose-table:text-gray-700 dark:prose-table:text-gray-300
      prose-th:text-gray-900 dark:prose-th:text-gray-200
      prose-td:border-gray-200 dark:prose-td:border-gray-700
      dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
        // className="whitespace-pre-wrap break-words"
      >
        {formattedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;




// 'use client'
// import MDEditor from "@uiw/react-md-editor";

// const MarkdownViewer = ({ content }: any) => {
//   const formatSpecialLines = (text: string) => {
//     if (!text) return "";

//     // Bold the keys
//     let result = text.replace(
//       /^((?:Tone|Format|Avoid|Structure|Target audience|Include|Opening|Closing):)/gm,
//       "**$1**"
//     );

//     // Ensure each special line ends with a hard line break (two spaces + newline)
//     result = result.replace(
//       /^(?:\*\*(?:Tone|Format|Avoid|Structure|Target audience|Include|Opening|Closing):\*\*.*)$/gm,
//       (line) => line.replace(/\s*$/, "  ") // ensure two spaces at end
//     );

//     return result;
//   };

//   const processedContent = formatSpecialLines(content);

//   return (
//     <div
//       className="prose prose-slate max-w-none
//         text-gray-900
//         prose-headings:font-bold prose-headings:text-gray-900
//         prose-p:leading-snug prose-p:my-1
//         prose-li:my-0.5 prose-li:text-gray-800
//         prose-strong:font-semibold prose-strong:text-black"
//     >
//       <MDEditor.Markdown
//         source={processedContent}
//         style={{
//           backgroundColor: "transparent",
//           color: "inherit",
//           lineHeight: 1.4,
//           whiteSpace: "normal", // keep this
//           fontSize: "15px",
//         }}
//       />
//     </div>
//   );
// };

// export default MarkdownViewer