package com.abdelaziz.portfolio.projects;

/** Decoded cover bytes ready to serve, with their stored content type. */
public record CoverAsset(byte[] bytes, String contentType) {
}
