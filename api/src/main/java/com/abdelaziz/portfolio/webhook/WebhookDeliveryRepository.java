package com.abdelaziz.portfolio.webhook;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WebhookDeliveryRepository extends JpaRepository<WebhookDelivery, String> {
}
