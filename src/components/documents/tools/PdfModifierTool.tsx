'use client';

import React, { useState, useCallback } from 'react';
import {
  PdfActiveTool,
  HighlightColor,
  PdfHighlightAnnotation,
  PdfCommentAnnotation,
  PdfTextAnnotation,
  PdfSignatureAnnotation,
  PdfPageModel,
} from './pdf/types';
import { INITIAL_PDF_PAGES } from './pdf/mockPdfData';
import { PdfEditorHeader } from './pdf/PdfEditorHeader';
import { PdfEditorToolbar } from './pdf/PdfEditorToolbar';
import { PdfPageThumbnails } from './pdf/PdfPageThumbnails';
import { PdfDocumentCanvas } from './pdf/PdfDocumentCanvas';
import { UserProcessedDocument } from '@/types/documentTools';

interface PdfModifierToolProps {
  userPlanSlug?: string;
  onOpenUpgradeModal?: () => void;
  onDocumentCreated?: (doc: UserProcessedDocument) => void;
}

export const PdfModifierTool: React.FC<PdfModifierToolProps> = ({
  userPlanSlug: _userPlanSlug = 'recommande',
  onOpenUpgradeModal: _onOpenUpgradeModal,
  onDocumentCreated,
}) => {
  // --- États du Document & Navigation ---
  const [documentName] = useState<string>('Document_Academique_Rapport.pdf');
  const [pages, setPages] = useState<PdfPageModel[]>(INITIAL_PDF_PAGES);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isThumbnailsOpen, setIsThumbnailsOpen] = useState<boolean>(true);

  // --- États des Outils & Palettes ---
  const [activeTool, setActiveTool] = useState<PdfActiveTool>('select');
  const [selectedColor, setSelectedColor] = useState<HighlightColor>('yellow');

  // --- États des Annotations Interactives Découplées ---
  // Initialisation avec des annotations d'exemple réalistes interactives
  const [highlights, setHighlights] = useState<PdfHighlightAnnotation[]>([
    {
      id: 'hl-init-1',
      pageNumber: 1,
      color: 'yellow',
      targetParagraphId: 'p1-quote',
      createdAt: 'À l’instant',
    },
  ]);

  const [comments, setComments] = useState<PdfCommentAnnotation[]>([
    {
      id: 'note-init-1',
      pageNumber: 1,
      xPercent: 78,
      yPercent: 32,
      author: 'Comité Scientifique',
      content: 'Excellente citation. Veiller à mentionner l’année de publication dans la bibliographie finale.',
      createdAt: 'Aujourd’hui 10:45',
      isOpen: false,
    },
  ]);

  const [texts, setTexts] = useState<PdfTextAnnotation[]>([]);
  const [signatures, setSignatures] = useState<PdfSignatureAnnotation[]>([]);
  const [underlines, setUnderlines] = useState<string[]>(['p1-sec1']);
  const [strikethroughs, setStrikethroughs] = useState<string[]>([]);

  // --- Gestion de la Sauvegarde ---
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // --- Historique Undo / Redo ---
  type HistorySnapshot = {
    highlights: PdfHighlightAnnotation[];
    comments: PdfCommentAnnotation[];
    texts: PdfTextAnnotation[];
    signatures: PdfSignatureAnnotation[];
    underlines: string[];
    strikethroughs: string[];
  };

  const [undoStack, setUndoStack] = useState<HistorySnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<HistorySnapshot[]>([]);

  const pushToHistory = useCallback(() => {
    setUndoStack((prev) => [
      ...prev,
      {
        highlights,
        comments,
        texts,
        signatures,
        underlines,
        strikethroughs,
      },
    ]);
    setRedoStack([]); // Effacer le redo après une nouvelle action
  }, [highlights, comments, texts, signatures, underlines, strikethroughs]);

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const lastState = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [
      ...prev,
      { highlights, comments, texts, signatures, underlines, strikethroughs },
    ]);
    setHighlights(lastState.highlights);
    setComments(lastState.comments);
    setTexts(lastState.texts);
    setSignatures(lastState.signatures);
    setUnderlines(lastState.underlines);
    setStrikethroughs(lastState.strikethroughs);
    setUndoStack((prev) => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [
      ...prev,
      { highlights, comments, texts, signatures, underlines, strikethroughs },
    ]);
    setHighlights(nextState.highlights);
    setComments(nextState.comments);
    setTexts(nextState.texts);
    setSignatures(nextState.signatures);
    setUnderlines(nextState.underlines);
    setStrikethroughs(nextState.strikethroughs);
    setRedoStack((prev) => prev.slice(0, -1));
  };

  // --- Actions sur les Pages ---
  const handleRotatePage = (pageNum: number) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.pageNumber === pageNum) {
          const nextRot = ((p.rotation + 90) % 360) as 0 | 90 | 180 | 270;
          return { ...p, rotation: nextRot };
        }
        return p;
      })
    );
  };

  const handleDeletePage = (pageNum: number) => {
    const activeRemaining = pages.filter((p) => !p.isDeleted && p.pageNumber !== pageNum);
    if (activeRemaining.length === 0) {
      alert('Impossible de supprimer la dernière page active du document.');
      return;
    }
    setPages((prev) =>
      prev.map((p) => (p.pageNumber === pageNum ? { ...p, isDeleted: true } : p))
    );
    if (currentPageNumber === pageNum) {
      const nextActive = activeRemaining[0];
      if (nextActive) setCurrentPageNumber(nextActive.pageNumber);
    }
  };

  const handleRestorePage = (pageNum: number) => {
    setPages((prev) =>
      prev.map((p) => (p.pageNumber === pageNum ? { ...p, isDeleted: false } : p))
    );
  };

  const handleAddPage = () => {
    const newPageNum = pages.length + 1;
    const newPage: PdfPageModel = {
      pageNumber: newPageNum,
      title: `Nouvelle page ${newPageNum}`,
      rotation: 0,
      isDeleted: false,
      contentParagraphs: [
        {
          id: `p${newPageNum}-sec`,
          type: 'h2',
          text: `Section additionnelle — Page ${newPageNum}`,
        },
        {
          id: `p${newPageNum}-body`,
          type: 'p',
          text: 'Cette page vierge est prête pour l’insertion de vos annotations, notes et synthèses complémentaires.',
        },
      ],
    };
    setPages((prev) => [...prev, newPage]);
    setCurrentPageNumber(newPageNum);
  };

  // --- Actions sur les Surlignages ---
  const handleToggleHighlightParagraph = (paragraphId: string, color: HighlightColor) => {
    pushToHistory();
    setHighlights((prev) => {
      const existing = prev.find(
        (h) => h.pageNumber === currentPageNumber && h.targetParagraphId === paragraphId
      );
      if (existing) {
        // Si même couleur -> suppression, sinon mise à jour de la couleur
        if (existing.color === color) {
          return prev.filter((h) => h.id !== existing.id);
        }
        return prev.map((h) => (h.id === existing.id ? { ...h, color } : h));
      }
      return [
        ...prev,
        {
          id: `hl-${Date.now()}`,
          pageNumber: currentPageNumber,
          color,
          targetParagraphId: paragraphId,
          createdAt: 'À l’instant',
        },
      ];
    });
  };

  const handleUpdateHighlightColor = (id: string, color: HighlightColor) => {
    pushToHistory();
    setHighlights((prev) => prev.map((h) => (h.id === id ? { ...h, color } : h)));
  };

  const handleDeleteHighlight = (id: string) => {
    pushToHistory();
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  // --- Actions Souligner / Barrer ---
  const handleToggleUnderline = (pId: string) => {
    pushToHistory();
    setUnderlines((prev) =>
      prev.includes(pId) ? prev.filter((id) => id !== pId) : [...prev, pId]
    );
  };

  const handleToggleStrike = (pId: string) => {
    pushToHistory();
    setStrikethroughs((prev) =>
      prev.includes(pId) ? prev.filter((id) => id !== pId) : [...prev, pId]
    );
  };

  // --- Actions Commentaires / Notes ---
  const handleAddComment = (xPercent: number, yPercent: number) => {
    pushToHistory();
    const newNote: PdfCommentAnnotation = {
      id: `note-${Date.now()}`,
      pageNumber: currentPageNumber,
      xPercent,
      yPercent,
      author: 'Vous (Auteur)',
      content: '',
      createdAt: 'À l’instant',
      isOpen: true,
    };
    setComments((prev) => [...prev, newNote]);
  };

  const handleUpdateComment = (id: string, content: string) => {
    pushToHistory();
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, content } : h(c))));
    function h(item: PdfCommentAnnotation) {
      return item;
    }
  };

  const handleDeleteComment = (id: string) => {
    pushToHistory();
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleToggleCommentOpen = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isOpen: !c.isOpen } : { ...c, isOpen: false }))
    );
  };

  // --- Actions Texte Libre ---
  const handleAddText = (xPercent: number, yPercent: number) => {
    pushToHistory();
    const newText: PdfTextAnnotation = {
      id: `txt-${Date.now()}`,
      pageNumber: currentPageNumber,
      xPercent,
      yPercent,
      content: '',
      color: '#0f172a',
      fontSize: 14,
      isEditing: true,
    };
    setTexts((prev) => [...prev, newText]);
  };

  const handleUpdateText = (id: string, content: string) => {
    pushToHistory();
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, content, isEditing: false } : t)));
  };

  const handleDeleteText = (id: string) => {
    pushToHistory();
    setTexts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Actions Signature ---
  const handleAddSignature = (xPercent: number, yPercent: number) => {
    pushToHistory();
    const dateNow = new Date();
    const formattedDate = dateNow.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const newSig: PdfSignatureAnnotation = {
      id: `sig-${Date.now()}`,
      pageNumber: currentPageNumber,
      xPercent,
      yPercent,
      signerName: 'Abdou Fall',
      dateStr: formattedDate,
      signatureId: `SNB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    };
    setSignatures((prev) => [...prev, newSig]);
  };

  const handleDeleteSignature = (id: string) => {
    pushToHistory();
    setSignatures((prev) => prev.filter((s) => s.id !== id));
  };

  // --- Sauvegarde finale et téléchargement ---
  const handleSavePdf = async () => {
    setIsSaving(true);
    setSaveStatus('saving');

    try {
      const activePages = pages.filter((p) => !p.isDeleted);
      const res = await fetch('/api/documents/tools/pdf-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPlanSlug: 'recommande',
          fileName: documentName,
          annotations: [
            ...highlights.map((h) => ({ id: h.id, type: 'highlight', pageNumber: h.pageNumber })),
            ...comments.map((c) => ({ id: c.id, type: 'text', content: c.content, pageNumber: c.pageNumber })),
            ...signatures.map((s) => ({ id: s.id, type: 'signature', pageNumber: s.pageNumber })),
          ],
          pagesState: activePages.map((p) => ({
            pageNumber: p.pageNumber,
            rotation: p.rotation,
            isDeleted: false,
          })),
        }),
      });

      const data = await res.json();
      if (data.success && data.document) {
        if (onDocumentCreated) onDocumentCreated(data.document);
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3500);
    } catch (err) {
      console.error('Erreur enregistrement PDF:', err);
      setSaveStatus('idle');
    } finally {
      setIsSaving(false);
    }
  };

  // Trouver la page active
  const currentPageModel =
    pages.find((p) => p.pageNumber === currentPageNumber && !p.isDeleted) ||
    pages.find((p) => !p.isDeleted) ||
    pages[0];

  const totalActivePages = pages.filter((p) => !p.isDeleted).length;

  return (
    <div className="pdf-studio-root">
      {/* 1. Barre d'information & actions supérieure */}
      <PdfEditorHeader
        documentName={documentName}
        currentPage={currentPageModel.pageNumber}
        totalPages={totalActivePages}
        zoomLevel={zoomLevel}
        isSaving={isSaving}
        saveStatus={saveStatus}
        isThumbnailsOpen={isThumbnailsOpen}
        onPageChange={(page) => setCurrentPageNumber(page)}
        onZoomChange={(delta) => setZoomLevel((prev) => Math.max(70, Math.min(150, prev + delta)))}
        onResetZoom={() => setZoomLevel(100)}
        onToggleThumbnails={() => setIsThumbnailsOpen((prev) => !prev)}
        onSavePdf={handleSavePdf}
      />

      {/* 2. Barre d'outils compacte avec vraies icônes et état actif */}
      <PdfEditorToolbar
        activeTool={activeTool}
        selectedColor={selectedColor}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onSelectTool={(tool) => setActiveTool(tool)}
        onSelectColor={(color) => setSelectedColor(color)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClearAnnotations={() => {
          pushToHistory();
          setHighlights([]);
          setComments([]);
          setTexts([]);
          setSignatures([]);
        }}
      />

      {/* 3. Zone d'édition en 2/3 colonnes : Miniatures à gauche + Document centré */}
      <div className="pdf-studio-body">
        {/* Colonne Gauche : Miniatures */}
        {isThumbnailsOpen && (
          <PdfPageThumbnails
            pages={pages}
            currentPage={currentPageModel.pageNumber}
            onSelectPage={(num) => setCurrentPageNumber(num)}
            onRotatePage={handleRotatePage}
            onDeletePage={handleDeletePage}
            onRestorePage={handleRestorePage}
            onAddPage={handleAddPage}
          />
        )}

        {/* Zone Centrale : Feuille A4 Réaliste avec Overlays d'Annotations */}
        <main className="pdf-studio-viewport">
          <PdfDocumentCanvas
            page={currentPageModel}
            totalPages={totalActivePages}
            zoomLevel={zoomLevel}
            activeTool={activeTool}
            selectedColor={selectedColor}
            highlights={highlights}
            comments={comments}
            texts={texts}
            signatures={signatures}
            underlines={underlines}
            strikethroughs={strikethroughs}
            onToggleHighlightParagraph={handleToggleHighlightParagraph}
            onUpdateHighlightColor={handleUpdateHighlightColor}
            onDeleteHighlight={handleDeleteHighlight}
            onToggleUnderline={handleToggleUnderline}
            onToggleStrike={handleToggleStrike}
            onAddComment={handleAddComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
            onToggleCommentOpen={handleToggleCommentOpen}
            onAddText={handleAddText}
            onUpdateText={handleUpdateText}
            onDeleteText={handleDeleteText}
            onAddSignature={handleAddSignature}
            onDeleteSignature={handleDeleteSignature}
          />
        </main>
      </div>
    </div>
  );
};
