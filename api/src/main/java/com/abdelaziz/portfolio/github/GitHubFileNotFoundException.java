package com.abdelaziz.portfolio.github;

/** The requested path does not exist in the repo at the given ref (HTTP 404). */
public class GitHubFileNotFoundException extends GitHubClientException {

    public GitHubFileNotFoundException(String repo, String path) {
        super(404, "Not found in repo " + repo + ": " + path);
    }
}
