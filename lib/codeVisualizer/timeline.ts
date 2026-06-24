import { VisualizerStep } from "../../types/codeVisualizer.types";

/**
 * Static buffer to store massive visualizer step arrays outside of reactive store state.
 * This ensures timeline seeking and scrubbing remain highly performant at 60+ FPS.
 */
export class TimelineBuffer {
  private static steps: VisualizerStep[] = [];

  public static setSteps(newSteps: VisualizerStep[]): void {
    this.steps = newSteps;
  }

  public static getSteps(): VisualizerStep[] {
    return this.steps;
  }

  public static getStep(index: number): VisualizerStep | undefined {
    return this.steps[index];
  }

  public static getLength(): number {
    return this.steps.length;
  }

  public static clear(): void {
    this.steps = [];
  }
}
