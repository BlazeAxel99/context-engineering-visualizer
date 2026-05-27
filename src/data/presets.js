export const PRESETS = {
  none: {
    prompt: "What steps and CLI scripts should our operations team run to resolve critical storage outages on cluster node-us-east-4?",
    context: "",
    tokens: { system: 25, prompt: 30, metadata: 0, context: 0, empty: 521 },
    stats: { latency: "380 ms", cost: "$0.00016", grounding: "0%" },
    output: "I do not have access to Acme Corp's private operations runbooks or internal cluster infrastructure details. To answer what steps or commands are required to resolve node-us-east-4 outages, you must supply the relevant operational documentation (such as operations-runbook.md) inside my context window. Otherwise, I cannot resolve the query."
  },
  messy: {
    prompt: "What steps and CLI scripts should our operations team run to resolve critical storage outages on cluster node-us-east-4?",
    context: `<context>
  <!-- System Diagnostics & Chat Scraped Dump - Raw Unranked Log -->
  <diagnostics_log timestamp="2026-05-26T22:04:12">
    HOST: node-us-east-1 STATUS: OK LOAD: 12.4%
    HOST: node-us-east-2 STATUS: OK LOAD: 8.9%
    HOST: node-us-east-3 STATUS: OK LOAD: 45.2%
    NETWORK CHATTER: Ping internal gateway successful. DNS response latency = 12ms.
    [CHAT LOG - DevOps channel]
    14:02 dave: hey did we update the staging certs for OAuth?
    14:04 sarah: yeah they are active. Let me know if you get ssl handshake fails.
    14:15 dave: cool query caching on Redis looks fast today.
    14:20 sysadmin-bot: CRITICAL ALERT: node-us-east-4 storage exhausted. DB writes fail with 500 error.
    
    [SYSOP RUNBOOK 4012: FOR node-us-east-4 STORAGE FAILS, IMMEDIATELY RUN SCRIPT \`/opt/acme/scripts/purge_temp_logs.sh\` AND REBOOT DB POD via \`docker restart acme-db-service\` TO RELEASE 200GB STORAGE.]
    
    14:22 dave: oh disk error on east-4. Let me double check what to do.
    14:24 sarah: i think we have a runbook for that? check the operations vault.
    14:35 dave: is node-us-east-4 running docker or k8s?
    14:38 sarah: docker container. It's the acme-db-service image.
    HOST: node-us-east-5 STATUS: OK LOAD: 11.2%
    HOST: node-us-east-6 STATUS: OK LOAD: 18.1%
    CRON TASK DIAGNOSTICS: Backup cron successfully completed for cluster node-us-west-1.
    STORAGE REPORT: US-WEST-2 reports disk usage at 44% capacity.
  </diagnostics_log>
</context>`,
    tokens: { system: 25, prompt: 30, metadata: 15, context: 280, empty: 226 },
    stats: { latency: "340 ms", cost: "$0.00062", grounding: "38%" },
    output: "Based on the raw diagnostic logs [Source: diagnostics_log], cluster **node-us-east-4** is experiencing a critical disk storage failure. There is chat conversation between Dave and Sarah discussing container issues and mention of a secret operations vault. However, the exact terminal recovery commands and CLI script steps to resolve this disk crisis are *buried in the unranked chat logs* and did not register correctly in my attention maps. I recommend verifying the runbook in the central vault rather than relying on noisy unranked diagnostics logs."
  },
  ops: {
    prompt: "What steps and CLI scripts should our operations team run to resolve critical storage outages on cluster node-us-east-4?",
    context: `<context>
  <metadata source="operations-runbook.md" classification="L3_RUNBOOK" updated="2026-05-26T17:13Z" />
  <incident_runbook id="doc_ops_02">
    <target_node>node-us-east-4</target_node>
    <trigger>Disk Space > 95%</trigger>
    <remedy_steps>
      1. Recover Storage: Execute the purging shell command: \`/opt/acme/scripts/purge_temp_logs.sh\` (Clears 200GB temporary logs).
      2. Service Reset: Restart the containerized database pod: \`docker restart acme-db-service\`
    </remedy_steps>
  </incident_runbook>
</context>`,
    tokens: { system: 25, prompt: 30, metadata: 12, context: 95, empty: 414 },
    stats: { latency: "190 ms", cost: "$0.00035", grounding: "100%" },
    output: `Based on Acme Operations Runbook [Source: operations-runbook.md], to resolve a critical storage outage on cluster **node-us-east-4** (triggered when Disk Space exceeds 95%):

1. **Recover Disk Space**: Run the temporary logs purging script:
   \`/opt/acme/scripts/purge_temp_logs.sh\`
   This action immediately clears approximately **200GB** of storage space [Source: operations-runbook.md].
   
2. **Container Reset**: If the microservice remains unresponsive, restart the containerized database daemon using:
   \`docker restart acme-db-service\` [Source: operations-runbook.md].`
  },
  auth: {
    prompt: "What headers and auth methods are required for Acme microservice calls, and how do we handle keys safely?",
    context: `<context>
  <metadata source="security-vault-api.md" classification="CONFIDENTIAL" />
  <security_specs id="doc_auth_01">
    <gateway_auth>OAuth2 Token Insertion</gateway_auth>
    <req_header>Authorization: Bearer <JWT_TOKEN></req_header>
    <token_expiry>3600 seconds</token_expiry>
    <vault_rules>Never store raw credentials in production env variables. Utilize mTLS tunnels for cross-microservice trust.</vault_rules>
  </security_specs>
</context>`,
    tokens: { system: 25, prompt: 30, metadata: 10, context: 85, empty: 426 },
    stats: { latency: "180 ms", cost: "$0.00032", grounding: "100%" },
    output: `According to the Acme Security Vault specifications [Source: security-vault-api.md], calling Acme microservices requires:

1. **Authorization Request Header**: Inject a valid OAuth2 bearer token structured as:
   \`Authorization: Bearer <JWT_TOKEN>\` (lifespan of 3600 seconds) [Source: security-vault-api.md].
2. **Secret Key Safety**: Do **NOT** store raw access keys or credentials directly in production environment variables [Source: security-vault-api.md]. Instead, load them securely from the Acme Secret Vault during cluster initialization.
3. **Service Trust**: Establish internal **mTLS secure tunnels** rather than relying on dynamic API keys for cross-microservice network requests.`
  }
};
