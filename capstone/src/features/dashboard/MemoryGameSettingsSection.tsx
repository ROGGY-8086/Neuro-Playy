import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  HelpCircle,
  Wand2,
  RefreshCw,
  Eye
} from 'lucide-react';
import { ApiService } from '../../services/api';
import { MemoryGameQuestion, MemoryGameConfig } from '../../types';

interface MemoryGameSettingsSectionProps {
  profileId: number | null;
  profileName?: string;
  onSaved?: () => void;
  soundFx?: {
    playSuccess: () => void;
    playNotice: () => void;
    playClick: () => void;
  };
}

const DEFAULT_SAMPLE_QUESTIONS: MemoryGameQuestion[] = [
  {
    questionText: 'What is the name of your eldest grandchild?',
    imageUrl: '',
    correctAnswer: 'Liam',
    options: ['Liam', 'Noah', 'Oliver', 'Lucas'],
    sortOrder: 0,
  },
  {
    questionText: 'What town or city did you grow up in?',
    imageUrl: '',
    correctAnswer: 'Springfield',
    options: ['Springfield', 'Oakland', 'Madison', 'Burlington'],
    sortOrder: 1,
  },
  {
    questionText: 'What kind of pet did you have named Bella?',
    imageUrl: '',
    correctAnswer: 'Golden Retriever Dog',
    options: ['Golden Retriever Dog', 'Siamese Cat', 'Parakeet Bird', 'Rabbit'],
    sortOrder: 2,
  },
  {
    questionText: 'What is your favorite morning beverage?',
    imageUrl: '',
    correctAnswer: 'Warm Black Tea',
    options: ['Warm Black Tea', 'Fresh Coffee', 'Orange Juice', 'Hot Chocolate'],
    sortOrder: 3,
  },
  {
    questionText: 'Which season do you love the most for gardening?',
    imageUrl: '',
    correctAnswer: 'Spring',
    options: ['Spring', 'Summer', 'Autumn', 'Winter'],
    sortOrder: 4,
  },
];

export const MemoryGameSettingsSection: React.FC<MemoryGameSettingsSectionProps> = ({
  profileId,
  profileName,
  onSaved,
  soundFx,
}) => {
  const [questions, setQuestions] = useState<MemoryGameQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewImageIdx, setPreviewImageIdx] = useState<number | null>(null);

  // Load configured questions for selected profile
  useEffect(() => {
    if (!profileId) {
      setQuestions([]);
      return;
    }

    let isMounted = true;
    async function fetchConfig() {
      setIsLoading(true);
      setStatusMessage(null);
      try {
        const config: MemoryGameConfig = await ApiService.getMemoryGameConfig(profileId!);
        if (!isMounted) return;
        if (config && config.questions && config.questions.length > 0) {
          // Normalize options to always ensure 4 slots for easy editing
          const normalized = config.questions.map((q, idx) => {
            const rawOpts = Array.isArray(q.options) ? [...q.options] : [];
            while (rawOpts.length < 4) {
              rawOpts.push('');
            }
            return {
              ...q,
              options: rawOpts,
              sortOrder: idx,
            };
          });
          setQuestions(normalized);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.warn('Could not load memory game config:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchConfig();
    return () => {
      isMounted = false;
    };
  }, [profileId]);

  // Add Question
  const handleAddQuestion = () => {
    if (questions.length >= 5) {
      soundFx?.playNotice();
      return;
    }
    soundFx?.playClick();
    const newQ: MemoryGameQuestion = {
      questionText: '',
      imageUrl: '',
      correctAnswer: '',
      options: ['', '', '', ''],
      sortOrder: questions.length,
    };
    setQuestions([...questions, newQ]);
    setStatusMessage(null);
  };

  // Remove Question
  const handleRemoveQuestion = (idx: number) => {
    soundFx?.playClick();
    const updated = questions.filter((_, i) => i !== idx).map((q, i) => ({ ...q, sortOrder: i }));
    setQuestions(updated);
    setStatusMessage(null);
  };

  // Reorder Question Up
  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    soundFx?.playClick();
    const copy = [...questions];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;
    setQuestions(copy.map((q, i) => ({ ...q, sortOrder: i })));
  };

  // Reorder Question Down
  const handleMoveDown = (idx: number) => {
    if (idx === questions.length - 1) return;
    soundFx?.playClick();
    const copy = [...questions];
    const temp = copy[idx + 1];
    copy[idx + 1] = copy[idx];
    copy[idx] = temp;
    setQuestions(copy.map((q, i) => ({ ...q, sortOrder: i })));
  };

  // Update Field
  const handleUpdateQuestion = (idx: number, field: keyof MemoryGameQuestion, value: any) => {
    const copy = [...questions];
    copy[idx] = { ...copy[idx], [field]: value };
    setQuestions(copy);
    setStatusMessage(null);
  };

  // Update Option
  const handleUpdateOption = (qIdx: number, optIdx: number, value: string) => {
    const copy = [...questions];
    const options = [...copy[qIdx].options];
    options[optIdx] = value;
    copy[qIdx] = { ...copy[qIdx], options };
    setQuestions(copy);
    setStatusMessage(null);
  };

  // Quick set correct answer to option slot
  const handleSetOptionAsCorrect = (qIdx: number, optValue: string) => {
    if (!optValue.trim()) return;
    soundFx?.playClick();
    handleUpdateQuestion(qIdx, 'correctAnswer', optValue.trim());
  };

  // Load Sample Template
  const handleLoadSampleTemplate = () => {
    soundFx?.playClick();
    setQuestions(JSON.parse(JSON.stringify(DEFAULT_SAMPLE_QUESTIONS)));
    setStatusMessage({
      type: 'success',
      text: 'Sample template loaded with 5 questions! Customize the answers and photos to match your patient.',
    });
  };

  // Validation
  const validateQuestions = (): string | null => {
    if (questions.length !== 5) {
      return `The Memory Game requires exactly 5 questions (currently ${questions.length} configured). Please add or remove questions until you have 5.`;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText || !q.questionText.trim()) {
        return `Question #${i + 1} is missing the question prompt text.`;
      }
      if (!q.correctAnswer || !q.correctAnswer.trim()) {
        return `Question #${i + 1} is missing the correct answer.`;
      }
      const validOpts = q.options.filter(o => o && o.trim().length > 0);
      if (validOpts.length < 2) {
        return `Question #${i + 1} must have at least 2 answer choices.`;
      }
      const correctTrimmed = q.correctAnswer.trim().toLowerCase();
      const hasCorrectInOpts = validOpts.some(o => o.trim().toLowerCase() === correctTrimmed);
      if (!hasCorrectInOpts) {
        return `Question #${i + 1}: The correct answer ("${q.correctAnswer}") must be listed among the answer choices.`;
      }
    }
    return null;
  };

  const validationError = validateQuestions();
  const canSave = !validationError && !isSaving && !!profileId;

  // Save Configuration
  const handleSave = async () => {
    if (!profileId || validationError) {
      soundFx?.playNotice();
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      // Clean up options: make sure correct answer is included and remove empties
      const cleaned: MemoryGameQuestion[] = questions.map((q, i) => {
        const correctTrimmed = q.correctAnswer.trim();
        const rawOpts = q.options.map(o => o.trim()).filter(o => o.length > 0);
        if (!rawOpts.some(o => o.toLowerCase() === correctTrimmed.toLowerCase())) {
          rawOpts.push(correctTrimmed);
        }
        return {
          id: q.id,
          questionText: q.questionText.trim(),
          imageUrl: q.imageUrl && q.imageUrl.trim().length > 0 ? q.imageUrl.trim() : undefined,
          correctAnswer: correctTrimmed,
          options: rawOpts,
          sortOrder: i,
        };
      });

      await ApiService.saveMemoryGameConfig(profileId, cleaned);
      soundFx?.playSuccess();
      setStatusMessage({
        type: 'success',
        text: 'Memory Game settings saved! Your patient will now see these 5 questions when playing.',
      });
      onSaved?.();
    } catch (err: unknown) {
      soundFx?.playNotice();
      const msg = err instanceof Error ? err.message : 'Failed to save memory game settings.';
      setStatusMessage({
        type: 'error',
        text: msg,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-stone-300 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-ink-950">
                Memory Game Settings & Questions
              </h3>
              {questions.length === 5 ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  5 / 5 Ready
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  {questions.length} / 5 Questions (5 Required)
                </span>
              )}
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              Curate the 5 personalized multiple-choice questions for {profileName || 'your patient'} with familiar photos and custom answers.
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {questions.length === 0 && (
            <button
              type="button"
              onClick={handleLoadSampleTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-700 transition-colors shadow-2xs cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Load 5 Sample Questions</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAddQuestion}
            disabled={questions.length >= 5 || isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          role="alert"
          className={`p-4 rounded-xl border-2 text-xs font-medium flex items-start gap-2.5 ${
            statusMessage.type === 'success'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
              : 'border-red-300 bg-red-50 text-red-950'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">{statusMessage.text}</div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="py-8 text-center space-y-2">
          <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-medium">Loading memory questions for this patient...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && questions.length === 0 && (
        <div className="p-8 text-center rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/60 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-ink-950">No Memory Questions Configured Yet</h4>
            <p className="text-xs text-stone-600 max-w-md mx-auto mt-1">
              Create exactly 5 personalized questions about family members, familiar places, or favorite memories for your patient to play daily.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleLoadSampleTemplate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Load 5 Suggested Questions</span>
            </button>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add From Scratch</span>
            </button>
          </div>
        </div>
      )}

      {/* Question Cards (1 to 5) */}
      {!isLoading && questions.length > 0 && (
        <div className="space-y-5">
          {questions.map((q, qIdx) => (
            <div
              key={qIdx}
              className="p-5 rounded-2xl border-2 border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors space-y-4"
            >
              {/* Card Header & Controls */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-800 text-white font-mono font-bold text-xs flex items-center justify-center">
                    {qIdx + 1}
                  </span>
                  <span className="text-xs font-extrabold text-stone-800 uppercase tracking-wider">
                    Question {qIdx + 1} of 5
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(qIdx)}
                    disabled={qIdx === 0}
                    className="p-1 rounded-lg border border-stone-300 bg-white text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move question up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(qIdx)}
                    disabled={qIdx === questions.length - 1}
                    className="p-1 rounded-lg border border-stone-300 bg-white text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move question down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIdx)}
                    className="p-1 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors ml-1"
                    title="Delete question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Question Text & Optional Image */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">
                    Question Prompt <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) => handleUpdateQuestion(qIdx, 'questionText', e.target.value)}
                    placeholder="e.g., What is your grandson's name?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-ink-950 text-xs font-medium focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                    <span>Photo URL (Optional)</span>
                    {q.imageUrl && (
                      <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-0.5">
                        <ImageIcon className="w-3 h-3" /> Photo Attached
                      </span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={q.imageUrl || ''}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'imageUrl', e.target.value)}
                      placeholder="https://.../photo.jpg"
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-300 bg-white text-ink-950 text-xs font-medium focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 outline-none"
                    />
                    {q.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewImageIdx(previewImageIdx === qIdx ? null : qIdx)}
                        className="px-2.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors"
                        title="Toggle Image Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Photo Preview Thumbnail if open */}
              {previewImageIdx === qIdx && q.imageUrl && (
                <div className="p-3 bg-white rounded-xl border border-stone-300 flex items-center gap-3">
                  <img
                    src={q.imageUrl}
                    alt="Question thumbnail preview"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&q=80';
                    }}
                    className="w-20 h-20 object-cover rounded-lg border border-stone-200"
                  />
                  <div className="text-xs text-stone-600">
                    <p className="font-bold text-ink-950">Photo Preview</p>
                    <p className="text-[11px] text-stone-500">This photo will appear with the question during gameplay to reinforce visual recall.</p>
                  </div>
                </div>
              )}

              {/* Correct Answer */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">
                  Correct Answer <span className="text-red-500">*</span>
                  <span className="text-stone-500 font-normal ml-1.5">(The system will grade against this exact answer)</span>
                </label>
                <input
                  type="text"
                  value={q.correctAnswer}
                  onChange={(e) => handleUpdateQuestion(qIdx, 'correctAnswer', e.target.value)}
                  placeholder="e.g., Liam"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-emerald-300 bg-emerald-50/40 text-emerald-950 text-xs font-bold focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 outline-none"
                />
              </div>

              {/* 4 Answer Options */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 block">
                    Answer Choices (Options A, B, C, D)
                  </label>
                  <span className="text-[11px] text-stone-500">
                    Click the checkmark next to a choice to set it as the correct answer
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(q.options.slice(0, 4)).map((opt, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isCorrect = q.correctAnswer && opt && q.correctAnswer.trim().toLowerCase() === opt.trim().toLowerCase();

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-2 p-1.5 px-2.5 rounded-xl border transition-colors ${
                          isCorrect
                            ? 'border-emerald-400 bg-emerald-50/70'
                            : 'border-stone-300 bg-white'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-md font-mono font-bold text-[11px] flex items-center justify-center shrink-0 ${
                          isCorrect ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {letter}
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                          placeholder={`Choice ${letter}`}
                          className="flex-1 bg-transparent text-xs text-ink-950 font-medium outline-none py-1"
                        />
                        {opt.trim().length > 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetOptionAsCorrect(qIdx, opt)}
                            className={`p-1 rounded-md text-xs font-bold transition-colors ${
                              isCorrect
                                ? 'text-emerald-700 bg-emerald-100'
                                : 'text-stone-400 hover:text-emerald-700 hover:bg-stone-100'
                            }`}
                            title="Set as correct answer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Validation & Save Footer */}
      <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {validationError ? (
            <p className="text-xs text-amber-800 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{validationError}</span>
            </p>
          ) : (
            <p className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>All 5 questions are complete and ready to save.</span>
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving Questions...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-amber-300" />
              <span>Save 5 Memory Questions</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
