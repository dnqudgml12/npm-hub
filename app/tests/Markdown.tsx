'use client';
// pages/[package].tsx
import { useState, useEffect } from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function Markdown() {
  const packageName = 'spec-change';
  const [readme, setReadme] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string>('');

  useEffect(() => {
    async function fetchReadme() {
      if (!packageName) return;

      try {
        setIsLoading(true);
        const response = await fetch(`https://unpkg.com/${packageName}/README.md`);

        if (!response.ok) {
          throw new Error(`Failed to fetch README: ${response.statusText}`);
        }

        const text = await response.text();
        setReadme(text);
        setFetchError('');
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to fetch README');
      } finally {
        setIsLoading(false);
      }
    }

    fetchReadme();
  }, [packageName]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{fetchError}</div>
      </div>
    );
  }

  return (
    <div className="max-h-[750px] overflow-y-auto max-w-screen-sm bg-primary-10 p-4">
      <h1 className="text-2xl font-bold mb-4">README for {packageName}</h1>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold my-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold my-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold my-2">{children}</h3>,
          p: ({ children }) => <p className="my-4 text-base leading-relaxed">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc list-inside my-4 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside my-4 space-y-2">{children}</ol>
          ),
          li: ({ children }) => <li className="ml-4">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} className="inline-flex items-center h-6 mx-2 hover:opacity-80">
              {children}
            </a>
          ),
          img: ({ src, alt }) => <img src={src || ''} alt={alt || ''} className="h-full" />,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic">
              {children}
            </blockquote>
          ),
          code: ({
            inline = true,
            className,
            children,
            ...props
          }: {
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
          }) => {
            // **규칙 1: Markdown 코드 블록 감지**
            const isBlockCode = !inline && className?.startsWith('language-');

            // **규칙 2: 일반적인 코드 구문 감지 (코드일 가능성이 높은 텍스트)**
            const isPotentialCode =
              typeof children === 'string' &&
              (/return|function|const|let|var|;|{|}/.test(children) ||
                children.trim().startsWith('<') ||
                children.trim().startsWith('npm'));

            // 코드 블록 하이라이팅 적용
            if (isBlockCode || isPotentialCode) {
              const language = className?.replace('language-', '') || 'javascript';
              return (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={language}
                  PreTag="div"
                  className="rounded-lg my-4"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }

            // **규칙 3: 인라인 코드**
            if (inline) {
              return (
                <code className="bg-gray-200 text-red-500 px-1 py-0.5 rounded-md" {...props}>
                  {children}
                </code>
              );
            }
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-gray-300">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 bg-gray-100">{children}</th>
          ),
          td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
        }}
      >
        {readme}
      </ReactMarkdown>
    </div>
  );
}
