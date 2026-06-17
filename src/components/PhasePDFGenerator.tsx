'use client';
import React, { useState } from 'react';
import { useGarage } from '@/context/GarageContext';
import { Download, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ACCENT = [180, 240, 82]; // #B4F052
const DARK = [18, 18, 18];
const HEADER_BG: [number, number, number] = [30, 30, 30];

function safeParse<T>(raw: string, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

function addHeader(doc: jsPDF, title: string, y: number): number {
  doc.setFillColor(HEADER_BG[0], HEADER_BG[1], HEADER_BG[2]);
  doc.rect(14, y, doc.internal.pageSize.getWidth() - 28, 10, 'F');
  doc.setTextColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 18, y + 7);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  return y + 16;
}

function addSubHeader(doc: jsPDF, title: string, y: number): number {
  doc.setTextColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 16, y);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  return y + 7;
}

function addText(doc: jsPDF, text: string, y: number, opts?: { italic?: boolean; size?: number; maxWidth?: number }): number {
  const sz = opts?.size || 10;
  doc.setFontSize(sz);
  doc.setFont('helvetica', opts?.italic ? 'italic' : 'normal');
  doc.setTextColor(60, 60, 60);
  const maxW = opts?.maxWidth || doc.internal.pageSize.getWidth() - 32;
  const lines = doc.splitTextToSize(text || 'Not yet completed', maxW);
  if (y + lines.length * (sz * 0.5) > doc.internal.pageSize.getHeight() - 20) {
    doc.addPage();
    y = 20;
  }
  doc.text(lines, 16, y);
  return y + lines.length * (sz * 0.45) + 4;
}

function addLabelValue(doc: jsPDF, label: string, value: string, y: number): number {
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  doc.text(label + ':', 16, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const lines = doc.splitTextToSize(value || '—', doc.internal.pageSize.getWidth() - 80);
  doc.text(lines, 60, y);
  return y + Math.max(lines.length * 4, 6) + 2;
}

function checkPage(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > doc.internal.pageSize.getHeight() - 20) {
    doc.addPage();
    return 20;
  }
  return y;
}

function addFooters(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `INNOVATION CENTER at BusinessHUB / District.org — Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
}

function createTitlePage(doc: jsPDF, phaseTitle: string, phaseSub: string) {
  // Background
  doc.setFillColor(DARK[0], DARK[1], DARK[2]);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');

  // Accent line
  doc.setFillColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  doc.rect(14, 60, doc.internal.pageSize.getWidth() - 28, 3, 'F');

  // Brand
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('INNOVATION CENTER at BusinessHUB / District.org', 14, 50);

  // Title
  doc.setTextColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(phaseTitle, 14, 85);

  // Subtitle
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(phaseSub, 14, 100);

  // Date
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 120);

  doc.addPage();
}

// ═══════════════════════════════════════════
// PHASE 1: Problem Discovery Report
// ═══════════════════════════════════════════
function generatePhase1(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'Problem Discovery Report', 'Phase 1 Summary — Tasks 1 through 4');
  let y = 20;

  // --- Task 1: Problems ---
  y = addHeader(doc, '1. Problem Inventory (Task 1)', y);
  const problems = safeParse<Array<{id: string; statement: string; who: string; where: string; painful: string; opportunityTypes: string[]}>>(getTaskInput(1, 'problems'), []);
  if (problems.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['#', 'Problem Statement', 'Who', 'Where', 'Types']],
      body: problems.map((p, i) => [
        String(i + 1),
        p.statement || '—',
        p.who || '—',
        p.where || '—',
        (p.opportunityTypes || []).join(', ') || '—'
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No problems added yet.', y, { italic: true });
  }

  // --- Task 1: Trends ---
  y = checkPage(doc, y, 30);
  y = addHeader(doc, '2. Trend Signals (Task 1)', y);
  const trends = safeParse<Array<{trend: string; where: string; note: string}>>(getTaskInput(1, 'trends'), []);
  if (trends.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['#', 'Trend', 'Where', 'Note']],
      body: trends.map((t, i) => [String(i + 1), t.trend || '—', t.where || '—', t.note || '—']),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No trend signals added yet.', y, { italic: true });
  }

  // --- Task 2: Evaluation Matrix ---
  y = checkPage(doc, y, 30);
  y = addHeader(doc, '3. Evaluation Matrix (Task 2)', y);
  const evaluations = safeParse<Record<string, {pain?: number; frequency?: number; urgency?: number; alternatives?: number; trend?: number; reach?: number; pay?: number; insight?: number}>>(getTaskInput(2, 'evaluations'), {});
  const evalEntries = Object.entries(evaluations);
  if (evalEntries.length > 0 && problems.length > 0) {
    const criteriaKeys = ['pain', 'frequency', 'urgency', 'alternatives', 'trend', 'reach', 'pay', 'insight'] as const;
    autoTable(doc, {
      startY: y,
      head: [['Problem', ...criteriaKeys.map(k => k.charAt(0).toUpperCase() + k.slice(1)), 'Total']],
      body: evalEntries.map(([pid, scores]) => {
        const prob = problems.find(p => p.id === pid);
        const name = prob ? (prob.statement || '').substring(0, 30) : pid.substring(0, 10);
        const vals = criteriaKeys.map(k => String((scores as Record<string, number>)[k] || 0));
        const total = criteriaKeys.reduce((s, k) => s + ((scores as Record<string, number>)[k] || 0), 0);
        return [name, ...vals, String(total)];
      }),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 7 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
      columnStyles: { 0: { cellWidth: 35 } },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No evaluations completed yet.', y, { italic: true });
  }

  // --- Task 3: Selected Problem ---
  doc.addPage();
  y = 20;
  y = addHeader(doc, '4. Selected Focus Problem (Task 3)', y);
  const selectedProblem = safeParse<{customer?: string; problem?: string; context?: string; impact?: string; trend?: string; compiled?: string}>(getTaskInput(3, 'selectedProblemStatement'), {});
  if (selectedProblem.compiled) {
    y = addText(doc, selectedProblem.compiled, y, { size: 11 });
    y += 4;
    y = addLabelValue(doc, 'Customer', selectedProblem.customer || '—', y);
    y = addLabelValue(doc, 'Problem', selectedProblem.problem || '—', y);
    y = addLabelValue(doc, 'Context', selectedProblem.context || '—', y);
    y = addLabelValue(doc, 'Impact', selectedProblem.impact || '—', y);
    y = addLabelValue(doc, 'Trend', selectedProblem.trend || '—', y);
  } else {
    y = addText(doc, 'No problem selected yet.', y, { italic: true });
  }

  // --- Task 3: Target Customer ---
  y += 4;
  y = addHeader(doc, '5. Target Customer Profile (Task 3)', y);
  const targetCustomer = safeParse<{primarySegment?: string; specificPersona?: string; workflowContext?: string; currentWorkaround?: string; segmentPriority?: string}>(getTaskInput(3, 'targetCustomer'), {});
  y = addLabelValue(doc, 'Primary Segment', targetCustomer.primarySegment || '—', y);
  y = addLabelValue(doc, 'Persona', targetCustomer.specificPersona || '—', y);
  y = addLabelValue(doc, 'Workflow Context', targetCustomer.workflowContext || '—', y);
  y = addLabelValue(doc, 'Current Workaround', targetCustomer.currentWorkaround || '—', y);

  // --- Task 3: Decision Rationale ---
  y += 4;
  y = addSubHeader(doc, 'Decision Rationale', y);
  y = addText(doc, getTaskInput(3, 'decisionRationale') || 'Not documented yet.', y);

  // --- Task 4: Customer Situation ---
  doc.addPage();
  y = 20;
  y = addHeader(doc, '6. Customer Situation (Task 4)', y);
  const situation = safeParse<{whenAppears?: string; triggers?: string; tryingToAccomplish?: string; doToday?: string; whatMakesDifficult?: string}>(getTaskInput(4, 'customerSituation'), {});
  y = addLabelValue(doc, 'When it appears', situation.whenAppears || '—', y);
  y = addLabelValue(doc, 'Triggers', situation.triggers || '—', y);
  y = addLabelValue(doc, 'Customer goal', situation.tryingToAccomplish || '—', y);
  y = addLabelValue(doc, 'Current behavior', situation.doToday || '—', y);
  y = addLabelValue(doc, 'Difficulty', situation.whatMakesDifficult || '—', y);

  // --- Task 4: Jobs ---
  y += 4;
  y = addHeader(doc, '7. Jobs To Be Done (Task 4)', y);
  const jobs = safeParse<{functional?: string; emotional?: string; social?: string; mainJTBD?: {situation?: string; motivation?: string; desiredOutcome?: string; compiled?: string}}>(getTaskInput(4, 'jobs'), {});
  y = addLabelValue(doc, 'Functional Job', jobs.functional || '—', y);
  y = addLabelValue(doc, 'Emotional Job', jobs.emotional || '—', y);
  y = addLabelValue(doc, 'Social Job', jobs.social || '—', y);
  if (jobs.mainJTBD?.compiled) {
    y += 2;
    y = addSubHeader(doc, 'Main JTBD Statement', y);
    y = addText(doc, jobs.mainJTBD.compiled, y, { size: 11 });
  }

  // --- Task 4: Pains ---
  y = checkPage(doc, y, 40);
  y += 4;
  y = addHeader(doc, '8. Customer Pains (Task 4)', y);
  const pains = safeParse<Array<{description?: string; category?: string; intensity?: number; frequency?: string; evidence?: string}>>(getTaskInput(4, 'pains'), []);
  if (pains.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['#', 'Pain Description', 'Category', 'Intensity', 'Frequency', 'Evidence']],
      body: pains.map((p, i) => [
        String(i + 1),
        (p.description || '—').substring(0, 60),
        p.category || '—',
        p.intensity ? '\u2605'.repeat(p.intensity) : '—',
        p.frequency || '—',
        (p.evidence || '—').substring(0, 40)
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No pains documented yet.', y, { italic: true });
  }

  // --- Task 4: Gains ---
  y = checkPage(doc, y, 40);
  y = addHeader(doc, '9. Customer Gains (Task 4)', y);
  const gains = safeParse<Array<{description?: string; category?: string; importance?: number; desiredOutcome?: string; evidence?: string}>>(getTaskInput(4, 'gains'), []);
  if (gains.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['#', 'Gain Description', 'Category', 'Importance', 'Desired Outcome']],
      body: gains.map((g, i) => [
        String(i + 1),
        (g.description || '—').substring(0, 60),
        g.category || '—',
        g.importance ? '\u2605'.repeat(g.importance) : '—',
        (g.desiredOutcome || '—').substring(0, 50)
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No gains documented yet.', y, { italic: true });
  }
}

// ═══════════════════════════════════════════
// PHASE 2: Strategic Foundation & Roadmap
// ═══════════════════════════════════════════
function generatePhase2(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'Strategic Foundation & Roadmap', 'Phase 2 Summary — Tasks 5 through 7');
  let y = 20;

  // --- Task 5: North Star ---
  y = addHeader(doc, '1. Change Statement (Task 5)', y);
  y = addText(doc, getTaskInput(5, 'changeStatement') || 'Not yet drafted.', y, { size: 12 });
  y += 4;

  y = addHeader(doc, '2. Vision Statement (Task 5)', y);
  y = addText(doc, getTaskInput(5, 'vision') || 'Not yet drafted.', y, { size: 12 });
  y += 4;

  y = addHeader(doc, '3. Mission Statement (Task 5)', y);
  y = addText(doc, getTaskInput(5, 'mission') || 'Not yet drafted.', y, { size: 12 });
  y += 4;

  // --- Values ---
  y = checkPage(doc, y, 40);
  y = addHeader(doc, '4. Core Values (Task 5)', y);
  const values = safeParse<Array<{name?: string; category?: string; meaning?: string; behavior?: string; antiBehavior?: string}>>(getTaskInput(5, 'values_structured'), []);
  if (values.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Value', 'Category', 'Meaning', 'Behavior', 'Anti-Behavior']],
      body: values.map(v => [v.name || '—', v.category || '—', (v.meaning || '—').substring(0, 50), (v.behavior || '—').substring(0, 50), (v.antiBehavior || '—').substring(0, 50)]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No core values defined yet.', y, { italic: true });
  }

  // --- Decision Principles ---
  y = checkPage(doc, y, 30);
  y = addHeader(doc, '5. Decision Principles (Task 5)', y);
  const principles = safeParse<{doList?: string[]; doNotList?: string[]}>(getTaskInput(5, 'decisionPrinciples'), {});
  if (principles.doList && principles.doList.length > 0) {
    y = addSubHeader(doc, 'We DO:', y);
    for (const item of principles.doList) { y = addText(doc, '\u2022 ' + item, y); }
    y += 3;
  }
  if (principles.doNotList && principles.doNotList.length > 0) {
    y = addSubHeader(doc, 'We DO NOT:', y);
    for (const item of principles.doNotList) { y = addText(doc, '\u2022 ' + item, y); }
  }

  // --- Task 6: Destination ---
  doc.addPage();
  y = 20;
  y = addHeader(doc, '6. 3-Year Destination Statement (Task 6)', y);
  y = addText(doc, getTaskInput(6, 'destinationStatement') || 'Not yet drafted.', y, { size: 11 });

  // --- Milestones ---
  y += 4;
  y = addHeader(doc, '7. Milestones (Task 6)', y);
  const milestones = safeParse<Array<{description?: string; category?: string; whyMatters?: string; horizon?: string}>>(getTaskInput(6, 'milestones'), []);
  if (milestones.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['#', 'Milestone', 'Category', 'Why it Matters', 'Horizon']],
      body: milestones.map((m, i) => [String(i + 1), (m.description || '—').substring(0, 50), m.category || '—', (m.whyMatters || '—').substring(0, 40), m.horizon || '—']),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No milestones added yet.', y, { italic: true });
  }

  // --- Roadmap Summary ---
  y = checkPage(doc, y, 30);
  y = addHeader(doc, '8. Streamlined Roadmap v0 (Task 7)', y);
  const roadmapNotes = getTaskInput(7, 'notes');
  if (roadmapNotes) {
    y = addText(doc, roadmapNotes, y, { size: 9 });
  } else {
    y = addText(doc, 'Roadmap not yet finalized.', y, { italic: true });
  }
}

// ═══════════════════════════════════════════
// PHASE 3: Founder & Team Blueprint
// ═══════════════════════════════════════════
function generatePhase3(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'Founder & Team Blueprint', 'Phase 3 Summary — Tasks 8 through 10');
  let y = 20;

  // --- Readiness ---
  y = addHeader(doc, '1. Founder Readiness Snapshot (Task 8)', y);
  const readiness = safeParse<Array<{area?: string; score?: number; evidence?: string; risk?: string; improvementAction?: string}>>(getTaskInput(8, 'readinessSnapshot'), []);
  if (readiness.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Area', 'Score', 'Evidence', 'Risk', 'Action']],
      body: readiness.map(r => [r.area || '—', String(r.score || 0) + '/5', (r.evidence || '—').substring(0, 35), (r.risk || '—').substring(0, 35), (r.improvementAction || '—').substring(0, 35)]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'Readiness snapshot not completed yet.', y, { italic: true });
  }

  // --- Skill Gaps ---
  y = checkPage(doc, y, 40);
  y = addHeader(doc, '2. Skill Gap Map (Task 8)', y);
  const skillGaps = safeParse<Array<{skillArea?: string; currentLevel?: number; neededLevel?: number; gap?: number; howToCover?: string}>>(getTaskInput(8, 'skillGapMap'), []);
  if (skillGaps.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Skill Area', 'Current', 'Needed', 'Gap', 'How to Cover']],
      body: skillGaps.map(s => [s.skillArea || '—', String(s.currentLevel || 0), String(s.neededLevel || 0), String(s.gap || 0), (s.howToCover || '—').substring(0, 40)]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'Skill gap map not completed yet.', y, { italic: true });
  }

  // --- AI Leverage ---
  y = checkPage(doc, y, 40);
  y = addHeader(doc, '3. AI Leverage & Delegation Map (Task 8)', y);
  const aiLeverage = safeParse<Array<{workArea?: string; founderRole?: string; aiSupport?: string; humanSupportNeeded?: string}>>(getTaskInput(8, 'aiLeverageMap'), []);
  if (aiLeverage.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Work Area', 'Founder Role', 'AI Support', 'Human Support']],
      body: aiLeverage.map(a => [a.workArea || '—', (a.founderRole || '—').substring(0, 35), (a.aiSupport || '—').substring(0, 35), (a.humanSupportNeeded || '—').substring(0, 35)]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'AI leverage map not completed yet.', y, { italic: true });
  }

  // --- Wellbeing ---
  y = checkPage(doc, y, 40);
  y = addHeader(doc, '4. Energy & Wellbeing Protocol (Task 8)', y);
  const wellbeing = safeParse<Array<{area?: string; minimumStandard?: string; warningSignal?: string; recoveryAction?: string}>>(getTaskInput(8, 'energyWellbeing'), []);
  if (wellbeing.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Area', 'Minimum Standard', 'Warning Signal', 'Recovery Action']],
      body: wellbeing.map(w => [w.area || '—', (w.minimumStandard || '—').substring(0, 40), (w.warningSignal || '—').substring(0, 40), (w.recoveryAction || '—').substring(0, 40)]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'Wellbeing protocol not completed yet.', y, { italic: true });
  }

  // --- Team Roles ---
  doc.addPage();
  y = 20;
  y = addHeader(doc, '5. Needed Team Roles (Task 9)', y);
  const roles = safeParse<Array<{title?: string; type?: string; skills?: string; contribution?: string; priority?: string; timeline?: string}>>(getTaskInput(9, 'neededRoles'), []);
  if (roles.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Role Title', 'Type', 'Key Skills', 'Priority', 'Timeline']],
      body: roles.map(r => [r.title || '—', r.type || '—', (r.skills || '—').substring(0, 40), r.priority || '—', r.timeline || '—']),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No roles defined yet.', y, { italic: true });
  }

  // --- Co-founder Assessment ---
  y = checkPage(doc, y, 30);
  y = addHeader(doc, '6. Co-Founder Assessment (Task 9)', y);
  const cofounder = safeParse<{needsCofounder?: string; justification?: string; alternative?: string; riskOfNot?: string}>(getTaskInput(9, 'coFounderAssessment'), {});
  y = addLabelValue(doc, 'Needs Co-Founder?', cofounder.needsCofounder || '—', y);
  y = addLabelValue(doc, 'Justification', cofounder.justification || '—', y);
  y = addLabelValue(doc, 'Alternative', cofounder.alternative || '—', y);
  y = addLabelValue(doc, 'Risk of Not Having', cofounder.riskOfNot || '—', y);

  // --- Mentorship Needs ---
  y = checkPage(doc, y, 40);
  y += 4;
  y = addHeader(doc, '7. Mentorship Needs (Task 9 \u2192 Task 10)', y);
  const mentorNeeds = safeParse<Array<{area?: string; whyNeeded?: string; mentorQuestion?: string; urgency?: string}>>(getTaskInput(9, 'mentorshipNeedsForTask10'), []);
  if (mentorNeeds.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Area', 'Why Needed', 'Key Question', 'Urgency']],
      body: mentorNeeds.map(m => [(m.area || '—').substring(0, 30), (m.whyNeeded || '—').substring(0, 40), (m.mentorQuestion || '—').substring(0, 40), m.urgency || '—']),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No mentorship needs documented yet.', y, { italic: true });
  }

  // --- Mentor Shortlist ---
  y = checkPage(doc, y, 40);
  y = addHeader(doc, '8. Mentor Shortlist (Task 10)', y);
  const mentors = safeParse<Array<{name?: string; roleType?: string; whyThisPerson?: string; status?: string; experienceFit?: number; networkFit?: number; valuesFit?: number}>>(getTaskInput(10, 'mentorShortlist'), []);
  if (mentors.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Name', 'Role Type', 'Why This Person', 'Status', 'Exp Fit', 'Net Fit', 'Val Fit']],
      body: mentors.map(m => [m.name || '—', m.roleType || '—', (m.whyThisPerson || '—').substring(0, 35), m.status || '—', String(m.experienceFit || 0), String(m.networkFit || 0), String(m.valuesFit || 0)]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 7 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No mentors shortlisted yet.', y, { italic: true });
  }
}

// ═══════════════════════════════════════════
// PHASE 4: Innovation Horizon & Idea Portfolio
// ═══════════════════════════════════════════
function generatePhase4(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'Innovation Horizon & Idea Portfolio', 'Phase 4 Summary — Tasks 11 through 13');
  let y = 20;

  // --- Horizon Decision ---
  y = addHeader(doc, '1. Innovation Horizon Decision (Task 11)', y);
  const primary = getTaskInput(11, 'primaryHorizon') || '—';
  const secondary = getTaskInput(11, 'secondaryHorizon') || 'none';
  y = addLabelValue(doc, 'Primary Horizon', primary, y);
  if (secondary !== 'none') {
    y = addLabelValue(doc, 'Secondary Horizon', secondary, y);
  }
  y = addLabelValue(doc, 'Why This Horizon', getTaskInput(11, 'whyThisHorizon') || '—', y);
  y = addLabelValue(doc, 'Why Not Others', getTaskInput(11, 'whyNotOtherHorizons') || '—', y);
  y += 3;

  // --- Assumptions & Risks ---
  y = addHeader(doc, '2. Key Assumptions & Risks (Task 11)', y);
  y = addLabelValue(doc, 'Key Assumptions', getTaskInput(11, 'keyAssumptions') || '—', y);
  y = addLabelValue(doc, 'Risks Created', getTaskInput(11, 'risksCreated') || '—', y);
  y = addLabelValue(doc, 'Evidence Needed', getTaskInput(11, 'evidenceNeeded') || '—', y);
  y = addLabelValue(doc, 'Implications', getTaskInput(11, 'implicationsForIdeation') || '—', y);

  // --- Strategic Fit Scores ---
  y = checkPage(doc, y, 40);
  y += 4;
  y = addHeader(doc, '3. Strategic Fit Scores (Task 11)', y);
  const fitScoresRaw = safeParse<Record<string, Record<string, number>>>(getTaskInput(11, 'strategicFitScores'), {});
  const horizonKeys = Object.keys(fitScoresRaw);
  if (horizonKeys.length > 0) {
    const criteria = Object.keys(fitScoresRaw[horizonKeys[0]] || {});
    autoTable(doc, {
      startY: y,
      head: [['Criterion', ...horizonKeys]],
      body: criteria.map(c => [c, ...horizonKeys.map(h => String(fitScoresRaw[h]?.[c] || 0))]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 8, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No strategic fit scores recorded yet.', y, { italic: true });
  }

  // --- Transferable Mechanisms ---
  doc.addPage();
  y = 20;
  y = addHeader(doc, '4. Transferable Mechanisms (Task 12)', y);
  const mechanisms = safeParse<Array<{name?: string; sourceModel?: string; whyItWorks?: string; possibleApplication?: string; mainRisk?: string}>>(getTaskInput(12, 'transferableMechanisms'), []);
  if (mechanisms.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Mechanism', 'Source Model', 'Why it Works', 'Application', 'Risk']],
      body: mechanisms.map(m => [m.name || '—', m.sourceModel || '—', (m.whyItWorks || '—').substring(0, 35), (m.possibleApplication || '—').substring(0, 35), (m.mainRisk || '—').substring(0, 25)]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No transferable mechanisms extracted yet.', y, { italic: true });
  }

  // --- Ecosystem Stakeholders ---
  y = checkPage(doc, y, 40);
  y = addHeader(doc, '5. Ecosystem Stakeholders (Task 12)', y);
  const stakeholders = safeParse<Array<{name?: string; category?: string; role?: string; valueGive?: string; valueReceive?: string; tension?: string}>>(getTaskInput(12, 'ecosystemStakeholders'), []);
  if (stakeholders.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Stakeholder', 'Category', 'Role', 'Value Given', 'Value Received']],
      body: stakeholders.map(s => [s.name || '—', s.category || '—', (s.role || '—').substring(0, 30), (s.valueGive || '—').substring(0, 30), (s.valueReceive || '—').substring(0, 30)]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No stakeholders mapped yet.', y, { italic: true });
  }

  // --- Idea Long List ---
  doc.addPage();
  y = 20;
  y = addHeader(doc, '6. Idea Long List (Task 13)', y);
  const ideas = safeParse<Array<{name?: string; description?: string; sourceMechanism?: string; targetSegment?: string; horizonAlignment?: string; comments?: string}>>(getTaskInput(13, 'ideasLongList'), []);
  if (ideas.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['#', 'Idea Name', 'Description', 'Source', 'Segment', 'Horizon']],
      body: ideas.map((idea, i) => [
        String(i + 1),
        idea.name || '—',
        (idea.description || '—').substring(0, 50),
        (idea.sourceMechanism || '—').substring(0, 20),
        (idea.targetSegment || '—').substring(0, 20),
        idea.horizonAlignment || '—'
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No ideas generated yet.', y, { italic: true });
  }

  // --- Team Comments ---
  y = checkPage(doc, y, 20);
  y = addHeader(doc, '7. Team Comments & Notes (Task 13)', y);
  y = addText(doc, getTaskInput(13, 'teamComments') || 'No team comments recorded.', y);
}



// ═══════════════════════════════════════════
// PHASE 5 TYPES
// ═══════════════════════════════════════════
interface ShortlistedIdea {
  ideaId: string;
  rank: number;
  whyShortlisted: string;
  whatMakesItPromising: string;
  biggestRisk: string;
  keyAssumption: string;
  nextAnalysisTask: string;
}

interface ParkedRejectedIdea {
  ideaId: string;
  status: string;
  reason: string;
  revisitCondition: string;
}

interface StrongestLever {
  ideaId: string;
  innovationType: string;
  whyItMatters: string;
  howItCreatesDifferentiation: string;
  whatMustBeTrue: string;
  riskOrUncertainty?: string;
}

interface InnovationScore {
  ideaId: string;
  innovationDepth: number;
  differentiationPotential: number;
  customerValue: number;
  businessModelStrength: number;
  executionFeasibility: number;
  totalScore: number;
}

interface CompetitorMap {
  ideaId: string;
  directCompetitors: string;
  indirectAlternatives: string;
  currentWorkaround: string;
  doNothingCost: string;
}

interface ERRCGrid {
  ideaId: string;
  eliminate: string;
  reduce: string;
  raise: string;
  create: string;
}

interface DifferentiationLogic {
  ideaId: string;
  insteadOfCompetingOn: string;
  weCompeteBy: string;
  soTargetCustomerCan: string;
  withLessPainCost: string;
}

interface BlueOceanScore {
  ideaId: string;
  valueInnovation: number;
  differentiationClarity: number;
  nonCustomerPotential: number;
  competitionAvoidance: number;
  costAdvantage: number;
  adoptionSimplicity: number;
  totalScore: number;
}

interface BMCCanvas {
  ideaId: string;
  keyPartners: string;
  keyActivities: string;
  keyResources: string;
  valuePropositions: string;
  customerRelationships: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
}

interface VPCCanvas {
  ideaId: string;
  customerJobs: string;
  customerPains: string;
  customerGains: string;
  productsServices: string;
  painRelievers: string;
  gainCreators: string;
}

interface CanvasRisk {
  ideaId: string;
  assumptions: string;
  criticalRisks: string;
  mitigationPlan: string;
}

interface HypothesisStatus {
  ideaId: string;
  personaHypothesis: string;
  problemHypothesis: string;
  valueHypothesis: string;
}

interface Interview {
  customerName: string;
  customerRole: string;
  companyName: string;
  ideaId: string;
  painValidation: string;
  verbatimQuote: string;
  notes: string;
}

interface RankedIdea {
  ideaId: string;
  rank: number;
  rationale: string;
  riskRating: string;
  feasibilityRating: string;
}

interface SelectionDetails {
  championRationale?: string;
  contingencyPlan?: string;
  immediateMilestone?: string;
}

interface ValidationRow {
  assumption: string;
  type: string;
  method: string;
  targetMetric: string;
  status: string;
}

interface WireframeScreen {
  title: string;
  description: string;
  components: string;
}

// ═══════════════════════════════════════════
// PHASE 5: Business Model Determination Report
// ═══════════════════════════════════════════
function generatePhase5(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'Business Model Determination', 'Phase 5 Summary — Tasks 14 through 20');
  let y = 20;

  // Build a helper map for shortlisted idea names using Task 13's ideasLongList
  const ideasLongList = safeParse<Array<{id?: string; name?: string}>>(getTaskInput(13, 'ideasLongList'), []);
  const ideaNameMap = new Map<string, string>();
  ideasLongList.forEach(idea => {
    if (idea.id && idea.name) {
      ideaNameMap.set(idea.id, idea.name);
    }
  });

  const getIdeaName = (ideaId: string): string => {
    if (ideaNameMap.has(ideaId)) return ideaNameMap.get(ideaId) || ideaId;
    const normalizedCards = safeParse<Array<{ideaId: string; ideaName: string}>>(getTaskInput(14, 'normalizedIdeaCards'), []);
    const card = normalizedCards.find(c => c.ideaId === ideaId);
    if (card && card.ideaName) return card.ideaName;
    return ideaId;
  };

  // Fetch all required keys for Tasks 14-20
  getTaskInput(14, 'normalizedIdeaCards');
  getTaskInput(14, 'firstPassFilter');
  getTaskInput(14, 'ideaScores');
  const shortlistedIdeas = safeParse<ShortlistedIdea[]>(getTaskInput(14, 'shortlistedIdeas'), []);
  const parkedRejectedIdeas = safeParse<ParkedRejectedIdea[]>(getTaskInput(14, 'parkedRejectedIdeas'), []);

  getTaskInput(15, 'tenTypesAnalysis');
  const strongestInnovationLevers = safeParse<StrongestLever[]>(getTaskInput(15, 'strongestInnovationLevers'), []);
  const innovationPotentialScores = safeParse<InnovationScore[]>(getTaskInput(15, 'innovationPotentialScores'), []);
  getTaskInput(15, 'weakInnovationAreas');

  const competitorMap = safeParse<CompetitorMap[]>(getTaskInput(16, 'competitorMap'), []);
  getTaskInput(16, 'valueFactors');
  getTaskInput(16, 'strategyCanvasScores');
  const errcGrid = safeParse<ERRCGrid[]>(getTaskInput(16, 'errcGrid'), []);
  const differentiationLogic = safeParse<DifferentiationLogic[]>(getTaskInput(16, 'differentiationLogic'), []);
  const blueOceanScores = safeParse<BlueOceanScore[]>(getTaskInput(16, 'blueOceanScores'), []);

  const businessModelCanvases = safeParse<BMCCanvas[]>(getTaskInput(17, 'businessModelCanvases'), []);
  const valuePropositionCanvases = safeParse<VPCCanvas[]>(getTaskInput(17, 'valuePropositionCanvases'), []);
  const canvasRisks = safeParse<CanvasRisk[]>(getTaskInput(17, 'canvasRisks'), []);

  getTaskInput(18, 'questionnaires');
  const interviewsList = safeParse<Interview[]>(getTaskInput(18, 'interviewsList'), []);
  const hypothesisStatuses = safeParse<HypothesisStatus[]>(getTaskInput(18, 'hypothesisStatuses'), []);

  const finalShortlistRankings = safeParse<RankedIdea[]>(getTaskInput(19, 'finalShortlistRankings'), []);
  const championSelectionDetails = safeParse<SelectionDetails>(getTaskInput(19, 'championSelectionDetails'), {});
  const winningBusinessModelName = getTaskInput(19, 'winningBusinessModelName') || '';

  const pocScopeDetails = getTaskInput(20, 'pocScopeDetails') || '';
  const feasibilityValidationMatrix = safeParse<ValidationRow[]>(getTaskInput(20, 'feasibilityValidationMatrix'), []);
  const wireframeScreens = safeParse<WireframeScreen[]>(getTaskInput(20, 'wireframeScreens'), []);
  const failConditions = getTaskInput(20, 'failConditions') || '';

  // --- Task 14: Shortlisted Ideas (table) ---
  y = addHeader(doc, '1. Shortlisted Ideas (Task 14)', y);
  if (shortlistedIdeas.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Rank', 'Idea Name', 'Why Shortlisted', 'Key Assumption', 'Biggest Risk']],
      body: shortlistedIdeas.map(s => [
        String(s.rank || ''),
        getIdeaName(s.ideaId),
        s.whyShortlisted || '—',
        s.keyAssumption || '—',
        s.biggestRisk || '—'
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No shortlisted ideas recorded.', y, { italic: true });
  }

  // --- Task 14: Parked/Rejected Ideas (table) ---
  y = checkPage(doc, y, 40);
  y = addHeader(doc, '2. Parked & Rejected Ideas (Task 14)', y);
  if (parkedRejectedIdeas.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Idea Name', 'Status', 'Reason', 'Revisit Condition']],
      body: parkedRejectedIdeas.map(p => [
        getIdeaName(p.ideaId),
        p.status || '—',
        p.reason || '—',
        p.revisitCondition || '—'
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No parked or rejected ideas recorded.', y, { italic: true });
  }

  // --- Task 15: Innovation Analysis (strongest levers, scores) ---
  doc.addPage();
  y = 20;
  y = addHeader(doc, '3. Innovation Analysis (Task 15)', y);
  if (strongestInnovationLevers.length > 0) {
    y = addSubHeader(doc, 'Strongest Innovation Levers', y);
    autoTable(doc, {
      startY: y,
      head: [['Idea Name', 'Innovation Type', 'Why It Matters', 'Differentiation Logic', 'What Must Be True']],
      body: strongestInnovationLevers.map(l => [
        getIdeaName(l.ideaId),
        l.innovationType || '—',
        l.whyItMatters || '—',
        l.howItCreatesDifferentiation || '—',
        l.whatMustBeTrue || '—'
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 8;
  }

  if (innovationPotentialScores.length > 0) {
    y = checkPage(doc, y, 40);
    y = addSubHeader(doc, 'Innovation Potential Scores', y);
    autoTable(doc, {
      startY: y,
      head: [['Idea Name', 'Depth', 'Differentiation', 'Customer Value', 'Biz Model Strength', 'Feasibility', 'Total Score']],
      body: innovationPotentialScores.map(s => [
        getIdeaName(s.ideaId),
        String(s.innovationDepth || 0),
        String(s.differentiationPotential || 0),
        String(s.customerValue || 0),
        String(s.businessModelStrength || 0),
        String(s.executionFeasibility || 0),
        String(s.totalScore || 0)
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  }

  // --- Task 16: Blue Ocean Strategy ---
  doc.addPage();
  y = 20;
  y = addHeader(doc, '4. Blue Ocean Strategy (Task 16)', y);

  if (competitorMap.length > 0) {
    y = addSubHeader(doc, 'Competitor Map', y);
    autoTable(doc, {
      startY: y,
      head: [['Idea Name', 'Direct Competitors', 'Indirect Alternatives', 'Current Workaround', 'Cost of Do Nothing']],
      body: competitorMap.map(c => [
        getIdeaName(c.ideaId),
        c.directCompetitors || '—',
        c.indirectAlternatives || '—',
        c.currentWorkaround || '—',
        c.doNothingCost || '—'
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 8;
  }

  if (errcGrid.length > 0) {
    y = checkPage(doc, y, 40);
    y = addSubHeader(doc, 'ERRC Grid', y);
    autoTable(doc, {
      startY: y,
      head: [['Idea Name', 'Eliminate', 'Reduce', 'Raise', 'Create']],
      body: errcGrid.map(e => [
        getIdeaName(e.ideaId),
        e.eliminate || '—',
        e.reduce || '—',
        e.raise || '—',
        e.create || '—'
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 8;
  }

  if (differentiationLogic.length > 0) {
    y = checkPage(doc, y, 40);
    y = addSubHeader(doc, 'Differentiation Logic', y);
    autoTable(doc, {
      startY: y,
      head: [['Idea Name', 'Instead of Competing On', 'We Compete By', 'So Customers Can', 'Less Pain/Cost']],
      body: differentiationLogic.map(d => [
        getIdeaName(d.ideaId),
        d.insteadOfCompetingOn || '—',
        d.weCompeteBy || '—',
        d.soTargetCustomerCan || '—',
        d.withLessPainCost || '—'
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 8;
  }

  if (blueOceanScores.length > 0) {
    y = checkPage(doc, y, 40);
    y = addSubHeader(doc, 'Blue Ocean Scores', y);
    autoTable(doc, {
      startY: y,
      head: [['Idea Name', 'Value Innov.', 'Diff. Clarity', 'Non-Customer', 'Comp. Avoid', 'Cost Adv.', 'Adoption', 'Total']],
      body: blueOceanScores.map(s => [
        getIdeaName(s.ideaId),
        String(s.valueInnovation || 0),
        String(s.differentiationClarity || 0),
        String(s.nonCustomerPotential || 0),
        String(s.competitionAvoidance || 0),
        String(s.costAdvantage || 0),
        String(s.adoptionSimplicity || 0),
        String(s.totalScore || 0)
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  }

  // --- Task 17: Business Model Canvas & VPC summaries ---
  doc.addPage();
  y = 20;
  y = addHeader(doc, '5. Business Model Canvas & VPC (Task 17)', y);

  const canvasesToPrint = shortlistedIdeas.length > 0
    ? shortlistedIdeas.map(s => s.ideaId)
    : businessModelCanvases.map(b => b.ideaId);

  canvasesToPrint.forEach(ideaId => {
    const bmc = businessModelCanvases.find(b => b.ideaId === ideaId);
    const vpc = valuePropositionCanvases.find(v => v.ideaId === ideaId);
    const risk = canvasRisks.find(r => r.ideaId === ideaId);
    const ideaName = getIdeaName(ideaId);

    y = checkPage(doc, y, 50);
    y = addSubHeader(doc, `Business Model Canvas & VPC: ${ideaName}`, y);

    if (bmc) {
      autoTable(doc, {
        startY: y,
        head: [['BMC Component', 'Description / Details']],
        body: [
          ['Key Partners', bmc.keyPartners || '—'],
          ['Key Activities', bmc.keyActivities || '—'],
          ['Key Resources', bmc.keyResources || '—'],
          ['Value Propositions', bmc.valuePropositions || '—'],
          ['Customer Relationships', bmc.customerRelationships || '—'],
          ['Channels', bmc.channels || '—'],
          ['Customer Segments', bmc.customerSegments || '—'],
          ['Cost Structure', bmc.costStructure || '—'],
          ['Revenue Streams', bmc.revenueStreams || '—']
        ],
        theme: 'grid',
        headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
        bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
      });
      y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 6;
    }

    if (vpc) {
      y = checkPage(doc, y, 40);
      autoTable(doc, {
        startY: y,
        head: [['VPC Component', 'Description / Details']],
        body: [
          ['Customer Jobs', vpc.customerJobs || '—'],
          ['Customer Pains', vpc.customerPains || '—'],
          ['Customer Gains', vpc.customerGains || '—'],
          ['Products & Services', vpc.productsServices || '—'],
          ['Pain Relievers', vpc.painRelievers || '—'],
          ['Gain Creators', vpc.gainCreators || '—']
        ],
        theme: 'grid',
        headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
        bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
      });
      y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 6;
    }

    if (risk) {
      y = checkPage(doc, y, 35);
      autoTable(doc, {
        startY: y,
        head: [['Canvas Risks & Mitigation', 'Details']],
        body: [
          ['Key Assumptions', risk.assumptions || '—'],
          ['Critical Risks Identified', risk.criticalRisks || '—'],
          ['Mitigation Plan', risk.mitigationPlan || '—']
        ],
        theme: 'grid',
        headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
        bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
      });
      y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
    }
  });

  // --- Task 18: Customer Discovery Results ---
  doc.addPage();
  y = 20;
  y = addHeader(doc, '6. Customer Discovery (Task 18)', y);

  if (hypothesisStatuses.length > 0) {
    y = addSubHeader(doc, 'Hypothesis Validation Statuses', y);
    autoTable(doc, {
      startY: y,
      head: [['Idea Name', 'Persona Hypothesis', 'Problem Hypothesis', 'Value Hypothesis']],
      body: hypothesisStatuses.map(h => [
        getIdeaName(h.ideaId),
        h.personaHypothesis || '—',
        h.problemHypothesis || '—',
        h.valueHypothesis || '—'
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 8;
  }

  y = checkPage(doc, y, 40);
  y = addSubHeader(doc, `Logged Interviews (Total: ${interviewsList.length})`, y);
  if (interviewsList.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Idea Name', 'Customer / Role / Company', 'Pain Validation', 'Verbatim Quote / Notes']],
      body: interviewsList.map(i => [
        getIdeaName(i.ideaId),
        `${i.customerName || '—'} (${i.customerRole || '—'} at ${i.companyName || '—'})`,
        i.painValidation || '—',
        `Quote: "${i.verbatimQuote || '—'}"\nNotes: ${i.notes || '—'}`
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  } else {
    y = addText(doc, 'No interviews logged yet.', y, { italic: true });
  }

  // --- Task 19: Final Selection ---
  doc.addPage();
  y = 20;
  y = addHeader(doc, '7. Final Business Model Selection (Task 19)', y);

  const rankedIdeas = [...finalShortlistRankings].sort((a, b) => (a.rank || 0) - (b.rank || 0));
  const winnerFromRank = rankedIdeas.find(r => r.rank === 1);
  const runnerUpFromRank = rankedIdeas.find(r => r.rank === 2);
  const winnerName = winningBusinessModelName || (winnerFromRank ? getIdeaName(winnerFromRank.ideaId) : '—');
  const runnerUpName = runnerUpFromRank ? getIdeaName(runnerUpFromRank.ideaId) : '—';

  if (finalShortlistRankings.length > 0) {
    y = addSubHeader(doc, 'Final Shortlist Rankings', y);
    autoTable(doc, {
      startY: y,
      head: [['Rank', 'Idea Name', 'Risk Rating', 'Feasibility Rating', 'Rationale']],
      body: rankedIdeas.map(r => [
        String(r.rank || ''),
        getIdeaName(r.ideaId),
        r.riskRating || '—',
        r.feasibilityRating || '—',
        r.rationale || '—'
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 8;
  }

  y = checkPage(doc, y, 50);
  y = addSubHeader(doc, 'Crowned Champion & Backup Plan', y);
  y = addLabelValue(doc, 'Winning Business Model (Winner)', winnerName, y);
  y = addLabelValue(doc, 'Runner-Up Business Model', runnerUpName, y);
  y = addLabelValue(doc, 'Selection Rationale', championSelectionDetails.championRationale || '—', y);
  y = addLabelValue(doc, 'Contingency Backup Plan', championSelectionDetails.contingencyPlan || '—', y);
  y = addLabelValue(doc, 'Immediate Action Milestone', championSelectionDetails.immediateMilestone || '—', y);

  // --- Task 20: Proof of Concept Scope ---
  doc.addPage();
  y = 20;
  y = addHeader(doc, '8. Proof of Concept (PoC) Scope (Task 20)', y);

  y = addSubHeader(doc, 'PoC Boundaries & Fast-to-Fail Rules', y);
  y = addLabelValue(doc, 'Scope Details', pocScopeDetails || '—', y);
  y = addLabelValue(doc, 'Fast-to-Fail Conditions', failConditions || '—', y);

  if (feasibilityValidationMatrix.length > 0) {
    y = checkPage(doc, y, 40);
    y = addSubHeader(doc, 'Feasibility Validation Matrix', y);
    autoTable(doc, {
      startY: y,
      head: [['Assumption', 'Type', 'Validation Method', 'Target Metric', 'Status']],
      body: feasibilityValidationMatrix.map(f => [
        f.assumption || '—',
        f.type || '—',
        f.method || '—',
        f.targetMetric || '—',
        f.status || '—'
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 8;
  }

  if (wireframeScreens.length > 0) {
    y = checkPage(doc, y, 40);
    y = addSubHeader(doc, 'PoC Mock Wireframe Screens', y);
    autoTable(doc, {
      startY: y,
      head: [['Screen Title', 'Description', 'Mock Components']],
      body: wireframeScreens.map(w => [
        w.title || '—',
        w.description || '—',
        w.components || '—'
      ]),
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  }
}

// ═══════════════════════════════════════════
// HELPER: Generic task section (notes + deliverable)
// ═══════════════════════════════════════════
function addGenericTaskSection(doc: jsPDF, getTaskInput: (t: number, f: string) => string, taskNum: number, sectionNum: number, title: string, y: number): number {
  y = checkPage(doc, y, 40);
  y = addHeader(doc, `${sectionNum}. Task ${taskNum}: ${title}`, y);
  const notes = getTaskInput(taskNum, 'notes');
  const deliverable = getTaskInput(taskNum, 'deliverable');
  if (notes) {
    y = addSubHeader(doc, 'Notes & Key Insights', y);
    y = addText(doc, notes, y);
  }
  if (deliverable) {
    y = addLabelValue(doc, 'Key Deliverable', deliverable, y);
  }
  if (!notes && !deliverable) {
    y = addText(doc, 'Not yet completed.', y, { italic: true });
  }
  return y;
}

// ═══════════════════════════════════════════
// PHASE 6: Make Starter-Kits (Tasks 21-25)
// ═══════════════════════════════════════════
function generatePhase6(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'Starter-Kits Portfolio & Assets', 'Phase 6 Summary — Tasks 21 through 25');
  let y = 20;
  y = addGenericTaskSection(doc, getTaskInput, 21, 1, 'Define Your USPs', y);
  y = addGenericTaskSection(doc, getTaskInput, 22, 2, 'Assemble Focus Group & Follow Lean Start-up Loop', y);
  y = addGenericTaskSection(doc, getTaskInput, 23, 3, 'ESGs', y);
  y = addGenericTaskSection(doc, getTaskInput, 24, 4, 'Build Financial Model', y);
  y = addGenericTaskSection(doc, getTaskInput, 25, 5, 'Create Pitch Deck', y);
}

// ═══════════════════════════════════════════
// PHASE 7: Develop MVP (Tasks 26-31)
// ═══════════════════════════════════════════
function generatePhase7(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'MVP Technical Specification & Backlog', 'Phase 7 Summary — Tasks 26 through 31');
  let y = 20;

  // Task 26 has special fields
  y = addHeader(doc, '1. Task 26: Specify MVP', y);
  const productName = getTaskInput(26, 'productName');
  const features = getTaskInput(26, 'features');
  const targetUser = getTaskInput(26, 'targetUser');
  const keyMetric = getTaskInput(26, 'keyMetric');
  const t26notes = getTaskInput(26, 'notes');
  if (productName) y = addLabelValue(doc, 'Product Name', productName, y);
  if (features) { y = addSubHeader(doc, 'Core Features', y); y = addText(doc, features, y); }
  if (targetUser) y = addLabelValue(doc, 'Target User', targetUser, y);
  if (keyMetric) y = addLabelValue(doc, 'Key Metric', keyMetric, y);
  if (t26notes) { y = addSubHeader(doc, 'Notes', y); y = addText(doc, t26notes, y); }
  if (!productName && !features && !t26notes) y = addText(doc, 'Not yet completed.', y, { italic: true });

  y = addGenericTaskSection(doc, getTaskInput, 27, 2, 'Determine Tool Stack', y);
  y = addGenericTaskSection(doc, getTaskInput, 28, 3, 'Set Up Lean PMO', y);
  y = addGenericTaskSection(doc, getTaskInput, 29, 4, 'Perform Legal Check of Business Model & Key Documents', y);
  y = addGenericTaskSection(doc, getTaskInput, 30, 5, 'Calculate Costs for MVP Development', y);
  y = addGenericTaskSection(doc, getTaskInput, 31, 6, 'Develop MVP', y);
}

// ═══════════════════════════════════════════
// PHASE 8: Define Brand (Tasks 32-35)
// ═══════════════════════════════════════════
function generatePhase8(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'Brand Identity & Style System', 'Phase 8 Summary — Tasks 32 through 35');
  let y = 20;
  y = addGenericTaskSection(doc, getTaskInput, 32, 1, 'Define Your Brand', y);
  y = addGenericTaskSection(doc, getTaskInput, 33, 2, 'Establish an Online Footprint', y);
  y = addGenericTaskSection(doc, getTaskInput, 34, 3, 'Create Design & Wireframes', y);
  y = addGenericTaskSection(doc, getTaskInput, 35, 4, 'Finish Logo and Creatives', y);
}

// ═══════════════════════════════════════════
// PHASE 9: Raise (Pre-)Seed Capital (Tasks 36-42)
// ═══════════════════════════════════════════
function generatePhase9(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'Seed Funding Strategy & Pipeline', 'Phase 9 Summary — Tasks 36 through 42');
  let y = 20;
  y = addGenericTaskSection(doc, getTaskInput, 36, 1, 'Consider Various Funding Options', y);
  y = addGenericTaskSection(doc, getTaskInput, 37, 2, 'Calculate Required Funding Amount and Valuation', y);
  y = addGenericTaskSection(doc, getTaskInput, 38, 3, 'Determine Non-financial Investor Requirements', y);
  y = addGenericTaskSection(doc, getTaskInput, 39, 4, 'Identify Relevant Investor Types', y);
  y = addGenericTaskSection(doc, getTaskInput, 40, 5, 'Prepare and Pitch to Potential Investors', y);
  y = addGenericTaskSection(doc, getTaskInput, 41, 6, 'Evaluate Potentially Interested Investors', y);
  y = addGenericTaskSection(doc, getTaskInput, 42, 7, 'Secure (Pre-)Seed Investment', y);
}

// ═══════════════════════════════════════════
// PHASE 10: Build Functions (Tasks 43-60)
// ═══════════════════════════════════════════
function generatePhase10(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'Corporate Infrastructure Report', 'Phase 10 Summary — Tasks 43 through 60');
  let y = 20;
  const phase10Tasks: [number, string][] = [
    [43, 'Define Target Organizational Chart'],
    [44, 'Gather Requirements for Each Function'],
    [45, 'Design Operating Model'],
    [46, 'Incorporate Legal Entity'],
    [47, 'Set Up Bank Accounts'],
    [48, 'Set Up Accounting'],
    [49, 'Define Central and Local Logistics Value Streams'],
    [50, 'Select Payment Service Provider'],
    [51, 'Register Trademark'],
    [52, 'Perform Capacity-Planning for Facility'],
    [53, 'Set Up Content Production'],
    [54, 'Build Supply Chain'],
    [55, 'Organize Distribution'],
    [56, 'Institute Sales Funnel'],
    [57, 'Prepare Cross-Channel Marketing & Sales Strategy'],
    [58, 'Ramp Up Facility'],
    [59, 'Set Up Customer Care'],
    [60, 'Prepare Tech Infrastructure and Security'],
  ];
  phase10Tasks.forEach(([num, title], idx) => {
    y = addGenericTaskSection(doc, getTaskInput, num, idx + 1, title, y);
  });
}

// ═══════════════════════════════════════════
// PHASE 11: Set Up KPI Reports (Tasks 61-64)
// ═══════════════════════════════════════════
function generatePhase11(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'KPI Reporting & Cadence Plan', 'Phase 11 Summary — Tasks 61 through 64');
  let y = 20;

  // Task 61 has special KPI fields
  y = addHeader(doc, '1. Task 61: Define Top 20 KPIs', y);
  const kpiRows: string[][] = [];
  for (let i = 0; i < 5; i++) {
    const name = getTaskInput(61, `kpi-${i}-name`);
    const target = getTaskInput(61, `kpi-${i}-target`);
    const current = getTaskInput(61, `kpi-${i}-current`);
    if (name) kpiRows.push([name, target || '—', current || '—']);
  }
  if (kpiRows.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['KPI Name', 'Target', 'Current']],
      body: kpiRows,
      theme: 'grid',
      headStyles: { fillColor: HEADER_BG, textColor: [ACCENT[0], ACCENT[1], ACCENT[2]], fontSize: 8 },
      bodyStyles: { fontSize: 7, textColor: [60, 60, 60] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as {lastAutoTable: {finalY: number}}).lastAutoTable.finalY + 10;
  }
  const t61notes = getTaskInput(61, 'notes');
  if (t61notes) { y = addSubHeader(doc, 'Notes', y); y = addText(doc, t61notes, y); }
  if (kpiRows.length === 0 && !t61notes) y = addText(doc, 'Not yet completed.', y, { italic: true });

  y = addGenericTaskSection(doc, getTaskInput, 62, 2, 'Set Up Data Warehouse', y);
  y = addGenericTaskSection(doc, getTaskInput, 63, 3, 'Prepare Daily, Weekly, and Monthly Reports', y);
  y = addGenericTaskSection(doc, getTaskInput, 64, 4, 'Set Hiring Targets', y);
}

// ═══════════════════════════════════════════
// PHASE 12: Go Live (Tasks 65-69)
// ═══════════════════════════════════════════
function generatePhase12(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'Go Live Launch & Onboarding Report', 'Phase 12 Summary — Tasks 65 through 69');
  let y = 20;
  y = addGenericTaskSection(doc, getTaskInput, 65, 1, 'Stress Test & Bug-Fix Across Functions', y);
  y = addGenericTaskSection(doc, getTaskInput, 66, 2, 'Prepare Press List', y);
  y = addGenericTaskSection(doc, getTaskInput, 67, 3, 'Start KPI Reporting', y);
  y = addGenericTaskSection(doc, getTaskInput, 68, 4, 'Conduct Launch PR Campaign & Paid Marketing', y);
  y = addGenericTaskSection(doc, getTaskInput, 69, 5, 'Continue Testing & Bug-Fixing', y);
}

// ═══════════════════════════════════════════
// PHASE 13: Raise Growth Capital (Tasks 70-71)
// ═══════════════════════════════════════════
function generatePhase13(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'Growth Capital & Cap Table Plan', 'Phase 13 Summary — Tasks 70 through 71');
  let y = 20;
  y = addGenericTaskSection(doc, getTaskInput, 70, 1, 'Secure Growth Investment', y);
  y = addGenericTaskSection(doc, getTaskInput, 71, 2, 'Set Up Employee Participation Program', y);
}

// ═══════════════════════════════════════════
// PHASE 14: Build Culture (Tasks 72-74)
// ═══════════════════════════════════════════
function generatePhase14(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'Company Culture & Employee Handbook', 'Phase 14 Summary — Tasks 72 through 74');
  let y = 20;
  y = addGenericTaskSection(doc, getTaskInput, 72, 1, 'Design and Track Hiring Process', y);
  y = addGenericTaskSection(doc, getTaskInput, 73, 2, 'Foster People Development', y);
  y = addGenericTaskSection(doc, getTaskInput, 74, 3, 'Create and Maintain Company Culture', y);
}

// ═══════════════════════════════════════════
// PHASE 15: Learn from Data (Tasks 75-81)
// ═══════════════════════════════════════════
function generatePhase15(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'Data Analytics & Retention Funnel', 'Phase 15 Summary — Tasks 75 through 81');
  let y = 20;
  y = addGenericTaskSection(doc, getTaskInput, 75, 1, 'Navigate Using Daily, Weekly, & Monthly Reports', y);
  y = addGenericTaskSection(doc, getTaskInput, 76, 2, 'Dig Deeper Using Ad Hoc Reports for Each Function', y);
  y = addGenericTaskSection(doc, getTaskInput, 77, 3, 'Analyze Progress Toward Financial Targets', y);
  y = addGenericTaskSection(doc, getTaskInput, 78, 4, 'Focus on Cross-Channel Marketing Mix that Works', y);
  y = addGenericTaskSection(doc, getTaskInput, 79, 5, 'Analyze Customer Engagement with Product', y);
  y = addGenericTaskSection(doc, getTaskInput, 80, 6, 'Re-design Operating Model According to Data', y);
  y = addGenericTaskSection(doc, getTaskInput, 81, 7, 'Establish Proper Financial Reporting, Controlling, & Compliance', y);
}

// ═══════════════════════════════════════════
// PHASE 16: Optimize Functions (Tasks 82-94)
// ═══════════════════════════════════════════
function generatePhase16(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'Scale Optimization & Automation Plan', 'Phase 16 Summary — Tasks 82 through 94');
  let y = 20;
  const phase16Tasks: [number, string][] = [
    [82, 'Groom & Prioritize Product Roadmap'],
    [83, 'Enhance UI/UX According to Usability Tests'],
    [84, 'Boost Tech Stack'],
    [85, 'Eliminate Operational Bottlenecks'],
    [86, 'Re-assess Suppliers & Partners'],
    [87, 'Optimize Payment Mix, Fees, Checkout Funnel & Fraud Prevention'],
    [88, 'Improve Management of Sales Funnel'],
    [89, 'Optimize CAC vs CLV'],
    [90, 'Enhance CRM'],
    [91, 'Build Brand & Execute PR Strategy'],
    [92, 'Improve Customer Care Processes to Maximize NPS'],
    [93, 'Automate Important Manual Processes'],
    [94, 'Accelerate Workforce'],
  ];
  phase16Tasks.forEach(([num, title], idx) => {
    y = addGenericTaskSection(doc, getTaskInput, num, idx + 1, title, y);
  });
}

// ═══════════════════════════════════════════
// PHASE 17: Best Practices (Tasks 95-96)
// ═══════════════════════════════════════════
function generatePhase17(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'OKR Goal Settings & SOP Handbook', 'Phase 17 Summary — Tasks 95 through 96');
  let y = 20;
  y = addGenericTaskSection(doc, getTaskInput, 95, 1, 'Phase in OKR System', y);
  y = addGenericTaskSection(doc, getTaskInput, 96, 2, 'Define Best Practices for Each Function', y);
}

// ═══════════════════════════════════════════
// PHASE 18: Independence (Tasks 97-100)
// ═══════════════════════════════════════════
function generatePhase18(doc: jsPDF, getTaskInput: (t: number, f: string) => string) {
  createTitlePage(doc, 'PMF Audit & Succession Roadmap', 'Phase 18 Summary — Tasks 97 through 100');
  let y = 20;
  y = addGenericTaskSection(doc, getTaskInput, 97, 1, 'Implement Best Practices', y);
  y = addGenericTaskSection(doc, getTaskInput, 98, 2, 'Implement Ongoing Knowledge Sharing', y);
  y = addGenericTaskSection(doc, getTaskInput, 99, 3, 'Achieve Product-Market Fit', y);
  y = addGenericTaskSection(doc, getTaskInput, 100, 4, 'Constantly Evaluate Further Growth & Expansion Options', y);
}

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════
const PHASE_INFO: Record<number, { title: string; fileName: string; tasks: string }> = {
  1: { title: 'Problem Discovery Report', fileName: 'Phase_1_Problem_Discovery_Report', tasks: 'Tasks 1\u20134' },
  2: { title: 'Strategic Foundation & Roadmap', fileName: 'Phase_2_Strategic_Foundation_Roadmap', tasks: 'Tasks 5\u20137' },
  3: { title: 'Founder & Team Blueprint', fileName: 'Phase_3_Founder_Team_Blueprint', tasks: 'Tasks 8\u201310' },
  4: { title: 'Innovation Horizon & Idea Portfolio', fileName: 'Phase_4_Innovation_Horizon_Ideas', tasks: 'Tasks 11\u201313' },
  5: { title: 'Business Model Determination Report', fileName: 'Phase_5_Business_Model_Determination', tasks: 'Tasks 14\u201320' },
  6: { title: 'Starter-Kits Portfolio & Assets', fileName: 'Phase_6_Starter_Kits_Portfolio', tasks: 'Tasks 21\u201325' },
  7: { title: 'MVP Technical Specification & Backlog', fileName: 'Phase_7_MVP_Technical_Specification', tasks: 'Tasks 26\u201331' },
  8: { title: 'Brand Identity & Style System', fileName: 'Phase_8_Brand_Identity_System', tasks: 'Tasks 32\u201335' },
  9: { title: 'Seed Funding Strategy & Pipeline', fileName: 'Phase_9_Seed_Funding_Strategy', tasks: 'Tasks 36\u201342' },
  10: { title: 'Corporate Infrastructure Report', fileName: 'Phase_10_Corporate_Infrastructure', tasks: 'Tasks 43\u201360' },
  11: { title: 'KPI Reporting & Cadence Plan', fileName: 'Phase_11_KPI_Reporting_Plan', tasks: 'Tasks 61\u201364' },
  12: { title: 'Go Live Launch & Onboarding Report', fileName: 'Phase_12_Go_Live_Launch_Report', tasks: 'Tasks 65\u201369' },
  13: { title: 'Growth Capital & Cap Table Plan', fileName: 'Phase_13_Growth_Capital_Plan', tasks: 'Tasks 70\u201371' },
  14: { title: 'Company Culture & Employee Handbook', fileName: 'Phase_14_Company_Culture_Blueprint', tasks: 'Tasks 72\u201374' },
  15: { title: 'Data Analytics & Retention Funnel', fileName: 'Phase_15_Data_Analytics_Funnel', tasks: 'Tasks 75\u201381' },
  16: { title: 'Scale Optimization & Automation Plan', fileName: 'Phase_16_Scale_Optimization_Plan', tasks: 'Tasks 82\u201394' },
  17: { title: 'OKR Goal Settings & SOP Handbook', fileName: 'Phase_17_OKR_SOP_Handbook', tasks: 'Tasks 95\u201396' },
  18: { title: 'PMF Audit & succession Roadmap', fileName: 'Phase_18_PMF_Succession_Roadmap', tasks: 'Tasks 97\u2013100' },
};

export default function PhasePDFGenerator({ phase }: { phase: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 }) {
  const { getTaskInput } = useGarage();
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const info = PHASE_INFO[phase];

  const generatePDF = async () => {
    setGenerating(true);
    setGenerated(false);

    // Small delay to allow UI to update
    await new Promise(r => setTimeout(r, 50));

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    switch (phase) {
      case 1: generatePhase1(doc, getTaskInput); break;
      case 2: generatePhase2(doc, getTaskInput); break;
      case 3: generatePhase3(doc, getTaskInput); break;
      case 4: generatePhase4(doc, getTaskInput); break;
      case 5: generatePhase5(doc, getTaskInput); break;
      case 6: generatePhase6(doc, getTaskInput); break;
      case 7: generatePhase7(doc, getTaskInput); break;
      case 8: generatePhase8(doc, getTaskInput); break;
      case 9: generatePhase9(doc, getTaskInput); break;
      case 10: generatePhase10(doc, getTaskInput); break;
      case 11: generatePhase11(doc, getTaskInput); break;
      case 12: generatePhase12(doc, getTaskInput); break;
      case 13: generatePhase13(doc, getTaskInput); break;
      case 14: generatePhase14(doc, getTaskInput); break;
      case 15: generatePhase15(doc, getTaskInput); break;
      case 16: generatePhase16(doc, getTaskInput); break;
      case 17: generatePhase17(doc, getTaskInput); break;
      case 18: generatePhase18(doc, getTaskInput); break;
    }

    addFooters(doc);

    const dateStr = new Date().toISOString().slice(0, 10);
    doc.save(`${info.fileName}_${dateStr}.pdf`);

    setGenerating(false);
    setGenerated(true);
    setTimeout(() => setGenerated(false), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginTop: '16px' }}>
      <button
        onClick={generatePDF}
        disabled={generating}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 28px',
          background: generating
            ? 'linear-gradient(135deg, #666 0%, #444 100%)'
            : 'linear-gradient(135deg, #B4F052 0%, #8BC34A 100%)',
          color: '#0a0a0a',
          fontWeight: 700,
          fontSize: '15px',
          borderRadius: '12px',
          border: 'none',
          cursor: generating ? 'wait' : 'pointer',
          boxShadow: generating ? 'none' : '0 4px 15px rgba(180, 240, 82, 0.3)',
          transition: 'all 0.2s ease',
          opacity: generating ? 0.7 : 1,
        }}
      >
        {generating ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>&#x21bb;</span>
            Generating PDF...
          </span>
        ) : (
          <>
            <Download size={18} />
            Download {info.title} ({info.tasks})
          </>
        )}
      </button>
      {generated && (
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: '#B4F052',
          fontWeight: 600,
          animation: 'fadeIn 0.3s ease',
        }}>
          <CheckCircle size={16} />
          PDF Generated Successfully!
        </span>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// ALL PHASES: Master PDF (Tasks 1-100)
// ═══════════════════════════════════════════
const ALL_GENERATORS = [
  generatePhase1, generatePhase2, generatePhase3, generatePhase4, generatePhase5,
  generatePhase6, generatePhase7, generatePhase8, generatePhase9, generatePhase10,
  generatePhase11, generatePhase12, generatePhase13, generatePhase14, generatePhase15,
  generatePhase16, generatePhase17, generatePhase18,
];

export function AllPhasesPDFGenerator() {
  const { getTaskInput } = useGarage();
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateAllPDF = async () => {
    setGenerating(true);
    setGenerated(false);
    await new Promise(r => setTimeout(r, 50));

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Master title page
    doc.setFillColor(DARK[0], DARK[1], DARK[2]);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('INNOVATION CENTER at BusinessHUB / District.org', 14, 50);
    doc.setTextColor(ACCENT[0], ACCENT[1], ACCENT[2]);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Complete Startup', 14, 80);
    doc.text('Journey Report', 14, 95);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('All 100 Tasks — Phases 1 through 18', 14, 120);
    doc.setFontSize(11);
    doc.setTextColor(180, 180, 180);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 140);

    // Table of contents
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
    let y = 20;
    doc.setTextColor(ACCENT[0], ACCENT[1], ACCENT[2]);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Table of Contents', 14, y);
    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    Object.entries(PHASE_INFO).forEach(([num, info]) => {
      doc.text(`Phase ${num}: ${info.title} (${info.tasks})`, 14, y);
      y += 7;
    });

    // Generate each phase
    for (const gen of ALL_GENERATORS) {
      gen(doc, getTaskInput);
    }

    addFooters(doc);

    const dateStr = new Date().toISOString().slice(0, 10);
    doc.save(`Complete_Startup_Journey_Report_${dateStr}.pdf`);

    setGenerating(false);
    setGenerated(true);
    setTimeout(() => setGenerated(false), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginTop: '24px' }}>
      <button
        onClick={generateAllPDF}
        disabled={generating}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '16px 32px',
          background: generating
            ? 'linear-gradient(135deg, #666 0%, #444 100%)'
            : 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
          color: '#0a0a0a',
          fontWeight: 800,
          fontSize: '16px',
          borderRadius: '14px',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          cursor: generating ? 'wait' : 'pointer',
          boxShadow: generating ? 'none' : '0 4px 20px rgba(255, 215, 0, 0.3)',
          transition: 'all 0.2s ease',
          opacity: generating ? 0.7 : 1,
        }}
      >
        {generating ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>&#x21bb;</span>
            Generating Complete Report...
          </span>
        ) : (
          <>
            <Download size={20} />
            Download Complete Startup Journey (Tasks 1–100)
          </>
        )}
      </button>
      {generated && (
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: '#FFD700',
          fontWeight: 600,
          animation: 'fadeIn 0.3s ease',
        }}>
          <CheckCircle size={16} />
          Complete Report Generated Successfully!
        </span>
      )}
    </div>
  );
}
