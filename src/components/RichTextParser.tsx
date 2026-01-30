import React, { Fragment } from 'react'
import { cn } from '@/lib/utils'

interface RichTextParserProps {
  content: any
  className?: string
}

export const RichTextParser: React.FC<RichTextParserProps> = ({ content, className }) => {
  if (!content || !content.root || !content.root.children) {
    return null
  }

  return <div className={cn('space-y-4', className)}>{content.root.children.map((node: any, i: number) => <Node key={i} node={node} />)}</div>
}

const Node = ({ node }: { node: any }) => {
  if (!node) return null

  switch (node.type) {
    case 'text':
      let text = <Fragment>{node.text}</Fragment>
      if (node.format & 1) text = <strong className="font-bold text-white">{text}</strong>
      if (node.format & 2) text = <em className="italic">{text}</em>
      if (node.format & 8) text = <span className="underline">{text}</span>
      if (node.format & 16) text = <code className="bg-white/10 rounded px-1">{text}</code>
      return text

    case 'paragraph':
      return (
        <p className="leading-relaxed text-white/80">
          {node.children?.map((child: any, i: number) => (
            <Node key={i} node={child} />
          ))}
        </p>
      )

    case 'heading':
      const Tag = node.tag as React.ElementType
      return (
        <Tag className="font-bold text-gold mt-6 mb-2">
          {node.children?.map((child: any, i: number) => (
            <Node key={i} node={child} />
          ))}
        </Tag>
      )

    case 'list':
      const ListTag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <ListTag className={cn("pl-5 space-y-1", node.listType === 'number' ? "list-decimal" : "list-disc")}>
          {node.children?.map((child: any, i: number) => (
            <Node key={i} node={child} />
          ))}
        </ListTag>
      )

    case 'listitem':
      return (
        <li className="pl-1">
          {node.children?.map((child: any, i: number) => (
            <Node key={i} node={child} />
          ))}
        </li>
      )
      
    case 'link':
      return (
        <a 
          href={node.fields?.url} 
          target={node.fields?.newTab ? '_blank' : undefined}
          rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
          className="text-gold hover:underline"
        >
          {node.children?.map((child: any, i: number) => (
            <Node key={i} node={child} />
          ))}
        </a>
      )

    case 'linebreak':
      return <br />

    default:
      return (
        <Fragment>
          {node.children?.map((child: any, i: number) => (
            <Node key={i} node={child} />
          ))}
        </Fragment>
      )
  }
}
