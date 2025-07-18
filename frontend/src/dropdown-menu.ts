export class DropdownMenu {
  private menuButton: HTMLElement | null;
  private menuDropdown: HTMLElement | null;
  private menuContainer: HTMLElement | null;
  private activeClass = "bg-neutral-200";

  constructor() {
    this.menuContainer = document.getElementById("menu-container");
    this.menuButton = document.getElementById("menu-button");
    this.menuDropdown = document.getElementById("menu-dropdown");

    if (this.menuButton) {
      this.menuButton.addEventListener(
        "click",
        this.toggleMenuDropdown.bind(this)
      );
    }
    document.addEventListener("click", this.maybeHideMenuDropdown.bind(this));
  }

  private toggleMenuDropdown(): void {
    if (!this.menuDropdown || !this.menuButton) return;
    const isActive = this.menuDropdown.classList.toggle("hidden");
    if (!isActive) {
      this.menuButton.classList.add(this.activeClass);
      this.menuButton.setAttribute("aria-expanded", "true");
    } else {
      this.menuButton.classList.remove(this.activeClass);
      this.menuButton.setAttribute("aria-expanded", "false");
    }
  }

  private maybeHideMenuDropdown(event: MouseEvent): void {
    const clickedEl = event.target as HTMLElement;
    if (
      this.menuContainer &&
      !this.menuContainer.contains(clickedEl) &&
      this.menuDropdown &&
      !this.menuDropdown.classList.contains("hidden")
    ) {
      this.menuDropdown.classList.add("hidden");
      if (this.menuButton) {
        this.menuButton.classList.remove(this.activeClass);
        this.menuButton.setAttribute("aria-expanded", "false");
      }
    }
  }
}
