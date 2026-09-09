package com.abdelaziz.portfolio.webhook;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

/** One row per GitHub webhook delivery (idempotent retry guard). */
@Entity
@Table(name = "webhook_deliveries")
public class WebhookDelivery {

    @Id
    private String deliveryId;

    private String event;

    private String repoFullName;

    private String actionTaken;

    private Instant receivedAt;

    protected WebhookDelivery() {
    }

    public WebhookDelivery(String deliveryId, String event, String repoFullName, String actionTaken) {
        this.deliveryId = deliveryId;
        this.event = event;
        this.repoFullName = repoFullName;
        this.actionTaken = actionTaken;
    }

    @PrePersist
    void stampReceivedAt() {
        if (receivedAt == null) {
            receivedAt = Instant.now();
        }
    }
}
