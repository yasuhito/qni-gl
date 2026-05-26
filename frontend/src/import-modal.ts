const DEFAULT_EDITOR_HEIGHT = 320;
const MAX_EDITOR_HEIGHT = 600;

export class ImportModal {
  private modalElement: HTMLElement;
  private importButton: HTMLElement;
  private textarea: HTMLTextAreaElement;
  private lineNumbers: HTMLElement;

  constructor(modalId: string, closeButtonId: string) {
    this.modalElement = document.getElementById(modalId)!;
    this.importButton = document.getElementById("modal-import-button")!;
    this.textarea = document.getElementById("qasm-input") as HTMLTextAreaElement;
    this.lineNumbers = document.getElementById("line-numbers")!;

    this.setupCloseHandlers(closeButtonId);
    this.setupImportHandler();
    this.setupLineNumberSync();
  }

  private setupCloseHandlers(closeButtonId: string): void {
    document.getElementById(closeButtonId)?.addEventListener("click", () => this.close());

    this.modalElement.querySelector('[data-action="click->import#closeModal"]')
      ?.addEventListener("click", () => this.close());
  }

  private setupImportHandler(): void {
    this.importButton.addEventListener("click", () => {
      const qasm = this.textarea.value.trim();
      if (!qasm) return;

      window.pixiApp?.worker?.postMessage({ requestType: "import", qasm });
      this.close();
    });
  }

  private updateLineNumbers(): void {
    this.textarea.style.height = "auto";
    const scrollHeight = Math.min(this.textarea.scrollHeight, MAX_EDITOR_HEIGHT);
    this.textarea.style.height = `${scrollHeight}px`;

    const lines = Math.max(1, this.textarea.value.split("\n").length);
    this.lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join("<br>");
    this.lineNumbers.style.height = `${this.textarea.clientHeight}px`;
  }

  private setupLineNumberSync(): void {
    this.textarea.addEventListener("input", () => this.updateLineNumbers());
    this.textarea.addEventListener("scroll", () => {
      this.lineNumbers.scrollTop = this.textarea.scrollTop;
    });

    this.updateLineNumbers();
  }

  private resetEditor(): void {
    this.textarea.value = "";
    this.textarea.style.height = `${DEFAULT_EDITOR_HEIGHT}px`;

    this.lineNumbers.innerHTML = "1";
    this.lineNumbers.style.height = `${DEFAULT_EDITOR_HEIGHT}px`;
  }

  open(): void {
    this.modalElement.classList.remove("hidden");
    this.resetEditor();
    this.textarea.focus();

    this.updateLineNumbers();
  }

  close(): void {
    this.modalElement.classList.add("hidden");
    this.resetEditor();
  }
}
