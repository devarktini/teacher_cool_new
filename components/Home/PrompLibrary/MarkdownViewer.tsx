'use client'
import MDEditor from "@uiw/react-md-editor";

const MarkdownViewer = ({ content }: any) => {
  const formatSpecialLines = (text: string) => {
    if (!text) return "";

    // Bold the keys
    let result = text.replace(
      /^((?:Tone|Format|Avoid|Structure|Target audience|Include|Opening|Closing):)/gm,
      "**$1**"
    );

    // Ensure each special line ends with a hard line break (two spaces + newline)
    result = result.replace(
      /^(?:\*\*(?:Tone|Format|Avoid|Structure|Target audience|Include|Opening|Closing):\*\*.*)$/gm,
      (line) => line.replace(/\s*$/, "  ") // ensure two spaces at end
    );

    return result;
  };

  const processedContent = formatSpecialLines(content);

  return (
    <div
      className="prose prose-slate max-w-none
        text-gray-900
        prose-headings:font-bold prose-headings:text-gray-900
        prose-p:leading-snug prose-p:my-1
        prose-li:my-0.5 prose-li:text-gray-800
        prose-strong:font-semibold prose-strong:text-black"
    >
      <MDEditor.Markdown
        source={processedContent}
        style={{
          backgroundColor: "transparent",
          color: "inherit",
          lineHeight: 1.4,
          whiteSpace: "normal", // keep this
          fontSize: "15px",
        }}
      />
    </div>
  );
};

export default MarkdownViewer