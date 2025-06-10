import tippy from "tippy.js";
export class ShareModal {
  private modalElement: HTMLElement;

  private updateUrlDisplay(): void {
    const urlDiv = document.getElementById("circuit-url");
    if (!urlDiv) return;
    urlDiv.textContent = `${location.origin}${location.pathname}${location.hash}`;
  }

  constructor(modalId: string, closeButtonId: string) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      throw new Error(`Modal element with ID '${modalId}' not found.`);
    }
    this.modalElement = modal;

    const closeButton = document.getElementById(closeButtonId);
    if (closeButton) {
      closeButton.addEventListener("click", this.close.bind(this));
    }

    const backgroundOverlay = this.modalElement.querySelector(
      '[data-action="click->share#closeModal"]'
    );
    if (backgroundOverlay) {
      backgroundOverlay.addEventListener("click", this.close.bind(this));
    }

    const titleInput = document.getElementById(
      "circuit-title-input"
    ) as HTMLInputElement | null;
    if (titleInput) {
      titleInput.addEventListener("input", () => {
        document.title = titleInput.value || "Qni GL";
        this.updateUrlDisplay();
      });
    }

    const copyButton = document.getElementById("copy-button");
    if (copyButton) {
      // tippyインスタンスを作成
      const tip = tippy(copyButton, {
        content: "Copied to clipboard",
        trigger: "manual",
        placement: "bottom",
        duration: [0, 250],
      });

      copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(
          `${location.origin}${location.pathname}${location.hash}`
        );
        // 吹き出し表示
        tip.show();
        setTimeout(() => tip.hide(), 1000);
      });
    }

    this.updateUrlDisplay();
  }

  open(): void {
    this.modalElement.classList.remove("hidden");
    const titleInput = document.getElementById(
      "circuit-title-input"
    ) as HTMLInputElement | null;
    if (titleInput) {
      titleInput.focus();
    }
    this.updateUrlDisplay();
  }

  close(): void {
    this.modalElement.classList.add("hidden");
  }
}
