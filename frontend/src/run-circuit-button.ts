export class RunCircuitButton {
  private el: HTMLElement;

  constructor(
    selector: string = "run-circuit-button",
    private onClick?: () => void
  ) {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`[RunButton] "${selector}" is not found`);
    this.el = el;

    // Ensure ripple does not overflow
    this.el.classList.add("overflow-hidden");

    // Inject ripple animation style once
    RunCircuitButton.injectRippleStyle();

    this.el.addEventListener("click", (ev) => this.handleClick(ev));
  }

  public finish() {
    console.log("[RunButton] FINISH");
  }

  // Handle button click: show ripple and call callback
  private handleClick(ev: MouseEvent) {
    this.createRipple(ev);
    this.onClick?.();
  }

  // Create and animate ripple effect
  private createRipple(ev: MouseEvent) {
  
    this.el.querySelectorAll(".runbtn-ripple").forEach((r) => r.remove());

    const rect = this.el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");

    Object.assign(ripple.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${ev.clientX - rect.left - size / 2}px`,
      top: `${ev.clientY - rect.top - size / 2}px`,
      background: "rgba(255,255,255,0.45)",
      position: "absolute",
      borderRadius: "50%",
      pointerEvents: "none",
      transform: "scale(0)",
      animation: `runbtn-ripple 400ms linear`,
    });

    ripple.className = "runbtn-ripple";

    ripple.addEventListener("animationend", () => ripple.remove());

    this.el.appendChild(ripple);
  }

  // Inject ripple animation CSS if not already present
  private static injectRippleStyle() {
    if (document.getElementById("runbtn-ripple-style")) return;

    const style = document.createElement("style");
    style.id = "runbtn-ripple-style";
    style.textContent = `
      @keyframes runbtn-ripple { to { transform: scale(4); opacity: 0; } }
      .runbtn-ripple { will-change: transform, opacity; }
    `;
    document.head.appendChild(style);
  }
}
