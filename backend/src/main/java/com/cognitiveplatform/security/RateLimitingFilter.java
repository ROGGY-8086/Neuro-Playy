package com.cognitiveplatform.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    @Value("${app.rate-limiting.enabled:true}")
    private boolean enabled;

    @Value("${app.rate-limiting.requests-per-minute:60}")
    private int requestsPerMinute;

    private final Map<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();

    private static class RequestCounter {
        long windowStartTimestamp;
        AtomicInteger count;

        RequestCounter(long windowStartTimestamp) {
            this.windowStartTimestamp = windowStartTimestamp;
            this.count = new AtomicInteger(1);
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        if (enabled && path.startsWith("/api/auth/")) {
            String clientIp = getClientIp(request);
            long currentTime = System.currentTimeMillis();

            RequestCounter counter = requestCounts.compute(clientIp, (key, existing) -> {
                if (existing == null || (currentTime - existing.windowStartTimestamp) > 60000) {
                    return new RequestCounter(currentTime);
                }
                existing.count.incrementAndGet();
                return existing;
            });

            if (counter.count.get() > requestsPerMinute) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"timestamp\":\"" + java.time.Instant.now() + "\",\"status\":429,\"error\":\"Too Many Requests\",\"message\":\"Rate limit exceeded. Please wait a moment before trying again.\",\"path\":\"" + path + "\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
