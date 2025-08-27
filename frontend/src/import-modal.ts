export class ImportModal {
  private modalElement: HTMLElement;
  private importButton: HTMLElement | null;
  private textarea: HTMLTextAreaElement | null;

  constructor(modalId: string, closeButtonId: string) {
    const modal = document.getElementById(modalId);
    if (!modal)
      throw new Error(`Modal element with ID '${modalId}' not found.`);
    this.modalElement = modal;

    this.importButton = document.getElementById("modal-import-button");
    this.textarea = document.getElementById(
      "qasm-input"
    ) as HTMLTextAreaElement | null;

    this.setupCloseHandlers(closeButtonId);

    this.setupImportHandler();
  }

  private setupCloseHandlers(closeButtonId: string): void {
    const closeButton = document.getElementById(closeButtonId);
    if (closeButton) closeButton.addEventListener("click", () => this.close());

    const overlay = this.modalElement.querySelector(
      '[data-action="click->import#closeModal"]'
    );
    if (overlay) overlay.addEventListener("click", () => this.close());
  }

  private setupImportHandler(): void {
    if (!this.importButton) return;
    this.importButton.addEventListener("click", async () => {
      const qasm = this.textarea?.value?.trim();
      if (!qasm) return;

      // TODO: qasmをServiceWorkerに送信

      this.close();
    });
  }

  open(): void {
    this.modalElement.classList.remove("hidden");
    this.textarea?.focus();
  }

  close(): void {
    this.modalElement.classList.add("hidden");
    if (this.textarea) this.textarea.value = "";
  }
}
