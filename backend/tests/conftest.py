import pytest


def assert_complex_approx(actual, expected_real, expected_imag):
    __tracebackhide__ = True
    assert pytest.approx(actual.real) == expected_real, f"Real parts differ: {
        actual.real} != {expected_real}"
    assert pytest.approx(actual.imag) == expected_imag, f"Imaginary parts differ: {
        actual.imag} != {expected_imag}"
