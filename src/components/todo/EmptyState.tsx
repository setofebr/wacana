import emptyIllustration from '../../assets/empty-bg.png';
import WacanaShell from './WacanaShell';

type EmptyStateProps = {
  canRedo?: boolean;
  canUndo?: boolean;
  onCreateTask: () => void;
  onRedo: () => void;
  onUndo: () => void;
};

function EmptyState({
  canRedo,
  canUndo,
  onCreateTask,
  onRedo,
  onUndo,
}: EmptyStateProps) {
  return (
    <WacanaShell
      canRedo={canRedo}
      canUndo={canUndo}
      onCreateTask={onCreateTask}
      onRedo={onRedo}
      onUndo={onUndo}
    >
      <div className="relative flex h-120 w-full flex-col items-center gap-8 overflow-hidden rounded-3xl bg-app-surface p-3 shadow-app-lg">
        <img
          src={emptyIllustration}
          alt="A cyclist riding through a quiet green landscape"
          className="aspect-square w-full shrink-0 rounded-2xl object-cover"
        />

        <div className="flex w-full flex-col items-center gap-2 text-center">
          <h1 className="text-base font-semibold leading-5 tracking-[0.16px]">
            No Plan Today
          </h1>
          <p className="text-sm font-medium leading-5 tracking-[0.14px] text-app-muted">
            This might be a success but maybe your confusion in decision.
          </p>
        </div>
      </div>
    </WacanaShell>
  );
}

export default EmptyState;
