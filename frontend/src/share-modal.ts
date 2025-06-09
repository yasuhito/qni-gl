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
  }

  open(): void {
    this.modalElement.classList.remove("hidden");
  }

  close(): void {
    this.modalElement.classList.add("hidden");
  }
}
