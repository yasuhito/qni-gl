import { expect, test } from "./fixtures";

test.describe("ImportButton state", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("default", async ({ page }) => {
        await expect(page).toHaveScreenshot("qasm-import-upload-default.png");
    });

    test("hover", async ({ page }) => {
        const importButton = page.locator('#importButton');

        await importButton.hover();

        await expect(page).toHaveScreenshot("qasm-import-upload-hover.png");
    });

    test("click", async ({ page }) => {
        const importButton = page.locator('#importButton');

        const buttonBox = await importButton.boundingBox();

        if (buttonBox) {
            await page.mouse.move(
                buttonBox.x + buttonBox.width / 2,
                buttonBox.y + buttonBox.height / 2
            );

            await page.mouse.down();

            await expect(page).toHaveScreenshot("qasm-import-upload-click.png");

            await page.mouse.up();
        }
    });
});

test.describe("Import Modal state", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.locator('#importButton').click();
    });

    test("open", async ({ page }) => {
        const modal = page.locator('#import-modal');

        await expect(modal).toBeVisible();

        await expect(page).toHaveScreenshot("qasm-import-modal-open.png");
    });

    test("QASM input", async ({ page }) => {
        const qasmText =
            `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[1] q;\nh q[0];`;

        const textarea = page.locator('#qasm-input');

        await textarea.fill(qasmText);

        await expect(textarea).toHaveValue(qasmText);

        const lineNumbers = page.locator('#line-numbers');

        await expect(lineNumbers).toContainText("1");

        await expect(lineNumbers).toContainText("4");

        await expect(page).toHaveScreenshot("qasm-import-modal-qasm-input.png");
    });

    test("Import button states", async ({ page }) => {
        const modalImportButton = page.locator('#modal-import-button');

        await expect(page).toHaveScreenshot("qasm-import-modal-import-default.png");

        await modalImportButton.hover();

        await expect(page).toHaveScreenshot("qasm-import-modal-import-hover.png");

        const modalButtonBox = await modalImportButton.boundingBox();

        if (modalButtonBox) {
            await page.mouse.move(
                modalButtonBox.x + modalButtonBox.width / 2,
                modalButtonBox.y + modalButtonBox.height / 2
            );

            await page.mouse.down();

            await expect(page).toHaveScreenshot("qasm-import-modal-import-click.png");

            await page.mouse.up();
        }
    });
});

const qasmCases = [
    {
        name: "H gate",
        qasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[1] q;\nh q[0];`,
        screenshot: "qasm-import-h-gate-placed.png"
    },
    {
        name: "X gate",
        qasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[1] q;\nx q[0];`,
        screenshot: "qasm-import-x-gate-placed.png"
    },
    {
        name: "Y gate",
        qasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[1] q;\ny q[0];`,
        screenshot: "qasm-import-y-gate-placed.png"
    },
    {
        name: "Z gate",
        qasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[1] q;\nz q[0];`,
        screenshot: "qasm-import-z-gate-placed.png"
    },
    {
        name: "√X gate",
        qasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[1] q;\nsx q[0];`,
        screenshot: "qasm-import-rootx-gate-placed.png"
    },
    {
        name: "S gate",
        qasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[1] q;\ns q[0];`,
        screenshot: "qasm-import-s-gate-placed.png"
    },
    {
        name: "S† gate",
        qasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[1] q;\nsdg q[0];`,
        screenshot: "qasm-import-sdagger-gate-placed.png"
    },
    {
        name: "T gate",
        qasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[1] q;\nt q[0];`,
        screenshot: "qasm-import-t-gate-placed.png"
    },
    {
        name: "T† gate",
        qasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[1] q;\ntdg q[0];`,
        screenshot: "qasm-import-tdagger-gate-placed.png"
    },
    {
        name: "SWAP gate",
        qasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[2] q;\nswap q[0], q[1];`,
        screenshot: "qasm-import-swap-gate-placed.png"
    },
    {
        name: "Control gate",
        qasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[2] q;\nctrl q[0], q[1];`,
        screenshot: "qasm-import-control-gate-placed.png"
    },
    {
        name: "|0> gate",
        qasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[1] q;\nreset q[0];`,
        screenshot: "qasm-import-0ket-gate-placed.png"
    },
    {
        name: "|1> gate",
        qasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[1] q;\nreset q[0];\nx q[0];`,
        screenshot: "qasm-import-1ket-gate-placed.png"
    },
    {
        name: "Measurement gate",
        qasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nbit[1] c;\nqubit[1] q;\nc[0] = measure q[0];`,
        screenshot: "qasm-import-measurement-gate-placed.png"
    },
    {
        name: "CX gate",
        qasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[2] q;\ncx q[0], q[1];`,
        screenshot: "qasm-import-cx-gate-placed.png"
    },
    {
        name: "CCX gate",
        qasm: `OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[3] q;\nccx q[0], q[1], q[2];`,
        screenshot: "qasm-import-ccx-gate-placed.png"
    },
];

for (const { name, qasm, screenshot } of qasmCases) {
    test.describe(`${name} QASM import`, () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/");

            await page.locator('#importButton').click();

            await page.locator('#qasm-input').fill(qasm);
        });

        test(`should import and place ${name}`, async ({ page }) => {
            await page.locator('#modal-import-button').click();

            await expect(page.locator('#import-modal')).not.toBeVisible();

            await expect(page).toHaveScreenshot(screenshot);
        });
    });
}
