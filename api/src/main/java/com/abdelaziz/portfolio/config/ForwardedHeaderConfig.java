package com.abdelaziz.portfolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.ForwardedHeaderFilter;

/**
 * Honors {@code X-Forwarded-For}/{@code X-Forwarded-Proto} so
 * {@code getRemoteAddr()} (contact throttle) sees the real client IP
 * behind the nginx proxy.
 *
 * <p>Trust boundary: single-node compose where nginx is the only ingress.
 * Do not expose the API directly to untrusted proxies with this on.
 */
@Configuration
public class ForwardedHeaderConfig {

    @Bean
    ForwardedHeaderFilter forwardedHeaderFilter() {
        return new ForwardedHeaderFilter();
    }
}
