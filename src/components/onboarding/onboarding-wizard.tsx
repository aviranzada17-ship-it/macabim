"use client";

import { useActionState, useRef, useState } from "react";
import {
  submitOnboardingAction,
  type OnboardingState,
} from "@/app/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft } from "lucide-react";

type FieldType = "text" | "tel" | "textarea" | "select";

type Step = {
  key: string;
  question: string;
  helper?: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
};

const STEPS: Step[] = [
  {
    key: "phone",
    question: "מה מספר הטלפון שלך?",
    type: "tel",
    placeholder: "050-1234567",
  },
  {
    key: "parentName",
    question: "מה השם המלא של ההורה?",
    type: "text",
    placeholder: "שם פרטי ומשפחה",
  },
  {
    key: "parentPhone",
    question: "מה מספר הטלפון של ההורה?",
    type: "tel",
    placeholder: "050-1234567",
  },
  {
    key: "school",
    question: "באיזה בית ספר אתה לומד?",
    type: "text",
  },
  {
    key: "grade",
    question: "באיזו כיתה אתה?",
    type: "text",
    placeholder: 'לדוגמה: י"א 3',
  },
  {
    key: "bio",
    question: "ספר לנו קצת על עצמך",
    helper: "כמה משפטים חופשיים – מי אתה, מה מעניין אותך",
    type: "textarea",
  },
  {
    key: "enlistmentGoal",
    question: "לאן היית רוצה להתגייס?",
    type: "text",
  },
  {
    key: "yearImportance",
    question: "מה הכי חשוב לך מהשנה הקרובה בתוכנית?",
    type: "textarea",
  },
  {
    key: "strengths",
    question: "מה שני היתרונות הכי בולטים שלך?",
    type: "textarea",
  },
  {
    key: "weakness",
    question: "מה הדבר שהכי חשוב לך לשפר אצלך?",
    type: "textarea",
  },
  {
    key: "importantToKnow",
    question: "יש משהו חשוב שאנחנו צריכים לדעת עליך?",
    helper: "לדוגמה: מגבלה רפואית, רגישות מסוימת, כל דבר שיעזור לנו להכיר אותך",
    type: "textarea",
  },
  {
    key: "howFound",
    question: "איך הגעת לתוכנית המכבים?",
    type: "text",
  },
  {
    key: "investmentLevel",
    question: "כמה אתה מוכן להשקיע בתוכנית הזו?",
    type: "select",
    options: [
      { value: "מקסימלי - מוכן לתת הכל", label: "מקסימלי – מוכן לתת הכל" },
      { value: "גבוה - אשקיע הרבה מאמץ", label: "גבוה – אשקיע הרבה מאמץ" },
      { value: "סביר - אשתדל כמיטב יכולתי", label: "סביר – אשתדל כמיטב יכולתי" },
      { value: "עדיין לא בטוח", label: "עדיין לא בטוח" },
    ],
  },
];

const initialState: OnboardingState = {};

export function OnboardingWizard() {
  const [state, formAction, pending] = useActionState(
    submitOnboardingAction,
    initialState,
  );
  const [stepIndex, setStepIndex] = useState(0);
  const fieldRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>>(
    {},
  );

  const isLast = stepIndex === STEPS.length - 1;
  const current = STEPS[stepIndex];

  function goNext() {
    const el = fieldRefs.current[current.key];
    if (el && "reportValidity" in el && !el.reportValidity()) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function handleKeyDown(e: React.KeyboardEvent, type: FieldType) {
    if (type === "textarea") return;
    if (e.key === "Enter") {
      e.preventDefault();
      if (!isLast) goNext();
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Progress value={((stepIndex + 1) / STEPS.length) * 100} />
        <p className="text-xs text-muted-foreground">
          שאלה {stepIndex + 1} מתוך {STEPS.length}
        </p>
      </div>

      {STEPS.map((step, i) => (
        <div
          key={step.key}
          className={i === stepIndex ? "flex flex-col gap-2" : "hidden"}
        >
          <Label htmlFor={step.key} className="text-lg font-bold text-foreground">
            {step.question}
          </Label>
          {step.helper ? (
            <p className="text-sm text-muted-foreground">{step.helper}</p>
          ) : null}

          {step.type === "textarea" ? (
            <Textarea
              id={step.key}
              name={step.key}
              required
              rows={4}
              placeholder={step.placeholder}
              ref={(el) => {
                fieldRefs.current[step.key] = el;
              }}
              autoFocus={i === stepIndex}
            />
          ) : step.type === "select" ? (
            <NativeSelect
              id={step.key}
              name={step.key}
              required
              defaultValue=""
              ref={(el) => {
                fieldRefs.current[step.key] = el;
              }}
            >
              <option value="" disabled>
                בחר תשובה
              </option>
              {step.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </NativeSelect>
          ) : (
            <Input
              id={step.key}
              name={step.key}
              type={step.type}
              required
              placeholder={step.placeholder}
              ref={(el) => {
                fieldRefs.current[step.key] = el;
              }}
              onKeyDown={(e) => handleKeyDown(e, step.type)}
              autoFocus={i === stepIndex}
            />
          )}
        </div>
      ))}

      {state.error ? (
        <p className="text-sm font-medium text-destructive">{state.error}</p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={goBack}
          disabled={stepIndex === 0}
        >
          <ArrowRight className="size-4" />
          הקודם
        </Button>

        {isLast ? (
          <Button type="submit" disabled={pending} size="lg">
            {pending ? "שולח..." : "סיום והתחלה"}
          </Button>
        ) : (
          <Button type="button" onClick={goNext} size="lg">
            הבא
            <ArrowLeft className="size-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
