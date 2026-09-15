import { CircuitStep } from "./circuit-step";
import { Dropzone } from "./dropzone";

type PastePushAnimationTarget = {
  dropzone: Dropzone;
  startOffsetX: number;
};

type PasteInsertionAnimationOptions = {
  pushDuration: number;
  revealDelay: number;
  maxPushDistance: number;
  onReveal: () => void;
};

type PasteInsertionAnimationStartOptions = {
  movedSteps: StepMovementTarget[];
  pastedSteps: Set<CircuitStep>;
  referenceStepSize: number;
};

type StepMovementTarget = {
  step: CircuitStep;
  startStepOffset: number;
};

type StepCompactionAnimationStartOptions = {
  movedSteps: StepMovementTarget[];
  referenceStepSize: number;
};

/**
 * ペースト時の押し出しと挿入表示を担当する。
 */
export class PasteInsertionAnimation {
  private pushAnimationFrame: number | null = null;
  private pushAnimationTargets: PastePushAnimationTarget[] = [];
  private revealTimer: ReturnType<typeof setTimeout> | null = null;
  private hiddenDropzones: Dropzone[] = [];

  constructor(private readonly options: PasteInsertionAnimationOptions) {}

  start({
    movedSteps,
    pastedSteps,
    referenceStepSize,
  }: PasteInsertionAnimationStartOptions): void {
    this.cancel();
    this.hidePastedDropzones(pastedSteps);

    const targets = this.targetsForStepMovements(
      movedSteps,
      referenceStepSize,
    );

    if (targets.length === 0) {
      this.reveal();
      return;
    }

    this.moveTargetsToStart(targets);
    this.animateMovement(targets, () => this.scheduleReveal());
  }

  /** 空ステップ削除で左へ詰まるゲートを、削除前の位置から滑らせる。 */
  startCompaction({
    movedSteps,
    referenceStepSize,
  }: StepCompactionAnimationStartOptions): void {
    this.cancel();

    const targets = this.targetsForStepMovements(
      movedSteps,
      referenceStepSize,
    );

    if (targets.length === 0) {
      return;
    }

    this.moveTargetsToStart(targets);
    this.animateMovement(targets);
  }

  cancel(): void {
    if (this.pushAnimationFrame !== null) {
      cancelAnimationFrame(this.pushAnimationFrame);
      this.pushAnimationFrame = null;
    }
    if (this.revealTimer !== null) {
      clearTimeout(this.revealTimer);
      this.revealTimer = null;
    }

    this.restorePushedTargets();
    this.revealHiddenDropzones();
  }

  private targetsForStepMovements(
    movedSteps: StepMovementTarget[],
    referenceStepSize: number,
  ): PastePushAnimationTarget[] {
    return movedSteps.flatMap(({ step, startStepOffset }) => {
      const startOffsetX = this.movementDistance(
        startStepOffset,
        referenceStepSize,
      );

      return this.pushedDropzonesIn([step]).map((dropzone) => ({
        dropzone,
        startOffsetX,
      }));
    });
  }

  private moveTargetsToStart(targets: PastePushAnimationTarget[]): void {
    targets.forEach(({ dropzone, startOffsetX }) => {
      dropzone.setInsertionAnimationOffset(startOffsetX);
    });
  }

  private animateMovement(
    targets: PastePushAnimationTarget[],
    onComplete: () => void = () => undefined,
  ): void {
    const startedAt = performance.now();

    const animate = (now: number) => {
      const progress = Math.min(
        (now - startedAt) / this.options.pushDuration,
        1
      );
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      this.moveTargets(targets, easedProgress);

      if (progress < 1) {
        this.pushAnimationFrame = requestAnimationFrame(animate);
        return;
      }

      this.pushAnimationFrame = null;
      this.pushAnimationTargets = [];
      onComplete();
    };

    this.pushAnimationTargets = targets;
    this.pushAnimationFrame = requestAnimationFrame(animate);
  }

  private scheduleReveal(): void {
    this.revealTimer = setTimeout(() => {
      this.revealTimer = null;
      this.reveal();
    }, this.options.revealDelay);
  }

  private moveTargets(
    targets: PastePushAnimationTarget[],
    progress: number
  ): void {
    targets.forEach(({ dropzone, startOffsetX }) => {
      dropzone.setInsertionAnimationOffset(startOffsetX * (1 - progress));
    });
  }

  private hidePastedDropzones(pastedSteps: Set<CircuitStep>): void {
    this.hiddenDropzones = Array.from(pastedSteps).flatMap((step) =>
      step.dropzones.filter((dropzone) => this.shouldAnimate(dropzone))
    );
    this.hiddenDropzones.forEach((dropzone) => {
      dropzone.setInsertionAnimationAlpha(0);
    });
  }

  private pushedDropzonesIn(steps: CircuitStep[]): Dropzone[] {
    return steps.flatMap((step) =>
      step.dropzones.filter((dropzone) => this.shouldAnimate(dropzone))
    );
  }

  private movementDistance(
    startStepOffset: number,
    referenceStepSize: number
  ): number {
    return (
      Math.sign(startStepOffset) *
      Math.min(
        Math.abs(startStepOffset) * referenceStepSize,
        this.options.maxPushDistance,
      )
    );
  }

  private reveal(): void {
    this.revealHiddenDropzones();
    this.options.onReveal();
  }

  private revealHiddenDropzones(): void {
    this.hiddenDropzones.forEach((dropzone) => {
      if (!dropzone.destroyed) {
        dropzone.setInsertionAnimationAlpha(1);
      }
    });
    this.hiddenDropzones = [];
  }

  private restorePushedTargets(): void {
    this.pushAnimationTargets.forEach(({ dropzone }) => {
      if (!dropzone.destroyed) {
        dropzone.setInsertionAnimationOffset(0);
      }
    });
    this.pushAnimationTargets = [];
  }

  private shouldAnimate(dropzone: Dropzone): boolean {
    return (
      dropzone.operation !== null ||
      dropzone.connectTop ||
      dropzone.connectBottom
    );
  }
}
