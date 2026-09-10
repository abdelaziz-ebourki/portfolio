package com.abdelaziz.portfolio.contact;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Duration;

import org.junit.jupiter.api.Test;

class ContactThrottleTest {

    @Test
    void allowsUpToLimitThenBlocks() {
        ContactThrottle throttle = new ContactThrottle(2, Duration.ofMinutes(10));

        assertThat(throttle.tryAcquire("1.2.3.4")).isTrue();
        assertThat(throttle.tryAcquire("1.2.3.4")).isTrue();
        assertThat(throttle.tryAcquire("1.2.3.4")).isFalse();
    }

    @Test
    void tracksIpsIndependently() {
        ContactThrottle throttle = new ContactThrottle(1, Duration.ofMinutes(10));

        assertThat(throttle.tryAcquire("1.1.1.1")).isTrue();
        assertThat(throttle.tryAcquire("2.2.2.2")).isTrue();
        assertThat(throttle.tryAcquire("1.1.1.1")).isFalse();
    }

    @Test
    void windowExpiryFreesQuota() throws InterruptedException {
        ContactThrottle throttle = new ContactThrottle(1, Duration.ofMillis(150));

        assertThat(throttle.tryAcquire("9.9.9.9")).isTrue();
        assertThat(throttle.tryAcquire("9.9.9.9")).isFalse();
        Thread.sleep(250);
        assertThat(throttle.tryAcquire("9.9.9.9")).isTrue();
    }
}
