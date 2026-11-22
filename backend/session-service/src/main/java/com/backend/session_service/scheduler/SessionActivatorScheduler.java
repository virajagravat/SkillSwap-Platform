package com.backend.session_service.scheduler;

import com.backend.session_service.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduler that runs every minute and activates sessions whose start time has arrived.
 * It delegates to {@link SessionService#activateDueSessions()}.
 */
@Component
@RequiredArgsConstructor
public class SessionActivatorScheduler {

    private final SessionService sessionService;

    // Runs at the start of every minute
    @Scheduled(cron = "0 * * * * *")
    public void activateSessions() {
        sessionService.activateDueSessions();
    }
}
