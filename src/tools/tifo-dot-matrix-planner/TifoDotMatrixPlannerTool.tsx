import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  CornerForm,
  CornerKey,
  PlannerStep,
  Point,
  SharePayloadV1,
} from './lib/types';
import { DEFAULT_CORNER_FORM, DEFAULT_SLOGAN } from './lib/constants';
import { parseCorners } from './lib/geometry';
import { copyTextToClipboard } from './lib/copyToClipboard';
import { encodeSharePayload } from './lib/shareCodec';
import { computeSeatData } from './lib/seatLayout';
import { clampZoom, useSeatCanvas } from './hooks/useSeatCanvas';
import { StepCornersForm } from './components/StepCornersForm';
import { StepSloganForm } from './components/StepSloganForm';
import { StepPreviewCanvas } from './components/StepPreviewCanvas';
import { StepShareLink } from './components/StepShareLink';

type TifoDotMatrixPlannerToolProps = {
  onExit: () => void;
};

export const TifoDotMatrixPlannerTool = ({
  onExit,
}: TifoDotMatrixPlannerToolProps) => {
  const [zoom, setZoom] = useState(1);
  const [step, setStep] = useState<PlannerStep>(1);
  const [error, setError] = useState('');
  const [slogan, setSlogan] = useState(DEFAULT_SLOGAN);
  const [sloganLetterSpacing, setSloganLetterSpacing] = useState('0');
  const [confirmedSlogan, setConfirmedSlogan] = useState('');
  const [confirmedLetterSpacing, setConfirmedLetterSpacing] = useState(0);
  const [cornerForm, setCornerForm] = useState<CornerForm>(() => ({
    ...DEFAULT_CORNER_FORM,
  }));
  const [corners, setCorners] = useState<Record<CornerKey, Point> | null>(null);
  const [copyHint, setCopyHint] = useState('');

  const seatData = useMemo(() => {
    if (!corners || !confirmedSlogan) return null;
    return computeSeatData(corners, confirmedSlogan, confirmedLetterSpacing);
  }, [corners, confirmedSlogan, confirmedLetterSpacing]);

  const showSeatCanvas = Boolean(step === 3 && seatData);

  const shareUrl = useMemo(() => {
    if (!corners || !confirmedSlogan.trim()) return '';
    const payload: SharePayloadV1 = {
      v: 1,
      corners,
      slogan: confirmedSlogan.trim(),
      letterSpacing: confirmedLetterSpacing,
    };
    const token = encodeSharePayload(payload);
    if (typeof window === 'undefined') return '';
    const u = new URL(window.location.href);
    u.search = '';
    u.hash = '';
    u.searchParams.set('share', token);
    return u.toString();
  }, [corners, confirmedSlogan, confirmedLetterSpacing]);

  useEffect(() => {
    setZoom(1);
  }, [
    step,
    seatData?.rows,
    seatData?.cols,
    confirmedSlogan,
    confirmedLetterSpacing,
  ]);

  const onWheelZoom = useCallback((delta: number) => {
    setZoom((z) => clampZoom(z + delta));
  }, []);

  const canvasRef = useSeatCanvas(
    seatData,
    showSeatCanvas,
    zoom,
    null,
    onWheelZoom,
  );

  const adjustZoom = useCallback((delta: number) => {
    setZoom((z) => clampZoom(z + delta));
  }, []);

  const resetWizard = () => {
    setStep(1);
    setError('');
    setCorners(null);
    setConfirmedSlogan('');
    setConfirmedLetterSpacing(0);
    setSloganLetterSpacing('0');
    setSlogan(DEFAULT_SLOGAN);
    setCornerForm({ ...DEFAULT_CORNER_FORM });
    setCopyHint('');
  };

  const confirmCorners = () => {
    const parsed = parseCorners(cornerForm);
    const values = Object.values(parsed).flatMap((p) => [p.x, p.y]);
    if (values.some((value) => Number.isNaN(value))) {
      setError('请完整输入四个角的坐标（x/y 都要是数字）。');
      return;
    }
    setCorners(parsed);
    setError('');
    setStep(2);
  };

  const confirmSlogan = () => {
    if (!slogan.trim()) {
      setError('请先输入文案。');
      return;
    }
    const rawSp = Number(sloganLetterSpacing);
    const sp = Number.isFinite(rawSp) ? Math.max(0, Math.min(200, rawSp)) : 0;
    setConfirmedLetterSpacing(sp);
    setConfirmedSlogan(slogan.trim());
    setError('');
    setStep(3);
  };

  const copyShareLink = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await copyTextToClipboard(shareUrl);
      setCopyHint('已复制到剪贴板');
      window.setTimeout(() => setCopyHint(''), 2200);
    } catch {
      setCopyHint('复制失败，请手动全选链接复制');
      window.setTimeout(() => setCopyHint(''), 3200);
    }
  }, [shareUrl]);

  return (
    <>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">tifo点阵规划图</h1>
        <button
          type="button"
          onClick={() => {
            resetWizard();
            onExit();
          }}
          className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900"
        >
          返回工具列表
        </button>
      </header>

      {error ? (
        <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50/60 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}

      {step === 1 ? (
        <StepCornersForm
          cornerForm={cornerForm}
          onChange={setCornerForm}
          onBack={() => {
            resetWizard();
            onExit();
          }}
          onNext={confirmCorners}
        />
      ) : null}

      {step === 2 ? (
        <StepSloganForm
          slogan={slogan}
          sloganLetterSpacing={sloganLetterSpacing}
          onSloganChange={setSlogan}
          onLetterSpacingChange={setSloganLetterSpacing}
          onBack={() => {
            setError('');
            setStep(1);
          }}
          onNext={confirmSlogan}
        />
      ) : null}

      {step === 3 && seatData ? (
        <StepPreviewCanvas
          canvasRef={canvasRef}
          zoom={zoom}
          onAdjustZoom={adjustZoom}
          onResetZoom={() => setZoom(1)}
          onBack={() => {
            setError('');
            setStep(2);
          }}
          onShareStep={() => {
            setError('');
            setCopyHint('');
            setStep(4);
          }}
        />
      ) : null}

      {step === 4 ? (
        <StepShareLink
          shareUrl={shareUrl}
          copyHint={copyHint}
          onCopy={copyShareLink}
          onBack={() => {
            setError('');
            setCopyHint('');
            setStep(3);
          }}
        />
      ) : null}
    </>
  );
};
