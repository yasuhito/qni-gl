export class ShareModal {
  private modalElement: HTMLElement;

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
      });
    }
  }

  open(): void {
    this.modalElement.classList.remove("hidden");
    const titleInput = document.getElementById(
      "circuit-title-input"
    ) as HTMLInputElement | null;
    if (titleInput) {
      titleInput.focus();
    }
  }

  close(): void {
    this.modalElement.classList.add("hidden");
  }
}
