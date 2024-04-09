'use strict';
import * as dotenv from 'dotenv';
dotenv.config({});

const config: any = {
  app_name: [process.env.APP_NAME],
  license_key: process.env.NEW_RELIC_KEY,
  logging: {
    enabled: false,
    level: 'info',
  },
  allow_all_headers: false,
  custom_events_enabled: true,
  error_collector: {
    enabled: true,
    capture_events: true,
    attributes: { enabled: true },
    explain_threshold: 1000,
    record_sql: 'raw',
  },
  slow_sql: {
    enabled: true,
  },
  audit_log: {
    enabled: true,
  },
  application_logging: {
    enabled: true,
  },
  browser_monitoring: {
    enable: true,
  },
  collect_errors: true,
  collect_span_events: false,
  collect_traces: true,
  custom_insights_events: {
    enabled: false,
  },
  datastore_tracer: {
    database_name_reporting: { enabled: true },
    instance_reporting: { enabled: true },
  },
  distributed_tracing: { enabled: true },
  attributes: {
    enabled: true,
  },
  utilization: {
    detect_aws: false,
    detect_pcf: false,
    detect_azure: false,
    detect_docker: false,
    detect_gcp: false,
    detect_kubernetes: false,
  },
  transaction_tracer: {
    enabled: true,
    top_n: 20, // Defines the maximum number of groups of requests eligible for transaction traces.
    transaction_threshold: 'apdex_f', // Threshold of web transaction response time in seconds beyond which a transaction is eligible for transaction tracing.
    explain_threshold: 1000,
    record_sql: 'raw',
  },
  enforce_backstop: false,
  api: {
    custom_attributes_enabled: true,
    custom_events_enabled: true,
    notice_error_enabled: true,
    esm: { custom_instrumentation_entrypoint: null },
  },
  transaction_events: {
    attributes: { enabled: true, exclude: [], include: [] },
    enabled: true,
    max_samples_stored: 10000, // Defines the maximum number of events the agent collects per minute
  },
  grpc: { record_errors: true, ignore_status_codes: [] },
  span_events: {
    // A span represents a single operation within a trace.
    enabled: true,
    attributes: { enabled: false, exclude: [], include: [] },
    max_samples_stored: 2000, // Defines the maximum number of events the agent collects per minute
  },
  transaction_segments: {
    attributes: { enabled: true, exclude: [], include: [] },
  },
  message_tracer: { segment_parameters: { enabled: true } },
  plugins: { native_metrics: { enabled: true } },
};

exports.config = config;
