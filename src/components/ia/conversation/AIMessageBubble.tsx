'use client';

import React, { useState } from 'react';
import { AIMessage } from '@/types/ai';

interface AIMessageBubbleProps {
  message: AIMessage;
  onRetry?: () => void;
  onEdit?: (newContent: string) => void;
}

export const AIMessageBubble: React.FC<AIMessageBubbleProps> = ({
  message,
  onRetry,
  onEdit,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(message.content);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopyText = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Helper to format inline bold, italic, and code safely
  const formatInlineText = (text: string) => {
    // We split by code blocks `...`, then bold **...**, then links [text](url)
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Regex matching: `code`, **bold**, *italic*, [label](url)
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(remaining)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(remaining.substring(lastIndex, matchIndex));
      }

      const matchStr = match[0];
      if (matchStr.startsWith('`') && matchStr.endsWith('`')) {
        parts.push(
          <code key={`inline-${keyIdx++}`} className="msg-inline-code">
            {matchStr.slice(1, -1)}
          </code>
        );
      } else if (matchStr.startsWith('**') && matchStr.endsWith('**')) {
        parts.push(
          <strong key={`bold-${keyIdx++}`} className="msg-strong">
            {matchStr.slice(2, -2)}
          </strong>
        );
      } else if (matchStr.startsWith('*') && matchStr.endsWith('*')) {
        parts.push(
          <em key={`em-${keyIdx++}`} className="msg-em">
            {matchStr.slice(1, -1)}
          </em>
        );
      } else if (matchStr.startsWith('[') && matchStr.includes('](')) {
        const linkMatch = matchStr.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          parts.push(
            <a
              key={`link-${keyIdx++}`}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="msg-inline-link"
            >
              {linkMatch[1]}
            </a>
          );
        } else {
          parts.push(matchStr);
        }
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < remaining.length) {
      parts.push(remaining.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Advanced Block Markdown Parser: headers, tables, code blocks, blockquotes, lists, paragraphs
  const renderAdvancedMarkdown = (content: string) => {
    const lines = content.split('\n');
    const nodes: React.ReactNode[] = [];
    let i = 0;
    let blockIdx = 0;

    while (i < lines.length) {
      const line = lines[i];

      // 1. Code Block (```lang)
      if (line.trim().startsWith('```')) {
        const lang = line.trim().replace(/^```/, '') || 'texte';
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        const fullCode = codeLines.join('\n');
        const currentCodeIdx = blockIdx++;

        nodes.push(
          <div key={`code-block-${currentCodeIdx}`} className="msg-code-block-container">
            <div className="code-block-header">
              <span className="code-lang-tag">{lang}</span>
              <button
                type="button"
                onClick={() => handleCopyCode(fullCode, currentCodeIdx)}
                className="btn-copy-code"
                title="Copier le code"
              >
                {copiedCodeIdx === currentCodeIdx ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>
            <pre className="code-pre">
              <code>{fullCode}</code>
            </pre>
          </div>
        );
        i++;
        continue;
      }

      // 2. Markdown Table Detection (| col1 | col2 |)
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }

        if (tableLines.length >= 2) {
          const headerCells = tableLines[0]
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim());

          // Skip separator row (e.g., |---|---|)
          const dataRows = tableLines.slice(2).map((row) =>
            row
              .split('|')
              .slice(1, -1)
              .map((c) => c.trim())
          );

          nodes.push(
            <div key={`table-${blockIdx++}`} className="msg-table-scroll-wrapper">
              <table className="msg-table">
                <thead>
                  <tr>
                    {headerCells.map((th, hIdx) => (
                      <th key={`th-${hIdx}`}>{formatInlineText(th)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, rIdx) => (
                    <tr key={`tr-${rIdx}`}>
                      {row.map((td, cIdx) => (
                        <td key={`td-${rIdx}-${cIdx}`}>{formatInlineText(td)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // 3. Headings
      if (line.startsWith('### ')) {
        nodes.push(
          <h3 key={`h3-${blockIdx++}`} className="msg-h3">
            {formatInlineText(line.replace('### ', ''))}
          </h3>
        );
        i++;
        continue;
      }
      if (line.startsWith('## ')) {
        nodes.push(
          <h2 key={`h2-${blockIdx++}`} className="msg-h2">
            {formatInlineText(line.replace('## ', ''))}
          </h2>
        );
        i++;
        continue;
      }
      if (line.startsWith('# ')) {
        nodes.push(
          <h1 key={`h1-${blockIdx++}`} className="msg-h1">
            {formatInlineText(line.replace('# ', ''))}
          </h1>
        );
        i++;
        continue;
      }

      // 4. Blockquotes
      if (line.startsWith('> ')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].startsWith('> ')) {
          quoteLines.push(lines[i].replace(/^>\s*/, ''));
          i++;
        }
        nodes.push(
          <blockquote key={`quote-${blockIdx++}`} className="msg-quote">
            {quoteLines.map((ql, qIdx) => (
              <p key={`qp-${qIdx}`}>{formatInlineText(ql)}</p>
            ))}
          </blockquote>
        );
        continue;
      }

      // 5. Bullet Lists (* or -)
      if (line.match(/^(\*|-)\s+/)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].match(/^(\*|-)\s+/)) {
          listItems.push(lines[i].replace(/^(\*|-)\s+/, ''));
          i++;
        }
        nodes.push(
          <ul key={`ul-${blockIdx++}`} className="msg-ul">
            {listItems.map((item, lIdx) => (
              <li key={`li-${lIdx}`} className="msg-li">
                {formatInlineText(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // 6. Numbered Lists (1. 2.)
      if (line.match(/^\d+\.\s+/)) {
        const numItems: string[] = [];
        while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
          numItems.push(lines[i].replace(/^\d+\.\s+/, ''));
          i++;
        }
        nodes.push(
          <ol key={`ol-${blockIdx++}`} className="msg-ol">
            {numItems.map((item, nIdx) => (
              <li key={`nli-${nIdx}`} className="msg-li">
                {formatInlineText(item)}
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // 7. Empty line spacer
      if (line.trim() === '') {
        nodes.push(<div key={`spacer-${blockIdx++}`} className="msg-spacer" />);
        i++;
        continue;
      }

      // 8. Normal Paragraph
      nodes.push(
        <p key={`p-${blockIdx++}`} className="msg-p">
          {formatInlineText(line)}
        </p>
      );
      i++;
    }

    return nodes;
  };

  return (
    <article
      className={`conversation-message-entry ${isUser ? 'is-user' : 'is-assistant'}`}
      aria-label={isUser ? 'Votre message' : "Réponse de l'Assistant Sunubiblio"}
    >
      {isUser ? (
        /* USER MESSAGE: Compact right-aligned capsule without heavy borders */
        <div className="user-message-container">
          {message.attachments && message.attachments.length > 0 && (
            <div className="user-attachments-tray">
              {message.attachments.map((att) => (
                <div key={att.id} className={`user-att-pill ${att.type}`}>
                  <span className="att-icon">
                    {att.type === 'library' && '📚'}
                    {att.type === 'document' && '📄'}
                    {att.type === 'image' && '🖼️'}
                    {att.type === 'text' && '✏️'}
                  </span>
                  <span className="att-name">{att.name}</span>
                  {att.size && <span className="att-size">{att.size}</span>}
                </div>
              ))}
            </div>
          )}

          {isEditing ? (
            /* CANVA D'ÉDITION DU MESSAGE UTILISATEUR (Image 3 ChatGPT) */
            <div className="user-edit-canva-box">
              <textarea
                value={editDraft}
                onChange={(e) => setEditDraft(e.target.value)}
                className="edit-canva-textarea"
                rows={Math.max(2, editDraft.split('\n').length)}
                autoFocus
              />
              <div className="edit-canva-footer-row">
                <button
                  type="button"
                  onClick={() => {
                    setEditDraft(message.content);
                    setIsEditing(false);
                  }}
                  className="btn-canva-cancel"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (editDraft.trim() && onEdit) {
                      onEdit(editDraft.trim());
                      setIsEditing(false);
                    }
                  }}
                  className="btn-canva-send"
                >
                  Envoyer
                </button>
              </div>
            </div>
          ) : (
            <div className="user-bubble">
              <p className="user-text-content">{message.content}</p>
            </div>
          )}

          {/* 3 icônes d'actions discrètes au survol sous le message utilisateur (Copier, Partager, Modifier) */}
          {!isEditing && (
            <div className="user-message-actions-row">
              <button
                type="button"
                onClick={handleCopyText}
                className="btn-user-action-icon"
                title="Copier le message"
                aria-label="Copier"
              >
                {copied ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.4">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="btn-user-action-icon"
                title="Partager le prompt"
                aria-label="Partager"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditDraft(message.content);
                  setIsEditing(true);
                }}
                className="btn-user-action-icon"
                title="Modifier le message"
                aria-label="Modifier"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ASSISTANT MESSAGE: Natural text flow, ChatGPT pure style without Assistant banner */
        <div className="assistant-message-container">
          {/* Natural Prose Flow - Clean like ChatGPT */}
          <div className="assistant-prose-body">
            {renderAdvancedMarkdown(message.content)}

            {/* Web Sources consulted if any */}
            {message.sources && message.sources.length > 0 && (
              <div className="web-sources-section">
                <div className="sources-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  <span>Sources Web consultées :</span>
                </div>
                <div className="sources-grid">
                  {message.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-chip"
                    >
                      <span className="source-badge">{src.domain}</span>
                      <span className="source-title">{src.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Discrete Action Toolbar under Assistant response (ChatGPT style) */}
          <div className="assistant-actions-toolbar">
            <button
              type="button"
              onClick={handleCopyText}
              className="btn-action-discrete"
              title="Copier toute la réponse"
            >
              {copied ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </button>

            {/* Thumbs up */}
            <button type="button" className="btn-action-discrete" title="Bonne réponse">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
            </button>

            {/* Thumbs down */}
            <button type="button" className="btn-action-discrete" title="Mauvaise réponse">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
              </svg>
            </button>

            {/* Audio read */}
            <button type="button" className="btn-action-discrete" title="Écouter la réponse">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            </button>

            {/* Share */}
            <button type="button" className="btn-action-discrete" title="Partager">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>

            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="btn-action-discrete"
                title="Régénérer cette réponse"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <polyline points="23 20 23 14 17 14"></polyline>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modale Partager le prompt (Exactement comme Image 4 de ChatGPT) */}
      {isShareModalOpen && (
        <div className="share-prompt-overlay" onClick={() => setIsShareModalOpen(false)}>
          <div className="share-prompt-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="share-dialog-header">
              <h3 className="share-dialog-title">Partager le prompt</h3>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="share-dialog-close-btn"
                title="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="share-preview-card">
              <div className="share-preview-bubble">
                <span>{message.content}</span>
              </div>
            </div>

            <div className="share-link-info-row">
              <span className="globe-icon">🌐</span>
              <div className="share-link-texts">
                <span className="share-link-heading">Partager un lien public vers ce prompt</span>
                <span className="share-link-sub">
                  Toute personne disposant de ce lien peut accéder à ce prompt.{' '}
                  <span className="share-link-more">En savoir plus</span>
                </span>
              </div>
            </div>

            <div className="share-destinations-grid">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(`${window.location.origin}/ia?prompt=${encodeURIComponent(message.content)}`);
                    setShareCopied(true);
                    setTimeout(() => setShareCopied(false), 2000);
                  }
                }}
                className="share-destination-btn"
              >
                <div className="share-dest-icon-wrap">
                  {shareCopied ? '✓' : '🔗'}
                </div>
                <span>{shareCopied ? 'Copié !' : 'Copier le lien'}</span>
              </button>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(message.content + ' — sur SunuIA')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-destination-btn"
              >
                <div className="share-dest-icon-wrap">𝕏</div>
                <span>X</span>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : 'https://sunubiblio.sn')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-destination-btn"
              >
                <div className="share-dest-icon-wrap">in</div>
                <span>LinkedIn</span>
              </a>

              <a
                href={`https://reddit.com/submit?title=${encodeURIComponent(message.content)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-destination-btn"
              >
                <div className="share-dest-icon-wrap">🔴</div>
                <span>Reddit</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .conversation-message-entry {
          width: 100%;
          max-width: 100%;
          margin: 0 0 28px 0;
          display: flex;
          flex-direction: column;
          animation: messageFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          min-width: 0;
        }

        /* -------------------------------------------------------------
           USER MESSAGE STYLING (Compact right-aligned capsule)
        ------------------------------------------------------------- */
        .user-message-container {
          align-self: flex-end;
          max-width: min(85%, 640px);
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          min-width: 0;
        }

        .user-attachments-tray {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 6px;
          justify-content: flex-end;
        }

        .user-att-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 9999px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          font-size: 11.5px;
          color: #334155;
          max-width: 220px;
        }

        .user-att-pill .att-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 600;
        }

        .user-att-pill .att-size {
          color: #94a3b8;
          font-size: 10.5px;
        }

        .user-bubble {
          background: #f0f4f9;
          color: #0f172a;
          padding: 10px 18px;
          border-radius: 20px;
          border-bottom-right-radius: 4px;
          border: 1px solid rgba(226, 232, 240, 0.85);
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
          word-break: break-word;
          overflow-wrap: anywhere;
          min-width: 0;
        }

        .user-text-content {
          margin: 0;
          font-size: 15px;
          line-height: 1.55;
          color: #0f172a;
          white-space: pre-wrap;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        /* 3 icônes sous le message utilisateur, invisibles par défaut et affichées au survol (exactement comme ChatGPT) */
        .user-message-actions-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 5px;
          padding-right: 2px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s ease, transform 0.15s ease;
          transform: translateY(-2px);
        }

        .user-message-container:hover .user-message-actions-row {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }

        .btn-user-action-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          padding: 0;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.12s ease;
        }

        .btn-user-action-icon:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        @media (max-width: 640px) {
          .user-message-actions-row {
            opacity: 0.85;
            pointer-events: auto;
            transform: none;
          }
        }

        /* -------------------------------------------------------------
           ASSISTANT MESSAGE STYLING (Natural prose, pure ChatGPT style)
        ------------------------------------------------------------- */
        .assistant-message-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* PROSE BODY: Natural typography, zero card frame */
        .assistant-prose-body {
          font-size: 15.5px;
          line-height: 1.7;
          color: #1e293b;
          word-break: break-word;
          overflow-wrap: anywhere;
          padding-left: 2px;
          min-width: 0;
        }

        :global(.msg-h1) {
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
          margin: 16px 0 8px 0;
          line-height: 1.35;
        }

        :global(.msg-h2) {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          margin: 14px 0 6px 0;
          line-height: 1.35;
        }

        :global(.msg-h3) {
          font-size: 15.5px;
          font-weight: 700;
          color: #1e293b;
          margin: 12px 0 6px 0;
          line-height: 1.4;
        }

        :global(.msg-p) {
          margin: 0 0 10px 0;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        :global(.msg-spacer) {
          height: 6px;
        }

        :global(.msg-strong) {
          font-weight: 700;
          color: #0f172a;
        }

        :global(.msg-em) {
          font-style: italic;
          color: #475569;
        }

        :global(.msg-inline-code) {
          background: #f1f5f9;
          color: #4f46e5;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 13.5px;
          padding: 2px 6px;
          border-radius: 5px;
          border: 1px solid #e2e8f0;
          word-break: break-word;
        }

        :global(.msg-inline-link) {
          color: #d97706;
          text-decoration: underline;
          text-underline-offset: 2px;
          word-break: break-all;
          font-weight: 600;
        }

        :global(.msg-quote) {
          margin: 10px 0;
          padding: 6px 14px;
          border-left: 3px solid #cbd5e1;
          background: transparent;
          font-size: 14px;
          color: #64748b;
          font-style: italic;
        }

        :global(.msg-quote p) {
          margin: 0;
        }

        :global(.msg-ul) {
          margin: 6px 0 12px 0;
          padding-left: 20px;
          list-style-type: disc;
        }

        :global(.msg-ol) {
          margin: 6px 0 12px 0;
          padding-left: 20px;
          list-style-type: decimal;
        }

        :global(.msg-li) {
          margin-bottom: 5px;
          line-height: 1.6;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        /* CODE BLOCK: Internal horizontal scroll ONLY, never whole page */
        :global(.msg-code-block-container) {
          background: #0f172a;
          border-radius: 12px;
          margin: 12px 0;
          border: 1px solid #1e293b;
          overflow: hidden;
          width: 100%;
          max-width: 100%;
        }

        :global(.code-block-header) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 7px 14px;
          background: #1e293b;
          border-bottom: 1px solid #334155;
          font-size: 12px;
          color: #94a3b8;
        }

        :global(.code-lang-tag) {
          font-family: monospace;
          text-transform: uppercase;
          font-size: 11px;
          font-weight: 700;
          color: #cbd5e1;
        }

        :global(.btn-copy-code) {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 11.5px;
          font-family: inherit;
          padding: 2px 6px;
          border-radius: 4px;
          transition: all 0.15s ease;
        }

        :global(.btn-copy-code:hover) {
          color: #f8fafc;
          background: rgba(255, 255, 255, 0.1);
        }

        :global(.code-pre) {
          margin: 0;
          padding: 14px 16px;
          overflow-x: auto;
          white-space: pre;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 13.5px;
          line-height: 1.5;
          color: #f1f5f9;
          -webkit-overflow-scrolling: touch;
        }

        :global(.code-pre code) {
          font-family: inherit;
          background: transparent;
          border: none;
          padding: 0;
          color: inherit;
        }

        /* TABLE: Internal scroll wrapper, never causes page scroll */
        :global(.msg-table-scroll-wrapper) {
          width: 100%;
          max-width: 100%;
          overflow-x: auto;
          margin: 12px 0;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #ffffff;
          -webkit-overflow-scrolling: touch;
        }

        :global(.msg-table) {
          width: 100%;
          min-width: 360px;
          border-collapse: collapse;
          font-size: 14px;
          text-align: left;
        }

        :global(.msg-table th) {
          background: #f8fafc;
          padding: 10px 14px;
          font-weight: 700;
          color: #1e293b;
          border-bottom: 2px solid #e2e8f0;
        }

        :global(.msg-table td) {
          padding: 9px 14px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }

        :global(.msg-table tr:last-child td) {
          border-bottom: none;
        }

        /* Web sources */
        .web-sources-section {
          margin-top: 14px;
          padding: 10px 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .sources-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 8px;
        }

        .sources-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .source-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          text-decoration: none;
          color: #d97706;
          font-size: 12px;
          transition: all 0.15s ease;
          max-width: 100%;
        }

        .source-chip:hover {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .source-badge {
          background: #f1f5f9;
          color: #475569;
          font-size: 10.5px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .source-title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 240px;
        }

        .assistant-arch-disclaimer {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding: 8px 12px;
          background: #fffbeb;
          border: 1px dashed rgba(245, 158, 11, 0.35);
          border-radius: 8px;
          font-size: 11.5px;
          color: #b45309;
        }

        /* ACTIONS TOOLBAR */
        .assistant-actions-toolbar {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
        }

        .btn-action-discrete {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          padding: 0;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: #8e8ea0;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-action-discrete:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        @media (max-width: 640px) {
          .user-message-container {
            max-width: 92%;
          }

          .user-bubble {
            padding: 10px 14px;
            font-size: 14.5px;
          }

          .assistant-prose-body {
            font-size: 14.5px;
            line-height: 1.65;
          }

          .source-title {
            max-width: 160px;
          }
        }

        /* CANVA D'ÉDITION DU MESSAGE UTILISATEUR (Image 3 ChatGPT) */
        .user-edit-canva-box {
          width: 100%;
          min-width: min(100%, 500px);
          background: #f4f4f4;
          border-radius: 18px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
        }

        .edit-canva-textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-family: inherit;
          font-size: 15px;
          line-height: 1.5;
          color: #0f172a;
          resize: none;
          padding: 0;
        }

        .edit-canva-footer-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }

        .btn-canva-cancel {
          padding: 6px 14px;
          border-radius: 9999px;
          border: 1px solid #d1d5db;
          background: #ffffff;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-canva-cancel:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .btn-canva-send {
          padding: 7px 18px;
          border-radius: 9999px;
          border: none;
          background: #0d0d0d;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-canva-send:hover {
          background: #262626;
          transform: translateY(-1px);
        }

        /* MODALE PARTAGER LE PROMPT (Image 4 ChatGPT) */
        .share-prompt-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: shareFadeIn 0.18s ease-out;
        }

        .share-prompt-dialog {
          width: 100%;
          max-width: 520px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.22);
          padding: 24px 24px 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          animation: shareScaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .share-dialog-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .share-dialog-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .share-dialog-close-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 50%;
          color: #64748b;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .share-dialog-close-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .share-preview-card {
          width: 100%;
          min-height: 140px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
        }

        .share-preview-bubble {
          background: #f0f4f9;
          color: #0f172a;
          padding: 8px 16px;
          border-radius: 18px;
          border-bottom-right-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          max-width: 85%;
          word-break: break-word;
        }

        .share-link-info-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .globe-icon {
          font-size: 18px;
          line-height: 1.2;
        }

        .share-link-texts {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .share-link-heading {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .share-link-sub {
          font-size: 12px;
          color: #64748b;
        }

        .share-link-more {
          text-decoration: underline;
          cursor: pointer;
        }

        .share-destinations-grid {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding-top: 8px;
          border-top: 1px solid #f1f5f9;
        }

        .share-destination-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-decoration: none;
          color: #334155;
          font-size: 11.5px;
          font-weight: 600;
          transition: transform 0.15s ease;
        }

        .share-destination-btn:hover {
          transform: translateY(-2px);
          color: #0f172a;
        }

        .share-dest-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          transition: background 0.15s ease;
        }

        .share-destination-btn:hover .share-dest-icon-wrap {
          background: #e2e8f0;
        }

        @keyframes shareFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes shareScaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes messageFadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </article>
  );
};
