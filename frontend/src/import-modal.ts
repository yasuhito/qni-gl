export class ImportModal {
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
      '[data-action="click->import#closeModal"]'
    );
    if (backgroundOverlay) {
      backgroundOverlay.addEventListener("click", this.close.bind(this));
    }
  }

  public open(): void {
    this.modalElement.classList.remove("hidden");
  }

  public close(): void {
    this.modalElement.classList.add("hidden");
  }
}
