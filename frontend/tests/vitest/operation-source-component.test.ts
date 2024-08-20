import { Container } from "pixi.js";
import { OPERATION_EVENTS, OPERATION_SOURCE_EVENTS } from "../../src/events";
import { OperationClass } from "../../src/operation";
import { OperationSourceComponent } from "../../src/operation-source-component";
import { describe, it, expect, beforeEach, vi } from "vitest";

class MockOperation extends Container {
  borderWidth = 2;
  sizeInPx = 50;
  cornerRadius = 5;
}

describe("OperationSourceComponent", () => {
  let operationSource: OperationSourceComponent;

  beforeEach(() => {
    operationSource = new OperationSourceComponent(
      MockOperation as OperationClass
    );
  });

  it("should create a new operation when generateNewOperation is called", () => {
    const newOperation = operationSource.generateNewOperation();
    const addedOperation = operationSource.children.find(
      (child) => child instanceof MockOperation
    );

    expect(newOperation).toBeInstanceOf(MockOperation);
    expect(addedOperation).toBe(newOperation);
  });

  it("should emit OPERATION_CREATED event when a new operation is generated", () => {
    const spy = vi.fn();
    operationSource.on(OPERATION_SOURCE_EVENTS.OPERATION_CREATED, spy);

    operationSource.generateNewOperation();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.any(MockOperation));
  });

  it("should handle GRABBED event and generate a new operation", () => {
    const operation = operationSource.generateNewOperation();
    const spy = vi.fn();
    operationSource.on(OPERATION_SOURCE_EVENTS.OPERATION_GRABBED, spy);

    operation.emit(OPERATION_EVENTS.GRABBED, operation, { x: 0, y: 0 });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(operation, { x: 0, y: 0 });
  });

  it("should handle DISCARDED event and remove the operation", () => {
    const operation = operationSource.generateNewOperation();
    const spy = vi.fn();
    operationSource.on(OPERATION_SOURCE_EVENTS.OPERATION_DISCARDED, spy);

    operation.emit(OPERATION_EVENTS.DISCARDED, operation);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(operation);
  });
});
