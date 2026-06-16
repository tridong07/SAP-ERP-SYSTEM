"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ALL_DATA_SOURCES, DOC_RULES } from "../../../lib/data-sources";
import { arrayMove } from "@dnd-kit/sortable";
import SapFormViewer from "../SapFormViewer";

// Import các sub-components đã tách
import { HeaderSection } from "./HeaderSection";
import { FieldCard } from "./FieldCard";
import { ActionButtons } from "./ActionButtons";
import { ConfigurationPanel } from "./ConfigurationPanel";

type InputMode =
  | "MANUAL" // Nhập tay
  | "DROPDOWN" // Chọn từ danh mục (DBA)
  | "AUTO_GEN" // STT/Mã tự sinh
  | "SYSTEM_DATE" // Ngày hiện tại
  | "COMPUTED" // Cột tính toán (Công thức)
  | "RELATION"; // Lấy dữ liệu liên kết (Lookup từ bảng khác)

type Align = "left" | "center" | "right";

interface Column {
  id: string;
  code: string;
  label: string;
  type: "text" | "number" | "computed";
  formula: string;
  inputMode: InputMode;
  source?: string;
  fontSize?: number;       // Thêm dòng này (ví dụ: 12, 14, 16)
  align?: Align;
}

interface Field {
  id: string;
  label: string;
  type: "text" | "number" | "TABLE";
  columns: Column[];
  inputMode: InputMode;
  source?: string;
  span?: 1 | 2 | 3;
  fontSize?: number;
  align?: Align;
  showLabel?: boolean;
}

// 1. Định nghĩa kiểu dữ liệu cho props
interface SapFormBuilderProps {
  formId: string | null;
  onBack: () => void;
  onSave: (data: any) => void;
}

export default function SapFormBuilder({ formId, onBack, onSave }: SapFormBuilderProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [docType, setDocType] = useState<string>("LEAVE");
  const [fields, setFields] = useState<Field[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const currentRule = DOC_RULES[docType];
  const selectedField = fields.find((f) => f.id === selectedFieldId);

  // --- Load & Save Data ---
  useEffect(() => {
    const saved = localStorage.getItem(`config_${docType}`);
    if (saved) {
      setFields(JSON.parse(saved).fields);
    } else {
      setFields(currentRule.defaultFields.map((d: any) => ({
        ...d,
        id: Date.now().toString() + Math.random(),
        columns: [],
        inputMode: "MANUAL",
        span: d.type === "TABLE" ? 3 : 1
      })));
    }
    setIsInitialized(true);
  }, [docType, currentRule.defaultFields]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(`config_${docType}`, JSON.stringify({ fields, updatedAt: new Date().toISOString() }));
    }
  }, [fields, docType, isInitialized]);

  // --- Logic Helpers ---
  const canAddField = (type: "text" | "number" | "TABLE") => {
    const isTable = type === "TABLE";
    if (isTable && !currentRule.allowTable) return { allowed: false, message: "Loại đơn không cho phép thêm Bảng." };
    if (!isTable && !currentRule.allowSingle) return { allowed: false, message: "Loại đơn không cho phép thêm Trường đơn." };
    if (isTable && fields.some((f) => f.type === "TABLE")) return { allowed: false, message: "Chỉ được phép có 1 bảng chi tiết!" };
    if (!isTable && fields.filter((f) => f.type !== "TABLE").length >= 12) return { allowed: false, message: "Đã đạt giới hạn 12 trường đơn!" };
    return { allowed: true };
  };

  const moveItem = useCallback((arr: any[], index: number, direction: "up" | "down") => {
    const newArr = [...arr];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target >= 0 && target < newArr.length) {
      [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
    }
    return newArr;
  }, []);

  const getAvailableSources = () => 
    currentRule.sources.map((sId: string) => ALL_DATA_SOURCES[sId as keyof typeof ALL_DATA_SOURCES]);

  // --- Actions ---
  const addField = (isTable: boolean) => {
    const type = isTable ? "TABLE" : "text";
    const check = canAddField(type);
    if (!check.allowed) { alert(check.message); return; }

    const newField: Field = {
      id: Date.now().toString(),
      label: isTable ? "Bảng chi tiết" : "Trường mới",
      type: isTable ? "TABLE" : "text",
      columns: [],
      inputMode: "MANUAL",
      span: isTable ? 3 : 1
    };
    setFields(prev => [...prev, newField]);
  };

  const addColumn = (fieldId: string) => {
    setFields(fields.map(f => f.id === fieldId ? {
      ...f,
      columns: [...f.columns, {
        id: Date.now().toString(),
        code: `col_${(f.columns.length + 1).toString().padStart(2, "0")}`,
        label: "Tên cột",
        type: "text",
        formula: "",
        inputMode: "MANUAL",
        source: ""
      }]
    } : f));
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates, span: updates.type === "TABLE" ? 3 : (updates.span || f.span || 1) } : f));
  };

  const duplicateField = (fieldId: string) => {
    const fieldToCopy = fields.find((f) => f.id === fieldId);
    if (!fieldToCopy) return;
    const check = canAddField(fieldToCopy.type);
    if (!check.allowed) { alert(check.message); return; }
    setFields([...fields, { ...fieldToCopy, id: Date.now().toString(), label: `${fieldToCopy.label} (copy)` }]);
  };

  return (
    <div className="p-6 bg-zinc-50 min-h-screen">
      <HeaderSection 
        onBack={onBack} 
        onSave={onSave} 
        isPreview={isPreview} 
        setIsPreview={setIsPreview} 
        docType={docType} 
        setDocType={setDocType} 
      />
      
      <main className="max-w-6xl mx-auto p-8">
        {isPreview ? (
          <SapFormViewer fields={fields} allDataSources={ALL_DATA_SOURCES} />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {fields.map(f => (
                <FieldCard 
                  key={f.id} 
                  f={f} 
                  onSettings={() => { setSelectedFieldId(f.id); setIsPanelOpen(true); }}
                  onRemove={() => setFields(fields.filter(x => x.id !== f.id))}
                  onDuplicate={() => duplicateField(f.id)}
                  onUpdate={(val: string) => updateField(f.id, { label: val })}
                />
              ))}
            </div>
            <ActionButtons addField={addField} currentRule={currentRule} />
          </div>
        )}
      </main>

      <ConfigurationPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
        field={selectedField} 
        updateField={updateField} 
        moveItem={moveItem}
        setFields={setFields}
        fields={fields}
        addColumn={addColumn}
        getAvailableSources={getAvailableSources}
      />
    </div>
  );
}