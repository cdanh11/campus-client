package com.campus.testsupport;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import com.campus.identity.domain.AccountStatus;
import com.campus.identity.domain.RoleCode;
import com.campus.identity.domain.RoleRepository;
import com.campus.identity.domain.UserAccount;
import com.campus.identity.domain.UserAccountRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

/** Frontend-owned opt-in harness, copied by its runner and removed in finally.
 * Uses existing backend test configuration; never starts against a developer database.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = "campus.security.refresh-cookie.secure=false")
@ActiveProfiles("test")
@PostgresApplicationTest
class CampusClientBrowserIntegrationTest {
    @Autowired UserAccountRepository users;
    @Autowired RoleRepository roles;
    @Autowired PasswordEncoder passwords;
    @Autowired TestRestTemplate http;
    @Autowired ObjectMapper mapper;
    @LocalServerPort int port;

    @Test
    void exportsProductionContractAndRunsRealBrowserJourneys() throws Exception {
        Path frontend = Path.of(System.getProperty("campus.client.dir")).toRealPath();
        assertThat(Files.isRegularFile(frontend.resolve("package.json"))).isTrue();
        String password = UUID.randomUUID().toString();
        seed("browser-admin@example.test", RoleCode.ADMIN, password);
        seed("browser-user@example.test", RoleCode.USER, password);
        var response = http.getForEntity("/v3/api-docs", String.class);
        assertThat(response.getStatusCode().value()).isEqualTo(200);
        var schema = mapper.readTree(response.getBody());
        assertThat(schema.path("paths").has("/api/v1/auth/login")).isTrue();
        // Normalize only the random test server URL; all paths and schemas are production generated.
        ((com.fasterxml.jackson.databind.node.ObjectNode) schema).set("servers",
                mapper.valueToTree(List.of(java.util.Map.of("url", "http://localhost:8080"))));
        Path exported = Path.of("target", "campus-client-openapi.json");
        Files.writeString(exported, mapper.writerWithDefaultPrettyPrinter().writeValueAsString(schema));

        boolean windows = System.getProperty("os.name").toLowerCase().contains("win");
        ProcessBuilder builder = windows
                ? new ProcessBuilder("cmd.exe", "/d", "/c", "npm.cmd run test:e2e:real")
                : new ProcessBuilder("npm", "run", "test:e2e:real");
        builder.directory(frontend.toFile());
        builder.environment().put("CAMPUS_TEST_BACKEND_URL", "http://localhost:" + port);
        builder.environment().put("CAMPUS_TEST_PASSWORD", password);
        builder.redirectErrorStream(true);
        Path browserLog = Path.of("target", "campus-client-browser.log");
        builder.redirectOutput(browserLog.toFile());
        Process browser = builder.start();
        try {
            boolean finished = browser.waitFor(5, TimeUnit.MINUTES);
            assertThat(finished).as("Browser suite must complete within 5 minutes").isTrue();
            System.out.println(Files.readString(browserLog));
            assertThat(browser.exitValue()).as("Real frontend/backend browser result").isZero();
        } finally {
            if (browser.isAlive()) {
                browser.descendants().forEach(ProcessHandle::destroy);
                browser.destroy();
            }
        }
    }

    private void seed(String email, RoleCode role, String password) {
        users.save(UserAccount.create(UUID.randomUUID(), email, "Browser test account",
                passwords.encode(password), AccountStatus.ACTIVE,
                Set.of(roles.findByCode(role).orElseThrow()), Instant.now()));
    }
}
