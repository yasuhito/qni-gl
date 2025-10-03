const DEFAULT_EDITOR_HEIGHT = 320;
export class ImportModal {
  private modalElement: HTMLElement;
  private importButton: HTMLElement | null;
  private textarea: HTMLTextAreaElement | null;
  private lineNumbers: HTMLElement | null;

  constructor(modalId: string, closeButtonId: string) {
    const modal = document.getElementById(modalId);
    if (!modal)
      throw new Error(`Modal element with ID '${modalId}' not found.`);
    this.modalElement = modal;

    this.importButton = document.getElementById("modal-import-button");
    this.textarea = document.getElementById(
      "qasm-input"
    ) as HTMLTextAreaElement | null;
    this.lineNumbers = document.getElementById("line-numbers");

    this.setupCloseHandlers(closeButtonId);
    this.setupImportHandler();
    this.setupLineNumberSync();
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

      if (window.pixiApp?.worker) {
        window.pixiApp.worker.postMessage({
          requestType: "import",
          qasm: qasm,
        });
      }

      this.close();
    });
  }

  private updateLineNumbers(): void {
    if (!this.textarea || !this.lineNumbers) return;
    this.textarea.style.height = "auto";
    const scrollHeight = Math.min(this.textarea.scrollHeight, 600);

    this.textarea.style.height = scrollHeight + "px";
    const lines = Math.max(1, this.textarea.value.split("\n").length);

    this.lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join("<br>");
    this.lineNumbers.style.height = this.textarea.clientHeight + "px";
  }

  private setupLineNumberSync(): void {
    if (!this.textarea || !this.lineNumbers) return;
    this.textarea.addEventListener("input", () => this.updateLineNumbers());
    this.textarea.addEventListener("scroll", () => {
      this.lineNumbers!.scrollTop = this.textarea!.scrollTop;
    });
    this.updateLineNumbers();
  }

  private resetEditor(): void {
    if (this.textarea) {
      this.textarea.value = "";
      this.textarea.style.height = `${DEFAULT_EDITOR_HEIGHT}px`;
    }
    if (this.lineNumbers) {
      this.lineNumbers.innerHTML = "1";
      this.lineNumbers.style.height = `${DEFAULT_EDITOR_HEIGHT}px`;
    }
  }

  open(): void {
    this.modalElement.classList.remove("hidden");
    this.resetEditor();
    this.textarea?.focus();
    this.updateLineNumbers(); 
  }

  close(): void {
    this.modalElement.classList.add("hidden");
    if (this.textarea) this.textarea.value = "";
    this.resetEditor();
  }
}
