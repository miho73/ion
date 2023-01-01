package com.github.miho73.ion.lib;

public class Assertion {
    public static boolean rangeAssert(int value, int min, int max) {
        return (value < min) || (value > max);
    }
}
