package com.abdelaziz.portfolio.github;

/** Non-2xx from the GitHub API that is not a missing file or auth failure. */
public class GitHubClientException extends RuntimeException {

    private final int status;

    public GitHubClientException(int status, String message) {
        super(message);
        this.status = status;
    }

    public int status() {
        return status;
    }
}
